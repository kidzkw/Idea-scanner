# 03_pain_points/ — 客户痛点 SSOT

> **一句话**：每一个真实、跨源、可量化的客户痛点，对应一个 SSOT markdown。是 `09_startup_ideas/` 的蓄水池。

## 文件结构

```
03_pain_points/
├── README.md                ← 本文件
├── _SCORECARD.md            ← 10 维痛点评分卡
├── _INDEX.md                ← 全部痛点索引
├── _TAXONOMY.md             ← 痛点分类法（受众 × 领域 × 严重度）
├── _template/
│   └── PAIN_TEMPLATE.md     ← 单痛点 SSOT 模板
├── VERBATIM/                ← 原话池（按 pain slug 分子目录）
│   └── <pain-slug>/
│       └── YYYY-MM-DD_<source>_<post-id>.md
├── EVIDENCE/                ← 数字证据（搜索量 / 评论数 / Stripe 同类产品 ARR 等）
│   └── <pain-slug>/
├── HOT_THREADS/             ← 关键 thread 实时追踪（帖子员维护）
│   └── <pain-slug>/
├── IDEA_LINKED/             ← pain → idea 反向索引（一痛多 idea 时方便回查）
│   └── <pain-slug>.md
├── _archive/                ← 被合并/废弃的 pain SSOT
└── <pain-slug>.md           ← 单痛点 SSOT
```

## 一个痛点能进 SSOT 的最低门槛

1. **≥3 条独立 verbatim**（不同用户 / 不同 thread 同一痛）
2. **≥2 个独立平台**（不能只 Reddit；至少 Reddit + HN / G2 / 其他）
3. **可量化的受众基数**（粗估 ≥5K 全球潜在用户）
4. **明确"现有 workaround"**（用户在用什么蹩脚方案）

不达标 → 留在 `02_raw/_inbox/` 或 `_archive/`，不立 SSOT。

## 生命周期

```
02_raw/_inbox/ (新帖子) ──┐
                          │
HN / G2 / 论坛 抓取 ──────┤
                          │
                          ▼
              [流水主管 5 阶段 pipeline]
                          ▼
               已有 pain SSOT?
              ┌──────┴──────┐
            是               否
            │                │
            ▼                ▼
       追加 verbatim    门槛达标? 
            │           ┌──┴──┐
            │          是    否
            │          ▼     ▼
            │      新建SSOT  暂存_inbox
            │          │
            └─────┬────┘
                  ▼
          [打分员 10 维]
                  ▼
        [信号算法员 0-100 热度]
                  ▼
         热度 ≥70 → 触发 idea 提案
                  ▼
        09_startup_ideas/ 新建 draft
                  ▼
        IDEA_LINKED/<slug>.md 反向 link
```

## 打分（10 维）

详见 `_SCORECARD.md`。简述：

| # | 维度 | 权 |
|---|---|---|
| P1 | 痛点严重度（每天浪费时间 / 现金流损失） | ×3 |
| P2 | 付费意愿信号（"I'd pay" / 同类已有人付费） | ×3 |
| P3 | 受众规模（全球可触达 SAM） | ×2 |
| P4 | 复发频率（一次性 vs 反复触发） | ×2 |
| P5 | 平台扩散（多少独立社区有此痛） | ×2 |
| P6 | 时效性（季节性 / 政策驱动 / 长期结构） | ×1.5 |
| P7 | 现有方案差距（免费工具有多烂） | ×2 |
| P8 | 表达密度（每月新 thread 数） | ×1.5 |
| P9 | 量化可得性（数据是否可结构化采集） | ×1 |
| P10 | 与 0 成本路径相容（能否软件化解决） | ×2 |

满分 200，归一化 0-100。

## 与 09_startup_ideas/ 的关系

- pain 是**蓄水池**，idea 是**出水口**。
- 一个 pain 可对应多个 idea（不同切入角度）
- 一个 idea 必须 link ≥1 pain
- pain 自己不打"能不能赚钱"分；那是 idea scorecard 的活
- pain 维度（严重度 / 付费意愿 / 受众）打完后，idea scorecard 直接引用 snapshot，不重复抓证据

## 谁在写 / 谁在维护

| 动作 | 角色 |
|---|---|
| 抓帖子入 inbox | 抓取员（cron） |
| 5 阶段处理 | 流水主管 + 5 employees |
| 写新 pain SSOT | 研究员 |
| 抓 verbatim 原话 | 原话手 |
| 维护 HOT_THREADS 实时追踪 | 帖子员 |
| 10 维打分 | 打分员 |
| 计算热度 | 信号算法员 |
| 索引漂移扫 | 索引稽查（周扫） |
| 关键词召回/精度迭代 | 关键词调优员（周扫） |
