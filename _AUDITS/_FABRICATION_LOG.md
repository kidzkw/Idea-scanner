---
file_type: fabrication_central_log
purpose: "Central log for all detected AI fabrication / hallucination / phantom citation. Any agent (测谎员 / 一致性稽查 / 回执稽查 / 研究员) appends one row when fabrication is detected. 合规主管 owns + weekly review."
authority: 合规主管 (Audit VP) reads + reviews. 测谎员 / main Claude / any detecting agent appends only.
last_updated: TEMPLATE
escalation_rule: same AI accumulating ≥3 fabrications in same dimension → 合规主管 escalates to 总监 strategic queue P0 (spec change required)
---

# Fabrication Central Log (template)

Each entry MUST include (per column):
- **date**: ISO timestamp
- **detector**: which agent caught it
- **source_ai**: which AI fabricated (claude / chatgpt / grok / gemini)
- **ticker**: which ticker
- **field**: SSOT section (§1 / §2 / §3 / §4 / §5 / §7 / §8 / raw_quotes)
- **claim**: fabricated number / statement
- **actual**: real number / statement
- **delta**: |claim-actual| / actual %
- **severity**: low (≤5%) / medium (5-15%) / high (>15% or thesis-touching)
- **mechanism**: how detected (sample=1.0 audit / cross-AI consensus / source URL refute / etc)
- **artifact**: evidence file path
- **action_taken**: how corrected

---

## Cumulative fabrication entries (sorted by date desc)

| date | detector | source_ai | ticker | field | claim | actual | delta | severity | mechanism | artifact | action_taken |
|---|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | | |

---

## Per-AI tally (auto-aggregated)

| AI | Cumulative count | Last incident | Status |
|---|---|---|---|
| claude | 0 | — | clean |
| chatgpt | 0 | — | clean |
| grok | 0 | — | clean |
| gemini | 0 | — | clean |

> Escalation tripwires:
> - 3+ same-AI same-dim fabrications → 合规主管 escalate P0 spec change
> - Gemini ≥6 cumulative → quarantine-first protocol mandatory (per `feedback_gemini_paraphrase_contamination.md`)
