# NYC RFP × China Sourcing Arbitrage

**Project Type**: Standalone — not part of the investment research framework in this repo.
**Branch**: `claude/nyc-rfp-research-4fZfZ`
**Created**: 2026-05-19
**Status**: v0.1 scaffold

---

## Thesis (one paragraph)

NYC city agencies spend ~$30B/yr on procurement. As of January 2024, the Procurement
Policy Board lets agencies make **noncompetitive direct purchases from City-certified
MWBE vendors up to $1.5M per transaction** — bypassing the public RFP track entirely.
The user qualifies for **NYC MBE certification as an Asian-Pacific person**, and can
source physical goods from China at a 40–70% landed-cost discount versus US wholesale.
The arbitrage: become the MBE-certified middleman between agency buyers (who *must*
hit MWBE spend goals) and Chinese factories (who can't sell direct to NYC agencies).

The killer feature is not the public RFPs on PASSPort — those are price-driven,
crowded, and slow. It is the **$1.5M discretionary MWBE channel**, where agency
buyers actively *hunt* for certified vendors to spend with. Public RFPs are the
secondary funnel; first-priority is getting onto agency MWBE rolodexes.

---

## Stage gates

| Gate | What unlocks it | Status |
|---|---|---|
| **G0 — Eligibility confirmed** | Read `01_profile_qualifications.md`, confirm Asian-Pacific or Asian-Indian descent, US citizen/LPR, NY-resident business, <SBA size standard | ☐ |
| **G1 — Entity formed** | NY LLC or corp registered, EIN, business bank account, NY ST-120 resale cert | ☐ |
| **G2 — MBE application submitted** | Application via nyc.gov/mwbe; typical processing 90–120 days | ☐ |
| **G3 — PASSPort enrolled** | Vendor account at PASSPort + commodity codes selected (see `03_target_categories.md`) | ☐ |
| **G4 — First agency outreach** | Cold email to ≥5 agency MWBE contacts (NYPD, DCAS, DOE, DSNY, FDNY, Parks) with capability statement | ☐ |
| **G5 — First quote requested** | Agency requests pricing on a specific SKU | ☐ |
| **G6 — First PO** | First purchase order; deploys working capital | ☐ |
| **G7 — Second customer / repeat order** | Validates the model | ☐ |

---

## Why this is plausibly good (and where it can fail)

**Tailwinds**
- NYC has hard MWBE utilization goals (30% target across agencies); buyers are graded on it.
- $1.5M direct-buy threshold (raised Jan 2024) is materially under-exploited by new MBEs.
- Asian-American MBEs are statistically *under*-represented in goods categories vs. construction/services.
- Cash conversion: agencies pay net 30–45 on registered contracts; supplier (China) pays on T/T 30% deposit + 70% on B/L — financeable.

**Headwinds (read `04_risks_and_compliance.md` before doing anything)**
- **Section 301 tariffs**: 25% on most goods, with higher rates on textiles/EVs as of 2025. Has to be priced in.
- **UFLPA (Uyghur Forced Labor Prevention Act)**: cotton, polysilicon, tomatoes — rebuttable presumption of forced labor. Textiles risk.
- **Buy American**: federally-funded projects (most infrastructure) carry domestic-content rules; some NYC procurements inherit them.
- **Quality/cert burden**: NIOSH for respirators, ASTM/F963 for school items, UL for electrical — cost of compliance can erase margin on low-ASP SKUs.
- **Working capital**: a $200K PO needs ~$100K in inventory cash for 60 days. Factor or PO financing exists but eats 2–4%/month.

---

## Files in this project

| File | Purpose |
|---|---|
| `README.md` | This file. Thesis + gates. |
| `01_profile_qualifications.md` | NYC MBE eligibility checklist for an Asian-American applicant. |
| `02_procurement_landscape.md` | Map of who buys what: DCAS, DOE, NYPD, DSNY, FDNY, Parks, MTA, NYCHA. |
| `03_target_categories.md` | China-sourceable × NYC-demanded categories, ranked 1–10 on fit. |
| `04_risks_and_compliance.md` | Tariffs, UFLPA, Buy American, certifications, quality bonds. |
| `05_action_plan.md` | Concrete 90-day plan G0 → G4. |
| `06_data_sources.md` | All live RFP / notice feeds + monitoring setup. |
| `opportunities/_TEMPLATE.md` | Per-RFP scoring template. |
| `_LIVE_BOARD.md` | Running list of live RFPs to evaluate. |

---

## Non-goals (explicit)

- Not building a real-time scraper this iteration — we map the data sources and set up manual monitoring first.
- Not registering the entity for the user — that requires their identity docs and personal decision on legal structure.
- Not making product-line bets before MBE cert is in hand — categories are *hypotheses* until an agency confirms demand.

---

## How to use this project

1. Read `01_profile_qualifications.md` and check each eligibility box honestly.
2. Read `03_target_categories.md` to decide which 2–3 categories to anchor the capability statement on.
3. Follow `05_action_plan.md` week by week.
4. As RFPs surface (manually from `06_data_sources.md`), copy `opportunities/_TEMPLATE.md` and score them; only pursue scores ≥7/10.

Research-only. No investment, legal, or tax advice — verify with a NY-licensed attorney before forming an entity or signing a contract.
