---
file_type: persistent_pending_todo
purpose: "总监 warmup MUST read first. Cross-session TODO queue. After completion, 总监 removes the row + commits to _完成的TODO_archive.md"
last_updated: 2026-04-28
authority: 总监.md warmup §2 reads this first
auto_resume_directive: "After warmup, if user did not specify another task, automatically execute from the top item, ack user when complete"
---

# 总监 Pending TODO Queue (cross-session persistent)

**总监 auto-execute rule**: after warmup, if user did not specify another task, execute top of P0 → bottom in order. On completion → remove row + write to `_完成的TODO_archive.md` + brief user.

---

## P0 (immediate, blocking)

### TODO-001 · GitHub PAT 配置 (用户动作, 等待中)
- **状态**: 等用户在 https://github.com/settings/tokens 生成 classic PAT (no scope) → 写入 `D:\Claude\AI_Reddit\.env` 的 `GITHUB_PAT=...`
- **触发**: 用户回 "PAT 装好" 时
- **总监动作**: 派 自动化工程师 跑 `python gh_pull.py` 验证 → 扩 `gh_pull.py` query 列表至 12 条 (PAT 后限速从 60/h 提到 5K/h, 可激进)
- **依赖**: 无
- **创建**: 2026-04-28

### TODO-002 · 启动 Phase 1 — 5 阶段 pipeline 11 个 agent prompt 重写
- **状态**: 待启动 (Plan B 抓取已上线, inbox 已有 92 条 raw 待处理)
- **触发**: 用户说 "重写 agents" / "处理 inbox"
- **总监动作**: 派 流水主管 + 研究主管 协同
  - 改 `分诊员/提取员/对比员/规则稽查/归档员` 5 个 pipeline agent: 把"股票 ticker"语义改为"pain candidate"; 输出目标从 SSOT ticker 改为 `03_pain_points/<slug>.md`
  - 改 `调度员/研究员/打分员/原话手/帖子员/索引稽查` 6 个 research agent: 同上语义重映射
  - 保留中文名 + 角色逻辑, 仅改 system prompt 关键词
  - 改完后跑 1 条 inbox 文件做 PoC, 对照 `03_pain_points/_template/PAIN_TEMPLATE.md` 验证产出
- **依赖**: 无 (可与 TODO-001 并行)
- **创建**: 2026-04-28

---

## P1 (this week)

### TODO-101 · 写 抓取员 + 关键词调优员 两个新 agent prompt
- **状态**: 待写 (脚本已落地, agent prompt 还没建)
- **触发**: 用户说 "建抓取员 / 调优员"
- **总监动作**: 派 架构主管
  - `.claude/agents/抓取员.md` — 编排 hn_pull/se_pull/gh_pull 三脚本 + 监控 _logs/
  - `.claude/agents/关键词调优员.md` — 周扫 _processed/ 计算召回率/精度, 迭代 `_lib.py` POSITIVE_KEYWORDS / NEGATIVE_PATTERNS
- **依赖**: TODO-002 完成后逻辑更顺 (因为调优员要读 _processed/)
- **创建**: 2026-04-28

### TODO-102 · 重写 06_data_sources/source_weight_ladder.md
- **状态**: 待重写 (现有还是股票权重 SEC=100/Grok=50)
- **总监动作**: 派 研究主管 → 研究员
  - 新权重表: HN 高分 thread=70 / Stack Exchange high-vote=75 / GitHub Issue 高 thumbs-up=72 / Reddit verified ≥10K=60 / 普通 reddit=45 / Quora=40 / TrustPilot=50 / G2 reviews=65 / 用户自己 verbatim=85
- **创建**: 2026-04-28

### TODO-103 · 写 RAW_TEMPLATE_PAIN.md 替代现有 RAW_TEMPLATE.md
- **状态**: 现 RAW_TEMPLATE 是股票 ticker 字段; Plan B 抓取脚本已用了新 frontmatter 但模板没正式更
- **总监动作**: 派 研究员 写 `02_raw/RAW_TEMPLATE_PAIN.md`, 旧 template mv `_archive/`

---

## P2 (this quarter)

### TODO-201 · 第一个 pain SSOT 立 + 第一个 idea 提案
- **状态**: 等 pipeline 改完才能跑
- **总监动作**: 处理 inbox 中 score 最高的 5-10 条 raw → 立第一个 pain SSOT (≥3 verbatim, 跨 2 平台) → 触发 idea 提案
- **依赖**: TODO-002

### TODO-202 · 总监周报: top 10 emerging pain points + top 5 idea
- **状态**: 等首批数据
- **总监动作**: 周日跑 `信号算法员` 计算热度 → 写 `04_daily_log/YYYY-MM-DD_weekly_digest.md`
- **依赖**: TODO-201

### TODO-203 · 进化员 v1.x scorecard 权重调优
- **状态**: 6 月数据后启动
- **总监动作**: 周日扫 _processed/ + 关注 idea 命中率 → 提议权重调整 → 写 v1.x 块到 _SCORECARD.md 底部
- **依赖**: 累计 6 月真实抓取数据

---

## P3 (cleanup / nice-to-have)

### TODO-301 · GitHub PAT 拿到后扩 gh_pull.py query 至 12 条
- 现仅 6 条 query, PAT 后可加: 高赞 PR 评论 / "as a workaround" / "stack overflow" + repo bias / "I miss" 等

### TODO-302 · 加 Reddit 网页 scrape (chrome-devtools MCP) 作为 Reddit API 失败的备选
- 已有 chrome-grok / chrome-claude / chrome-chatgpt / chrome-gemini 沙箱
- 加一个 chrome-reddit-scrape 沙箱, 用 reddit.com/r/<sub>/search?q=...&sort=new 抓
- ⚠️ 限 ≤100 帖/日, 严守 `00_rules/_compliance/REDDIT_DATA_POLICY_v1.md`

### TODO-303 · 前端 dashboard (Next.js)
- pain 热度榜 + idea 评分卡 — Phase 4, 不阻塞主流程

### TODO-304 · NotebookLM 接入
- 现 chrome-gemini 沙箱里已有 notebooklm.google.com 入口
- 用法: 把 30+ pain SSOT 上传, 让 NotebookLM 跨 SSOT 找 pattern (用户访谈话术 / 共同症状词 / 跨域 pain)

### TODO-305 · 旧 stock 内容 archive 复盘
- `_archive/01_value_chain_legacy/` `03_tickers_legacy/` `08_hidden_gems_PLANNING_legacy/` 内容是否要彻底删
- 决策: 先放 6 月观察, 没用过则 mv 外置硬盘 / 删

---

## Scheduled Verbatim Window (auto-fire on warmup)

| Ticker | Event date | T+1 due | Source set | Status | Owner |
|---|---|---|---|---|---|
| | | | claude / chatgpt / grok / gemini | pending / in-flight / completed | |

> Auto-fire mechanic: at warmup, 总监 scans this table for `due_date <= today` AND `status=pending` rows → dispatches research team in parallel sandbox (per `00_rules/AI_AGENT_ISOLATION_ARCHITECTURE_v1.0.md`).

---

## Decision rules
- `[SNAPSHOT-<date>]` tag indicates session-handoff merge.
- Duplicate detection: if input task collides with existing row (same ticker + task_type), merge into existing row + cross-ref.
- TODOs older than 4 weeks with no progress → 总监 prompts user for kill / re-prioritize.
