---
file_type: master_plan
version: v0.2
created: 2026-04-28
last_updated: 2026-04-28
authority: supersedes BOOTSTRAP.md for new mission scope
status: PHASE 1 IN PROGRESS — archive 完成, pain_points 骨架完成, 等 Reddit API 凭据 + agent prompt 重写
user_context: NYC, 0-cost preference, fast cash cycle, vertical-agnostic
---

# 🎯 AI_Reddit · 改造计划 v0.1

> **新使命**：从 Reddit / HN / X / G2 等社群信号中**挖掘真实客户痛点**，沉淀为可比、可追溯、可复盘的**痛点 SSOT**，并孵化为**0 成本启动的创业 idea**。
>
> **旧使命（已废弃）**：股票 DD（来自 AI_Semi_Research 模板）。

---

## 一、现有框架评估（What we keep / What we kill）

### ✅ 100% 复用（架构骨架，痛点挖掘同样需要）

| 模块 | 旧用途 | 新用途 | 备注 |
|---|---|---|---|
| **5 阶段 raw intake pipeline** | 处理 chatgpt/grok 投研笔记 | 处理 Reddit/HN 抓取的帖子 | 完全不动；只换 _inbox/ 投喂源 |
| **30-agent 组织架构** | 投研团队 | 痛点研究团队 | 角色映射见 §二 |
| **Source Weight Ladder** | SEC=100, Grok=50 | Reddit verified user / G2 review / 公司投诉社区分级 | 重新校准权重表 |
| **Verification Tokens** | source_url + quote_locator | 同上 — 每条痛点必须挂 Reddit 永久链 + 帖子 ID | 不动 |
| **Per-AI sandbox v1.0** | 5 chrome MCP | 同左 + 加 Reddit/HN 抓取 chrome 实例 | 加一个 `reddit_scraper` 沙箱 |
| **_AUDITS / _PENDING_TODO / _ACTIVE_WORK** | 跨 session 协调 | 同上 | 不动 |
| **04_daily_log/** | 投研日志 | 抓取/处理日志 | 不动 |
| **_AI_PROJECTS/** chrome launchers | 5 AI 沙箱启动 | 同上 | 不动 |
| **打分员 + 4 evidence row 强制** | 7 维 2Y-3X scorecard | 10 维痛点 + idea 双 scorecard | 评分逻辑沿用，公式重写 |

### 🔄 需要语义重映射（agent 不删，改 prompt + 改职责）

| 旧角色 | 旧职责 | 新职责 | 改造工作量 |
|---|---|---|---|
| **总监** (CEO) | 投研总入口 | 痛点 + idea 总入口 | 改 system prompt 关键词 |
| **研究员** | 写 ticker SSOT | 写「痛点 SSOT」(`03_pain_points/<slug>.md`) | 改 template 引用 |
| **原话手** | 抓高管 verbatim | 抓 **Redditor 原话** (verbatim 100% 不改写) | 不动逻辑，改源 |
| **打分员** | 7 维 scorecard | 10 维痛点 scorecard + 13 维 idea scorecard | 重写 rubric |
| **发现员** | 扫 AI 价值链宇宙 | 扫 subreddit / HN / X 宇宙发现新痛点 | 重写源清单 |
| **社交员** | 扫 X 关注 60K+ | 扫 Reddit 高赞 + HN 高分 + IH builders | 重写阈值 |
| **日历员** | catalyst_calendar (财报) | trend_calendar (产品发布 / 政策 / 季节性) | 改语义 |
| **承诺稽查** | 财报 vs L4/L5 verbatim | **idea 实施 vs 6/12 月承诺**（用户自己的） | 角色保留，改对照源 |
| **进化员** | 优化 7 维 scorecard 权重 | 优化痛点 + idea scorecard 权重 | 不动逻辑 |
| **图谱建模师** | 标的-行业-事件图 | 痛点-客户群-竞品-渠道图 | 不动逻辑，改 schema |
| **信号算法员** | 0-100 ticker 信号 | 0-100 痛点热度 + 0-100 idea 可行度 | 公式重写 |

### ❌ 删除或归档（与新使命无关）

| 模块 | 处理 |
|---|---|
| `01_value_chain/` (AI 半导体价值链) | mv → `_archive/01_value_chain_legacy/` |
| `03_tickers/` 的 SEC / VERBATIM(高管) / WATCHLIST 子目录 | 改为 `03_pain_points/` 下 VERBATIM(Reddit 原话) / EVIDENCE / IDEA_LINKED |
| `08_hidden_gems_PLANNING/` (基金宇宙 151) | mv → `_archive/08_hidden_gems_legacy/` |
| **agent: 文件员** (SEC 文件追踪) | 改造为 **帖子员** — 追踪关键 thread 的新评论 |
| 7 维 2Y-3X scorecard | 改为 10 维痛点 scorecard（见 `03_pain_points/_SCORECARD.md`，待建） |

### ➕ 新增（痛点挖掘特有）

| 新模块 | 路径 | 用途 |
|---|---|---|
| **03_pain_points/** | 改自 03_tickers/ | 每个痛点一个 SSOT |
| **09_startup_ideas/** | 全新 | idea 库 + 13 维 scorecard（**本次已建**） |
| **10_competitor_scan/** | 全新 | G2/Capterra/AlternativeTo/PH 竞品 review 扫 |
| **11_customer_interviews/** | 全新 | DM / call 笔记 + payment intent signals |
| **06_data_sources/reddit_taxonomy.md** | 新文件 | subreddit 分类 + 抓取权重 |
| **新 agent: 抓取员** | `.claude/agents/抓取员.md` | PRAW + HN Algolia + chrome scrape 编排 |
| **新 agent: 关键词调优员** | `.claude/agents/关键词调优员.md` | 监控抓取召回率/精度，迭代 pain-keyword 列表 |

---

## 二、新角色映射表（30 → 32 agents）

```
User
 └─ 总监 (CEO) — 痛点+idea 总入口
     │
     ├─ 研究主管 → 12 employees
     │   ├─ 发现员      扫新 subreddit / 痛点宇宙
     │   ├─ 抓取员 ⭐NEW  PRAW / HN / chrome 自动抓取编排
     │   ├─ 调度员      投喂 _inbox/ 触发 5 阶段
     │   ├─ 研究员      写痛点 SSOT
     │   ├─ 打分员      10 维痛点 + 13 维 idea 双打分
     │   ├─ 原话手      Reddit 原话 verbatim 抓取
     │   ├─ 社交员      X / 高赞 thread 监控
     │   ├─ 帖子员 (改自文件员)  关键 thread 新评论追踪
     │   ├─ 日历员      trend_calendar
     │   ├─ 日志员      daily intake 日志
     │   ├─ 索引稽查    _INDEX.md 漂移检查
     │   └─ 承诺稽查    idea 6/12 月里程碑 vs 实际
     │
     ├─ 流水主管 → 5 employees (5 阶段不动)
     ├─ 合规主管 → 3 employees (反编造不动)
     └─ 架构主管 → 5 employees
         ├─ 信号算法员    0-100 痛点热度 + idea 可行度
         ├─ 图谱建模师    痛点-客户-竞品-渠道图
         ├─ 自动化工程师  cron / Reddit 抓取脚本
         ├─ 前端全栈员    idea dashboard (Next.js, 后期再做)
         └─ 关键词调优员 ⭐NEW  pain-keyword 召回/精度迭代
```

---

## 三、Harness 自动化抓取计划

### 3.1 抓取源 + 频率

| 源 | 接口 | 成本 | 频率 | 抓取策略 |
|---|---|---|---|---|
| **Reddit** | PRAW (官方 API, 免费) | 0 | 每日 06:00 + 18:00 ET | top/new/rising × 30 个目标 sub × pain-keyword filter |
| **HN** | Algolia API (免费) | 0 | 每日 08:00 ET | Ask HN + Show HN + 高分 thread |
| **IndieHackers** | chrome-devtools MCP scrape | 0 | 每周 Mon 09:00 | Milestones + 失败复盘 thread |
| **ProductHunt** | RSS + chrome scrape | 0 | 每日 09:00 | 当日 launch + 评论低分项 |
| **X / Twitter** | 现有 chrome-grok MCP | 0（已有沙箱） | 按需触发 | 关键词 + verified ≥10K 账号 |
| **G2 / Capterra / AlternativeTo** | chrome scrape | 0 | 每周 Sat | 竞品 1-3 星 review("the worst part is...") |
| **App Store / Play Store** | 公开 review JSON | 0 | 每月 | 竞品 1-2 星 review |

### 3.2 抓取流程（对接现有 5 阶段 pipeline）

```
[抓取员] cron 触发
    ├─ PRAW pull (subreddit × keyword)
    ├─ Algolia pull (HN)
    └─ chrome MCP scrape (其余)
         ↓
将每条候选帖子写入 02_raw/_inbox/YYYY-MM-DD_REDDIT_<sub>_<post-id>.md
（用现有 RAW_TEMPLATE.md，frontmatter 加 pain_keywords 字段）
         ↓
[流水主管] 现有 5 阶段 pipeline 跑完不动：
  分诊员: 噪声/营销/低互动剔除
  提取员: 提取 pain statement / 受众 / 现有 workaround / 付费信号
  对比员: 与 03_pain_points/ 现有 SSOT diff
  规则稽查: 反编造 + 反单源
  归档员: 追加到对应痛点 SSOT, 更新 _INDEX.md
         ↓
[关键词调优员] 每周日扫 _processed/, 计算
  - 召回率 (有多少真痛点被分诊员错杀)
  - 精度 (有多少进入 SSOT 的实际是噪声)
  → 调整 pain-keyword 列表 + 分诊阈值
```

### 3.3 Pain-keyword 启动列表（v0.1, 让 关键词调优员 迭代）

正向（真痛点信号）:
- "I wish there was a tool that..."
- "is there any way to..." / "how do you guys..."
- "frustrating" / "nightmare" / "wasting hours"
- "I'd pay for..." / "would pay good money"
- "why isn't there..." / "no one has built..."
- "tried [X] but..." (竞品不满)
- "switched from [X] because..."

负向（噪声过滤）:
- "DAE" (mostly venting)
- 单句 < 50 char
- 评论数 < 3
- karma < 5
- 广告 / 招聘 / 自我推销

### 3.4 必要 cron 任务（待 自动化工程师 落地）

```powershell
# Windows Task Scheduler
06:00 daily   reddit_pull_AM.ps1      # PRAW 拉 30 sub × keywords
08:00 daily   hn_pull.ps1             # HN Algolia API
09:00 daily   ph_pull.ps1             # ProductHunt RSS
18:00 daily   reddit_pull_PM.ps1      # 当日二次拉
21:00 daily   process_inbox.ps1       # 触发 5 阶段 pipeline
21:00 Sun     keyword_tuning.ps1      # 关键词调优员 周扫
21:30 Sun     idea_rescore.ps1        # 全量 idea 重打分
21:30 Sun     audit_full.ps1          # 合规主管全量稽查
```

### 3.5 抓取员 / 关键词调优员 prompt 待办

- [ ] `.claude/agents/抓取员.md` — 编排 PRAW + Algolia + chrome scrape
- [ ] `.claude/agents/关键词调优员.md` — 召回/精度迭代
- [ ] `06_data_sources/_scripts/reddit_pull.ps1`（用 PRAW Python 脚本调用）
- [ ] `06_data_sources/_scripts/hn_pull.ps1`
- [ ] `06_data_sources/reddit_taxonomy.md` — subreddit 优先级表

---

## 四、双 Scorecard 设计（核心输出）

### 4.1 痛点 Scorecard（10 维, 见 `03_pain_points/_SCORECARD.md`，待建）
痛点是**蓄水池**：先验证它真实、规模、可付费，再考虑能不能做成产品。

### 4.2 创业 idea Scorecard（13 维, 已建于 `09_startup_ideas/_SCORECARD.md`）
idea 必须**回扣到一个或多个 03_pain_points/ SSOT**（否则 KILL）。打分细节见该文件。

---

## 五、优先级 + 执行顺序

### Phase 0 — 计划锁定 ✅ 完成
- [x] 写本 plan 文档
- [x] 落地 `09_startup_ideas/` 骨架（_SCORECARD / _INDEX / _template / README）
- [x] 用户确认 Q2/Q4/Q5（2026-04-28）

### Phase 1 — 痛点骨架 ✅ 大部分完成
- [x] mv `01_value_chain/` → `_archive/01_value_chain_legacy/`
- [x] mv `08_hidden_gems_PLANNING/` → `_archive/08_hidden_gems_PLANNING_legacy/`
- [x] mv `03_tickers/` → `_archive/03_tickers_legacy/`（**未重命名**改为整体归档 + 新建 `03_pain_points/` 全新结构，更安全）
- [x] 新建 `03_pain_points/` 骨架（README / SCORECARD / INDEX / TAXONOMY / TEMPLATE + 6 子目录）
- [x] 新建 `09_startup_ideas/` D11 现金回收速度（用户硬约束）→ scorecard v1.1
- [x] 新建 `06_data_sources/forum_taxonomy.md`（30+ 平台，Tier 1-3）
- [x] 新建 `06_data_sources/reddit_api_setup.md`（用户 5 分钟流程）
- [x] 新建 `10_competitor_scan/_template/`（占位）
- [x] 新建 `11_customer_interviews/_template/`（占位）
- [ ] 重写 `06_data_sources/source_weight_ladder.md`（Reddit 体系，旧的还是股票权重）
- [ ] 重写 11 个核心 agent 的 system prompt（保留中文名 + 逻辑，换关键词）

### Phase 2 — 自动化（等 Reddit 凭据）
- [ ] 用户注册 Reddit App，把 4 个值填到 `D:/Claude/AI_Reddit/.env`
- [ ] 创建 `抓取员` + `关键词调优员` 两个新 agent prompt
- [ ] 写 PRAW Python 脚本 (`reddit_pull_core.py`) + PowerShell wrapper (`reddit_pull.ps1`)
- [ ] 写 HN Algolia 脚本 + GitHub Issues 脚本 + Stack Exchange 脚本
- [ ] cron 注册 (Windows Task Scheduler, ET 时区) + 跑通端到端 1 天
- [ ] 用 5 个种子 subreddit 验证（约 500 raw → 5 阶段 pipeline 全量）

### Phase 3 — 全量上线
- [ ] 30 个目标 subreddit + 9 个 Tier 1 平台全量接入
- [ ] 关键词调优员 周迭代
- [ ] 第一个 pain SSOT 立 + 第一个 idea draft 入 `09_startup_ideas/`，全维度打分
- [ ] 总监 周报：top 10 emerging pain points + top 5 idea 评分

### Phase 4 — Dashboard（可选）
- [ ] 前端全栈员搭 Next.js dashboard：痛点热度榜 + idea 评分卡

---

## 六、决策点状态

| # | 问题 | 用户回答 (2026-04-28) | 状态 |
|---|---|---|---|
| Q1 | 30 个 subreddit 清单 | 待用户审改 (`06_data_sources/forum_taxonomy.md` 已草拟) | 待回 |
| Q2 | 目标客户 / 行业偏好 | **不限定**；硬约束：0 成本 + 快速启动 + 快速资金周期；明显客户痛点优先 | ✅ |
| Q3 | 启动预算上限 | 默认 $0/月（已写入 memory） | ✅ |
| Q4 | 同意 archive 旧 folder | ✅ 同意 | ✅ 已执行 |
| Q5 | Reddit App 注册 | ✅ 用户自己注册 | ⏳ 等凭据 |
| Q6 | 中文 agent 命名 | _未问，默认保留中文名 + 改 prompt_ | 默认保留 |
| Q7 | 抓取频率 | _未问，默认日 ×2_ | 默认 |
| Q+ | **新增平台清单** | ✅ 用户要求扩充，已写 forum_taxonomy.md (30+ 平台) | ✅ |
| Q+ | **NYC 地理优势** | ✅ 用户在纽约 → Yelp/Nextdoor/TaskRabbit/r/AskNYC 加入 Tier 2 | ✅ |

---

## 七、本次已完成（即时可用）

- ✅ 本计划文档（v0.2）
- ✅ `_archive/` — 3 个 legacy folder 全部 mv 入档（不真删）
- ✅ `09_startup_ideas/` 完整骨架（v1.1, 14 维含 D11 现金回收速度）
- ✅ `03_pain_points/` 完整骨架（10 维 pain scorecard + 受众/领域/形态分类法 + 6 子目录）
- ✅ `06_data_sources/forum_taxonomy.md` — 30+ 平台分级，含 NYC 本地源
- ✅ `06_data_sources/reddit_api_setup.md` — 5 分钟流程
- ✅ `10_competitor_scan/` + `11_customer_interviews/` 占位目录
- ✅ Memory 写入 3 条：user profile / idea-shape preference / project repurposing context

---

## 八、用户**下一步**

**立刻 (5 分钟)**：
1. 打开 `06_data_sources/reddit_api_setup.md`，跟步骤注册 Reddit App
2. 把 4 个值填到 `D:/Claude/AI_Reddit/.env`
3. 回我 "reddit auth done"

**之后 (按你节奏)**：
4. 审 `06_data_sources/forum_taxonomy.md` 30 个 subreddit 清单，删/加/改
5. 我建抓取员 + 调优员 + Python/PS 脚本，跑首日抓取
6. 第一个 pain SSOT 立起来后，开始迭代
