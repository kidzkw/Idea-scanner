# Data Sources — Where RFPs and Notices Live

> Manual monitoring first; automation later. The cost of "missing one" is low compared
> to the cost of false-positive responses to ill-fitting RFPs.

---

## Primary feeds (check daily)

| Feed | URL | What it has | How to monitor |
|---|---|---|---|
| **PASSPort Public Solicitations** | https://a0333-passportpublic.nyc.gov/rfx.html | All released NYC competitive RFPs and RFx | Set up email alerts after enrolling commodity codes; also bookmark + filter by category |
| **City Record Online (CROL)** | https://a856-cityrecord.nyc.gov/ | Daily official publication: bid notices, awards, public hearings, contract registrations | Use **Advanced Search** + email alert on keywords ("janitorial", "PPE", "gloves", "uniform") |
| **NYC MOCS — Find Opportunities** | https://www.nyc.gov/site/mocs/passport/articles/find-opportunities.page | MOCS aggregated entry to PASSPort + filters | Bookmark |
| **Data.gov M/WBE Upcoming Procurements dataset** | https://catalog.data.gov/dataset/m-wbe-upcoming-procurement | Forward-looking list of planned MWBE procurements | Download CSV monthly |

## Agency-direct pages (check weekly)

| Agency | Page |
|---|---|
| NYPD MWBE Small Purchases | https://www.nyc.gov/site/nypd/about/about-nypd/mwbe-small-purchases.page |
| DCAS Citywide Procurement | https://www.nyc.gov/site/dcas/business/citywide-procurement-faq.page |
| DOE Procurement / Contracts | https://www.nyc.gov/site/schools/about/contracts.page |
| DSNY Procurement | https://www.nyc.gov/site/dsny/about/inside-dsny/procurement.page |
| Parks Doing Business | https://www.nyc.gov/site/parks/about/work-with-parks.page |
| NYCHA Procurement | https://www.nyc.gov/site/nycha/business/procurement.page |
| MTA Doing Business (state, not city) | https://new.mta.info/doing-business-with-us |
| Port Authority (bi-state) | https://www.panynj.gov/business-opportunities/en/index.html |

## Adjacent / benchmark feeds

| Feed | URL | Why useful |
|---|---|---|
| **SAM.gov** | https://sam.gov/ | Federal opportunities; benchmark + GSA Schedules path |
| **GSA Advantage** | https://www.gsaadvantage.gov/ | Federal price ceiling per SKU |
| **NYS OGS Centralized Contracts** | https://ogs.ny.gov/procurement/centralized-contracts | NYS pricing benchmark |
| **NYS Contract Reporter** | https://www.nyscr.ny.gov/ | NYS open solicitations |
| **GovDeals NYC surplus** | https://www.govdeals.com/ | NYC sells off — shows what they over-bought |
| **NYC Open Data — Procurement** | https://data.cityofnewyork.us/browse?q=procurement | Historical award data; price/win analysis |

---

## Search recipes (copy-paste)

### CROL Advanced Search keywords
- "janitorial" + "agency: DSNY OR DCAS OR NYCHA"
- "gloves" + "category: Goods"
- "uniform" + "agency: DSNY OR Parks OR DOE"
- "PPE" + "category: Goods"
- "hardware" + "category: Goods"

### PASSPort filters
- RFx Status: Released
- RFx Type: Goods
- Category: filter by NIGP codes selected during enrollment

### Data.gov MWBE upcoming dataset — Python snippet (when automation is built)

```python
import pandas as pd
url = "https://data.cityofnewyork.us/api/views/<dataset-id>/rows.csv?accessType=DOWNLOAD"
df = pd.read_csv(url)
target = df[df['Category'].isin(['Goods'])]
target = target[target['Estimated Contract Value'] < 1_500_000]  # direct-buy ceiling
target.to_csv('opportunities/_imports/mwbe_upcoming.csv', index=False)
```

(Defer building this until manual monitoring proves the value.)

---

## Monitoring SLA

| Source | Frequency | Owner | Action on hit |
|---|---|---|---|
| PASSPort email alerts | Real-time → triage within 24h | User | Copy notice to `opportunities/<EPIN>.md` |
| CROL email alerts | Daily | User | Same |
| Agency MWBE pages | Weekly Friday | User | Check for new postings |
| Data.gov MWBE upcoming | Monthly 1st | User | Append to `_LIVE_BOARD.md` |
| Capability statement → liaison rolodex | Quarterly | User | Refresh + re-send to non-responders |

---

## Loop / automation plan (later)

When manual monitoring is overflowing, escalate in this order:

1. **Email-rule automation** — Gmail filter rules: `from:nyc.gov "RFx Released"` → tag `nyc-rfp` → forward to a single triage inbox
2. **Daily summary** — Claude `/loop` prompt running daily that pulls CROL + PASSPort + Data.gov, scores against the category fit, and writes a digest to `_LIVE_BOARD.md` (see project root for the loop prompt template)
3. **Scrape only if needed** — only PASSPort RFx pages, with a respectful 1 req/sec rate limit and ToS-compliant access pattern; prefer the official email alerts

---

**Sources** (entry points):
- [PASSPort Public](https://a0333-passportpublic.nyc.gov/rfx.html)
- [CROL Home](https://a856-cityrecord.nyc.gov/)
- [MOCS Find Opportunities](https://www.nyc.gov/site/mocs/passport/articles/find-opportunities.page)
- [Data.gov MWBE Upcoming](https://catalog.data.gov/dataset/m-wbe-upcoming-procurement)
