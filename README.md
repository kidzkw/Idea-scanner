# AI_Research_Framework

Pluggable research framework template — a 30-agent organization, per-AI sandbox isolation v1.0, 7-dimension scoring, and 5-stage raw intake pipeline. Universe-agnostic: clone, configure your tickers/universe, and start.

**Research-only. No trading decisions.** This template never produces position / sizing / margin / timing recommendations.

---

## What this framework solves

Reading research is easy; **storing** research is hard. After 10 earnings transcripts you remember "looked OK"; details vanish. After three AIs disagree, you can't tell who's right.

This template provides:

1. **Single intake pipeline**: `02_raw/_inbox/` → 5-stage processing → archive into ticker SSOT, with full audit chain.
2. **Cross-AI weight arbitration**: SEC 100 > IR 95 > Transcript 90 > Bloomberg 85 > Gemini Deep Research 70 > ChatGPT 60 > Grok 50.
3. **Exec verbatim tracking**: L1-L5 commit level scoring; reconcile vs SEC actuals after earnings.
4. **Rule-driven workflow**: `00_rules/` codifies workflow + scoring formula + stop conditions.
5. **Anti-fabrication**: every claim carries verification tokens (source_url + quote_locator); `测谎员` audits via WebFetch+Grep sampling.

---

## 30-Agent organization (v3.0)

```
User
 └─ 总监 (CEO)  ← user's only entry point
     │
     ├─ 研究主管 (Research head) → 11 employees
     ├─ 流水主管 (Pipeline head) → 5 employees (5-stage raw intake)
     ├─ 合规主管 (Compliance head) → 3 employees
     └─ 架构主管 (Architecture head) → 4 employees (Research OS)
```

### Layer 1: 总监 (1 agent, Opus)
Receives all user tasks, classifies, dispatches 1-3 dept heads in parallel/serial, aggregates report (≤400 words).

### Layer 2: 4 dept heads (Sonnet — routing only, cost-optimized)
- **研究主管** — manages 11 research employees; routes by keyword
- **流水主管** — runs 5-stage raw intake pipeline serially
- **合规主管** — anti-fabrication audit team
- **架构主管** — Research OS engine builders

### Layer 3a: Research department (11)
Discovery / scheduling / SSOT writing / scoring / verbatim arbitration / social / SEC filings / calendar / daily log / index audit / commitment reconciliation.

### Layer 3b: Pipeline (5, serial)
Triage → Extract → Diff → Rule check → Archive

### Layer 3c: Compliance (3, anti-fabrication)
Lie-detector / receipt audit / consistency cross-check

### Layer 3d: Architecture (4, Research OS)
Signal engine / supply-chain graph / automation / canvas frontend

See `.claude/agents/README.md` for full per-agent prompts and `00_rules/` for authority.

---

## Cost allocation logic

| Model | Count | Use case | Relative cost |
|---|---|---|---|
| Opus 4.7 | 6 | User-facing (总监) + writing (研究员) + judgment (打分员/对比员) + arbitration | ~15x Haiku |
| Sonnet 4.6 | 13 | Routing (3 heads) + data fetch / audit | ~5x Haiku |
| Haiku 4.5 | 4 | Format-only writes (日历员/日志员/归档员) + rule check (分诊员) | 1x |

Rough estimate: a full "process inbox" run (10 raws) costs ~50-70% less than all-Opus dispatch.

---

## Directory map

```
00_rules/          Authority rules (DD workflow + step contracts + verification tokens + Gates A/B/C)
01_value_chain/    Value-chain layer mapping (template — configure per universe)
02_raw/            New-info intake + 5-stage processing + audit-chain archive
03_tickers/        SSOT + VERBATIM + SEC + SOCIAL + WATCHLIST (template empty)
04_daily_log/      Per-day processing summary
05_triggers/       catalyst_calendar + earnings worksheets
06_data_sources/   Data source registry + Source Weight Ladder + chrome MCP / scan scripts
08_hidden_gems_PLANNING/  Standalone planning project (e.g. fund universe definition + tracking)
_AUDITS/           Compliance audits (drift / fabrication sampling / consistency)
_AI_PROJECTS/      Per-AI sandbox folders (claude / chatgpt / grok / gemini)
.claude/agents/    30 agent prompts (Chinese-named files, English content welcome)
```

---

## Quick navigation

| Want | Read |
|---|---|
| Workflow flowchart | `00_rules/DD_WORKFLOW_v2.md` |
| Per-step contracts | `00_rules/STEP_CONTRACTS_v1.md` |
| Sub-agent prompt standard | `00_rules/AGENT_PROMPT_TEMPLATE_v1.md` |
| Anti-fabrication tokens | `00_rules/VERIFICATION_TOKENS_v1.md` |
| 30-agent dispatch graph | `.claude/agents/README.md` |
| Per-ticker SSOT template | `03_tickers/_template/TICKER_TEMPLATE.md` |
| Scorecard formula | `03_tickers/_SCORECARD_2Y_3X.md` |
| Today's events | `05_triggers/catalyst_calendar.md` |
| Per-AI sandbox architecture | `00_rules/AI_AGENT_ISOLATION_ARCHITECTURE_v1.0.md` |
| MCP server config | `00_rules/MCP_SERVER_CONFIG_TO_ADD.md` |

---

## Core concepts

**SSOT (Single Source of Truth)** — one markdown per ticker, all judgments centralize there.

**Raw 5-stage** — Triage → Extract → Diff → Rule Check → Archive. Each stage forces a deterministic artifact.

**Scorecard 2Y-3X** — 7 dims (Upside / Probability / Catalyst / SanDisk / Theme Diff / AI Fit / Integrity Δ); each dim requires 4 evidence rows.

**VERBATIM Commit Level** — L5 hard commit > L4 strong guide > L3 normal guide > L2 aspiration > L1 narrative. L4/L5 miss = probability downgrade.

**Verification Tokens** — every claim carries source_url + quote_locator + source_weight. `测谎员` auto-validates.

**Per-AI sandbox isolation v1.0** — each AI (claude / chatgpt / grok / gemini) has dedicated chrome MCP instance + project folder + quarantine rules. No global selected_page race.

**Trust hierarchy** — downstream agents trust upstream primary fetches (no re-fetch); exception: stale >30d or 测谎员 marked dubious.

---

## Hard rules (never violate)

| Rule | Detail |
|---|---|
| No position management | Never write $X / trim / add / starter / timing / margin |
| No China ADRs / mainland private | VIE / HFCAA / geopolitics → Triage rejects |
| No ETFs | Single-name only |
| Single-source quote ≠ anchor | ≥2 independent sources required for verified_dual+ |
| Secondary execs required | Beyond CEO, capture CFO / COO / President / VP voices |
| INDEX honesty | `_INDEX.md` ✅ must match real files |
| Verification token mandatory | Claims without source_url are rejected |
| Gemini quarantine-first | Gemini paraphrase contamination — never anchor `verified_quad` on Gemini alone |

---

## Multi-AI division of labor

All non-Claude models access via **chrome-devtools MCP per dedicated chrome instance** (per-AI sandbox v1.0). One MCP probe per tab; failure → primary-only fallback (Claude WebSearch) + `_VERBATIM_BACKFILL_TRACKER.md`.

| Model | Access | Purpose | Weight |
|---|---|---|---|
| Claude (Opus 4.7) | Native WebSearch / WebFetch | SEC / IR / Bloomberg primary + SSOT writing + scoring + arbitration | (arbiter) |
| Gemini (web) | chrome-devtools MCP tab | Conversational mode only (Deep Research FORBIDDEN — chat-not-persisted bug) | 60 |
| NotebookLM (web) | chrome-devtools MCP tab | Upload transcript / 10-Q for grounded Q&A | 85 |
| ChatGPT (web) | chrome-devtools MCP tab | Frameworks / valuation / structured enumeration | 60 |
| Grok (web) | chrome-devtools MCP tab | 30-90d real-time signals / X heat / M&A whispers | 50 |

4-source verbatim ("verified_quad") is the new anchor standard. See `00_rules/AI_AGENT_ISOLATION_ARCHITECTURE_v1.0.md`.

---

## Backup & automation

- **Backup script**: `_scripts/weekly_backup.ps1` (template — configure your remote)
- **Exclude**: `07_archive/` + `*.gdoc` + secrets / credentials / portfolio / lock files
- **Schedule**: configure via Windows Task Scheduler (template assumes Sunday 22:00 local)
- **Logs**: `_scripts/_logs/backup_YYYY-MM-DD_HHmm.log`

---

## Bootstrap (new universe)

See `BOOTSTRAP.md` in this directory for setup steps:
1. Define universe (e.g. "AI semi", "biotech", "fintech")
2. Configure `00_rules/_AUTHORITY_INDEX.md` universe scope
3. Launch 5 chrome MCP instances via `_AI_PROJECTS/launch_all_chrome.ps1`
4. Sign into 4 AI services in respective tabs
5. Add 5 chrome-devtools entries per `00_rules/MCP_SERVER_CONFIG_TO_ADD.md`
6. Restart Claude Code
7. Run 总监 warmup to verify 4 authority files cache hit

---

## Version
- v3.0 (template export from AI_Semi_Research, framework-only)
