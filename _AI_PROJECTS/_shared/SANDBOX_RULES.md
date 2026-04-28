---
file_type: sandbox_master_rules
version: v1.0
created: 2026-04-27
supersedes: 5 per-source README.md + 2 _quarantine_rules.md (gemini, deepseek)
authority: 00_rules/AI_AGENT_ISOLATION_ARCHITECTURE_v1.0.md
status: active
---

# Sandbox Master Rules (5 AI sources)

> Single canonical doc covering all 5 AI sandbox folders + per-source rules + 2 quarantine specs.
> 旧 5 README + 2 quarantine_rules 已 archive.

---

## §1 Universal Contract (all 5 sources)

Per `_shared/SANDBOX_CONTRACT.md`:
- AI sources are **evidence providers, not canonical writers**
- Allowed: Write JSON in own sandbox / mark `quarantine_pending`
- **Forbidden**: Edit `03_tickers/` / `05_triggers/` / `_SCORECARD_2Y_3X.md` / 04_daily_log/ / Promote quote to verified_triple|quad by self-declaration / Use another AI's output as primary evidence
- Synthesis (`SYNTHESIS_SOP_v1.0`) is the ONLY merge point to canonical
- 测谎员 sample=1.0 mandatory before canonical publication
- Output format: `_shared/OUTPUT_SCHEMA.md` v1

---

## §2 Per-Source Allocation

| Source | Port | Folder | Allowed domains | Default trust | Quarantine-first |
|---|---|---|---|---|---|
| Claude (Web) | 9227 | `claude_research/` | claude.ai **(new_page 必用 Project URL: `https://claude.ai/project/019dcd87-9ef1-72a8-b98e-7174e3640e53`)** | high (audited) | NO |
| ChatGPT | 9223 | `chatgpt_research/` | chatgpt.com **(new_page 必用 project URL: `https://chatgpt.com/g/g-p-69eef61a6e1c819186a1a2473d5df891-stock/project` 才继承 PROJECT_INSTRUCTIONS)** | medium | NO |
| Grok | 9224 | `grok_research/` | grok.com, x.com **(new_page 必用 project URL: `https://grok.com/project/58a7baf2-adc9-492c-9c78-edcb218c4560?tab=conversations`)** | medium-low (numbers) | NO |
| Gemini | 9225 | `gemini_research/` | gemini.google.com **(new_page 必用 Gem URL: `https://gemini.google.com/gem/35134fcebac9`)** | quarantine-first | **YES** (G1-G6) |
<!-- DeepSeek removed 2026-04-27 per user decision (folder archived to _AI_PROJECTS/_archive/deepseek_research_2026-04-27_removed/). 4-AI architecture henceforth. -->


权威: `_AI_PROJECTS/MCP_PORT_REGISTRY.json`

---

## §3 Per-Source Roles (1 句话)

- **Claude**: Primary-source anchor — SEC/IR/transcripts/filings/verified market data. Native WebSearch/WebFetch fallback OK.
- **ChatGPT**: Structured extraction + valuation framing + secondary sanity check.
- **Grok**: Real-time signal + X chatter + sentiment shifts + dissenting market context (30-90d).
- **Gemini**: Broad discovery + peer mapping + alternate framing — but quarantine-first due to fabrication history.
- **DeepSeek**: Reasoning + adversarial review + red-team thesis — quarantine-first as new entrant.

---

## §4 Output Folder Convention

```
_AI_PROJECTS/<source>_research/
├── _outputs/YYYY-MM-DD/<TICKER>_<task_id>.json   ← verified-or-source-native, ready for synthesis
├── _quarantine/YYYY-MM-DD/<TICKER>_<task_id>.json  ← must not enter SSOT until checked
├── _conversations/                              ← chat transcript snapshots
├── _raw_fetches/                                ← (Claude only) WebFetch cache
├── chrome_profile/                              ← local browser profile (gitignore)
├── chrome_launch.ps1                            ← per-source launcher
└── _lock_active.txt                             ← runtime lock (gitignore)
```

每 output JSON 必符合 `_shared/OUTPUT_SCHEMA.md` v1 (覆盖在 `00_rules/AGENT_OUTPUT_AUTHORITY_v2.0.md` Part C.3).

---

## §5 Quarantine Rules

### §5.1 Gemini (G1-G6)

- **G1**: §1 snapshot 数字 (mcap/price/shares) freshness ≤24h. >24h → auto-reject from consensus.
- **G2**: §3 catalyst / §8 killer_triggers 数字必须 raw_quotes 支撑. 无 verbatim → `unverified_gemini_synthesis`, 不进 SSOT.
- **G3**: `fabrication_self_check` 含 "refute"/"override"/"baseline incorrect" + 与 ≥2 AI 冲突 → audit_VP block dispatch (not just warn).
- **G4**: Deep Research mode FORBIDDEN. 普通 chat mode only. (历史: 3+ chat-not-persisted bug)
- **G5**: §5 peer mapping + §8 hidden findings allowed but enter synthesis as `hypothesis_pending_verification`.
- **G6**: Gemini 不能单源驱动 SSOT thesis change / score change / catalyst-date change.

**计数**: 累计 7 次 fabrication 跨 §1/§7/§8/§verbatim, NEW failure mode 2026-04-27 = "active refutation". 详见 `_AUDITS/_FABRICATION_LOG.md` + `memory/project_gemini_paraphrase_contamination.md`.

### §5.2 DeepSeek (D1-D5)

- **D1**: DeepSeek-only numbers NEVER canonical.
- **D2**: Red-team objections enter synthesis as **questions**, not facts.
- **D3**: 任何 revenue/mcap/margin/CAGR/customer% 数字必须外源 URL + verbatim. 无 → quarantine.
- **D4**: 与 ≥2 AI 冲突 → mark `requires_primary_adjudication`.
- **D5**: 可 lower confidence, 不可独立 reverse consensus.

### §5.3 Claude defense (phantom_citation)

- Claude **不许** cite `03_tickers/*.md` / `_AUDITS/*.md` 等内部文件 as evidence URL. 内部文件仅 context.
- Trigger spec rule (active monitoring): 若 ≥3 同类 Claude phantom_citation_internal_loop 出现 → spec change ESCALATION.
- 当前累计 1 次 (CRDO DustPhotonics 4/26).

### §5.4 Grok rate-limit

- "Fast" mode quota: 1h 56min cooldown after rate-limit hit.
- 写入 `_ratelimit_state.json`:
  ```json
  {"last_query_at":"...","quota_resets_at":"...","queries_this_window":N,"fallback_mode":"auto|always-fallback|disabled"}
  ```
- Rate-limit hit → `mcp_fallback_waiver`, fallback verified_triple+gemini_divergent.
- Social claim 必带账号身份 + URL.

---

## §6 MCP / Chrome 协议

每 source chrome 实例:
- Dedicated `--user-data-dir` (per source `chrome_profile/`)
- Dedicated `--remote-debugging-port` (9223-9227)
- 启动: `chrome_launch.ps1` (per source) 或一键 `_AI_PROJECTS/launch_all_chrome.ps1`
- 健康检查: `_AI_PROJECTS/check_ports.ps1`

每 chat session:
- **Freshness gate**: take_snapshot, count visible message turns. >10 → `new_page` (anti context-bleed).
- 每 list_pages / evaluate_script 90s 上限. timeout → `mcp_fallback_waiver`, exit clean.
- Receipt 必含 `tab_freshness_check: {existing_msg_count, action: reused|new_tab}` per source.

---

## §7 Synthesis Promote Path

```
_AI_PROJECTS/<source>/_outputs|_quarantine/<date>/<T>_<task>.json
   ↓ (研究员 SYNTHESIS_SOP_v1.0 step 2: quarantine pre-check G1-G6 / D1-D5)
   ↓ (step 3: cross-AI consensus matrix)
   ↓ (step 5: write 03_tickers/<T>.md v2.0 §1-§9 — only if anchor_eligible & audit pending)
   ↓ (Phase 3 测谎员 sample=1.0 final audit)
canonical SSOT (audit_status=passed|warn) → 邮件 / 总监 综合
```

任何 fabrication detected at any step → `_AUDITS/_FABRICATION_LOG.md` append + receipt `fabrication_logged: <row_n>` + 合规主管 escalation if pattern (≥3 same-AI same-dim) hit.

---

## §8 Adding a 6th AI Source (template)

1. 在 `MCP_PORT_REGISTRY.json` `sources` 加 entry (port 9228+)
2. 建 `_AI_PROJECTS/<source>_research/` 目录 + chrome_launch.ps1
3. 在本文件 §2 加行
4. 决定 quarantine-first 否; 若是, 加 §5.X 规则
5. 加 chrome MCP server entry (per `00_rules/MCP_SERVER_CONFIG_TO_ADD.md`)
6. 用户重启 Claude Code

---

## 修订日志

- **v1.0 · 2026-04-27** · CONSOLIDATION: 合并 5 per-source README + 2 _quarantine_rules.md. 旧 7 个文件 archive 到 `_AI_PROJECTS/_shared/_archive/`.
