# 09_startup_ideas — 创业 idea 库

> **一句话**：从 `03_pain_points/` 提炼出可孵化的 idea，用 14 维 scorecard 客观打分，按 GO/PROBE/WATCH/KILL 分流。

## 文件结构

```
09_startup_ideas/
├── README.md                  ← 本文件
├── _SCORECARD.md              ← 14 维评分卡 (3 kill-gate + 11 加权维)
├── _INDEX.md                  ← 全部 idea 索引表
├── _template/
│   └── IDEA_TEMPLATE.md       ← 单 idea SSOT 模板
├── _archive_killed/           ← 失败/低分 idea 归档 (永不删, 复盘用)
├── _validation_queue/         ← Grade=PROBE 的 idea (2 周窗口)
├── _active_build/             ← Grade=GO 的 idea (MVP 在建)
├── _watch/                    ← Grade=WATCH 的 idea (60d 重扫)
└── NNN_<slug>.md              ← 单 idea SSOT (扁平摆放, 由 status 决定移动到子目录)
```

## 生命周期

```
[03_pain_points/] 累积 ≥3 verbatim
        ↓
   [新建 idea draft]
        ↓
   [Kill-Gate G1/G2/G3]
   ├─ ❌ → _archive_killed/
   └─ ✅
        ↓
   [打分员 跑 10 维]
        ↓
   ┌───────────┬──────────┬──────────┬──────────┐
   ↓           ↓          ↓          ↓
 ≥80 GO    65-79 PROBE  50-64 WATCH  <50 KILL
   │          │           │            │
   ↓          ↓           ↓            ↓
_active_  _validation_  _watch/    _archive_
build/    queue/                    killed/
```

## 关键规则

1. **每个 idea 必须 link ≥1 个 03_pain_points/<slug>.md** — 没有真实痛点的"灵感"直接 KILL。
2. **每维 4 行证据** (Source URL / Date / Numeric / Reasoning) — 不足则该维 0 分。
3. **0 成本 + 速度优先 + 资金周期快**：D5 (启动成本) / D6 (启动速度) / D11 (现金回收速度) 是用户三大硬约束，各 ×2。
4. **打分员 = Claude Opus 唯一权威** — ChatGPT/Grok 评分只是输入，不是裁决。
5. **打分要可重现**：60 天后任何人按本 scorecard + 原 SSOT 应得到 ±5 分以内的结果。

## 谁来写 / 谁来打分

| 动作 | 角色 |
|---|---|
| 新建 idea draft | 研究员 (从 pain SSOT 触发) |
| Kill-Gate 评估 | 总监 (1 分钟决策) |
| 10 维打分 | 打分员 (4 行证据强制) |
| Score Δ ≥10 时验证 | 测谎员 (合规主管派) |
| 索引漂移扫描 | 索引稽查 (周扫) |
| 进 _active_build 后里程碑追踪 | 承诺稽查 (季度) |
| Scorecard 权重调优 | 进化员 (周扫 + 6 月数据后) |

## 与其他模块的边界

| 这里 (09_) **做** | 这里**不做** |
|---|---|
| idea-level 打分 + 排序 | 痛点 verbatim 抓取 → `03_pain_points/` |
| MVP 范围定义 + 里程碑 | 实际写代码 → 你自己 / Claude Code |
| 竞品引用 + 差异化定位 | 竞品深度 review → `10_competitor_scan/` |
| 付费意愿假设 | 客户访谈记录 → `11_customer_interviews/` |
| 收入/成本预估 | 实际财务 → 你的私有账本 |

## 第一个 idea 怎么开始

1. 等 `03_pain_points/` 累积出至少 1 个有 ≥3 独立 verbatim 的 pain（自动化抓取上线后约 2-4 周）
2. `cp _template/IDEA_TEMPLATE.md ./001_<slug>.md`
3. 填 frontmatter + Kill-Gate
4. 让 `打分员` 跑 10 维
5. 看分数决定去向
6. 在 `_INDEX.md` 加一行

> 在自动化没上线前，可以**手工**把你脑里现有的 idea 按本模板写出来，先把流程跑通。
