# Risks & Compliance — Read Before First Order

> If any of these blow up, the deal isn't unprofitable — it's *illegal* or *seized*.
> This is not legal advice. Hire a customs broker and a NY attorney before first import.

---

## 1. Tariffs (Section 301 + 232 + Section 201)

**Section 301** — China-origin tariffs. Most goods carry an extra 7.5–25%. As of
2024–2025 escalations:
- EVs: 100%
- Semiconductors: 50%
- Solar cells: 50%
- Lithium-ion batteries: 25%+
- Steel & aluminum: 25%
- Most other consumer goods on Lists 1–3: 25%
- Apparel/textiles on List 4A: 7.5%

**Practical impact**: bake 25% into landed-cost assumptions for any China-origin good
unless the HTS code falls on a List 4B item (currently suspended). Use the official
[HTS search](https://hts.usitc.gov/) and CBP's tariff lookup to confirm per SKU.

**Section 232** — steel/aluminum (25%/10% base, partial exemptions). Hits fasteners,
furniture frames, signage substrates.

**De minimis (Section 321)** — sub-$800 shipments used to enter duty-free. **As of
2025**, China-origin de minimis is being curtailed. Do **not** build a model that
depends on it for B2G volume — agency POs will exceed the threshold anyway.

---

## 2. Uyghur Forced Labor Prevention Act (UFLPA)

**Rebuttable presumption**: goods made *in whole or in part* in Xinjiang, or by
entities on the UFLPA Entity List, are barred from US import.

**High-risk inputs**:
- **Cotton** (Xinjiang produces ~85% of China's cotton) — kills naïve textile sourcing
- **Polysilicon** (solar panels) — not in target categories but flag
- **Tomatoes** — not relevant
- **PVC** — used in some plastics
- **Aluminum** — Xinjiang produces ~10% of China's aluminum; some signage / hardware risk
- **Lithium batteries** — supply chain transparency required

**What "rebuttable" means in practice**: CBP detains the shipment; importer must
prove negative — that no Xinjiang input or labor touched any layer of the supply
chain. Burden of proof is severe. Cotton uniforms detained ≈ working capital frozen
30–90 days, often forfeited.

**Mitigation**:
- Source apparel from Vietnam, Bangladesh, or Indonesia for cotton-heavy items (lose some China cost advantage, gain compliance)
- Demand factory-level traceability docs (yarn certs, cotton origin)
- Maintain CBP-style supply chain map per SKU

---

## 3. Buy American / Build America Buy America (BABA)

**Buy American Act** — federal procurement, 60%+ domestic content (rising to 75% by 2029).
**BABA** (IIJA 2021) — federally-funded infrastructure projects require domestic iron, steel, manufactured products, construction materials.

**Application to NYC**:
- City-funded procurement: **mostly not subject** to federal Buy American
- Federally-funded city projects (HUD on NYCHA; FTA on MTA; FHWA on DOT bridges): **subject to BABA**
- DSNY salt for road treatment + Parks materials: usually city-funded → safe
- NYCHA apartment renovations: HUD funds → BABA applies → China sourcing **blocked** for iron/steel/manufactured

**NYC also has** "Buy NY" preferences (limited; mostly food and printing) — not a major China-import barrier for target categories.

**Action**: filter every RFP for funding source. If federal funding present, skip
unless adjacency (services) escapes BABA.

---

## 4. Product certifications by category

| Category | Cert required | Cost | Time |
|---|---|---|---|
| **Janitorial plastics** | None federal; sometimes Prop 65 / REACH for export-version factory | $0–$2K | 2 weeks |
| **Work gloves** | ANSI/ISEA 105 (cut), 138 (impact) — third-party lab test | $1K–$5K per SKU | 4–8 weeks |
| **Safety glasses** | ANSI Z87.1+ | $2K–$5K | 6 weeks |
| **Hi-vis vests** | ANSI/ISEA 107 Class 2 or 3 | $2K–$5K | 6 weeks |
| **Hard hats** | ANSI Z89.1 | $3K–$8K | 8 weeks |
| **Office furniture** | BIFMA preferred, ANSI/SOHO basic | $5K–$15K | 8–12 weeks |
| **LED fixtures** | UL or ETL listing | $10K–$30K | 8–16 weeks |
| **Traffic signs (MUTCD)** | ASTM D4956 sheeting + MUTCD compliance | $5K–$10K | 4–8 weeks |
| **DOE classroom items** | ASTM F963, CPSIA Phthalates, lead testing | $3K–$8K per SKU | 4–8 weeks |
| **N95/surgical masks** | NIOSH (N95), FDA 510(k) (surgical) | $50K+ | 6–18 months |
| **Children's playground** | ASTM F1487 + IPEMA cert | $10K–$50K | 3–6 months |

**Heuristic**: cert cost should be ≤10% of first-year category revenue or skip.

---

## 5. CBP & customs

- **CBP Form 7501 entry** filed per shipment via licensed customs broker
- **ISF (Importer Security Filing)** filed 24h before vessel loading
- **HTS classification** — wrong code = penalty + retroactive duty
- **CTPAT** — voluntary program; reduces inspection rate, ~6 month enroll
- **Origin documentation** — Cert of Origin from factory; sometimes chamber-stamped

**Cost model**: customs broker $50–$150/entry + 0.21% MPF (max $575) + 0.125% HMF on
ocean freight + bond $500–$3,000/yr for $50K bond.

---

## 6. Other compliance landmines

- **Foreign Corrupt Practices Act** — China factory gifts/dinners to NYC procurement
  staff are *both* sides of a FCPA case. **Hard rule: no gifts to NYC employees ever.**
- **California Prop 65** — even if not selling to CA, products with CA Prop 65 chemicals
  trigger 60-day notice litigation industry; affects plastics, lighting, vinyl.
- **NY State excise / use tax** — sales to NYC agencies are tax-exempt with ST-119.1 cert;
  imports are not. Don't conflate.
- **Insurance** — agencies typically require $1M–$5M general liability, $1M auto, workers'
  comp. Premiums ~$2–8K/yr for a small goods reseller. Without this, can't contract.
- **Performance bond** — for contracts >$100K, often required (1–3% of contract value).
  Surety bonding for new MBEs is hard; NYC SBS has a Bond Readiness Program.

---

## 7. Sanctions / export controls (mostly N/A but flag)

- Most B2G imports are not Commerce Control List items.
- **Avoid**: anything that could be classified as dual-use (drones, advanced electronics,
  encryption, certain optics, certain LiDAR).
- ITAR / EAR: not an inbound concern for janitorial/PPE.

---

## 8. The "first 12 months" risk filter

For each RFP, score risk on these dimensions:

| Dim | Disqualifying if … |
|---|---|
| Federal funding | … BABA applies *and* good is iron/steel/manufactured |
| UFLPA | … cotton or aluminum primary input without verified non-Xinjiang trace |
| Cert | … cert cost > 10% of first-year cat revenue |
| Bond | … perf bond required > $100K and bonding not yet established |
| Liability | … playground, food, or medical (defer year 1) |
| Spec | … NYPD/FDNY mil-spec or NFPA cert (defer year 1) |

A clean RFP scores 0 disqualifiers. Score ≥1 disqualifier → skip in year 1.

---

**Sources**:
- [USTR Section 301 China Tariffs](https://ustr.gov/issue-areas/enforcement/section-301-investigations/section-301-china)
- [CBP UFLPA Resources](https://www.cbp.gov/trade/forced-labor/UFLPA)
- [Build America Buy America (BABA) Guidance](https://www.whitehouse.gov/omb/management/office-federal-financial-management/build-america-buy-america-baba/)
- [GSA Advantage](https://www.gsaadvantage.gov/) — federal price benchmark
- [HTS Search](https://hts.usitc.gov/) — tariff classification
