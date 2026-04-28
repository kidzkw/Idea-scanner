---
file_type: ai_sandbox_root
version: v1.0
created: 2026-04-27
status: active_scaffold
authority: 00_rules/AI_AGENT_ISOLATION_ARCHITECTURE_v1.0.md
---

# AI Projects Sandbox Root

This folder isolates each AI source before synthesis. No AI source writes directly to canonical SSOT files under `03_tickers/`.

## Sources

| Source | Folder | MCP / access | Default trust | Canonical write permission |
|---|---|---|---|---|
| Claude | `claude_research/` | Chrome MCP port 9227 / native primary fallback | high, but audited | no |
| ChatGPT | `chatgpt_research/` | Chrome MCP port 9223 | medium | no |
| DeepSeek | `deepseek_research/` | Chrome MCP port 9226 | quarantine-first | no |
| Gemini | `gemini_research/` | Chrome MCP port 9225 | quarantine-first | no |
| Grok | `grok_research/` | Chrome MCP port 9224 | medium-low for numbers, useful for real-time | no |

## Merge Rule

Only the synthesis agent may read these folders and write canonical files:

```text
_AI_PROJECTS/<source>/_outputs or _quarantine
  -> synthesis review
  -> _AUDITS consensus matrix
  -> 03_tickers/<TICKER>.md
```

## Folder Contract

- `_outputs/`: verified or source-native JSON ready for synthesis.
- `_quarantine/`: findings that must not enter SSOT until checked.
- `_conversations/`: chat transcript snapshots and metadata.
- `chrome_profile/`: local browser profile only; never commit.
- `_lock_active.txt`: optional runtime lock; never commit.

## Required Output

Every AI output must follow `_shared/OUTPUT_SCHEMA.md`.
