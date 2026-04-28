---
ai_id: gemini
version: v1.0
mcp_port: 9225
allowed_domains:
  - gemini.google.com
default_output: _quarantine
---

# Gemini Research Sandbox

Gemini is useful for broad discovery, peer mapping, and alternate framing, but current project audit shows repeated fabrication and stale-number risk. All Gemini outputs are quarantine-first.

## MCP

- Port: `9225`
- Profile: `_AI_PROJECTS/gemini_research/chrome_profile/`
- Allowed domain: `gemini.google.com`
- Forbidden mode: Deep Research unless explicitly re-approved.

## Output

Default destination:

```text
_AI_PROJECTS/gemini_research/_quarantine/YYYY-MM-DD/<TICKER>_<task_id>.json
```

Only audited findings may be copied to `_outputs/`.

