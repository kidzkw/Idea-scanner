---
file_type: scorecard
name: Startup Idea Scorecard · 0成本启动 + 快速现金周期版
version: v1.1
created: 2026-04-28
last_updated: 2026-04-28
changelog:
  - v1.1 (2026-04-28): 加 D11 现金回收速度 (×2), 总权重 22 → 24, 满分仍归一化 100
  - v1.0 (2026-04-28): 初版 13 维 (3 gate + 10 加权)
authority: REPURPOSING_PLAN.md §四
applies_to: 09_startup_ideas/*.md
scoring_authority: 打分员 (Claude Opus 唯一评分权威)
review_cadence: 季度全量重打分 (进化员 周扫调权重)
---

# 🎯 Startup Idea Scorecard · v1.1

> **核心原则**：idea 必须**回扣到 ≥1 个 03_pain_points/ SSOT**。脱离真实痛点的"灵感"直接进 `_archive_killed/`。
>
> **打分硬规则**：每一维**必须 4 行证据**（与现有打分员标准一致）：
> - `Source URL` — Reddit 永久链 / G2 review / 公开数据
> - `Date` — 证据日期
> - `Numeric Data` — 数字（评论数 / 月搜索量 / 价格 / 用户数等）
> - `Reasoning` — 一句话解释为何这条证据支持这个分数
>
> 没有 4 行证据 → 该维记 0 分 + 标 `⚠️ insufficient_evidence`。

---

## 一、3 个 Kill-Gate（任一失败 → 直接 KILL，不进打分）

| # | Gate | 通过条件 | 失败处理 |
|---|---|---|---|
| **G1** | **痛点真实** | 至少 1 个 `03_pain_points/<slug>.md` SSOT，包含 ≥3 条独立 verbatim 原话（不同用户） | mv `_archive_killed/`，注 `kill_reason: synthetic_pain` |
| **G2** | **法律合规** | 不涉及监管牌照 / 用户数据出境 / 版权灰色 / 受管制行业（医疗/金融/证券/赌博/酒精/烟草），或有可承担的合规路径 | mv `_archive_killed/`，注 `kill_reason: regulatory_block` |
| **G3** | **创始人匹配** | 你具备：(a) 技术能 ship MVP，或 (b) 渠道能找到首 100 用户，或 (c) 强烈个人 pain | mv `_archive_killed/`，注 `kill_reason: founder_misfit` |

通过 3 个 gate 后，进入 10 维打分。

---

## 二、11 维加权评分（每维 1-10 分）

| # | 维度 | 权重 | 1 分 | 5 分 | 10 分 |
|---|---|---|---|---|---|
| **D1** | **痛点强度** Pain Severity | **×3** | nice-to-have，用户随口抱怨 | 用户主动找 workaround | 每天浪费 ≥1h，已尝试付费方案但都不好 |
| **D2** | **付费意愿** Willingness to Pay | **×3** | 全是"免费就用"信号 | 个别 "I'd pay if..." | 同类产品已有人付 ≥$20/mo 且评论抱怨"贵但只能用" |
| **D3** | **目标客户基数** Audience Size | ×2 | <5K 全球潜在客户 | 5K-50K | ≥500K 可触达，且子群体清晰可定向 |
| **D4** | **使用频次** Stickiness | ×2 | 一次性 / 偶发 | 月级 | 日级使用，已嵌入工作流 |
| **D5** | **启动成本** Cost-to-Start ⭐ | ×2 | >$5K 才能 launch | $500-$5K | **$0** — 用免费 tier (Vercel/Supabase/Cloudflare) + 0 库存 |
| **D6** | **启动速度** Time-to-MVP ⭐ | ×2 | >3 月才能 ship | 4-12 周 | ≤2 周可 ship demo (含 LP + 核心 happy path) |
| **D7** | **利润空间** Profit Margin | ×2 | <30% gross margin / 物流重 | 30-70% | ≥80% gross margin (纯软件 / API / 信息差) |
| **D8** | **竞争密度** Competition (低=高分) | ×2 | 红海，YC 已 funded ≥3 家 | 有 2-5 个竞品但都体验糟 | 真空 / 仅 1 个老旧竞品评分 ≤3.5 |
| **D9** | **AI 杠杆** AI Leverage | ×2 | AI 帮不上 / 反而增加幻觉风险 | AI 加速开发 30-50% | AI 让产品本身**只有现在才可能存在**（2 年前做不出来） |
| **D10** | **渠道获客** Distribution | ×2 | 必须冷启动广告 / SEO 红海 | 已知社群入口 + 内容种子 | 有现成"水库"（你已运营的社群 / 邮件列表 / 痛点 SSOT 反向通知用户） |
| **D11** | **现金回收速度** Cash Velocity ⭐ | ×2 | 平台延迟结算（App Store 30-60d）/ 双边 marketplace 月费晚收 / 仅广告分成 | 月费 SaaS, 第 1 月即收 | **首笔收入 ≤ 30 天**：一次性预付 / 上线即 Stripe / 模板/工具/服务一手交钱一手交货 |

**总权重 = 24**，每维 1-10 分 → 满分 240，归一化到 **0-100**：
```
score = round( Σ(分 × 权重) / 24 × 10, 1 )
```

> **D11 设计意图**：用户硬约束「资金周期快」。低分典型：marketplace（要先做双边 + 平台抽佣）、广告变现（流量大才赚）、App Store（30-60 天结算）。高分典型：一次性预付的模板/课程/服务、即开即收的 SaaS、Gumroad/Stripe 直收。

---

## 三、阈值 + 分级

| 区间 | 等级 | 处理 |
|---|---|---|
| **≥ 80** | 🟢 GO | 进入 `_active_build/`，4 周冲刺 MVP |
| 65-79 | 🟡 PROBE | 进入 `_validation_queue/`，2 周客户访谈 + LP 测付费意愿 |
| 50-64 | 🟠 WATCH | 留 INDEX，60 天再扫一次（数据/竞争可能变） |
| < 50 | 🔴 PARK | mv `_archive_killed/`，注 `kill_reason: low_score` |

⚠️ **任意单维 ≤ 2** 即使总分 ≥ 80 也降一档（致命短板）。

---

## 四、加分项（max +10，可让总分超 100）

| 触发 | 加分 |
|---|---|
| 痛点 SSOT 已积累 ≥10 条独立 verbatim | +2 |
| 已有 ≥3 人在 Reddit 主动表达"如果有这个我立刻付钱" | +3 |
| 你（创始人）就是目标用户，每天用 | +2 |
| MVP 可在 7 天内 ship | +2 |
| 已有 ≥1 竞品被 YC/a16z 投资但执行差 → 验证市场 + 你能做更好 | +1 |

---

## 五、减分项（max -15）

| 触发 | 减分 |
|---|---|
| 依赖单一平台（Reddit/X/Apple App Store）流量 | -3 |
| 涉及用户隐私 / 敏感数据 | -3 |
| 需要双边市场（cold start hard） | -3 |
| 当前 LLM 价格 ≥$0.5/请求 → 单位经济不成立 | -3 |
| 2 年前同样 idea 被多人做过且全部死掉 | -3 |

---

## 六、打分模板（IDEA_TEMPLATE.md 内嵌）

```markdown
## 13 维评分 · v1.0

### Kill-Gates
- [x] G1 痛点真实  → linked_pains: [pain-001, pain-007]
- [x] G2 法律合规  → 无监管牌照
- [x] G3 创始人匹配 → 我每天遇到这个 pain

### 11 维打分

| 维度 | 分 | 权 | 加权 | 证据 4 行 |
|---|---:|---:|---:|---|
| D1 痛点强度 | 9 | 3 | 27 | (4 行 verbatim + 数据) |
| D2 付费意愿 | 8 | 3 | 24 | ... |
| D3 客户基数 | 7 | 2 | 14 | ... |
| D4 使用频次 | 9 | 2 | 18 | ... |
| D5 启动成本 | 10 | 2 | 20 | ... |
| D6 启动速度 | 9 | 2 | 18 | ... |
| D7 利润空间 | 9 | 2 | 18 | ... |
| D8 竞争密度 | 6 | 2 | 12 | ... |
| D9 AI 杠杆 | 10 | 2 | 20 | ... |
| D10 渠道获客 | 5 | 2 | 10 | ... |
| D11 现金速度 | 9 | 2 | 18 | ... |
| **小计** |  | **24** | **199** |  |

### 加分 / 减分
- 痛点 ≥10 verbatim:  +2
- 创始人是目标用户:    +2
- 依赖单一平台:        -0
- **修正**:            +4

### 最终分
`(199 / 24) × 10 + 4 = 86.9`  → 🟢 **GO**
```

---

## 七、版本 + 进化

- **v1.0 (本)** — 13 维 (3 gate + 10 加权)
- 进化员（Evolver）每周日扫 `09_startup_ideas/_active_build/` + `_archive_killed/` 实际命中率
  - 6mo 历史 ≥10 条 idea 后启动权重调优
  - 每次调权写"v1.x (Evolver-proposed)"块到本文件底部，**永不覆盖当前 v1.0**
  - 仅用户 approve 后切换主版本

---

## 八、与 03_pain_points/ scorecard 的关系

| 维度 | 痛点 SSOT 打分 | idea SSOT 打分 |
|---|---|---|
| 重心 | 「这 pain 真不真、规模多大」 | 「能不能从这 pain 做出生意」 |
| 角色 | 蓄水池（多 idea 可指向同一 pain） | 出水口（每 idea 必绑 ≥1 pain） |
| 字段重叠 | Volume / Severity / WTP / Audience | 共享，idea 直接引用 pain 分数 |
| 字段独有 | Search Volume / Recurrence / Vocal Minority Index | Cost / Speed / Margin / Competition / AI Leverage / Distribution |

**操作**：写 idea 时不要重抓 pain 维度的证据，**直接引用** `linked_pains[].score_snapshot`。
