---
file_type: setup_guide
name: Reddit API (PRAW) — 5 分钟注册指南
created: 2026-04-28
applies_to: 06_data_sources/_scripts/reddit_pull.ps1 (待建)
audience: 用户 (要你亲手注册一次, 之后脚本自动)
---

# 📘 Reddit API · 5 分钟注册指南

## 0. 前置

- 已有 Reddit 账号（任何账号都行，建议用你自己常用的）
- 浏览器登录 reddit.com

## 1. 创建 Reddit App

1. 打开 https://www.reddit.com/prefs/apps
2. 滚到底，点 **"create app"** 或 **"create another app"**
3. 填：
   - **name**: `ai_reddit_pain_miner` (随便填)
   - **type**: 选 **`script`** ⭐（重要 — 不要选 web app）
   - **description**: `Personal pain-point research; read-only; no AI training; no redistribution; no Reddit content in any final product. ≤60 req/min, ≤5K posts/day.`（详见 §1.1 防御性表述）
   - **about url**: 留空
   - **redirect uri**: `http://localhost:8081`（任意值，script 类型不实际使用 redirect 流；你之前发的 8081 也可以）
4. 点 **"create app"**

### 1.1 如果 Reddit 让你填 Use Case / Purpose（防御性模板）

照抄这段（合规主管已 approve）：

> **Purpose**: Personal pain-point research for product ideation.
>
> **What I'll do**: Read recent posts in 30 SaaS / entrepreneurship / NYC subreddits; identify recurring complaints / feature requests; aggregate into a personal research database (local files, never published).
>
> **What I will NOT do**:
> - Train any AI / ML model on Reddit data
> - Redistribute, resell, or publish Reddit content
> - Build a product that contains Reddit posts / users / comments
> - Exceed personal-use rate limits (≤60 req/min)
>
> **Read-only**. No posting, voting, messaging, or modifying any content.

> 全文依据：`00_rules/_compliance/REDDIT_DATA_POLICY_v1.md`

## 2. 取出 3 个值

创建后页面会显示：

```
ai_reddit_pain_miner
personal use script
[client_id 在这里 — 14 位字符]   ← 在 "personal use script" 下方
secret: [client_secret 在这里 — 27 位]
```

你需要的 3 个值：
- **client_id**: 14 位字符串（不带空格）
- **client_secret**: 27 位字符串
- **user_agent**: 自己起一个有意义的名字，例: `ai_reddit_pain_miner/0.1 by u/yourusername`

## 3. 把凭据放到 `.env`（**不要进 git**）

在仓库根目录建文件 `D:\Claude\AI_Reddit\.env`（注意：仓库根 `.gitignore` 应已包含 `.env`，待 自动化工程师 建脚本时确认）：

```bash
# Reddit API
REDDIT_CLIENT_ID=AbCdEfGhIjKlMn
REDDIT_CLIENT_SECRET=qWeRtYuIoPaSdFgHjKlZxCvBnM1
REDDIT_USER_AGENT=ai_reddit_pain_miner/0.1 by u/yourusername
REDDIT_USERNAME=yourusername
REDDIT_PASSWORD=YOUR_REDDIT_PASSWORD       # ⚠️ 仅 script app 需要; 不分享
```

> 如果你启用了 2FA，需要在密码字段填 `password:OTPCODE`（每次过期），更稳妥的做法是临时关 2FA 跑首次脚本，或换 OAuth 流程（自动化工程师后续切换）。

## 4. 验证（自动化工程师建脚本后）

`reddit_pull.ps1` 第一次跑会自检：
- 能 list subreddit
- 能拉单 subreddit 最近 25 条
- 拉满 1 分钟自动 rate-limit

成功 → 看到 `[OK] reddit auth verified, 25 posts pulled`。

## 5. 限额

- PRAW 默认 60 req/min
- 实际拉 30 个 sub × 100 帖子 ≈ 30 次 search call ≈ 30 sec → 完全够用
- 日限：免费账号没硬限，但 build a respectful client：抓取员 cron 默认每个 sub 最多 100 帖/次

## 6. 何时要重做？

- 凭据泄露（`.env` 被 commit）→ Reddit App 页面 **"edit"** 重新生成 secret
- Reddit 改政策（API 收费阈值变）→ 关注 https://www.reddit.com/r/redditdev/

## 7. 你做完后告诉我

把这 4 个值填到 `.env` 后，回我一句"reddit auth done"。我（自动化工程师）会建：
- `06_data_sources/_scripts/reddit_pull.ps1` (cron 入口)
- `06_data_sources/_scripts/reddit_pull_core.py` (PRAW 核心)
- `06_data_sources/_scripts/reddit_keywords.json` (来自 forum_taxonomy.md 的 keyword 列表)

第一次跑会拉 5 个种子 sub × 100 帖 ≈ 500 raw 文件 → 触发 5 阶段 pipeline 全量验证。
