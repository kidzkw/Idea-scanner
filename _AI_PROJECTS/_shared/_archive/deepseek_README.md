---
ai_id: deepseek
version: v1.0
mcp_port: 9226
allowed_domains:
  - chat.deepseek.com
default_output: _quarantine
---

# DeepSeek Research Sandbox

DeepSeek is added as a reasoning and adversarial review source. It is quarantine-first until the fabrication profile is known.

## Role

- Red-team thesis assumptions.
- Challenge consensus.
- Find logical gaps in valuation and catalyst mapping.

## Limits

- Do not use DeepSeek as the sole source for numbers.
- Do not allow DeepSeek-only findings into SSOT.
- Use DeepSeek outputs for challenge questions unless audited.

## MCP

- Port: `9226`
- Profile: `_AI_PROJECTS/deepseek_research/chrome_profile/`
- Allowed domain: `chat.deepseek.com`

## Output

Default destination:

```text
_AI_PROJECTS/deepseek_research/_quarantine/YYYY-MM-DD/<TICKER>_<task_id>.json
```

Promote to `_outputs/` only after audit.

