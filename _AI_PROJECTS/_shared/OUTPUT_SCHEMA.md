---
file_type: ai_source_output_schema
version: v1.0
created: 2026-04-27
status: active
---

# AI Source Output Schema

Every AI source writes one JSON file per ticker and task:

```text
_AI_PROJECTS/<source>_research/_outputs/YYYY-MM-DD/<TICKER>_<task_id>.json
```

If quarantine-first:

```text
_AI_PROJECTS/<source>_research/_quarantine/YYYY-MM-DD/<TICKER>_<task_id>.json
```

## Required JSON Shape

```json
{
  "schema_version": "ai_source_output_v1",
  "ai_id": "claude|chatgpt|deepseek|gemini|grok",
  "task_id": "DC-YYYY-MM-DD-TICKER-NNN",
  "ticker": "TICKER",
  "task_type": "research_brief|verbatim|sec_pull|social_signal|consensus_check|other",
  "as_of": "YYYY-MM-DDTHH:MM:SS-04:00",
  "mcp": {
    "port": 9223,
    "profile": "_AI_PROJECTS/chatgpt_research/chrome_profile",
    "conversation_snapshot": "_AI_PROJECTS/chatgpt_research/_conversations/...",
    "freshness_gate_passed": true,
    "visible_message_count": 0,
    "allowed_domain_passed": true
  },
  "status": "complete|partial|failed|quarantine_pending",
  "trust_label": "primary_verified|secondary_output|quarantine_pending|source_failed",
  "sections": {
    "snapshot_1": {},
    "forecast_2": {},
    "catalyst_revenue_map_3": [],
    "three_year_math_4": {},
    "peer_valuation_5": {},
    "spof_6": {},
    "catalyst_timeline_7": [],
    "killer_triggers_8": [],
    "cross_ai_notes_9": {}
  },
  "claims": [
    {
      "field": "snapshot_1.market_cap_b",
      "value": "123.4",
      "unit": "USD_B",
      "source_url": "https://...",
      "source_date": "YYYY-MM-DD",
      "source_type": "10-Q|10-K|8-K|IR_press|transcript|consensus_aggregator|analyst_note|web_ai_output",
      "verbatim": "short exact quote or NOT_FOUND",
      "confidence": "low|medium|high",
      "needs_audit": true
    }
  ],
  "raw_quotes": [
    {
      "speaker": "CEO|CFO|COO|Analyst|Unknown",
      "quote": "verbatim quote",
      "event": "event name",
      "date": "YYYY-MM-DD",
      "source_url": "https://...",
      "commit_level": "L1|L2|L3|L4|L5|n/a"
    }
  ],
  "not_found_fields": [],
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

## Hard Rules

- No `source_url` means the claim cannot be used as a canonical SSOT fact.
- Internal files such as `03_tickers/*.md` may be context, not evidence.
- Quarantine-first sources must set `status=quarantine_pending` until audited.
- Any numerical claim must include `source_date`; stale market data older than 24h is rejected for snapshot fields.

