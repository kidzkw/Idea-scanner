# AI_Semi_Research · Team Agents (v3.1)

> **v3.1 升级 2026-04-25** · 加架构部 (4 工程师), 服务 Research OS Phase 2&3

**28 个 subagent · 4 层组织架构**

```
用户
 └─ 🏢 总监 (CEO, 用户只跟我说话)
     │
     ├─ 👔 研究主管 ─┬─ 🔍 发现员       │ 找新票
     │              ├─ 🎛️ 调度员       │ (被 流水主管 顶替, 保留备用)
     │              ├─ 📝 研究员       │ 写 SSOT
     │              ├─ 🎯 打分员       │ 5 维 100 分
     │              ├─ 🎙️ 原话手       │ 高管 verbatim 三方抓
     │              ├─ 👀 社交员       │ ≥60K follower X
     │              ├─ 📂 文件员       │ SEC 8-K/10-Q/Form 4
     │              ├─ 📅 日历员       │ catalyst 日历
     │              ├─ 📓 日志员       │ daily log
     │              ├─ 🔎 索引稽查     │ _INDEX drift
     │              └─ ✔️ 承诺稽查     │ T+1 L4/L5 兑现
     │
     ├─ 👔 流水主管 ─┬─ 🚧 分诊员       │ Stage 1 看门
     │              ├─ ✂️ 提取员       │ Stage 2 提事实
     │              ├─ 🔀 对比员       │ Stage 3 对比新旧
     │              ├─ ⚖️ 规则稽查     │ Stage 4 查 §七
     │              └─ 🗄️ 归档员       │ Stage 5 归档
     │
     ├─ 👔 合规主管 ─┬─ 🕵️ 测谎员       │ WebFetch + Grep 验 claim
     │              ├─ 🧾 回执稽查     │ 查 orchestrator receipt 虚报
     │              └─ ⚠️ 一致性稽查   │ SSOT/VERBATIM/SEC 数字 drift
     │
     └─ 👔 架构主管 ─┬─ 📡 信号算法员   │ Unified Signal Engine
                    ├─ 🕸️ 图谱建模师   │ Sector-Ticker N:N 知识图
                    ├─ 🤖 自动化工程师 │ cron/webhook + Bidirectional Sync
                    └─ 🎨 前端全栈员   │ Next.js Research Canvas
```

---

## Layer 1: 用户对话入口 (1 个)

| Agent | Model | 职责 |
|---|---|---|
| `总监` | opus | 接收用户所有任务, 分类, 派给 1-3 个主管, 聚合报告 |

## Layer 2: 部门主管 (4 个, Sonnet 只路由)

| Agent | Model | 管多少人 | 接收总监 task 类型 |
|---|---|---|---|
| `研究主管` | sonnet | 11 员工 | 找票 / SSOT / 打分 / 原话 / 社交 / SEC / 日历 / 日志 / 索引 / 兑现 |
| `流水主管` | sonnet | 5 员工 | Raw 5-stage pipeline (处理 inbox 主力) |
| `合规主管` | sonnet | 3 员工 | 测谎 / 回执校验 / 一致性 sweep |
| `架构主管` | sonnet | 4 员工 | Research OS Phase 2&3: signal / graph / 自动化 / 前端 |

## Layer 3: 执行员工 (16 个 exec + 3 checker + 4 架构 = 23 个)

### 研究部 (研究主管 直属, 11 个)
| # | Agent | Model | 触发条件 |
|---|---|---|---|
| 1 | `发现员` | sonnet | 用户 "Round N scan" |
| 2 | `调度员` | sonnet | (legacy, 由 流水主管 顶替) |
| 3 | `研究员` | opus | Scorecard ≥70 / 持仓 / catalyst ≤30d |
| 4 | `打分员` | opus | 新 SSOT / 证据变化 / 季度 review |
| 5 | `原话手` | opus | 新 SSOT / 财报 48h / 访谈 / 异动 |
| 6 | `社交员` | sonnet | 财报前 1 周 / 后 48h / 异动 |
| 7 | `文件员` | sonnet | T+14 财报 / insider 异动 / 每日开盘前 |
| 8 | `日历员` | **haiku** | Step 副作用 / 会话开头 T-7/T-1 |
| 9 | `日志员` | **haiku** | Step 副作用 / 会话收尾 |
| 10 | `索引稽查` | sonnet | 会话开头/收尾 |
| 11 | `承诺稽查` | opus | 季度财报 T+1 |

### 流水部 (流水主管 直属, 5 个 · 串行 pipeline)
| Stage | Agent | Model | 职责 |
|---|---|---|---|
| 1 | `分诊员` | **haiku** | frontmatter + Rule 1/2 过滤 + truncation |
| 2 | `提取员` | sonnet | AI Industry Fit 5×4 + catalyst + 数字 + verbatim |
| 3 | `对比员` | opus | vs 最近 3 张卡 ✅🔁⚠️📊 + Source Weight 仲裁 |
| 4 | `规则稽查` | sonnet | §七-A/D 逐条 |
| 5 | `归档员` | **haiku** | SSOT append + daily_log + 移 _processed/ |

### 合规部 (合规主管 直属, 3 个 · 并行无依赖)
| Agent | Model | 触发 |
|---|---|---|
| `测谎员` | sonnet | 新 L4/L5 verbatim / Scorecard Δ≥10 / 新 SSOT / 用户 verify |
| `回执稽查` | sonnet | 每 raw 完成 Stage 6 时 |
| `一致性稽查` | sonnet | 会话收尾 + 每周日 |

### 架构部 (架构主管 直属, 4 个 · Research OS Phase 2&3, 新增 v3.1)
| Agent | Model | 职责 |
|---|---|---|
| `信号算法员` | sonnet | Unified Signal Engine — 把 SSOT/Scorecard/VERBATIM/SEC 转可订阅 signal stream |
| `图谱建模师` | sonnet | Sector-Ticker N:N 知识图 — 主题/赛道/竞品/供应链 graph schema + 查询 |
| `自动化工程师` | sonnet | cron/webhook 编排 + Bidirectional Sync (本地 ↔ GitHub ↔ Drive) |
| `前端全栈员` | opus | Next.js Research Canvas — 把 signal/graph/SSOT 可视化给用户 |

---

## 调用协议

### 用户 → 总监 (唯一入口)

```
用户: "处理 inbox"
总监: 分析 → 跨部门 task, phase 1 流水主管, phase 2 研究+合规并行
```

用户**不要**直接 `用 原话手 ...` — 应该说 `让 总监 抓 BESI 原话` 让总监路由.

(技术上仍可直接调用底层 agent, 但走总监更正式 + 有 audit trail)

### 总监 → 主管 (跨部门并行 or 串行)

| 用户 task | 总监 dispatch |
|---|---|
| "处理 inbox" | phase 1: 流水主管 (跑 pipeline) → phase 2 并行: 研究主管 (下游更新) + 合规主管 (抽检) |
| "Round N scan" | 研究主管 only |
| "新 SSOT <T>" | 研究主管 (→研究员) 并行 合规主管 (→测谎员 ready) |
| "T+1 兑现 <T>" | 研究主管 (→承诺稽查) 并行 合规主管 (→一致性稽查 <T>) |
| "会话开始" | 研究主管 (→日历员) + 合规主管 (→索引稽查) 并行 |
| "会话收尾" | 研究主管 (→日志员) + 合规主管 (→索引稽查+一致性稽查) 并行 |
| "audit" | 合规主管 only |

### 主管 → 员工 (部门内并行 when 独立)

研究主管 收到 "Phase 2 downstream updates" → 一 message 并行 5 Agent 调用 (研究员 + 打分员 + 原话手 + 日历员 + 日志员).

流水主管 收到 "process inbox" → **串行** 5 stage per raw (不能并行), 但**并行** 3 raws per batch.

合规主管 收到 "session close audit" → **并行** 3 个 checker agent.

### 聚合回流

员工 → 主管 (1-2 段 report)
主管 → 总监 (≤200-300 words summary)
总监 → 用户 (≤400 words final)

---

## 通用约束 (所有 23 agent)

每个 agent system prompt 内嵌:

1. **不依赖外部读文件来运转**: 规则 digest embed 在 prompt. 极特殊情况才 Read canonical rules.
2. **Session warmup (v2.4, 只 总监 做)**: 开会话一次读 DD_AUTHORITY_v3.2 + AGENT_OUTPUT_AUTHORITY_v2.0 + AI_AGENT_ISOLATION_ARCHITECTURE_v1.0 + VERIFICATION_TOKENS_v1, Anthropic cache 5min TTL
3. **Resilience R1a/b/c** (STEP_CONTRACTS §1):
   - R1a watchdog lock: `_processing_lock` 文件
   - R1b MCP down: `chrome-devtools list_pages` 探活 → 死切 primary-only
   - R1c 对话长/无状态: ≤5 必读 inputs, ≤800 字摘要, subagent 隔离 context
4. **硬规则 (Rule 1-5)**:
   - Rule 1 no_china_adrs
   - Rule 2 no_etfs
   - Rule 3 never_manage_positions ← **23 个 agent 输出都不得含仓位/时机/margin 语言, 主管自动 filter 员工 report**
   - Rule 4 verbatim_three_way (≥2 源才 anchor)
   - Rule 5 index_honesty
5. **Verification Tokens (v2.3 强制)**: 每 claim 必含 claim_id / source_url / source_weight / fetched_at / quote_locator / data_quality
6. **Trust Hierarchy (v2.3)**: 下游信任上游, 例外见 DD_WORKFLOW §16

---

## 模型分配 (Opus 6, Sonnet 13, Haiku 4 · 成本优化 v3.1)

### Opus 4.7 (6) — 判断/写作/用户面
- **管理层 (1)**: 总监 (用户面对面 + 跨部门 orchestration)
- **员工 (5)**: 研究员 (写作) · 打分员 (4-evidence 判断) · 原话手 (4 方仲裁) · 对比员 (Source Weight 仲裁) · 承诺稽查 (兑现判定)

### Sonnet 4.6 (13) — 路由/数据抓取/稽查
- **管理层 (3)**: 研究主管 / 流水主管 / 合规主管 (仅路由聚合, 不深思)
- **员工 (10)**: 发现员 · 调度员 (legacy) · 社交员 · 文件员 · 索引稽查 · 提取员 · 规则稽查 · 测谎员 · 回执稽查 · 一致性稽查

### Haiku 4.5 (4) — 格式化写入/规则检查
- 日历员 · 日志员 · 归档员 · 分诊员

**成本对比** (以"处理 10 raws"为例):
- 全 Opus 方案: ~100% baseline
- 当前分配: ~30-50% of baseline (省 50-70%)

---

## 快捷短语 (总监 识别)

| 用户说 | 总监路由 |
|---|---|
| "处理 inbox" / "处理 raw" / "全部" / "go" | 流水主管 → (研究主管 + 合规主管 并行) |
| "Round N scan" / "找新票 <theme>" | 研究主管 (→发现员) |
| "新 SSOT <T>" | 研究主管 + 合规主管 并行 |
| "打分 <T>" / "score" | 研究主管 (→打分员) + 合规主管 |
| "抓 <T> 原话" / "earnings call" | 研究主管 (→原话手) + 合规主管 (→测谎员) |
| "会话开始" / "status" | 研究主管 + 合规主管 并行 (session_open) |
| "会话收尾" / "收工" / "done" | 研究主管 + 合规主管 并行 (session_close) |
| "audit" / "verify" | 合规主管 only |
| "全套" / "full" | 3 主管并行最大化 |

---

## 版本历史

- **v3.1 · 2026-04-25** · 加架构部 (架构主管 + 4 工程师): 1 总监 + 4 主管 + 23 worker = 28 agent. 服务 Research OS Phase 2&3 (signal engine / graph / 自动化 / 前端)
- **v3.0 · 2026-04-24** · 加 4 层: 1 总监 + 3 主管 + 19 worker = 23 agent
- v2.0 · 2026-04-24 · 19 agent 中文改名 (Chinese role titles)
- v1.0 · 2026-04-23 · 初版 16 agent (11 Layer B + 5 Raw sub-stage)

---

## v3.0 Amendment (2026-04-24)

**This agent is updated for DD_WORKFLOW v3.0.** Key changes:

- **VERBATIM 三方 → 四方**: Add Gemini as 4th source (Claude + ChatGPT + Grok + Gemini). New `verified_quad` label = max-confidence anchor + Integrity Modifier +1. `verified_triple` (any 3-of-4) preserved as anchor-eligible (back-compat).
- **Watchdog drip default**: VERBATIM dispatch via CronCreate durable=true (1 ticker/fire/day, 90s fail-fast per source). In-session realtime is fallback only. NOT to be confused with Chrome MCP Watchdog (PowerShell schtask infrastructure).
- **AI Industry Fit 五条 replaces SanDisk 四条** (Scorecard dim 4): 5×4=20. Sub-dims = AI ecosystem / Moat / AI finance / Production+beat / R&D breakthrough. Each ≥1 evidence URL.
- **Source Weight Ladder**: Google Finance preferred (70 direct / 65 via Gemini). NotebookLM grounded = 85. Gemini Deep Research = 70. Yahoo Finance demoted to "备用" tag (still 65).
- **90s fail-fast**: Hard ceiling on `mcp__chrome-devtools__list_pages` and `evaluate_script`. On timeout → emit `mcp_fallback_waiver`, exit clean. NO inline retry. NO timeout extension.

**References**: DD_AUTHORITY_v3.2.md (consolidates DD_WORKFLOW_v2 v3.0 + STEP_CONTRACTS_v1 v1.1 + DD_ENFORCEMENT_v1 v1.1), AGENT_OUTPUT_AUTHORITY_v2.0.md (consolidates AGENT_PROMPT_TEMPLATE_v1 v1.4 + RESEARCH_BRIEF_v2.0 v2.0), VERIFICATION_TOKENS_v1.md v1.1.
