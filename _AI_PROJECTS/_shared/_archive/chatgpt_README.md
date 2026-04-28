---
ai_id: chatgpt
version: v1.0
mcp_port: 9223
allowed_domains:
  - chatgpt.com
default_output: _outputs
---

# ChatGPT Research Sandbox

ChatGPT is used for structured extraction, valuation framing, and second-source sanity checks.

## MCP

- Port: `9223`
- Profile: `_AI_PROJECTS/chatgpt_research/chrome_profile/`
- Allowed domain: `chatgpt.com`
- Freshness gate: open a new chat when visible message count is greater than 10.

## Output

Write JSON to:

```text
_AI_PROJECTS/chatgpt_research/_outputs/YYYY-MM-DD/<TICKER>_<task_id>.json
```

Conversation metadata goes in `_conversations/`.

