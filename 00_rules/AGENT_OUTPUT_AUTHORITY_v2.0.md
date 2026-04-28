---
file_type: agent_prompt_and_output_consolidated_authority
version: v2.0
created: 2026-04-27
supersedes: AGENT_PROMPT_TEMPLATE_v1.md (v1.4) + RESEARCH_BRIEF_v2.0.md (v2.0)
status: active
authority: DD_AUTHORITY_v3.2.md companion
purpose: "单一文件 cover (A) agent prompt 模板 + (B) SSOT v2.0 §1-§9 硬数据 schema + (C) 7-dim scoring + audit + AI sandbox output JSON. 之前 2 个文件合并."
---

# Agent Output Authority · v2.0

> Part A: 给每个 agent 的 prompt template (10 sections, 按需 inject)
> Part B: 每个 v2.0 SSOT 的 §1-§9 硬数据 schema
> Part C: 7-dim scoring + 测谎员 audit protocol + AI sandbox JSON output

---

## Part A · Agent Prompt Sections (10 sections)

每 Agent(prompt=...) 调用按需 inject. 规则: 子任务越小 → section 越少; 全 DD → 全 section.

### § 0 — 核心人设 (Ruthless Executor)

```
Zero EQ, High Execution IQ.
1. 绝对客观 (Data Purity): 一切只认事实/数字/URL. 没明确数据 → 标 `tentative`, 绝不 fabricate.
2. 防御性执行 (Fail-fast): API 超时 / 网页不可读 → 立即抛 `mcp_fallback_waiver`, 干净退出.
3. 冷酷的判决 (Ruthless Check): 触发止损线毫不犹豫 ❌, 不需情感缓冲.
4. 不对公司基本面破裂找借口 (anti 证实偏差).
```

### § 1 — Workflow Prologue (ALL research agents)

```
DD_AUTHORITY_v3.2 §1 六阶段:
1. Triage: source 存在 + frontmatter 有效 + Grok/Gemini truncation 检测
2. Extract: AI Industry Fit 五条 (强校验 URL+数值) + Catalyst + 止损 + 数字 + 高管 (→ VERBATIM)
3. Diff: vs 最近 3 张卡, ✅/🔁/⚠️/📊 + Source Weight 仲裁
4. Rule Check: trading_rules §七 逐条 ✅/⚠️/❌
5. Archive: SSOT append + daily_log 一行 + raw → _processed/ + catalyst_calendar update
6. Handoff: 标准 receipt
```

### § 2 — Compliance Rules (required)

```
Rule 1 (no_china_adrs): exclude VIE/HFCAA tickers
Rule 2 (no_etfs): exclude ETFs from SSOTs
Rule 3 (never_manage_positions): 禁 buy/sell/target $X/sizing/margin/timing 语言. Neutral research tone only.
Rule 4 (verbatim_4-way v3.0+): Claude-only = primary_only_pending; ≥3 source = anchor; flag single-source.
Rule 5 (index_honesty): every ✅ in INDEX maps to real file
```

### § 3 — Raw Pipeline (any agent producing research)

```
1. 先建 raw at `02_raw/_inbox/<YYYY-MM-DD>_<TICKER>_<source>_<topic-kebab>.md`
   Frontmatter 必填 (per FILENAME_FORMAT_v1): date / ticker / source / topic / status / source_weight / data_quality / confidence / scorecard_version
2. 再 synthesize 到 SSOT / daily_log / etc
3. raw → `02_raw/_processed/YYYY-MM/` with `status: processed`
4. cite raw file path in every downstream consumer

DO NOT 直接写 SSOT 不留 raw 审计链.
```

### § 4 — Scorecard Rigor (any agent proposing score change)

每 dim 必带 4 evidence: Source URL / Date / Numeric / Reason.

5-dim v3.0:
- Upside (20)
- Probability (20)
- Catalyst Density (20)
- AI Industry Fit 5×4 (20):
  - Sub-1 AI ecosystem binding (NVDA/Google/Anthropic/OpenAI/Meta/xAI)
  - Sub-2 Moat + 5y irreplaceability
  - Sub-3 AI 财务溢价 (Rev YoY ≥30% + GM ↑3pp + FCF+)
  - Sub-4 量产+出货 beat (供应链稳 + beat ≥75% + TAM headroom)
  - Sub-5 R&D 突破 (6-18mo window + ≤2 真竞品)
- Theme Differentiation (20)
- Integrity Modifier: ≥50% verified_quad → +1; 单源 ≥50% → -2

每 dim ≥1 evidence URL + 数值/fact, 否则标 `tentative_pending_evidence`.
**升级版 7-dim v2.0**: 详见 §C.

### § 5 — 二级管理层 Scan (earnings / conference call)

```
- MUST capture beyond CEO: CFO / COO / President / VP / GM
- CEO-only = single-point-of-failure flag active
- Add row to `03_tickers/VERBATIM/_SECONDARY_EXEC_GAP.md` if missed
- Anchor confidence capped at 'medium' until secondary captured
- 新 CEO + material event = HIGH priority backfill
```

### § 6 — VERBATIM Dispatch (4-way mandatory v3.0+)

```
1. Claude (主): WebSearch/WebFetch transcripts (Seeking Alpha / Motley Fool / IR)
2. ChatGPT (chrome :9223 _AI_PROJECTS sandbox)
3. Grok (chrome :9224 sandbox)
4. Gemini (chrome :9225 sandbox) — 🚫 Deep Research FORBIDDEN, 普通 mode only
5. (BONUS) DeepSeek (chrome :9226 sandbox, red-team only, quarantine-first)

Anchor status:
- verified_quad (4/4 mandatory) → +1 Integrity
- verified_triple (3/4) → anchor-eligible (back-compat)
- verified_dual (2/4) → allowed
- primary_only_pending → NOT anchor
- *_only_unverified → NEVER anchor

Default dispatch: Watchdog drip (CronCreate durable=true), 90s fail-fast.
chrome down → primary_only_pending + backfill (per `_VERBATIM_BACKFILL_TRACKER.md`).
```

### § 7 — Session-end Audit (long-running agent)

```
Mini-audit before return:
[ ] New files listed with absolute path
[ ] Raw files moved to _processed/
[ ] INDEX rows added for new SSOTs
[ ] Secondary exec gap flagged if CEO-only
[ ] Scorecard changes have evidence
[ ] Rule 3 lint: zero position/sizing/timing language
[ ] Rule 4 check: single-source quotes flagged
```

### § 8 — Report Format (required)

```
1. Headline finding (1-2 句)
2. Key numbers vs threshold
3. Workflow compliance status (steps skipped/completed)
4. Files created/updated (absolute paths)
5. Next actions / pending items
6. Source anchor status (verified_quad / triple / dual / primary_pending)
```

### § 9 — DD Enforcement v3.2 §7 (MANDATORY for VERBATIM / earnings-event workers)

详见 `DD_AUTHORITY_v3.2.md` Part 2 §7.1-§7.5 (Gates A+B+C). 90s 硬上限. Receipt JSON 必填 (mcp_evidence + tab_freshness_check + fabrication_logged + artifacts_written).

**Mandatory first actions** (before any WebSearch/WebFetch/file write):
1. `list_pages` → capture call_id
2. 若 ChatGPT/Grok/Gemini/DeepSeek tab 不存在 → `new_page` to canonical URL, capture call_id
3. **Freshness gate v1.2**: take_snapshot 数 message turns; >10 → new_page (anti context-bleed); record `tab_freshness_check: {existing_msg_count, action: reused|new_tab}` per source
4. evaluate_script 发 prompt → capture call_id + raw response sha256(first 500 chars)
5. Save raw to `02_raw/_processed/YYYY-MM/...` with `enforcement_contract_id: DC-...`
6. Only after 1-5 succeed → Claude primary WebSearch/WebFetch + 第 N raw

Receipt JSON full schema: see `DD_AUTHORITY_v3.2.md` §7.2.

### § 10 — AI Source Isolation (MANDATORY for 5-source research)

```
Authority: AI_AGENT_ISOLATION_ARCHITECTURE_v1.0.md.

For DeepSeek / ChatGPT / Gemini / Claude / Grok work:
1. Write only inside own sandbox: `_AI_PROJECTS/<source>_research/`
2. Follow `_AI_PROJECTS/_shared/OUTPUT_SCHEMA.md`
3. DO NOT edit canonical 03_tickers/ / 05_triggers/ / _SCORECARD_2Y_3X.md
4. DeepSeek + Gemini quarantine-first: default → `_quarantine/`, not `_outputs/`
5. Only synthesis (研究员 SYNTHESIS_SOP_v1.0) merges into canonical SSOT after audit
6. Internal files = context only, NOT evidence URLs (Claude phantom_citation_internal_loop defense)
```

### Usage Protocol

main thread `Agent(prompt=...)`:
- Always: § 1 + § 2 + § 7 + § 8
- + § 3 if produces raw content
- + § 4 if proposes Scorecard change
- + § 5 if processes earnings/call
- + § 6 if fetches VERBATIM
- + § 9 MANDATORY for VERBATIM / earnings-event / new-SSOT-with-exec-quotes
- + § 10 MANDATORY for any 5-source AI sandbox task

或简引: "Apply §1/§2/§3/§7/§8 from AGENT_OUTPUT_AUTHORITY_v2.0".

---

## Part B · Research Brief v2.0 SSOT Schema (硬数据 §1-§9)

### Hard Rules (frontmatter level)
- 每数字必带 (source_url, source_date, source_type ∈ [10-Q, 10-K, 8-K, IR_press, transcript, consensus_aggregator, analyst_note]). 缺一 = NOT_FOUND, 不 fabricate.
- verbatim cite > paraphrase. 数字 = 只复制不计算 (除非显式标 [CALC: formula]).
- Rule 3 严守.
- Cross-AI consensus matrix §9 强制. divergence ≥10% 必标 ⚠️.
- MISSING_HARD_DATA 任一 §1-§4 缺 → frontmatter `anchor_eligible: false` + 进 BACKFILL_TRACKER.

### §1 当前 Snapshot
```yaml
snapshot:
  as_of: <YYYY-MM-DD HH:MM ET>
  price: {close: <USD>, source_url, source_date}
  market_cap_b: <USD B>
  shares_outstanding_m: <M>
  ttm: {revenue_b, revenue_yoy_pct, ebitda_b, ebitda_margin_pct, eps_diluted, fcf_b, fcf_margin_pct,
        sources: [{quarter, filing, url, filing_date}, ...]}  # 4 季 10-Q 累加
  multiples: {pe_ttm, pe_fwd, ev_sales_ttm, ev_ebitda_ttm, pb,
              peer_mean_ev_sales, own_5y_mean_ev_sales,
              premium_or_discount_vs_peer_pct, premium_or_discount_vs_5y_pct}
```

### §2 营收/利润预测 (FY26-FY28)
```yaml
forecast:
  fy26:
    consensus: {revenue_b, gm_pct, opm_pct, ebitda_b, eps, fcf_b, n_estimates, sources: [...]}
    bull: {revenue_b, eps, assumption: "<≤30字>", probability_pct}
    base: {...}
    bear: {...}
  fy27: <same shape>
  fy28: <same shape>
```
约束: consensus = ≥3 分析师/aggregator 平均.

### §3 Catalyst → Revenue 映射
```yaml
catalyst_revenue_map:
  - id: CAT-1
    event: "..."
    expected_date: <YYYY-MM-DD or window>
    revenue_impact: {fy27_bump_usd_m, fy27_bump_pct, fy28_bump_usd_m}
    hit_probability: low(<30%) | med(30-65%) | high(>65%)
    probability_pct: <%>
    anchor_evidence: {verified, url, file_line, verbatim_quote: "<≤120字>"}
    fallback_if_missed: "<1句>"
```

### §4 3Y 数学路径
```yaml
three_year_math:
  current_mcap_b: <USD B>
  required_cagr_for_3x_pct: 44.2  # = (3^(1/3)-1)*100
  required_cagr_for_2x_pct: 26.0
  decomposition:
    revenue_cagr_pct: {bull, base, bear, prob_dist: {bull, base, bear}}
    margin_expansion_bps: {bull, base, bear}
    multiple_expansion_x: {bull, base, bear}
  weighted_3y_mcap_b: <USD B>  # = sum(prob_i * mcap_i)
  ai_sources: [claude, chatgpt, grok, gemini, deepseek]  # MIN 2 — list AI sources that independently computed this
  ai_source_count: <int>  # MUST be ≥ 2; if 1 → spof_flag below
  spof_flag: <true|false>  # true if ai_source_count < 2
  notes: "<≤80字 关键假设>"
```
**不许 fabricate target price**; §4 是 path decomposition, 不是 recommendation.

**🔒 §4 SPOF Hard Rule (added 2026-04-27)**:
- `weighted_3y_mcap_b` MUST be computed by ≥ 2 independent AI sources (Claude + at least 1 of: ChatGPT / Grok / Gemini / DeepSeek).
- If only 1 AI computed (single-AI SPOF): set `spof_flag: true` + write entry to §6 `single_source_numbers` (`field: weighted_3y_mcap_b, source: <ai>, backstop_pending: true, backfill_eta: <T+7 days>`) + frontmatter `weighted_3y_mcap_spof: true`.
- §9 Consensus Matrix MUST show ≥ 2 filled `weighted_3y_mcap_b` cells; otherwise verdict = `spof_pending` (not `agree`/`warn`/`conflict`).
- Rationale: §4 是用户 path-to-3x 数学决策核心字段 (RMBS/LITE 历史案例 single-AI 风险). 强制冗余防止单 AI 数学错传播至 SSOT 主结论.

### §5 同业 Valuation Comparison
```yaml
peer_valuation:
  peers: [<TICKER1>, ...]
  table:
    - {ticker, mcap_b, revenue_ttm_b, ebitda_margin_pct, pe_fwd, ev_sales_ttm, ev_ebitda_ttm, source_url}
  own_position: premium|inline|discount
  delta_vs_peer_mean_pct: <%>
```

### §6 SPOF / Single-Source 风险
```yaml
spof:
  single_source_numbers:
    - {field, source, backstop_pending, backfill_eta}
    # NOTE: §4 weighted_3y_mcap_b with ai_source_count<2 MUST appear here
    # (per §4 SPOF Hard Rule, added 2026-04-27).
  catalysts_no_fallback:
    - {id, reason: "<≤40字>"}
```

### §7 Catalyst 时间表 (T-N alerts)
```yaml
catalyst_timeline:
  - {event_date, event_type: earnings|filing|product_launch|regulatory|other, name: "<≤40字>",
     t_minus_alerts: [T-7, T-3, T-1, T-0, T+1], binary_pct: <%>}
```

### §8 Killer Disconfirmation Triggers
```yaml
killer_triggers:
  - {id: KILL-1, description: "<≤80字 必含具体数字>", source_to_watch, threshold,
     impact_if_hit: thesis_broken|thesis_dented|recheck}
  # 3-5 triggers required
```

### §9 Cross-AI Consensus Matrix
```yaml
cross_ai_consensus:
  ai_outputs:
    claude: {§1_snapshot: {filled, missing_fields}, §2_forecast: {filled, fy26/27/28_rev_b}, §3, §4}
    chatgpt: <same>
    grok: <same>
    gemini: <same, quarantine-first>
    deepseek: <same, quarantine-first>
  consensus_check:
    fy27_rev_b: {claude, chatgpt, grok, gemini, deepseek, max_min_spread_pct,
                 verdict: agree(<5%)|warn(5-10%)|conflict(>10%)}
    fy28_rev_b: <same>
    weighted_3y_mcap_b: {claude, chatgpt, grok, gemini, deepseek, max_min_spread_pct,
                         verdict: agree(<5%)|warn(5-10%)|conflict(>10%)|spof_pending}
    # spof_pending verdict iff <2 cells filled (per §4 SPOF Hard Rule)
  warnings:
    - {field, type: divergence|missing|fabrication_suspected|spof_single_ai, detail: "<≤80字>"}
```

### §10+ Historical Narrative
旧 v1.x SSOT 内容保留作 historical context, 但所有数字 cross-ref §1-§4.

---

## Part C · 7-Dim Scoring + Audit + AI Sandbox JSON

### C.1 7-Dim Scoring v2.0 (升级 5-dim v3.0)

```yaml
scoring_v2:
  dim1_business_quality: <0-5>
  dim2_moat_strength: <0-5>
  dim3_management_capital_alloc: <0-5>
  dim4_growth_runway: <0-5>
  dim5_catalyst_density: <0-5>
  dim6_financial_quality:  # NEW: 基于 §1 ttm + §2 forecast
    sub: {gm_quality: <0-5>, cash_conversion: <0-5>, balance_sheet: <0-5>}
    weighted: <0-5>
  dim7_valuation_anchor:  # NEW: 基于 §1 multiples + §5 peer
    sub: {multiple_vs_peer: <0-5>, multiple_vs_5y: <0-5>, implied_3y_path_realism: <0-5>}
    weighted: <0-5>
  total: <0-35>
  anchor_eligible: <true if §1-§4 全 + total ≥ 24>
```

### C.2 测谎员 Audit Protocol (sample_rate=1.0)

每 §1-§4 数字 (~30-50 per ticker):
1. 取 (source_url, verbatim_quote)
2. WebFetch URL → 检查页面含此数字 ±5% 容差
3. 不一致 → flag `audit_fail` + 写 `_AUDITS/audit_<T>_<date>.md`
4. fail_rate >5% → frontmatter `audit_status: failed`, 不可发布
5. 任何 fabrication detected → append `_AUDITS/_FABRICATION_LOG.md` + receipt 加 `fabrication_logged: <row_n>`

### C.3 AI Sandbox JSON Output Format (5-source mandatory)

每 AI sub-agent (claude/chatgpt/grok/gemini/deepseek) 必返 JSON, 写到 `_AI_PROJECTS/<source>_research/_outputs|_quarantine/YYYY-MM-DD/<TICKER>_<task_id>.json`:

```json
{
  "schema_version": "ai_source_output_v1",
  "ai_id": "claude|chatgpt|grok|gemini|deepseek",
  "task_id": "DC-YYYY-MM-DD-TICKER-NNN",
  "ticker": "T",
  "task_type": "research_brief|verbatim|sec_pull|social_signal|consensus_check|other",
  "as_of": "ISO",
  "mcp": {
    "port": 9223-9227,
    "profile": "...",
    "conversation_snapshot": "...",
    "freshness_gate_passed": true,
    "visible_message_count": N,
    "allowed_domain_passed": true
  },
  "status": "complete|partial|failed|quarantine_pending",
  "trust_label": "primary_verified|secondary_output|quarantine_pending|source_failed",
  "sections": {
    "snapshot_1": {...},
    "forecast_2": {...},
    "catalyst_revenue_map_3": [...],
    "three_year_math_4": {...},
    "peer_valuation_5": {...},
    "spof_6": {...},
    "catalyst_timeline_7": [...],
    "killer_triggers_8": [...],
    "cross_ai_notes_9": {...}
  },
  "claims": [
    {"field":"snapshot_1.market_cap_b","value":"123.4","unit":"USD_B",
     "source_url":"...","source_date":"...","source_type":"10-Q|10-K|8-K|IR_press|...",
     "verbatim":"...","confidence":"low|medium|high","needs_audit":true}
  ],
  "raw_quotes": [
    {"speaker":"CEO|CFO|...","quote":"...","event":"...","date":"...",
     "source_url":"...","commit_level":"L1|L2|L3|L4|L5|n/a"}
  ],
  "not_found_fields": [...],
  "fabrication_self_check": {
    "calculations_done": false,
    "used_internal_ssot_as_source": false,
    "refuted_other_ai": false,
    "notes": ""
  },
  "handoff": {
    "recommended_destination": "_outputs|_quarantine",
    "synthesis_include": false,
    "audit_required": true,
    "reason": ""
  }
}
```

**Hard rules per output**:
- 无 source_url → claim 不可作 canonical SSOT fact
- 内部文件 (03_tickers/*.md / _AUDITS/*.md) 仅 context, NOT evidence URL
- Quarantine-first sources (Gemini / DeepSeek): `status=quarantine_pending` 直到 audit
- 任何 §1 numerical claim 必带 source_date; mcap/price >24h stale → reject

### C.4 Phase Pipeline Wall Time 估

| Phase | 动作 | Owner | Wall Time |
|---|---|---|---|
| 0 | spec / dispatch_plan | 总监 | done |
| 1 | 5 AI × N ticker (sandbox-isolated, 真并行 per architecture v1.0) | main Claude | 5-8 min |
| 2 | synthesis: N×5 outputs → N v2.0 SSOT + cross-AI matrix | 研究员 (SYNTHESIS_SOP_v1.0) | 3 min |
| 3 | 测谎员 sample=1.0 验证 | 测谎员 | 2 min |
| 4 | 邮件 → kevin2023505@gmail.com | 社交员 / main Claude | 30 sec |
| **Total** | | | **~10 min** |

### C.5 Constraints (HARD)

- chrome MCP freshness gate v1.2: 任何 fetch 必带 timestamp ≤24h
- Gemini 普通 mode v1.3: 不 enable Deep Research
- chrome MCP 序列化: per-AI 独立 port (architecture v1.0) → 真并行 OK; 若回退 single-port → ≤3 sub-agent 并发
- Rule 3: 全程禁仓位语言

---

## 修订日志

- **v2.0 · 2026-04-27** · CONSOLIDATION: 合并 AGENT_PROMPT_TEMPLATE_v1 (v1.4) + RESEARCH_BRIEF_v2.0 (v2.0). DeepSeek 第 5 源加入. 旧 2 文件 archive.
- AGENT_PROMPT v1.4 · 2026-04-27 · §10 sandbox isolation
- v1.3 · 2026-04-26 · Gemini Deep Research forbidden
- v1.2 · 2026-04-26 · chrome chat freshness gate
- v1.1 · 2026-04-24 · 4-way Gemini, 90s fail-fast
- v1.0 · 2026-04-23 · initial template
- RBv2.0 · 2026-04-26 · §1-§9 hard data SSOT framework
