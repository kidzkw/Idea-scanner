---
file_type: authoritative_architecture
version: v1.0
created: 2026-04-27
authority: 总监 + 架构主管
supersedes: 00_rules/AI_AGENT_ISOLATION_ARCHITECTURE_v0.1.md
status: active_scaffold
purpose: "Five-source AI sandbox architecture: DeepSeek, ChatGPT, Gemini, Claude, Grok each gets isolated MCP/profile/project folder; only synthesis writes canonical SSOT."
---

# AI Agent Isolation Architecture v1.0

## Core Decision

Five AI sources run in separate sandboxes:

| AI | Folder | MCP port | Browser domain | Default destination | Role |
|---|---|---:|---|---|---|
| DeepSeek | `_AI_PROJECTS/deepseek_research/` | 9226 | `chat.deepseek.com` | `_quarantine/` | red-team reasoning |
| ChatGPT | `_AI_PROJECTS/chatgpt_research/` | 9223 | `chatgpt.com` | `_outputs/` | structured extraction |
| Gemini | `_AI_PROJECTS/gemini_research/` | 9225 | `gemini.google.com` | `_quarantine/` | peer map / alternate framing |
| Claude | `_AI_PROJECTS/claude_research/` | 9227 | `claude.ai` | `_outputs/` | primary-source extraction |
| Grok | `_AI_PROJECTS/grok_research/` | 9224 | `grok.com`, `x.com` | `_outputs/` | real-time / social signal |

Port `9222` remains reserved for the legacy shared Chrome MCP instance and should not be used by isolated agents.

## Hard Boundary

No source agent writes canonical files:

```text
03_tickers/
04_daily_log/
05_triggers/
03_tickers/_SCORECARD_2Y_3X.md
```

All source outputs must land in `_AI_PROJECTS/<source>_research/` and follow `_AI_PROJECTS/_shared/OUTPUT_SCHEMA.md`.

## Canonical Merge

Only the synthesis step can write canonical research artifacts:

```text
source sandbox outputs
  -> consensus matrix
  -> audit
  -> canonical SSOT write
```

The synthesis step must record:

- included sources
- excluded quarantine findings
- source-level disagreements
- any primary-source adjudication
- final audit result

## Quarantine-First Sources

DeepSeek and Gemini are quarantine-first.

They may contribute:

- questions
- red-team objections
- peer mapping hypotheses
- alternate catalyst paths

They may not independently trigger:

- score changes
- thesis upgrades/downgrades
- catalyst-date changes
- market cap / revenue / margin facts
- verified quote labels

## Required Launch Scripts

Each web-based source has a local launcher:

```text
_AI_PROJECTS/chatgpt_research/chrome_launch.ps1
_AI_PROJECTS/deepseek_research/chrome_launch.ps1
_AI_PROJECTS/gemini_research/chrome_launch.ps1
_AI_PROJECTS/grok_research/chrome_launch.ps1
_AI_PROJECTS/claude_research/chrome_launch.ps1
```

Each script uses a dedicated `chrome_profile/` directory and dedicated remote-debugging port.

## Freshness Gate

Before every prompt submission:

1. Confirm active tab domain is allowed.
2. Count visible message turns.
3. If visible message turns > 10, open a new chat.
4. Record `freshness_gate_passed` and `visible_message_count` in output JSON.

## Audit Standard

All §1-§4 hard numbers from `RESEARCH_BRIEF_v2.0.md` require sample-rate 1.0 audit before SSOT publication.

Any source with `source_url` missing, stale snapshot data, or unsupported verbatim must be excluded or downgraded.

## Operational Order

1. Start five Chrome profiles and log in once.
2. Run source agents into `_AI_PROJECTS`.
3. Run synthesis from local JSON files.
4. Run audit before canonical write.
5. Append results to `_AUDITS`.

## Current Scaffold

The folder scaffold is live as of 2026-04-27. Automation against each MCP port is allowed only after the harness confirms the target port and domain.

