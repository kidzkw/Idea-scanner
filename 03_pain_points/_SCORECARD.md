---
file_type: scorecard
name: Pain Point Scorecard
version: v1.0
created: 2026-04-28
authority: REPURPOSING_PLAN.md §四
applies_to: 03_pain_points/<slug>.md
scoring_authority: 打分员 (Claude Opus 唯一评分权威)
review_cadence: 月度全量重打分 (进化员 周扫调权重)
---

# 📐 Pain Point Scorecard · v1.0

> **目的**：判断一个 pain 是不是「真、大、可付费、可解」，决定是否升级为 idea 提案。
> **不要打**：会不会赚钱、能不能 ship、竞争如何 — 那是 `09_startup_ideas/_SCORECARD.md` 的活。

---

## 一、3 个 Kill-Gate（任一失败 → 留在 _inbox 或 _archive，不立 SSOT）

| # | Gate | 通过条件 |
|---|---|---|
| **PG1** | **多源** | ≥2 个独立平台都有该痛（Reddit + HN / G2 / Quora / 其他任一） |
| **PG2** | **多用户** | ≥3 条独立 verbatim，不同用户名（同一人多条不算） |
| **PG3** | **非情绪** | 至少 1 条具体到「workaround」「数据」「数字损失」，不是纯抱怨 |

## 二、10 维加权评分（每维 1-10）

> **每维 4 行证据**（Source URL / Date / Numeric / Reasoning）。不足 → 0 分 + ⚠️。

| # | 维度 | 权 | 1 分 | 5 分 | 10 分 |
|---|---|---:|---|---|---|
| **P1** | **痛点严重度** Severity | ×3 | 偶尔小不便 | 每周 1-2 次明显麻烦 | 每天浪费 ≥1h / 直接金钱损失 |
| **P2** | **付费意愿** WTP | ×3 | 全是"免费就好" | 个别 "I'd pay if it worked" | 同类产品已有人付 ≥$20/mo 且评论抱怨"贵但只能用它" |
| **P3** | **受众规模** Audience | ×2 | <5K 全球 | 5K-50K | ≥500K 可定向触达 |
| **P4** | **复发频率** Recurrence | ×2 | 一生一次 / 罕见 | 季度级 | 日/周级反复触发 |
| **P5** | **平台扩散** Cross-Platform Spread | ×2 | 仅 1 个 sub | 2-3 平台都有 | ≥5 平台 + 跨语言/跨地理 |
| **P6** | **时效性** Time Pressure | ×1.5 | 永恒 / 慢变 | 中期机会 | 政策/季节/技术变迁正在打开窗口 |
| **P7** | **现有方案差距** Solution Gap | ×2 | 已有完美免费方案 | 有方案但贵/难用 | 用户全靠手工 + Excel + 拼凑工具 |
| **P8** | **表达密度** Volume of Expression | ×1.5 | 月新 <2 thread | 月新 5-20 | 月新 ≥50 thread + 评论 ≥1K |
| **P9** | **量化可得性** Measurability | ×1 | 全主观 | 部分可量化 | 用户已自己粘了截图/数据 |
| **P10** | **0 成本路径相容** Soft Solvable | ×2 | 必须硬件/物流/牌照 | 部分软件可解 | 纯软件 / API / 信息差可解 |

**总权重 = 20**，每维 1-10 → 满分 200，归一化 0-100：
```
score = (Σ 分×权 / 20) × 10
```

---

## 三、阈值

| 区间 | 处理 |
|---|---|
| **≥ 75** | 🔥 HOT — 立即触发 idea 提案；信号算法员标 `signal: hot` |
| 60-74 | 🟡 EMERGING — 留 INDEX，每周观察新 verbatim 增量 |
| 45-59 | 🟠 WATCH — 季度重扫 |
| < 45 | 🔴 PARK — mv `_archive/` |

---

## 四、与 idea scorecard 的关系（避免重复抓证据）

idea SSOT 在 D1 (痛点强度) / D2 (付费意愿) / D3 (受众) 三维直接引用 pain SSOT 当时的分数 + snapshot 日期，**不要重抓证据**。

```yaml
# IDEA frontmatter
linked_pains:
  - pain_slug: founder-cant-find-paying-saas-niche
    severity_snapshot: 9   # = pain SSOT P1 当时的分
    wtp_snapshot: 8        # = pain SSOT P2 当时的分
    audience_snapshot: 7   # = pain SSOT P3 当时的分
    snapshot_date: 2026-04-28
```

---

## 五、版本

- v1.0（本）
- 进化员每周日扫 _processed → idea 转化率，6 月数据后调权重，写"v1.x (Evolver-proposed)"块到本文件底部，不覆盖。
