# Plan B · 抓取脚本（无 Reddit 路径）

> Reddit Responsible Builder Policy 把 personal API 注册挡死后的备选方案。
> 3 个免费、稳定的 pain-point 数据源；端到端 24h 内有真实数据。

## 文件

```
plan_b/
├── README.md              ← 本文件
├── _lib.py                ← 共享：raw 写入 / 去重 / pain-keyword filter
├── hn_pull.py             ← Hacker News (Algolia API, 0 auth)
├── se_pull.py             ← Stack Exchange (workplace/freelancing/superuser/serverfault/...)
├── gh_pull.py             ← GitHub Issues (用 PAT — 见 github_pat_setup.md)
├── pull_all.ps1           ← 三路顺序跑 + 写日志
├── github_pat_setup.md    ← 5 分钟 PAT 流程
├── _state/
│   ├── seen_hn.json       ← HN 已处理 ID（防重抓）
│   ├── seen_se.json
│   └── seen_gh.json
└── _logs/                 ← powershell 跑的输出日志
```

## 立刻试跑

```powershell
cd D:\Claude\AI_Reddit\06_data_sources\_scripts\plan_b
python hn_pull.py     # 0 auth, 8 秒, ~40 raw 进 inbox
python se_pull.py     # 0 auth, 30 秒, ~40 raw
python gh_pull.py     # 没 PAT 先跑能跑的（限速）
```

或者一把跑：
```powershell
.\pull_all.ps1
```

## 看结果

```powershell
ls D:\Claude\AI_Reddit\02_raw\_inbox\
```

每个 .md 文件 = 一条 pain 候选。用 VS Code / Notepad 打开看 frontmatter + body。

## 配 cron（Windows Task Scheduler）

```powershell
# 每天 ET 06:00 + 18:00 跑 pull_all.ps1
schtasks /Create /TN "AI_Reddit Plan B Morning" /TR "powershell.exe -File D:\Claude\AI_Reddit\06_data_sources\_scripts\plan_b\pull_all.ps1" /SC DAILY /ST 06:00 /F
schtasks /Create /TN "AI_Reddit Plan B Evening" /TR "powershell.exe -File D:\Claude\AI_Reddit\06_data_sources\_scripts\plan_b\pull_all.ps1" /SC DAILY /ST 18:00 /F
```

`/ST` 自动用本地 ET（NYC 时区）。

## Pain-keyword filter

写在 `_lib.py` 顶部 `POSITIVE_KEYWORDS` / `NEGATIVE_PATTERNS`。
- 正向命中 + 负向不命中 + body 长 + engagement 够 = 进 inbox
- 否则丢弃（`rejected.filter` 计数）

迭代：观察 inbox 文件质量，关键词调优员（待建 agent）每周扫一次召回率 / 精度。

## 下一步（人工触发）

inbox 里堆了 raw 后，回 Claude 说：

> **"处理 inbox"**

调度员就会拉起 5 阶段 pipeline（分诊 → 提取 → 对比 → 规则稽查 → 归档），把这些 raw 处理成 pain SSOT。

**注意**：现有 5 阶段 agent 是为股票 ticker 写的，跑这批 pain raw 之前需要先重写它们的 prompt（Phase 1 §五）。在那之前可以手动让研究员处理 1-2 条做 PoC。

## 合规

所有 3 个源都遵守：
- HN Algolia: 公开 API, ToS 允许程序读
- Stack Exchange: 公开 API, 30 req/sec 上限内
- GitHub: 公开 issue, 用户已授权 GitHub 公开

输出**不重新发布**、**不训练 AI**，仅本地分析（详见 `00_rules/_compliance/REDDIT_DATA_POLICY_v1.md` —— 同样规则适用）。

## 何时切回 Plan A

如果将来 Reddit Responsible Builder Policy 放宽，或你拿到 commercial license：
1. 用户填 `.env`：`REDDIT_CLIENT_ID=...` / `REDDIT_CLIENT_SECRET=...` / `REDDIT_USER_AGENT=...`
2. 自动化工程师写 `reddit_pull.py`（用 PRAW 或 stdlib OAuth）
3. 加进 `pull_all.ps1` 末尾
4. 现有 SSOT 不丢，新数据自动 dedup + 追加
