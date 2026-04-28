<!--
═══════════════════════════════════════════════════════════════════
  PAIN POINT SSOT 模板 · v1.0 · 2026-04-28
  使用方法:
  1. 复制本文件 → ../<pain-slug>.md (kebab-case)
     例: founder-cant-find-paying-saas-niche.md
  2. 必须先通过 3 个 Kill-Gate (PG1/PG2/PG3) 才能立 SSOT
  3. 每维 4 行证据强制 (Source URL / Date / Numeric / Reasoning)
  4. verbatim 原话另放 VERBATIM/<pain-slug>/ 子目录, 一条一文件
  5. 任何字段不确定 → ⚠️ TBD, 不要编造
═══════════════════════════════════════════════════════════════════
-->

---
pain_slug: ""                  # kebab-case, 与文件名一致
title: ""                      # 一句话, ≤80 字符 — 用户视角，不是产品视角
created: YYYY-MM-DD
last_scored: YYYY-MM-DD
status: emerging               # emerging / hot / watch / park / merged
score: 0.0                     # 0-100
grade: ""                      # HOT / EMERGING / WATCH / PARK
tags:                          # 见 _TAXONOMY.md
  - audience:
  - domain:
  - signal:
audience_estimate:
  global_sam: ""               # 例: "~80K Reddit 活跃 + IH"
  geo_focus: ""                # 例: US-EN / Global / NYC
verbatim_count: 0
unique_users: 0
platform_spread: 0             # 多少独立平台
linked_ideas: []               # 09_startup_ideas/<idea>.md 反向 link
authority: 03_pain_points/_SCORECARD.md
---

# Pain: {{title}}

## 一、核心叙事 (≤200 字)

> 站在**用户**视角写：他/她遇到了什么具体场景、当前怎么 workaround、为什么烦。
> 不要写"这是一个 XXX 的机会"——那是 idea 文档的活。

## 二、Kill-Gate

| Gate | ✅/❌ | 证据 |
|---|:-:|---|
| PG1 ≥2 独立平台 | ⏳ | Reddit (r/X) + HN (Ask HN #Y) |
| PG2 ≥3 独立用户 | ⏳ | u/aaa, u/bbb, u/ccc |
| PG3 ≥1 具体 workaround/数字 | ⏳ | 引用 verbatim ID |

3 ❌ → 不立 SSOT。

---

## 三、10 维评分

> 每维 4 行证据。不足 → 该维 0 + ⚠️。

### P1 · 严重度 (×3) — 分数: ⏳/10
| Source URL | Date | Numeric | Reasoning |
|---|---|---|---|
| | | | |
| | | | |
| | | | |
| | | | |

### P2 · 付费意愿 (×3) — 分数: ⏳/10
| Source URL | Date | Numeric | Reasoning |
|---|---|---|---|
| | | | |

### P3 · 受众规模 (×2) — 分数: ⏳/10
| Source URL | Date | Numeric | Reasoning |
|---|---|---|---|
| | | | |

### P4 · 复发频率 (×2) — 分数: ⏳/10
| Source URL | Date | Numeric | Reasoning |
|---|---|---|---|
| | | | |

### P5 · 平台扩散 (×2) — 分数: ⏳/10
| Source URL | Date | Numeric | Reasoning |
|---|---|---|---|
| | | | |

### P6 · 时效性 (×1.5) — 分数: ⏳/10
| Source URL | Date | Numeric | Reasoning |
|---|---|---|---|
| | | | |

### P7 · 现有方案差距 (×2) — 分数: ⏳/10
| Source URL | Date | Numeric | Reasoning |
|---|---|---|---|
| | | | |

### P8 · 表达密度 (×1.5) — 分数: ⏳/10
| Source URL | Date | Numeric | Reasoning |
|---|---|---|---|
| | | | |

### P9 · 量化可得性 (×1) — 分数: ⏳/10
| Source URL | Date | Numeric | Reasoning |
|---|---|---|---|
| | | | |

### P10 · 0 成本路径相容 (×2) — 分数: ⏳/10
| Source URL | Date | Numeric | Reasoning |
|---|---|---|---|
| | | | |

---

## 四、计算

```
加权小计 = P1×3 + P2×3 + P3×2 + ... + P10×2 = ___ / 200
归一化   = (加权小计 / 20) × 10            = ___ / 100
```

**最终分**: `___`
**等级**: `🔥 HOT / 🟡 EMERGING / 🟠 WATCH / 🔴 PARK`

---

## 五、Verbatim 原话池（前 5 条预览）

> 完整池 → `VERBATIM/<pain-slug>/` 子目录。打分员 引用其中代表性 3-5 条到这里。

### V1 — u/{{username}} on r/{{sub}} ({{date}})
> "{{原话不改}}"
**permalink**: https://reddit.com/...

### V2 — ...

### V3 — ...

---

## 六、现有方案 / 竞品（链接到 10_competitor_scan/）

| 现有方案 | 类型 | 价格 | 用户主要抱怨 | 详细 review |
|---|---|---|---|---|
| | | | | `10_competitor_scan/<slug>.md` |

---

## 七、关联 idea (linked_ideas)

| Idea | Slug | Score | Status |
|---|---|---:|---|
| _暂无_ | | | |

> 一痛多 idea 时，所有 idea slug 都列在这。

---

## 八、复盘日志

| 日期 | 触发 | 变更 | 谁 |
|---|---|---|---|
| 2026-04-28 | 初建 | draft v0.1 | 研究员 |

---

## 九、相关

- 评分卡: `03_pain_points/_SCORECARD.md` v1.0
- 分类法: `03_pain_points/_TAXONOMY.md`
- Verbatim 子目录: `VERBATIM/{{pain-slug}}/`
- 关键 thread 追踪: `HOT_THREADS/{{pain-slug}}/`
- 反向 link: `IDEA_LINKED/{{pain-slug}}.md`
