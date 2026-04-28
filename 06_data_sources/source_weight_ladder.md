---
file_type: source_authority_reference
version: v1.0
created: 2026-04-22
authority: DD_WORKFLOW_v2.md §4.3
purpose: 冲突仲裁权重表 — 同一事实多源分歧时, Claude 按此权重取舍
---

# 📐 Source Weight Ladder · v1.0

> **使用**: Raw frontmatter `source_weight: N`. 冲突时 ≥10 分差距, 高者胜.
> **Claude 终裁**: 无法判定时用 WebFetch 拉 Tier 95+ primary source.

---

## 权重表

| 权重 | 源类型 | 示例 | 可信场景 |
|---|---|---|---|
| **100** | SEC 官方文件 | 10-K / 10-Q / 8-K / S-1 / Form 4 / 13F / 13D | 财务数字 / insider 交易 / 股权结构 |
| 95 | 公司 IR 新闻稿 | investors.company.com press release | M&A 公告 / guide / 合同 |
| 92 | 交易所 official | NASDAQ/NYSE announcements | 上市 / 停牌 / 合规 |
| 90 | 财报电话会议 transcript | Seeking Alpha Transcripts / Motley Fool / AlphaSense | 管理层 verbatim, **VERBATIM 追踪主源** |
| 88 | 监管 filings 非 SEC | FCC / FDA / NRC / FAA / 欧 EMA | 审批 / 许可 / 事故 |
| 85 | Tier-1 财经媒体 | Bloomberg / Reuters / WSJ / FT | 独家 / 深度调查 |
| 82 | 专业行业媒体 | LightCounting / TrendForce / Omdia / SemiAccurate | 行业细节 / 产能 / 市占 |
| 80 | 审计报告 / 研究机构 | PwC / McKinsey / Gartner | 行业趋势 |
| 75 | Tier-2 财经媒体 | CNBC / Barron's / MarketWatch / Forbes | 新闻 |
| 72 | Bulge-bracket sell-side PT | GS / MS / JPM / RBC / Stifel 正式研报 | 目标价 / rating |
| 70 | 专业研究 newsletter | Grant's / Stansberry / Bespoke / IBD | analytical |
| 68 | 独立数据聚合 | S&P Capital IQ / FactSet / Refinitiv | 财务聚合 |
| 65 | 财务数据 web | Yahoo Finance / Public.com / Koyfin | 实时报价 / 基本比率 |
| 62 | Data 可视化平台 | Unusual Whales (options flow) / Bookmap | 资金流 |
| **60** | **ChatGPT 分析** | ChatGPT 基于公开数据推导的框架 / 估值 / 决策矩阵 | 结构化思考 |
| 55 | 第三方聚合媒体 | Seeking Alpha articles / Motley Fool op-ed / StockTitan | anecdotal analysis |
| 53 | Finviz / MarketBeat / Fintel | short 数据 / insider | 聚合 |
| **50** | **Grok 实时** | Grok Expert mode web/X 抓取 | 30-90d momentum / X 热度 |
| 45 | 独立 blog / Substack | 有 track record 的个人分析师 | opinion |
| 40 | 社交媒体 verified | X @CEO / @CFO / verified IR | 高管直接发言 (需配 VERBATIM) |
| 35 | 社交媒体 unverified | X 普通账号 / Reddit r/investing | 社群 sentiment |
| 30 | 分析师推文 | Discord / 小群 | anecdotal |
| 20 | 匿名论坛 | 4chan/biz / anonymous boards | speculation, 不采 |

---

## 冲突仲裁规则

### 规则 1: 高权重赢 (差 ≥10)
```
ChatGPT (60) 说 PL MC = $11.9B
Grok (50) 说 PL MC = $2B
差 10, Yahoo (65) 权重最高 → Yahoo 数字赢
```

### 规则 2: 同权重, 时间新赢
```
Bloomberg 2026-04-15 文章 (85) 说 USAR 收购价 $2.5B
Reuters 2026-04-20 文章 (85) 说 USAR 收购价 $2.8B
→ 采用 Reuters 数字 (日期更新)
```

### 规则 3: 同时同权重, Claude 拉 primary
```
两个 Tier-2 news 同日分歧 → Claude 用 WebFetch
拉 IR 新闻稿 (95) 或 SEC filing (100) 仲裁
```

### 规则 4: 全无法仲裁
```
SSOT 标 ⚠️ #contradiction
Thesis Log 记录 "[Ticker] [指标] 数据冲突 [Src1 vs Src2], 待 [event] 官方披露"
不作为估值 anchor
```

---

## 特殊源处理

### ChatGPT 权重降级情形
| 情形 | 降到 |
|---|---|
| ChatGPT 未带 URL 引用 | 40 |
| ChatGPT 数字明显过时 (>6 个月) | 35 |
| ChatGPT 自相矛盾 / 内部数字不一致 | 30 |
| ChatGPT 与已知 primary source 冲突 | 25 |

### Grok 权重降级情形
| 情形 | 降到 |
|---|---|
| Grok 输出含 "..." truncation | 35 |
| Grok 未标 source 数或 <100 sources | 35 |
| Grok 数据与 SEC filing 冲突 | 20 |
| Grok hallucination 历史记录 (like 2026-04-21 WOLF 利用率错案) | 30 |

### 升级情形
| 情形 | 升到 |
|---|---|
| ChatGPT 输出含 SEC URL 引用 | 70 |
| Grok 输出含 earnings transcript URL 引用 | 65 |
| Yahoo Finance Q1 2026 更新后 24h 内 | 72 |

---

## Claude 自身输出权重

Claude WebSearch 综合输出的 source_weight = **取其所引用源的最高权重** (不是 Claude 自己打).
例: Claude 引用 Bloomberg + Mining.com + 公司 IR → source_weight = 95 (IR 最高).

---

## 修订日志

- v1.0 · 2026-04-22 · 初始权重表
