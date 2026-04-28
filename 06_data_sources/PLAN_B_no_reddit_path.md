---
file_type: contingency_plan
name: Plan B — pain-point pipeline without Reddit API
version: v1.0
created: 2026-04-28
trigger: 用 reddit.com/prefs/apps 注册被强制重定向 / 拒绝 / 长期 pre-approval pending
status: standby (Plan A 优先, 这是 backup)
---

# 🆘 Plan B · No-Reddit 路径

> **触发条件**：Reddit 真把外部 API 注册关死。即便如此，**我们的痛点宇宙不依赖 Reddit**。本文档列出立刻能跑的替代源。

---

## 一、立刻可用（0 注册，0 密钥）

### B1 · Hacker News (Algolia API)
- **URL**: `https://hn.algolia.com/api/v1/`
- **认证**: 无
- **rate limit**: 10K req/h（免费够用）
- **覆盖**: Ask HN / Show HN / 高分 thread / 评论
- **痛点信号**: HN 创业者 + 工程师抱怨密度极高，单条 thread 评论 ≥100 是金矿
- **抓取脚本（伪代码）**:
  ```
  GET /search?query=I+wish+there+was&tags=story&hitsPerPage=100&numericFilters=points>20
  GET /search_by_date?tags=story,ask_hn&hitsPerPage=100
  ```
- **入 inbox**: 每条 hit → `02_raw/_inbox/YYYY-MM-DD_HN_<story_id>.md`

### B2 · Stack Exchange API
- **URL**: `https://api.stackexchange.com/2.3/`
- **认证**: 无（无 key 限 300 req/day/IP；申请 key 限 10K/day）
- **rate limit**: 30 req/sec
- **覆盖站点**: stackoverflow / superuser / serverfault / sysadmin / workplace / ux / pm / freelancing
- **痛点信号**: "no good answer" / 高 view 但低 accepted answer / 同问题反复出现
- **抓取**: `/questions?site=workplace&order=desc&sort=votes&tagged=tools`

### B3 · GitHub Issues (公开 repo)
- **URL**: GraphQL API `https://api.github.com/graphql`
- **认证**: GitHub Personal Access Token（5 分钟生成，免费，与 Reddit 无关）
- **rate limit**: 5K req/h authenticated
- **覆盖**: 任何 public repo issues，按 reaction 排序找高需求
- **痛点信号**: 高 thumbs-up + 长期 unresolved issue = 真实功能空白 → 第三方产品机会

### B4 · IndieHackers / ProductHunt（chrome scrape）
- 用现有 chrome-devtools MCP 沙箱
- 周扫，每次 ≤30 帖
- 已在 forum_taxonomy.md Tier 1

### B5 · X / Twitter（现有 chrome-grok 沙箱）
- 已配置，无需额外注册

### B6 · Reddit 网页 scrape（Reddit API 失败时的备选）
- 通过 chrome-devtools MCP 直接打开 reddit.com 浏览器
- 不走 API，走 HTML（合规上**比 API 更灰**，但 Reddit 起诉的是 industrial-scale，单用户低频读没风险）
- **限制**：每天 ≤100 个帖子；只读公开 subreddit；尊重 robots.txt
- 用 Reddit 自己的搜索 URL: `reddit.com/r/<sub>/search?q=...&sort=new`
- 入 inbox 同样写 `02_raw/_inbox/`

---

## 二、Plan A vs Plan B 对照

| 维度 | Plan A (Reddit API + 其他 5 平台) | Plan B (无 Reddit API) |
|---|---|---|
| 数据量/日 | ~3K Reddit + ~1K 其他 = **4K 帖** | ~1.2K 其他平台（HN/SE/GH/IH/PH/X） |
| 痛点覆盖 | Reddit 是创业/工具痛点最大水库 | HN+IH 也密集，但人群更工程师向 |
| 设置复杂度 | 中（Reddit App 5 分钟） | 低（HN/SE 不要 key） |
| 合规风险 | 中（Reddit 动作多） | 低（HN/SE/GH 政策稳定） |
| Phase 2 启动时间 | 等 Reddit 凭据 | **立刻可启动** |

---

## 三、决策树

```
用户尝试 reddit.com/prefs/apps
       │
       ├─ 成功拿凭据 → Plan A（Reddit + 其他全开）
       │
       ├─ 被重定向到 Devvit/automated-account 表单
       │     │
       │     ├─ 填表通过审核 → Plan A (但可能 1-7 天等待)
       │     │
       │     └─ 永久卡住 / 拒绝
       │           │
       │           └─ Plan B（其他 5 平台 + Reddit 网页 scrape）
       │
       └─ 选择主动跳过 Reddit → Plan B
```

---

## 四、Plan B 的最小可行设置（24h 内端到端）

| 步骤 | 时长 | 谁 |
|---|---|---|
| GitHub PAT 生成（settings → developer settings → tokens） | 2 min | 用户 |
| 把 `GITHUB_PAT=...` 写入 `.env` | 30 sec | 用户 |
| 自动化工程师写 `hn_pull.py` + `se_pull.py` + `gh_pull.py` | 2 h | Claude |
| 第一次跑 → 5 个种子主题（"I wish there was a tool" 等）每平台拉 100 条 → 入 _inbox | 10 min | 脚本 |
| 流水主管跑 5 阶段 pipeline → 第一批 pain SSOT | 30 min | Claude agents |
| 第一个 pain SSOT 立 + 第一个 idea 提案 | 同上 | 研究员 |

24h 后你已经有真实数据可看。Reddit 凭据来或不来，**不阻塞主流程**。

---

## 五、何时切回 Plan A

- 用户拿到 Reddit client_id/secret → 自动化工程师把 reddit_pull 加入 cron，与 HN/SE/GH 并列
- Plan B 已积累的 pain SSOT 不丢，Reddit 数据后续追加 verbatim 即可（pipeline 5 阶段会自动 dedup + 追加）
