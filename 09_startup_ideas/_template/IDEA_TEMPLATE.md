<!--
═══════════════════════════════════════════════════════════════════
  STARTUP IDEA SSOT 模板 · v1.0 · 2026-04-28
  使用方法:
  1. 复制本文件 → ../<NNN>_<slug>.md
     例: 001_reddit-pain-digest.md
  2. 填写 frontmatter + 每一节
  3. 每个评分维度必须 4 行证据 (Source URL / Date / Numeric / Reasoning)
  4. 通过 Kill-Gate 后跑完 10 维打分 → 按等级 mv 到对应子目录
  5. 任何字段不确定 → 标 ⚠️ TBD, 不要编造
═══════════════════════════════════════════════════════════════════
-->

---
idea_id: NNN
slug: ""                       # kebab-case, 与文件名一致
title: ""                      # 一句话概括, ≤80 字符
created: YYYY-MM-DD
last_scored: YYYY-MM-DD
status: draft                  # draft / probing / building / killed / launched
linked_pains:                  # 必须 ≥1; 否则 G1 fail
  - pain_id: ""
    pain_slug: ""
    severity_snapshot: 0       # 从 03_pain_points/<slug>.md 复制当时分
    snapshot_date: ""
target_customer:
  segment: ""                  # 例: "早期 SaaS 创始人 0-5 万 ARR"
  geo: ""                      # 例: US / Global / EN-speaking
  size_estimate: ""            # 例: "~80K Reddit + IH 活跃账号"
solution_one_liner: ""         # ≤120 字符, 名词+动词, 不写营销话术
distribution_channel: ""       # 你打算怎么找到首 100 用户
business_model: ""             # SaaS subscription / one-time / usage / marketplace / lead-gen / ads
price_hypothesis: ""           # 例: "$19/mo / $5 单次"
mvp_scope: ""                  # MVP 必须包含什么 happy path; 不写不必要功能
score: 0.0                     # 打完分后填; 范围 0-110
grade: ""                      # GO / PROBE / WATCH / KILL
kill_reason: ""                # 仅 status=killed 时填
authority: 09_startup_ideas/_SCORECARD.md
---

# Idea: {{title}}

## 一、核心叙事 (≤200 字)

> 用「目标用户 + 当前痛 + 解决方案 + 关键差异化」四要素写成一段话。
> 不要营销腔。不要"颠覆"、"赋能"、"革命"这种词。

## 二、关联痛点 (Linked Pains)

| Pain ID | Slug | Severity | Audience | WTP 信号数 | 引用日期 |
|---|---|---:|---:|---:|---|
| pain-XXX | ... | 8 | 80K | 12 | 2026-04-28 |

> 详细 verbatim 不在本文件复述。直接引用 `03_pain_points/<slug>.md` 即可。

## 三、Kill-Gate 评估

| Gate | 通过? | 证据 / 理由 |
|---|:-:|---|
| G1 痛点真实 (≥3 独立 verbatim) | ⏳ | 引用 pain SSOT verbatim 区块 |
| G2 法律合规 | ⏳ | 例: 不涉及医疗/金融/数据出境 |
| G3 创始人匹配 (技术 / 渠道 / 自身 pain 至少 1) | ⏳ | 例: 我每天遇到这个 pain + 能 ship MVP |

> 任一 ❌ → mv `_archive_killed/`，写 kill_reason，停。

---

## 四、11 维加权评分

> **每维必须 4 行证据**：Source URL / Date / Numeric Data / Reasoning。
> 不足 4 行 → 该维 0 分 + ⚠️ insufficient_evidence。

### D1 · 痛点强度 (×3)
**分数**: ⏳/10

| Source URL | Date | Numeric Data | Reasoning |
|---|---|---|---|
| https://reddit.com/r/.../comments/... | 2026-04-15 | 487 upvote / 92 comment | 高互动证明痛点共鸣 |
| ... | ... | ... | ... |
| ... | ... | ... | ... |
| ... | ... | ... | ... |

### D2 · 付费意愿 (×3)
**分数**: ⏳/10

| Source URL | Date | Numeric Data | Reasoning |
|---|---|---|---|
| ... | ... | ... | ... |

### D3 · 目标客户基数 (×2)
**分数**: ⏳/10

| Source URL | Date | Numeric Data | Reasoning |
|---|---|---|---|
| ... | ... | ... | ... |

### D4 · 使用频次 (×2)
**分数**: ⏳/10

| Source URL | Date | Numeric Data | Reasoning |
|---|---|---|---|
| ... | ... | ... | ... |

### D5 · 启动成本 (×2) ⭐
**分数**: ⏳/10

| Source URL | Date | Numeric Data | Reasoning |
|---|---|---|---|
| (Vercel free tier docs) | 2026-04-28 | $0/mo until 100GB bandwidth | hosting 完全 0 成本 |
| ... | ... | ... | ... |

### D6 · 启动速度 (×2) ⭐
**分数**: ⏳/10

| Source URL | Date | Numeric Data | Reasoning |
|---|---|---|---|
| ... | ... | ... | ... |

### D7 · 利润空间 (×2)
**分数**: ⏳/10

| Source URL | Date | Numeric Data | Reasoning |
|---|---|---|---|
| ... | ... | ... | ... |

### D8 · 竞争密度 (×2) — 低=高分
**分数**: ⏳/10

| Source URL | Date | Numeric Data | Reasoning |
|---|---|---|---|
| (G2 listing) | ... | 5 竞品, top 3 评分 4.2 / 4.1 / 3.8 | 中等竞争, 头部体验普通 |
| ... | ... | ... | ... |

### D9 · AI 杠杆 (×2)
**分数**: ⏳/10

| Source URL | Date | Numeric Data | Reasoning |
|---|---|---|---|
| ... | ... | ... | ... |

### D10 · 渠道获客 (×2)
**分数**: ⏳/10

| Source URL | Date | Numeric Data | Reasoning |
|---|---|---|---|
| ... | ... | ... | ... |

### D11 · 现金回收速度 (×2) ⭐
> 用户硬约束：首笔收入 ≤ 30 天 = 9-10 分；marketplace / 平台延迟结算 / 仅广告变现 ≤ 4 分
**分数**: ⏳/10

| Source URL | Date | Numeric Data | Reasoning |
|---|---|---|---|
| (Stripe 文档 / Gumroad payout 周期) | ... | T+2 days payout | 即开即收 |
| ... | ... | ... | ... |

---

## 五、加分 / 减分

| 触发 | ± | 备注 |
|---|---:|---|
| 痛点 SSOT ≥10 独立 verbatim | +2 | linked_pain[0] 当前 12 条 |
| 创始人即目标用户 | +2 | 我每天遇到 |
| 已有 ≥3 人主动说"立刻付钱" | +3 | 引用 thread URLs |
| 依赖单一平台 | -3 | 80% 分发靠 Reddit |
| ... | ... | ... |
| **修正小计** | **±N** |  |

---

## 六、得分计算

```
加权小计 = D1×3 + D2×3 + D3×2 + D4×2 + D5×2 + D6×2 + D7×2 + D8×2 + D9×2 + D10×2 + D11×2 = ___ / 240
归一化   = (加权小计 / 24) × 10        = ___ / 100
最终分   = 归一化 + 加减分修正        = ___
```

**最终分**: `___`
**等级**: `🟢 GO / 🟡 PROBE / 🟠 WATCH / 🔴 KILL`
**最低维**: `D__ (__分)` — ⚠️ 若 ≤2，整体降一档

---

## 七、MVP 计划 (仅 GO / PROBE 填)

### 7.1 Happy Path (≤3 步)
1. 用户 ...
2. 系统 ...
3. 产出 ...

### 7.2 技术栈 (优先 0 成本)
- 前端: ... (Vercel free)
- 后端: ... (Cloudflare Workers / Supabase free)
- AI: ... (用哪个模型, 单次成本估算)
- DB: ... (Supabase free tier 500MB)

### 7.3 验证里程碑

| 时间 | 动作 | 成功标准 |
|---|---|---|
| 第 1 周 | LP 上线 + Reddit 软发布 | 50 邮箱订阅 |
| 第 2 周 | MVP demo 给 10 个 Redditor | ≥3 人说"我立刻付费" |
| 第 4 周 | Stripe 收第一笔 | ≥1 付费 |
| 第 8 周 | 月活 50 / MRR $200 | 验证留存 |

### 7.4 Kill 触发条件 (提前止损)
- 4 周没有 1 个付费 → 转 `_archive_killed/`
- 关键假设证伪 → 同上

---

## 八、复盘日志

| 日期 | 触发 | 变更 | 谁 |
|---|---|---|---|
| 2026-04-28 | 初建 | draft v0.1 | 研究员 |

---

## 九、相关文件

- 痛点 SSOT: `03_pain_points/<linked_pain_slug>.md`
- 竞品扫描: `10_competitor_scan/<slug>.md`
- 客户访谈: `11_customer_interviews/<slug>/*.md`
- 评分版本: `09_startup_ideas/_SCORECARD.md` v1.0
