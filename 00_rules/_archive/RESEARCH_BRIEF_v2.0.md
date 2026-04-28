---
file_type: research_brief_template
version: v2.0
created: 2026-04-26
authority: extends DD_WORKFLOW_v2.md §SSOT_template; supersedes 5-dim 5x4 v3.0 anchor block
purpose: "硬数据驱动的 SSOT 升级模板. 每份 v2.0 SSOT 必填 §1-§9 九块. 缺则标 MISSING_HARD_DATA, 不 anchor_eligible. Five-source AI deep research 输出按本模板 JSON-structured."
owner: 研究员 (主) + 原话手 (verbatim+cross-AI) + 测谎员 (sample_rate=1.0 验证 source URL)
consumed_by: 打分员 (升级 5-dim → 7-dim 含财务硬指标 + 估值 multiple), 一致性稽查
hard_rules:
  - "每个数字必须带 (source_url, source_date, source_type ∈ [10-Q, 10-K, 8-K, IR_press, transcript, consensus_aggregator, analyst_note]). 缺一 = NOT_FOUND, 不 fabricate."
  - "verbatim cite > paraphrase. 数字 = 只复制不计算 (除非显式标 [CALC: formula])."
  - "Rule 3 never_manage_positions 严守: 禁 buy/sell/target_price/sizing/timing/margin 词."
  - "Cross-AI consensus matrix (Claude/ChatGPT/DeepSeek/Gemini/Grok) §9 强制. divergence ≥10% 必标 ⚠️."
  - "MISSING_HARD_DATA 任一 §1-§4 字段缺 → SSOT.frontmatter.anchor_eligible=false + 进 BACKFILL_TRACKER."
---

# Research Brief v2.0 · 硬数据驱动模板

> **使用**: 每个 v2.0 SSOT 在原 5-dim block 之上, 顶部插入 §1-§9 块. 旧 v1.x 内容保留为 §10+ historical narrative.
> **派生**: 5-dim 5x4 v3.0 → 7-dim v2.0 (新增 dim6 财务质量 / dim7 估值锚定)

---

## §1 · 当前 Snapshot (as of YYYY-MM-DD HH:MM ET)

> **来源约束**: 股价/市值 = chrome MCP fetch IR 或 finance aggregator (Yahoo/Google Finance) 同一时刻; TTM 数字 = 最近 4 季 10-Q 累加 (列出 4 个 quarter 的 source_url).

```yaml
snapshot:
  as_of: <YYYY-MM-DD HH:MM ET>
  price:
    close: <USD>
    source_url: <URL>
    source_date: <ISO>
  market_cap_b: <USD B>
  shares_outstanding_m: <M>
  ttm:
    revenue_b: <USD B>
    revenue_yoy_pct: <%>
    ebitda_b: <USD B>
    ebitda_margin_pct: <%>
    eps_diluted: <USD>
    fcf_b: <USD B>
    fcf_margin_pct: <%>
    sources:
      - {quarter: <Q4 FY25>, filing: 10-Q/10-K, url: <URL>, filing_date: <ISO>}
      - {quarter: <Q3 FY25>, filing: 10-Q, url: <URL>, filing_date: <ISO>}
      - {quarter: <Q2 FY25>, filing: 10-Q, url: <URL>, filing_date: <ISO>}
      - {quarter: <Q1 FY25>, filing: 10-Q, url: <URL>, filing_date: <ISO>}
  multiples:
    pe_ttm: <x>
    pe_fwd: <x>
    ev_sales_ttm: <x>
    ev_ebitda_ttm: <x>
    pb: <x>
    peer_mean_ev_sales: <x>
    own_5y_mean_ev_sales: <x>
    premium_or_discount_vs_peer: <%>
    premium_or_discount_vs_5y: <%>
```

---

## §2 · 营收/利润预测 (Next 12 Quarters / FY26-FY28)

> **来源约束**: consensus = ≥3 个分析师/aggregator 平均 (列名+date); bull/base/bear 三档 = 公司 guide / sell-side range / 自建 model 三角.

```yaml
forecast:
  fy26:
    consensus:
      revenue_b: <USD B>
      gm_pct: <%>
      opm_pct: <%>
      ebitda_b: <USD B>
      eps: <USD>
      fcf_b: <USD B>
      n_estimates: <int>
      sources: [<analyst_name + date + url>, ...]
    bull: {revenue_b: ..., eps: ..., assumption: "<≤30字>", probability_pct: <%>}
    base: {revenue_b: ..., eps: ..., assumption: "<≤30字>", probability_pct: <%>}
    bear: {revenue_b: ..., eps: ..., assumption: "<≤30字>", probability_pct: <%>}
  fy27: <same shape>
  fy28: <same shape>
```

---

## §3 · Catalyst → Revenue 映射

> 对每个 named catalyst, 必须 quantify 到 FY27/28 revenue impact. 命中概率分 low(<30%) / med(30-65%) / high(>65%).

```yaml
catalyst_revenue_map:
  - id: <CAT-1>
    event: "<具体事件, e.g. HBM4 customer named>"
    expected_date: <YYYY-MM-DD or window>
    revenue_impact:
      fy27_bump_usd_m: <int>
      fy27_bump_pct: <%>
      fy28_bump_usd_m: <int>
    hit_probability: low|med|high
    probability_pct: <%>
    anchor_evidence:
      verified: true|false
      url: <URL or null>
      file_line: <path:line>
      verbatim_quote: "<≤120字>"
    fallback_if_missed: "<1句>"
```

---

## §4 · 3Y 数学路径 (Mcap × CAGR × Time = Target)

> **不许 fabricate target price**; 此节是 path decomposition, 不是 recommendation.

```yaml
three_year_math:
  current_mcap_b: <USD B>
  required_cagr_for_3x_pct: <%>  # = (3^(1/3) - 1) * 100 = 44.2% if 3x
  required_cagr_for_2x_pct: <%>  # = 26.0%
  decomposition:
    revenue_cagr_pct: {bull: <%>, base: <%>, bear: <%>, prob_dist: {bull: <%>, base: <%>, bear: <%>}}
    margin_expansion_bps: {bull: <bps>, base: <bps>, bear: <bps>}
    multiple_expansion_x: {bull: <x>, base: <x>, bear: <x>}
  weighted_3y_mcap_b: <USD B>  # = sum(prob_i * mcap_i)
  notes: "<≤80字, 关键假设>"
```

---

## §5 · 同业 Valuation Comparison

```yaml
peer_valuation:
  peers: [<TICKER1>, <TICKER2>, <TICKER3>, <TICKER4>]
  table:
    - ticker: <T>
      mcap_b: <USD B>
      revenue_ttm_b: <USD B>
      ebitda_margin_pct: <%>
      pe_fwd: <x>
      ev_sales_ttm: <x>
      ev_ebitda_ttm: <x>
      source_url: <URL>
  own_position: premium|inline|discount
  delta_vs_peer_mean_pct: <%>
```

---

## §6 · SPOF / Single-Source 风险

```yaml
spof:
  single_source_numbers:
    - field: <e.g. fy27_revenue>
      source: <single source>
      backstop_pending: true|false
      backfill_eta: <ISO or null>
  catalysts_no_fallback:
    - id: <CAT-X>
      reason: "<≤40字>"
```

---

## §7 · Catalyst 时间表 (T-N alerts)

```yaml
catalyst_timeline:
  - event_date: <YYYY-MM-DD>
    event_type: earnings|filing|product_launch|regulatory|other
    name: "<≤40字>"
    t_minus_alerts: [T-7, T-3, T-1, T-0, T+1]
    binary_pct: <%>  # 二元事件命中后 single-day move 估
```

---

## §8 · Killer Disconfirmation Triggers

```yaml
killer_triggers:
  - id: <KILL-1>
    description: "<≤80字, 必含具体数字>"
    source_to_watch: <URL or filing type>
    threshold: "<e.g. GM <50% in Q1 FY26>"
    impact_if_hit: thesis_broken|thesis_dented|recheck
  - id: <KILL-2>
  - id: <KILL-3>
  # 3-5 triggers required
```

---

## §9 · Cross-AI Consensus Matrix

> 5 个 AI (Claude / ChatGPT / DeepSeek / Gemini / Grok) 各自独立填 §1-§4 后, 由 phase_2 synthesis 生成此矩阵. DeepSeek 与 Gemini 默认 quarantine-first, 需审计通过才进入 canonical consensus.

```yaml
cross_ai_consensus:
  ai_outputs:
    claude:
      §1_snapshot: {filled: true|false, missing_fields: [...]}
      §2_forecast: {filled: true|false, fy26_rev_b: <num>, fy27_rev_b: <num>, fy28_rev_b: <num>}
      §3_catalyst_map: {filled: true|false, n_catalysts: <int>}
      §4_3y_math: {filled: true|false, weighted_3y_mcap_b: <num>}
    chatgpt: <same shape>
    deepseek: <same shape, quarantine-first>
    grok: <same shape>
    gemini: <same shape, quarantine-first>
  consensus_check:
    fy27_rev_b:
      claude: <num>
      chatgpt: <num>
      deepseek: <num|null>
      grok: <num>
      gemini: <num>
      max_min_spread_pct: <%>
      verdict: agree|warn|conflict  # agree<5% / warn 5-10% / conflict>10%
    fy28_rev_b: <same>
    weighted_3y_mcap_b: <same>
  warnings:
    - field: <field>
      type: divergence|missing|fabrication_suspected
      detail: "<≤80字>"
```

---

## §10+ · Historical Narrative (旧 v1.x 内容, 不删)

(原 SSOT 业务/护城河/管理层叙事保留, 但所有数字 cross-ref §1-§4)

---

## 7-Dim Scoring (升级版, 替换原 5-dim 5x4)

```yaml
scoring_v2:
  dim1_business_quality: <0-5>
  dim2_moat_strength: <0-5>
  dim3_management_capital_alloc: <0-5>
  dim4_growth_runway: <0-5>
  dim5_catalyst_density: <0-5>
  dim6_financial_quality:  # NEW: 基于 §1 ttm + §2 forecast
    sub:
      gm_quality: <0-5>      # GM 趋势 + vs peer
      cash_conversion: <0-5> # FCF/EBITDA
      balance_sheet: <0-5>   # net cash / leverage
    weighted: <0-5>
  dim7_valuation_anchor:  # NEW: 基于 §1 multiples + §5 peer
    sub:
      multiple_vs_peer: <0-5>     # 折价高分 / 溢价低分 (除非高 dim4)
      multiple_vs_5y: <0-5>
      implied_3y_path_realism: <0-5>  # §4 weighted 3y 离当前 mcap 倍数 / 概率合理性
    weighted: <0-5>
  total: <0-35>
  anchor_eligible: true|false  # 全部 §1-§4 数据齐 + total ≥ 24
```

---

## Worker Output Format (five-source AI deep research 强制)

每个 AI sub-agent 必须返回 JSON-structured output, schema:

```json
{
  "ai_id": "claude|chatgpt|deepseek|gemini|grok",
  "ticker": "<T>",
  "as_of": "<ISO>",
  "snapshot_§1": { ... },
  "forecast_§2": { ... },
  "catalyst_revenue_map_§3": [ ... ],
  "three_year_math_§4": { ... },
  "peer_valuation_§5": { ... },
  "spof_§6": { ... },
  "catalyst_timeline_§7": [ ... ],
  "killer_triggers_§8": [ ... ],
  "raw_quotes": [
    {"§": "1.ttm.revenue_b", "verbatim": "<≤200字>", "source_url": "<URL>", "source_date": "<ISO>"}
  ],
  "not_found_fields": ["<§x.field>", ...],
  "fabrication_self_check": "no_calculation_done | calc_done_with_formula"
}
```

---

## 测谎员 Audit Protocol (sample_rate=1.0)

每个 §1-§4 数字 (~30-50 个 number per ticker), 测谎员逐个:
1. 取 source_url + verbatim_quote
2. WebFetch URL 看是否含此数字
3. 不一致 → flag `audit_fail` + 写 `_AUDITS/audit_<T>_<date>.md`
4. fail_rate >5% → SSOT.frontmatter.audit_status=`failed`, 不可发布

---

## Phase Pipeline (Wall Time 估)

| Phase | 动作 | Owner | Wall Time |
|---|---|---|---|
| 0 | spec 写完 + dispatch_plan | 总监 | done |
| 1 | 15 agent wave-gated (3 ticker × 5 AI) | main Claude | ~5-8 min |
| 2 | synthesis: 15 outputs → 3 v2.0 SSOT + cross-AI matrix | 研究员 | ~3 min |
| 3 | 测谎员 sample_rate=1.0 验证所有 source URL | 测谎员 | ~2 min |
| 4 | 邮件发 zhang.kwen@gmail.com (用户指定 kevin2023505@gmail.com) | 社交员 | ~30 sec |
| **Total** | | | **~10 min** |

---

## Constraints (HARD)

- chrome MCP freshness gate v1.2: 任何 chrome-devtools fetch 必带 timestamp 验证 ≤24h
- Gemini 普通 mode v1.3: 不许 enable Deep Research (普通 chat mode only)
- §Y v3.3 chrome MCP discipline: evaluate_script + fetch() 优先, 避免 select_page race
- chrome MCP 重 task ≤3 sub-agent 并发 → 12 agent 必分 4 wave (每 wave 3 ticker, 同 AI 并行)
  - 替代方案: Claude_primary 用 WebSearch/WebFetch (无 chrome 依赖), 其余 3 AI 各 ticker 串 (3 wave × 3 ticker)
- Rule 3: 全程禁仓位语言

---

end of spec
