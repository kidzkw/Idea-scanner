---
file_type: source_authority_reference
version: v2.0
created: 2026-04-28
supersedes: v1.0 (stock DD weights — see git history for legacy SEC/Bloomberg/Grok ladder)
authority: 对比员 §4 仲裁公式
purpose: 同一 pain 多源分歧时, 打分员 / 对比员 按此权重取舍
---

# 📐 Source Weight Ladder · v2.0 (Pain-Mining edition)

> **使用**: Raw frontmatter `source_weight: N` (抓取员 自动填). 冲突时 ≥10 分差距, 高者胜.
> **打分员 终裁**: 无法判定时用 WebFetch 拉权重 ≥80 source primary check.

---

## 一、权重表

| 权重 | 源类型 | 示例 | 可信场景 |
|---|---|---|---|
| **100** | 用户自己访谈 (1-on-1, 录音/笔记) | `11_customer_interviews/<slug>/*.md` 用户原话 | 直接 WTP / pain 严重度 — 最强证据 |
| 95 | 现金 conversion 数据 | Stripe / Gumroad / Shopify 公开订单数 / Substack 订阅数 | 真金白银付费 — revealed preference |
| 92 | 公开财务披露 | YC Demo Day 营收 / IH "$X MRR" milestone (verified) | 同行业商业可行性参考 |
| 88 | 行业垂直社区高赞 thread | r/SaaS / r/Entrepreneur / IH 高 karma 帖 (≥500 upvotes) | 大量同行验证 pain |
| **85** | **跨源 verbatim verified_quad** | 4 个独立平台都说过同一 pain | 跨源验证 = 真 pain |
| 82 | Stack Exchange high-score Q (没 accepted answer) | SO / superuser / serverfault score ≥20 + 0 accepted | 工程界确认未解决 |
| 80 | G2 / Capterra 1-3 星 review (含 quote) | 同类产品差评的 quote 段落 | revealed gap in existing solutions |
| 78 | GitHub Issue 高 thumbs-up (≥50) + open ≥6 月 | 知名 OSS repo 的 long-standing 功能请求 | 工程师社区共识 |
| 75 | HN 高分 thread (≥100 points) | "Tell HN" / "Ask HN" with high engagement | tech 创业者圈共识 |
| 72 | Reddit verified ≥10K karma + ≥100 comments | 知名社区 OP + 高互动评论 | 社区共识 |
| 70 | Indie Hackers Milestones / 失败复盘 | "we tried X and failed because Y" | 已花真金白银验证 |
| 68 | Product Hunt 评论低分项 | "missing X" / "would love to see Y" | early adopter feedback gap |
| 65 | TrustPilot / Glassdoor 中评 (4 星但含具体抱怨) | "great except for [Y]" | nuanced 用户 voice |
| 62 | Quora 高赞答案 / 评论 | site:quora.com "How do you..." | 一般用户 pain |
| 60 | Substack / DEV.to / HashNode 评论 | 长尾思考者 feedback | analytical |
| 58 | Beta List / Starter Story / Failory 复盘 | 失败创业故事 (含原因) | retrospective ground truth |
| 55 | Bluesky / Threads / Mastodon 高互动 | 新平台早期 voice | low-noise |
| **50** | **HN/SE/GH 普通帖** (低分但合规) | <100 points HN / <20 score SE | sample-of-many |
| 48 | TaskRabbit / Thumbtack / Yelp 服务需求 | "looking for someone to do X" | revealed local-service WTP |
| 45 | Reddit 普通帖 (无 verified, <60K karma) | 单帖单作者 | sample-of-one — 需 ≥3 同源支持 |
| 42 | App Store / Play Store 1-2 星 review | 单 review 段落 | 单数据点 |
| 40 | Quora 一般答案 / 单评 | site:quora.com 普通 thread | 单数据点 |
| 38 | X / Twitter unverified < 1K follower | 普通推文抱怨 | 弱 sample |
| 35 | Mumsnet / Nextdoor / 长尾 forum | 极 niche community | 有信号但样本小 |
| 30 | PissedConsumer / ComplaintsBoard | 投诉聚合站 | 投诉多但偏极端 |
| 25 | LLM 推理 / 工具产生的 pain summary | ChatGPT / Grok 总结 (无原始链) | 非证据, 仅 hint |
| 20 | YouTube 评论 / Twitch chat | 长尾 social | 非常弱 |
| **0** | **AI hallucinated quote / no permalink** | 无法回链的"原话" | **永远不接受** — 拒绝入 inbox |

---

## 二、Cross-source verification (verbatim 评级)

| Label | 条件 | data_quality 字段 |
|---|---|---|
| `verified_quad` | ≥4 独立平台 都有同一 pain | 最强 |
| `verified_triple` | ≥3 平台 | |
| `verified_dual` | ≥2 平台 (PG1 通过门槛) | |
| `single_platform_pending` | 仅 1 平台, 待 原话手 跨源补 | 不进 INDEX HOT/EMERGING |
| `contradicted` | 多源但显著不一致 | 触发 对比员 仲裁 |

---

## 三、仲裁规则 (对比员 §4)

1. **绝对差距 ≥10** 高权重源胜 (例: G2 quote 80 vs Reddit 普通 45 → G2 胜)
2. **平局 (差 <10)** → 数量胜 (3 条 SE 高赞 > 1 条 HN 单帖)
3. **仍平** → 标 `⚠️ unresolved_contradiction`, 暂缓写入 SSOT, 通知用户决策
4. **永不仲裁权重 0** (AI 幻觉) — 直接拒, 不当证据

---

## 四、动态调整 (进化员 周扫)

每周日 进化员 扫 _processed/ 与 idea hit-rate, 提议权重调整:
- 某源连续 4 周精度 <30% (产出的 pain SSOT 被 KILL 率高) → 降 5 分
- 某源连续 4 周高精度 (≥70% pain 升 emerging+) → 升 5 分
- 调整写"v2.x (Evolver-proposed)" 块到本文件底部, **永不覆盖** 当前 v2.0

---

## 五、与 idea D2 (付费意愿) 的关系

idea SSOT D2 评分时, 按权重选证据:
- 权 ≥80 (用户自访谈 / Stripe 数据 / G2 review) = D2 给 8-10
- 权 70-79 (HN 高分 / SE / IH milestone) = D2 给 5-7
- 权 <70 (单 Reddit / 单 Quora) = D2 给 1-4 (须配多源)

不允许 D2 ≥7 仅靠权重 <70 的单源证据。
