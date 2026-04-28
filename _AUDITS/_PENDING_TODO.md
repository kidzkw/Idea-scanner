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

### TODO-204 · 第一次端到端 PoC — 让 调度员 处理 inbox 5 条
- **状态**: 待启动 (P0-002 ✅ + P1-101/102/103 ✅ 全部完成)
- **触发**: 用户说 "处理 inbox" / "处理 5 条试试"
- **总监动作**: 派 调度员 → 选 inbox 中 engagement_score 最高的 5 条 → 跑 5 阶段 pipeline → 报告
- **预期产出**: 1-2 个 pain SSOT (status: provisional, 单源待 原话手 跨源补) + 5 条 raw 进 _processed/
- **依赖**: 无
- **创建**: 2026-04-28

### TODO-001 · ⚠️ 用户 revoke 旧 PAT + 重生成
- **状态**: PAT 已在 chat 暴露; 必须 revoke
- **触发**: session 结束前
- **用户动作**: https://github.com/settings/tokens → revoke `ai_reddit_pain_miner` → 重生 → 更新 `.env`
- **依赖**: 无
- **创建**: 2026-04-28

---

## P1 (this week)

### TODO-104 · 验证 11 agent prompt 在真实 raw 上的行为
- **状态**: agent prompt 已重写, 但还没跑过实际 raw
- **触发**: TODO-204 跑完后, 看 5 阶段是否符合预期
- **总监动作**: 检查 `04_daily_log/<date>.md` + `_processed/<month>/` 实际产出, 反推 agent prompt 是否要细调
- **依赖**: TODO-204

### TODO-105 · 重写剩余 stock-specific agent prompt (架构 / 合规 / 流水主管 / 研究主管 / 信号算法员 / 自动化工程师 / 进化员 / 测谎员 / 回执稽查 / 一致性稽查 / 日历员 / 日志员 / 承诺稽查 / 发现员 / 社交员 / 图谱建模师 / 前端全栈员 / 总监)
- **状态**: 11 个核心 agent 已改, 剩余 ~17 个还是 stock-DD 描述; 多数 routing-only / read-heavy, 影响小但不一致
- **触发**: 用户优先级排序后
- **依赖**: 无 (可分批做)

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
