---
file_type: synthesis_standard_operating_procedure
version: v1.0
created: 2026-04-27
authority: AI_AGENT_ISOLATION_ARCHITECTURE_v1.0.md §3
owner: 研究员 (synthesis 唯一执行者)
purpose: "Per-AI sandbox 架构下, 研究员 phase 2 synthesis 的标准操作流程. 单点 merge: 5 sandbox → canonical SSOT."
---

# Synthesis SOP v1.0

## §1 触发条件

main Claude 派 研究员 with synthesis task 当 ≥3 sandbox sources have output for same ticker × task.

## §2 输入清单 (按 read 顺序)

```
对 ticker=<T>, task_id=<DC-...>, date=<YYYY-MM-DD>:

1. _AI_PROJECTS/claude_research/_outputs/YYYY-MM-DD/<T>_<task>.json     (high trust, audited)
2. _AI_PROJECTS/chatgpt_research/_outputs/YYYY-MM-DD/<T>_<task>.json    (medium trust)
3. _AI_PROJECTS/grok_research/_outputs/YYYY-MM-DD/<T>_<task>.json       (medium-low for numbers)
4. _AI_PROJECTS/gemini_research/_quarantine/YYYY-MM-DD/<T>_<task>.json  (quarantine-first, G1-G6 检查)
5. _AI_PROJECTS/deepseek_research/_quarantine/YYYY-MM-DD/<T>_<task>.json (quarantine-first, D1-D5 检查)

附属:
- _AI_PROJECTS/_shared/SANDBOX_CONTRACT.md (规则)
- _AI_PROJECTS/_shared/OUTPUT_SCHEMA.md (字段)
- _AI_PROJECTS/{gemini,deepseek}_research/_quarantine_rules.md (specific rules)
- _AI_PROJECTS/grok_research/_ratelimit_state.json (Grok 是否 fallback waiver)
```

## §3 流程 (8 步)

### Step 1 — Validation
对每 sandbox JSON:
- ✅ schema_version == "ai_source_output_v1"
- ✅ ai_id 与文件路径一致
- ✅ ticker / task_id / as_of 完整
- ✅ mcp.allowed_domain_passed == true
- ❌ 任一不通过 → 跳过该 source + log to `_AUDITS/_FABRICATION_LOG.md` (severity=low, mechanism=schema_validation)

### Step 2 — Quarantine Pre-Check (Gemini G1-G6 / DeepSeek D1-D5)

**Gemini 输入** (强制, default quarantine):
- G1: 对 sections.snapshot_1 的每个 number, 检查 claims[].source_date 是否 ≤24h. >24h → mark `quarantine_excluded: true, reason: G1_stale`
- G2: 对 sections.catalyst_revenue_map_3[] / killer_triggers_8[] 数字, 检查 raw_quotes[] 有对应 verbatim. 无 → `quarantine_excluded: true, reason: G2_no_raw_quote`
- G3: fabrication_self_check.refuted_other_ai==true + claim 与 ≥2 其他 AI 冲突 → `block_synthesis, reason: G3_active_refute`
- G4: mcp.metadata 提到 deep_research → `quarantine_excluded: true, reason: G4_deep_research_used`
- G5: peer_valuation_5 / killer_triggers_8 进 synthesis 标 `hypothesis_pending_verification`
- G6: 任一 thesis/score/date claim Gemini-only → `unverified_gemini_synthesis, reason: G6_solo_source`

**DeepSeek 输入** (同样 default quarantine):
- D1: 任何 number claim DeepSeek-only → `quarantine_excluded: true, reason: D1_solo_number`
- D2: 红队 objections 转成 questions, 不入 facts 区
- D3: 收入/mcap/margin/CAGR/customer% 数字必须 source_url + verbatim, 无 → quarantine
- D4: 与 ≥2 AI 冲突 → `requires_primary_adjudication`
- D5: 仅可 lower confidence, 不可 reverse consensus

**Claude 防御** (per claude_research README):
- 对 claims[].source_url, 检查不含 `03_tickers/` 或 `_AUDITS/` → 若是, mark `phantom_citation_internal_loop` + log to FABRICATION_LOG (Claude counter ++)

**Grok rate-limit 处理**:
- 读 `_ratelimit_state.json`. 若 fallback_mode==always-fallback OR 该 ticker 有 mcp_fallback_waiver → 标 verified_dual/triple max (不能升 quad)

### Step 3 — Cross-AI Consensus Matrix

对每 numeric field (snapshot_1.market_cap_b / forecast_2.fy26.revenue / etc):
```
field: snapshot_1.market_cap_b
values: {claude: X, chatgpt: Y, grok: Z, gemini: W (after G-rules), deepseek: V (after D-rules)}
median: median([Xs after exclusions])
spread_pct: |max - min| / median * 100
verdict:
  spread <5%: agree (verified_quad if 4+ sources, verified_triple if 3)
  5-10%: warn
  >10%: conflict
quarantine_count: <N excluded>
```

### Step 4 — Anchor 升降级

```
sources_after_quarantine = N
N==4 + spread<5% → verified_quad (Integrity Modifier +1)
N==3 + spread<5% → verified_triple (anchor-eligible)
N==2 + spread<5% → verified_dual (allowed)
N==1 → primary_only_pending (NOT anchor)
spread >10% → conflict (worst-case wins, mark backfill_pending)
```

### Step 5 — Canonical SSOT Write

仅当 anchor_eligible == true 且 audit_required 经 测谎员 后:
- Write `03_tickers/<T>.md` v2.0 §1-§9 (frontmatter + body)
- Frontmatter 必含:
  ```yaml
  brief_version: v2.0
  research_brief_v2_completed: <ISO>
  data_quality_v2: <verified_quad|triple|dual|primary_only_pending>
  audit_status: pending  # 等 phase 3 测谎员
  sandbox_inputs_used: [claude, chatgpt, grok, gemini, deepseek]
  sandbox_excluded: [<source>:<reason>, ...]
  cross_ai_spread_summary: {<field>: <%>, ...}
  ```

### Step 6 — Consensus Matrix 文件

写 `_AUDITS/RBv2_pilot/_consensus_matrix_<batch_id>.md`:
- 横向 5-AI 表格
- Quarantine 排除明细 + 原因
- Conflict 字段列表 (待 phase 3 仲裁)

### Step 7 — Fabrication Log Append

对 step 2 检测到的任何 quarantine_excluded / phantom_citation_internal_loop:
- Append entry to `_AUDITS/_FABRICATION_LOG.md` 表
- 字段: date / detector="研究员_synthesis" / source_ai / ticker / field / claim / actual / delta / severity / mechanism / artifact / action_taken
- Receipt JSON 加 `fabrication_logged: <row_n>` 字段

### Step 8 — Handoff Receipt

研究员 receipt JSON:
```json
{
  "task_id": "synthesis_<T>_<batch>",
  "ticker": "<T>",
  "sandbox_inputs_read": 5,
  "sandbox_inputs_used": <N>,
  "quarantine_excluded": [{source:..., field:..., rule_violated:...}],
  "anchor_status": "verified_quad|triple|dual|primary_only_pending",
  "cross_ai_spread_max_pct": <N>,
  "conflict_fields": [...],
  "files_written": ["03_tickers/<T>.md", "_AUDITS/RBv2_pilot/_consensus_matrix_..."],
  "fabrication_logged_count": <N>,
  "phase_3_audit_priorities": [<top 5 fields for 测谎员 sample=1.0>]
}
```

## §4 严格约束

- **synthesis 是 ONLY merge 点**. 任何其他 agent 不许写 canonical SSOT.
- **不许 fabricate**: 缺失字段标 NOT_FOUND, 不构造数字
- **Rule 3** never_manage_positions
- **§4 path decomposition** 不是 target_price
- **measurement freshness**: 任何 mcap/price 数字若 ≤24h gate 不通过 → strict reject (per G1)
- **Receipt 完整性**: handoff 字段全填, 缺则 phase 3 测谎员 mark `WAIVER_FABRICATED`

## §5 异常处理

| 异常 | 处理 |
|---|---|
| <3 sandbox 有 output | 不能 synthesize, mark task_status=insufficient_sources, schedule retry |
| 全部 sandbox quarantined | mark `complete_quarantine`, NOT write SSOT, schedule re-fetch |
| spread >50% on snapshot_1.market_cap_b | mark thesis-critical conflict, escalate 主线程, 不进 SSOT 直到 manual adjudication |
| Gemini/DeepSeek 100% quarantine_excluded | OK, synthesis 仍可 proceed with Claude+ChatGPT+Grok 3-way |
| 同一 AI 触发 ≥3 quarantine in single batch | escalate 总监战略队列 P0 (pattern 复发) |

## §6 调用方式

main Claude 派遣:
```
Agent(subagent_type="研究员", description="Synthesis <T>", prompt="""
  [任务 SYNTHESIS_v1.0]
  Ticker: <T>
  Task_id: DC-<...>
  Inputs: read 5 sandbox per SOP §2
  Output: SSOT v2.0 + consensus matrix per SOP §3
  规则: AI_AGENT_ISOLATION_ARCHITECTURE_v1.0.md §3 + SYNTHESIS_SOP_v1.0.md
  Receipt: per §3 step 8
""")
```

end of v1.0.
