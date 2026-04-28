---
ai_id: claude
version: v1.0
mcp_port: 9227
allowed_domains:
  - claude.ai
access: dedicated_mcp_with_native_primary_fallback
default_output: _outputs
---

# Claude Research Sandbox

Claude is the primary-source anchor path: SEC, IR, transcripts, company filings, and verified market data. It can run through its own Claude Web MCP sandbox or through native primary-source tools when available.

## Role

- Fetch primary documents.
- Extract exact source-backed facts.
- Produce structured JSON for synthesis.

## Special Guardrail

Claude must not cite `03_tickers/*.md`, `_AUDITS/*.md`, or any internal project file as an external evidence URL. Internal files can be used as context only.

## Output

Write JSON to:

```text
_AI_PROJECTS/claude_research/_outputs/YYYY-MM-DD/<TICKER>_<task_id>.json
```

Cache external source snapshots in `_raw_fetches/` when useful.

## MCP

- Port: `9227`
- Profile: `_AI_PROJECTS/claude_research/chrome_profile/`
- Allowed domain: `claude.ai`
- Native primary fallback is allowed for SEC/IR/WebFetch style tasks.

