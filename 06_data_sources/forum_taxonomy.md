---
file_type: source_registry
name: Forum & Platform Taxonomy
version: v0.1
created: 2026-04-28
authority: REPURPOSING_PLAN.md §三
maintained_by: 关键词调优员 (周扫调优) + 用户 (添加新源)
---

# 🌐 Forum & Platform Taxonomy · v0.1

> **目的**：列出抓取员 cron 该扫的所有平台，分级 + 抓取方式 + 频率。
> **原则**：30+ 个平台，全部 0 成本接入。先跑 Tier 1 (10 个)，验证 pipeline 稳定后扩 Tier 2 / 3。

---

## Tier 1 · 主战场（每天扫，权重最高）

每个 pain SSOT 优先在这些平台找 verbatim。

| # | 平台 | 抓取方式 | 频率 | 备注 |
|---|---|---|---|---|
| 1 | **Reddit** | PRAW (官方 API, 免费) | 日 ×2 (06:00 + 18:00 ET) | 30 个目标 sub × pain-keyword filter — 主力 |
| 2 | **Hacker News** | Algolia API (免费, 无 key) | 日 ×1 (08:00 ET) | Ask HN + Show HN + 高分 thread |
| 3 | **Indie Hackers** | chrome-devtools MCP scrape | 周 1 (Mon 09:00) | Milestones + 失败复盘 + AMA |
| 4 | **Product Hunt** | RSS + chrome scrape | 日 ×1 (09:00 ET) | 当日 launch + 评论低分项（"missing X"） |
| 5 | **G2** (SaaS reviews) | chrome scrape | 周 1 (Sat 21:00) | 1-3 星 review，"the worst part is..." 段落 |
| 6 | **Capterra** | chrome scrape | 周 1 (Sat 22:00) | 同 G2，覆盖 SMB 软件 |
| 7 | **AlternativeTo** | chrome scrape | 周 1 (Sun 09:00) | "looking for alternative to X" — 现有方案不满信号 |
| 8 | **Stack Exchange (Sysadmin / SuperUser / ServerFault / Workplace / UserExperience)** | API (免费) | 日 ×1 (10:00 ET) | "how do I" + "no good answer" — 真实工程/职场 pain |
| 9 | **GitHub Issues** (公开 repo) | GraphQL API (免费, GH PAT) | 日 ×1 (12:00 ET) | 高 thumbs-up + 长期 unresolved issue 是产品需求信号 |
| 10 | **X / Twitter** | 现有 chrome-grok MCP | 按需触发 | 关键词 + verified ≥10K 抱怨帖 |

## Tier 2 · 二线（每周扫，补充信号）

| # | 平台 | 抓取方式 | 频率 | 备注 |
|---|---|---|---|---|
| 11 | **Quora** | chrome scrape (受限, 用 Google site:quora.com) | 周 1 | "What's the best..." 反映工具空缺 |
| 12 | **Lobste.rs** | RSS / Atom | 周 1 | HN 替代，更技术 niche |
| 13 | **DEV.to** | RSS + 评论 scrape | 周 1 | 开发者抱怨 + tutorial 评论"为什么没有 X" |
| 14 | **HashNode** | RSS | 周 1 | 同 DEV.to |
| 15 | **Designer News** | scrape | 周 1 | 设计师 niche |
| 16 | **Beta List / Starter Story / Failory** | scrape | 周 1 | 新创业项目 + 失败案例 |
| 17 | **TrustPilot** | scrape | 周 1 | B2C 服务投诉 |
| 18 | **Glassdoor** + **Blind / TeamBlind** | chrome scrape | 周 1 | 员工痛点 → B2B HR / dev tools 机会 |
| 19 | **Upwork / Fiverr 项目描述** | chrome scrape (search results) | 周 1 | "需要解决 X" — 揭露雇佣解决的痛点（高 WTP 信号） |
| 20 | **TaskRabbit / Thumbtack / Angi** (NYC 优势) | chrome scrape | 周 1 | 本地服务需求 + 价格信号 |
| 21 | **Yelp 1-2 星 review** (NYC focus) | chrome scrape | 周 1 | 本地服务痛点 — 用户在 NYC 有现场访问优势 |
| 22 | **App Store + Play Store reviews** (竞品) | 公开 review JSON / RSS | 月 1 | 1-2 星 review 段落 |
| 23 | **Substack 评论** (订阅免费 newsletter) | chrome scrape | 周 1 | thought leader 痛点 echo |
| 24 | **Threads (Meta)** + **Bluesky** | chrome scrape | 周 1 | 新平台早期信号 |
| 25 | **Discord 公开服务器** (创业 / 开发 / 设计 community) | chrome scrape (per channel) | 周 1 | 实时抱怨, low-noise (vs Reddit) |

## Tier 3 · 长尾 / 季度（按需 / 季度扫一次）

| # | 平台 | 用途 |
|---|---|---|
| 26 | **There's an AI for that / Futurepedia** 评论 | AI 工具空缺 |
| 27 | **PissedConsumer / ComplaintsBoard** | 大公司投诉聚合（B2C 替代品机会） |
| 28 | **Mumsnet / r/Parenting / Nextdoor** | 父母 / 邻里 niche |
| 29 | **SaaSHub / SaaSWorthy** | SaaS 替代品对比 |
| 30 | **Coursera / Udemy 课程评论** | 教育 niche pain |
| 31 | **Mastodon** | 长尾, 极 niche community |
| 32 | **Twitch chat / YouTube 评论** | creator niche pain |
| 33 | **Nextdoor (NYC)** | 本地服务痛点（NYC 居民优势） |
| 34 | **Google Trends + Exploding Topics** | 上升趋势词 → 反查 Reddit thread |

---

## 抓取硬规则

1. **每个抓的帖子必须存原始 permalink**（不存 .com 短链 / amp 链）— `verification_token` 强制
2. **不抓登录墙后内容**（Facebook 私群 / LinkedIn 全文 / 私 Discord）— 法律灰色
3. **遵守 robots.txt + rate limit**：Reddit PRAW 默认 60 req/min；其他 chrome scrape 设 ≥3 秒间隔
4. **不抓个人身份信息**（手机 / 邮箱 / 住址）— 进 inbox 前自动 redact
5. **每个源每次抓限 ≤200 帖子**（防止单源霸占 inbox）
6. **去重**：用 `(platform, post_id)` 元组做 dedupe，已 processed 的不重复入 inbox

---

## Pain-Keyword 召回列表 (v0.1，关键词调优员 周迭代)

### 正向（必抓）
```
"I wish there was"
"is there a tool"
"is there an app"
"is there any way to"
"how do you guys"
"why isn't there"
"why doesn't anyone"
"no one has built"
"frustrating that"
"nightmare"
"wasting hours"
"wastes my time"
"I would pay"
"I'd pay good money"
"would pay for"
"tried [X] but"
"switched from"
"can't find a"
"recommend a tool for"
"looking for a tool"
"hate that"
"is broken"
"piece of shit"     # 真痛点高信号
"workaround"
"hack together"
```

### 负向（自动剔除）
```
- 单句 < 50 char
- 评论数 < 3 (Tier 1 平台)
- karma < 5 (Reddit)
- 含: "DAE", "circlejerk", "shitpost"
- 招聘 / 自我推销 / 联盟链
- 标题或正文含: "I built", "show off", "review of mine" (作者自卖自夸)
```

---

## subreddit Tier 1 启动清单（30 个，等用户审改）

> **领域偏好开放**（用户 2026-04-28 确认无垂直锁定），先扫"创业者 + 开发者 + 创作者 + 本地"的高密度 sub。

### 创业 / 商业（10）
- r/Entrepreneur (2.5M)
- r/SaaS (250K)
- r/SmallBusiness (1.5M)
- r/Startups (1.5M)
- r/IndieDev (180K)
- r/sidehustle (2.3M)
- r/SideProject (130K)
- r/EntrepreneurRideAlong (250K)
- r/Business (4M)
- r/Freelance (180K)

### 开发者 / 技术（8）
- r/webdev (2.8M)
- r/programming (5.5M)
- r/sysadmin (1.2M)
- r/devops (380K)
- r/SoftwareEngineering (250K)
- r/LocalLLaMA (300K)
- r/ChatGPT (10M, 高噪声 — 仅高赞)
- r/OpenAI (2.5M, 同上)

### 创作者 / 自由职业（5）
- r/NewTubers (1M)
- r/podcasting (130K)
- r/Substack (50K)
- r/youtube (2.7M)
- r/socialmedia (200K)

### 工作 / 生产力（4）
- r/productivity (1.5M)
- r/Notion (350K)
- r/ObsidianMD (250K)
- r/excel (650K)

### NYC 本地（3）
- r/AskNYC (1M)
- r/nyc (4.5M)
- r/AskNewYork (50K)

> 用户审改清单：删/加/改权重，让 抓取员 按你的优先级跑。

---

## 演化

- 每周日 关键词调优员 报告：召回率 / 精度 / 单平台 SNR (信噪比)
- 单平台 SNR < 5% 连续 3 周 → 降到 Tier 3 或下架
- 单 sub 月新 verbatim < 5 → 备选轮换
- 用户随时可加新平台 / 新 sub → 加在末尾，注 added: YYYY-MM-DD
