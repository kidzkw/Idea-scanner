# Daily NYC RFP Monitoring Loop

> Use with the `/loop` skill. Recommended interval: **daily at 09:00 ET** (post-CROL publish).
> Manual trigger:
>
> ```
> /loop 24h <paste the prompt block below>
> ```
>
> Or for tighter monitoring during high-value pursuit windows:
>
> ```
> /loop 4h <paste the prompt block below>
> ```

---

## The prompt (copy from inside the fence)

```
You are the NYC RFP scout for the project at 10_nyc_rfp_sourcing/. Your job each
run is to surface NEW MWBE-fit opportunities, score them, and write them to
_LIVE_BOARD.md. Do not duplicate entries already on the board.

Context to load first (read these once per run):
- 10_nyc_rfp_sourcing/03_target_categories.md  (the 2-3 anchor categories)
- 10_nyc_rfp_sourcing/04_risks_and_compliance.md  (disqualifiers)
- 10_nyc_rfp_sourcing/06_data_sources.md  (where to look)
- 10_nyc_rfp_sourcing/_LIVE_BOARD.md  (what's already tracked — do not re-add)

Run, in order:

1. WebFetch https://a0333-passportpublic.nyc.gov/rfx.html — extract all RFx in
   "Released" status, posted in the last 7 days, categorized as Goods.
2. WebFetch https://a856-cityrecord.nyc.gov/ — get yesterday's procurement notices
   under "Solicitation" type. Filter to keywords: janitorial, gloves, PPE,
   uniform, hardware, signage, lighting, furniture, supplies.
3. (Once a month, on the 1st) WebFetch
   https://catalog.data.gov/dataset/m-wbe-upcoming-procurement — pull the
   upcoming MWBE list and add planned opportunities with estimated value
   under $1.5M.

For each candidate, decide PURSUE / WATCH / SKIP using these rules:

  SKIP if any of:
    - Not in target NIGP/category from 03_target_categories.md
    - Federal funding present AND product is iron/steel/manufactured (BABA blocks)
    - Cotton or aluminum primary input without obvious non-Xinjiang traceability
    - Requires NFPA, FDA 510(k), or NIOSH cert (year-1 defer)
    - Estimated value > $1.5M AND it's a Channel A direct-buy (out of scope)
    - Estimated value < $5K (not worth the entry/clearance overhead)
    - Performance bond > $100K required (bonding not yet established)

  WATCH if:
    - Borderline category fit, or
    - Solicitation due date > 45 days out (not urgent), or
    - Insufficient info in notice — flag for manual lookup

  PURSUE otherwise — score 1–10 on:
    demand_certainty, category_fit, sourcing_feasibility,
    compliance_clean, capital_fit, win_probability
  Average ≥ 7 → promote to opportunities/<EPIN>_<slug>.md using _TEMPLATE.md
  Average < 7 → leave on _LIVE_BOARD.md as WATCH

Write output by:
  a) Appending new rows to _LIVE_BOARD.md (keep existing rows; mark expired ones
     with status=EXPIRED if due date passed)
  b) For each PURSUE row scoring ≥7, create
     opportunities/<EPIN>_<slug>.md from _TEMPLATE.md and pre-fill what you can
  c) Updating "Last refresh:" timestamp at the top of _LIVE_BOARD.md
  d) Posting a final 5-line summary in your reply:
       - sources checked: N
       - new candidates seen: N
       - pursued (≥7): N
       - watch: N
       - skipped: N

Hard rules:
  - Never paraphrase agency requirements; copy verbatim from the source notice
  - Always include source URL + posted date in the board row
  - If a WebFetch fails after 1 retry, log "source: ERROR" in the summary and
    continue with other sources rather than aborting
  - Do not invent EPINs or values — if a field is missing from the source, leave blank
  - Do not commit changes — leave the working tree dirty for human review
  - Stop at 25 new candidates per run; if more, write "TRUNCATED at 25" and exit
```

---

## How to invoke

In a Claude Code session opened in this repo, run:

```
/loop 24h
```

Then when prompted for the command, paste the prompt block above. The loop skill
will re-run it every 24h and post the 5-line summary.

To stop the loop, run `/loop stop` (or whatever the loop skill's stop command is —
check `/help loop`).

## Tuning

- **Tighter cadence** during an active pursuit (response due window): `/loop 4h`
- **Looser cadence** when bandwidth-constrained: `/loop 72h`
- **Pause during MBE cert pending review**: there's little to do with candidates until cert clears, so 7d cadence is fine
- **Resume to daily** once cert is granted and PASSPort vendor account is live
