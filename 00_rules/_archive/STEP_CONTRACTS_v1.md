---
file_type: authoritative_step_contracts
version: v1.1
created: 2026-04-23
last_updated: 2026-04-24 (v1.0 → v1.1: Step 5 watchdog drip default + R1b 90s fail-fast + R1d new + 三方→四方)
authority: DD_WORKFLOW_v2.md v3.0 + AGENT_PROMPT_TEMPLATE_v1.md v1.1
purpose: 把 workflow 拆成 11 个 Layer B tracks 的 step contract, 作为未来 team agent prompt 的直接输入
status: active
owner: Claude (Opus 4.7)
---

# Step Contracts v1.0 · AI_Semi_Research Workflow

> **用途**: 每个 step 的 5 字段合同 (Trigger / Inputs+Outputs / Compliance / Handoff / Resilience), 在建 team agent 前锁死接口.
> **粒度选择**: Layer B (11 独立 track), Step 2 内嵌 DD_WORKFLOW §1 的 6 stage, 暂不拆子 agent.
> **本文件变化须 bump 版本 + 同步 MEMORY.md reference**

---

## 0. 总览

| # | Track | DD_WORKFLOW_v2 位置 | 独立性 | 预估时长 |
|---|-------|--------------------|--------|----------|
| 1 | Universe Scan & Discovery | §2 | 独立 | 长 |
| 2 | Raw Intake Pipeline (内含 6 stage) | §1 | 依赖 inbox | 中 |
| 3 | SSOT Build & Maintain | §2.3 | 依赖 raw/scorecard | 长 |
| 4 | Scorecard Scoring | §3 | 依赖 SSOT+evidence | 中 |
| 5 | VERBATIM 三方抓取 | §5 | 依赖 earnings event | 长 |
| 6 | SOCIAL Signal Tracker | §5b | 独立 per ticker | 中 |
| 7 | SEC Filing Tracker | §5c | T+14 window | 中 |
| 8 | Catalyst Calendar 维护 | §6 | raw archive 副作用 | 短 |
| 9 | Daily Log | §7 | raw processing 副作用 | 短 |
| 10 | Index Honesty Audit | §12 + feedback | 独立 | 短 |
| 11 | Earnings Reconciliation (L4/L5 兑现) | §5.5 | 季度节奏 | 中 |

---

## 1. 通用约束 (所有 step 共享)

### R1 · Resilience 基线

**R1a · Watchdog**
- step 开始写 `_processing_lock` (一行 `step=<N> ticker=<T> started=<ISO> stage=<k>`) 到该 step 工作目录
- 正常结束移除
- 会话开头扫 stale lock (>30 min) → 报告用户, 不静默清理

**R1b · Chrome-devtools MCP down 降级 / 90s fail-fast** (track 5/6/11) ⭐v1.1
- fire 前 `mcp__chrome-devtools__list_pages` 探活
- **每个 list_pages call 90 s 上限**; 每个 evaluate_script 90 s 上限
- 90s 超时 → emit `mcp_fallback_waiver` (per DD_ENFORCEMENT v1.1 §2 Gate B), 退出 clean
- 不允许 inline retry / 不允许 extend timeout (测谎员 通过 timestamp delta 检测 bypass)
- 死 / 超时 → 切 primary-only (Claude WebSearch/WebFetch 独立跑)
- VERBATIM 下 output 必带 `data_quality: primary_only_pending`, 写入 `03_tickers/VERBATIM/_VERBATIM_BACKFILL_TRACKER.md`
- 禁止 `chatgpt_only` / `grok_only_unverified` / `gemini_only_unverified` 作 anchor

**R1d · Watchdog drip default for VERBATIM** ⭐v1.1
- VERBATIM 默认派遣机制 = CronCreate durable=true scheduled local cron, 1 ticker/fire/day
- 不依赖 active interactive Claude session — durable=true 在 Claude 重启后存活
- chrome-devtools MCP reach 必须 local Claude harness 活时 fire (RemoteTrigger 不行)
- In-session realtime 仅作 fallback (用户明确要求 ad-hoc), 同样 90s fail-fast
- 生产 spec: `_AUDITS/2026-04-24_watchdog_backfill_routing_spec.md`
- 不要混淆: Chrome MCP Watchdog (PowerShell schtask) ≠ watchdog drip (CronCreate). 见 DD_WORKFLOW v3.0 §5.4.3.

**R1c · 单次对话时间过长**
- 每 step 无状态可重入, 只靠读文件恢复上下文
- inputs 明列 ≤5 个必读文件
- 单 step budget: ≤800 字摘要 + ≤3 文件写入, 超则拆子任务
- 调度优先走 subagent, 主线只存 receipt

### R2 · 全局合规
所有 step 套用 `AGENT_PROMPT_TEMPLATE_v1.md` §1 (六阶段, 若涉及 raw) + §2 (Rule 1-5: no_china_adrs / no_etfs / never_manage_positions / verbatim_three_way / index_honesty).

---

## Step 1 · Universe Scan & Discovery

**Trigger**: 用户 "Round N scan" / "扩 universe" (非自动)

**Inputs**:
- `03_tickers/_INDEX.md`
- `03_tickers/_WATCHLIST_ADDITIONS_PENDING.md`
- `03_tickers/_TAXONOMY.md`

**Outputs**:
- `02_raw/_inbox/YYYY-MM-DD_UNIVERSE_claude_round-N.md`
- `03_tickers/_WATCHLIST_ADDITIONS_PENDING.md` append

**Compliance**: §1, §2 (Rule 1 中国 ADR / Rule 2 ETF 过滤最关键), §7, §8

**Handoff**:
- 产 raw → 触发 Step 2
- 重复 ticker → flag, 不作新发现

**Resilience**:
- lock 放 `02_raw/_inbox/`
- >100 ticker 必分批, 禁用 Grok (DD_WORKFLOW §9.2)
- 每 tier 1 raw, 不合并

---

## Step 2 · Raw Intake Pipeline (内含 6 stage)

**Trigger**: `02_raw/_inbox/` 有新文件, 或用户 "处理 inbox" / "全部"

**Inputs**:
- `02_raw/_inbox/<filename>.md`
- `03_tickers/<TICKER>.md`
- `00_rules/trading_rules_*.md`
- `05_triggers/catalyst_calendar.md`

**Outputs**:
- `03_tickers/<TICKER>.md` Thesis Log append
- `04_daily_log/YYYY-MM-DD.md` 一行
- `02_raw/_processed/YYYY-MM/<filename>.md` (status=processed)
- `05_triggers/catalyst_calendar.md` (若新 catalyst)

**内部 6 stage** (DD_WORKFLOW §1.4):
1. Triage — frontmatter 校验 + Grok truncation 检测
2. Extract — AI Industry Fit 五条 (强校验 URL+数值) / Catalyst / §七-A 信号 / 拦截 L3+ 高管发言 (→ 触发四方 VERBATIM 队列)
3. Diff — vs 最近 3 张卡, ✅/🔁/⚠️/📊 + 严格按 v3.0 Source Weight 阶梯仲裁 (保护 verified_quad 不被单源覆盖)
4. Rule Check — §七 逐条 ✅/⚠️/❌
5. Archive — DeepSeek 词语优化与润色 + SSOT + daily_log + _processed/ + catalyst_calendar
6. Handoff — 标准回执

**Compliance**: §1 (全 6 stage), §2, §7, §8
- Extract 发现高管发言 → 触发 Step 5

**Handoff**: receipt = `{raw, ticker, stages_done:[1..6], ssot_delta, catalyst_new, verbatim_queued, daily_log_row}`
- catalyst_new → Step 8
- verbatim_queued → Step 5

**Resilience**:
- lock 每进 stage 更新 `stage=N`
- 幂等: Archive 按 raw_id 去重, 重启从 last stage 继续
- MCP down: Extract 高管发言走 primary-only + backfill tracker
- 每条 raw 独立 subagent

---

## Step 3 · SSOT Build & Maintain

**Trigger** (任一):
- Scorecard ≥70 (新晋)
- 持仓 (即使 <70)
- 硬 catalyst ≤30 天 + DD-1
- 用户指定

**Inputs**:
- `03_tickers/_template/` (若存在) / 否则参考 POET.md or BESI.md
- `02_raw/_processed/**/*<TICKER>*.md`
- `03_tickers/VERBATIM/<TICKER>_verbatim.md`
- `03_tickers/SEC/<TICKER>_sec.md` (if exists)
- `03_tickers/SOCIAL/<TICKER>_social.md` (if exists)

**Outputs**:
- `03_tickers/<TICKER>.md` (新建 / 更新 §Thesis Log)
- `03_tickers/_INDEX.md` 一行 (首次建)

**Compliance**: §1, §2, §3 (raw 审计链), §5 (earnings-related 走二级管理层), §7, §8

**Handoff**:
- v1.0 finalize → Step 4 Scorecard
- 首次建 → Step 5 VERBATIM baseline

**Resilience**:
- lock `03_tickers/` 带 `ticker phase=draft|v1.0|merged`
- 分节写入 (§一..§七), 每节独立 append
- MCP down: v1.0 draft 可发, 标 `data_completeness: partial`
- 每 SSOT 独立 subagent

---

## Step 4 · Scorecard Scoring

**Trigger**:
- 新 SSOT finalize (首次)
- 5 维任一维有新证据
- 季度 review

**Inputs**:
- `03_tickers/<TICKER>.md` §二/§四/§五
- `03_tickers/_SCORECARD_2Y_3X.md`
- `05_triggers/catalyst_calendar.md`
- `03_tickers/_INDEX.md`

**Outputs**:
- `03_tickers/_SCORECARD_2Y_3X.md` 新/更新行
- `03_tickers/<TICKER>.md` §Thesis Log (Scorecard δ + 4-evidence per dim)
- `03_tickers/_INDEX.md` Scorecard 列

**Compliance**: §1, §2, **§4 (4-evidence-per-dim 强制)**, §7, §8

**Handoff**:
- Scorecard ≥70 + 无 SSOT → 回 Step 3
- 降 ≥10 → `_AUDITS/` + 通知
- DD-0/DD-1 分数变化 → 更新 `_INDEX.md` DD Priority

**Resilience**:
- lock 旁 `03_tickers/_SCORECARD_*`
- 每维独立, 重启读 Thesis Log 最后一维续
- MCP 不影响 (只用已归档证据)
- 一次一 ticker

---

## Step 5 · VERBATIM 四方抓取 (v3.0) ⚠️ Resilience 最关键

**Trigger** (任一, DD_WORKFLOW §5.4):
- 新 SSOT baseline
- 财报 48h 内
- 投资者会议 (CES/OFC/GTC/...)
- CNBC/Bloomberg/FT/WSJ 电视访谈
- X verified exec 新 post
- ≥20% 单日异动
- 用户指定

**Inputs**:
- `03_tickers/VERBATIM/<TICKER>_verbatim.md`
- `03_tickers/VERBATIM/_VERBATIM_INDEX.md`
- `03_tickers/VERBATIM/_SECONDARY_EXEC_GAP.md`
- `03_tickers/VERBATIM/_VERBATIM_BACKFILL_TRACKER.md`

**Outputs**:
- `02_raw/_processed/YYYY-MM/YYYY-MM-DD_<TICKER>_claude_verbatim-<event>.md` (mandatory)
- `02_raw/_processed/YYYY-MM/YYYY-MM-DD_<TICKER>_chatgpt_verbatim-<event>.md` (Gate A mandatory)
- `02_raw/_processed/YYYY-MM/YYYY-MM-DD_<TICKER>_grok_verbatim-<event>.md` (Gate A mandatory)
- `02_raw/_processed/YYYY-MM/YYYY-MM-DD_<TICKER>_gemini_verbatim-<event>.md` (optional, unlocks verified_quad) ⭐v1.1
- `03_tickers/VERBATIM/<TICKER>_verbatim.md` Thesis Log append
- `03_tickers/<TICKER>.md` §四 Catalyst / §七-A (L4/L5 同步)

**Compliance**: §1, §2, §3, **§5 (二级管理层)**, **§6 (四方并行 v3.0)**, §7, §8 + §9 (DD_ENFORCEMENT v1.1 Gates A+B+C)

**Handoff**:
- 每 quote 带 `data_quality` (verified_quad ⭐ / verified_triple / verified_dual / primary_only_pending / chatgpt_only / grok_only_unverified / gemini_only_unverified / contradicted)
- verified_quad → +1 Integrity Modifier per Scorecard §3.2 v3.0
- L4/L5 → Step 3 SSOT §四 / §七-A 更新
- primary_only_pending → backfill tracker

**Resilience**:
- **MCP down 协议 (R1b v1.1)**: 探活 → 90s fail-fast → emit waiver → primary-only + backfill, 不阻塞
- **默认机制 (R1d)**: watchdog drip CronCreate durable=true, 1 ticker/fire/day, 不依赖 active session
- lock `03_tickers/VERBATIM/` 带 `ticker/event/mcp_state/stage=claude|chatgpt|grok|merge`
- **三方用 3 subagent 独立跑**, 主线不载 context
- 任一 done 先落 raw, 重启合并
- 合并/仲裁阶段独立 subagent

---

## Step 6 · SOCIAL Signal Tracker

**Trigger**: 新 SSOT 首扫 / 财报前 1 周 / 财报后 48h / ≥20% 异动 / M&A-IPO 后

**Inputs**:
- `03_tickers/SOCIAL/<TICKER>_social.md`
- `03_tickers/SOCIAL/_SOCIAL_INDEX.md`
- `03_tickers/<TICKER>.md`

**Outputs**:
- `02_raw/_processed/YYYY-MM/YYYY-MM-DD_<TICKER>_claude_social-scan.md`
- `03_tickers/SOCIAL/<TICKER>_social.md` Post Log append
- 新数据 post → 触发 Step 2 verify

**Compliance**: §1, §2, §3, §7, §8
+ **follower ≥60K verified 才采信** (DD_WORKFLOW §5b.2)

**Handoff**:
- 新数据 post → 新 raw → Step 2
- sentiment shift → `<TICKER>.md` Thesis Log 一行

**Resilience**:
- lock `03_tickers/SOCIAL/`
- MCP down fallback: WebSearch `from:verified` + `min_faves:`
- 一次一 ticker

---

## Step 7 · SEC Filing Tracker

**Trigger**:
- T+14 内财报 ticker (自动建)
- Scorecard ≥70 + insider 异动 (永久 active)
- 事件驱动 (M&A / guidance 撤回 / exec 变动)
- Daily 开盘前 48h 扫

**Inputs**:
- `03_tickers/SEC/<TICKER>_sec.md`
- `03_tickers/SEC/_SEC_INDEX.md`
- `05_triggers/catalyst_calendar.md`

**Outputs**:
- `03_tickers/SEC/<TICKER>_sec.md` Filing Log append
- `03_tickers/SEC/_SEC_INDEX.md` insider 警报
- Form 4 / 8-K Item 1.01 / SC 13G/D → 新 raw to `02_raw/_inbox/`
- `05_triggers/catalyst_calendar.md` SEC link 附加

**Compliance**: §1, §2, §3, §7, §8
+ SEC = Source Weight 100 (DD_WORKFLOW §4.3)
+ Foreign private issuer (BESI/TSM/ASML) 走 20-F/6-K + 本国 register

**Handoff**:
- Insider ≥$1M → 紧急 raw → Step 2
- 10-Q ≠ press release → `_AUDITS/` 警报
- 新 8-K M&A → Step 3 §四 update

**Resilience**:
- lock `03_tickers/SEC/` 带 `filing_type/CIK`
- **EDGAR 403 fallback** (DD_WORKFLOW §5c.6): WebSearch → IR 页 → SEC full-text search → 手贴
- MCP 不影响
- Daily 扫 ≤10 ticker/batch

---

## Step 8 · Catalyst Calendar 维护

**Trigger**:
- Step 2 Archive 发现新日期
- Step 5 L4/L5 提到 milestone
- Step 7 SEC filing 附日期
- 会话开头 T-7/T-1 alert 检查

**Inputs**:
- `05_triggers/catalyst_calendar.md`
- 触发方传入新事件

**Outputs**:
- `05_triggers/catalyst_calendar.md` 按日期正序插入
- T-1/T-7 → `05_triggers/upcoming_triggers.md` / morning brief

**Compliance**: §1, §2, §7, §8
+ 每行: Date / Ticker / Event / Binary? / Priority / Source / SSOT link

**Handoff**:
- T-1 → Step 5 pre-earnings VERBATIM + Step 7 SEC T-1 扫
- T+0 → Step 7 8-K + Step 5 post-earnings verbatim
- T+1 → Step 11 Reconciliation

**Resilience**:
- 幂等 append (dedup key = date+ticker+event)
- 步骤本身短, 非瓶颈

---

## Step 9 · Daily Log

**Trigger**: Step 2 Archive 副作用 + 会话收尾

**Inputs**:
- `04_daily_log/YYYY-MM-DD.md` (若存在)
- Step 2 receipt

**Outputs**:
- `04_daily_log/YYYY-MM-DD.md` (≤100 行)
- 超量: `04_daily_log/YYYY-MM-DD_batchN.md`

**Compliance**: §1, §2, §7, §8
+ Cap: ≤5 警报 / ≤30 处理行 / ≤100 总行 (DD_WORKFLOW §7.1)

**Handoff**:
- 警报 ≥5 → 建议 focused review
- §七 ❌ → 显眼标

**Resilience**:
- lock 带 `date=YYYY-MM-DD`
- 幂等 append (dedup by raw_id)

---

## Step 10 · Index Honesty Audit

**Trigger**: 事件驱动 (Event-Driven) — 仅当检测到 `03_tickers/` 下有 File Modified 或 Git-diff 变更时自动触发，或者用户手动 "audit"

**Inputs**:
- `03_tickers/_INDEX.md`
- `03_tickers/*.md` (实际文件)
- `03_tickers/VERBATIM/_VERBATIM_INDEX.md`
- `03_tickers/SEC/_SEC_INDEX.md`
- `03_tickers/SOCIAL/_SOCIAL_INDEX.md`
- `_AUDITS/` 历史

**Outputs**:
- `_AUDITS/YYYY-MM-DD_index_audit.md` (若 drift)
- `03_tickers/_INDEX.md` (修正 ✅/❌)

**Compliance**: §1, §2 (**Rule 5 index_honesty 核心**), §7, §8

**Handoff**:
- 开头: 简述 drift count 作 context
- 收尾: 新建 SSOT 未入 _INDEX → 补
- drift ≥3 → 建议专场清理

**Resilience**:
- read-only + 少量修正, 低中断风险
- 放会话最前/最后, 不占主线

---

## Step 11 · Earnings Reconciliation (L4/L5 兑现)

**Trigger**: 季度财报 T+1, 或 Step 8 catalyst T+1 hit

**Inputs**:
- `03_tickers/VERBATIM/<TICKER>_verbatim.md` (4 季度 L4/L5)
- `03_tickers/SEC/<TICKER>_sec.md` (10-Q/8-K 数字)
- `03_tickers/<TICKER>.md`

**Outputs**:
- `03_tickers/VERBATIM/<TICKER>_verbatim.md` 每 L4/L5 标 ✅/⚠️/❌
- `03_tickers/<TICKER>.md` §Thesis Log (兑现 + Scorecard 胜率 δ)
- `_AUDITS/` "exec 语言通胀" 警报 (若 ❌ 多)

**Compliance**: §1, §2, §5, §7, §8

**Handoff**:
- ❌ → Step 4 胜率 -1~2 阶
- ✅ → Step 4 胜率 +1~2 阶
- 跨季度 pattern → `_VERBATIM_INDEX.md` tone trend

**Resilience**:
- lock 带 `ticker/quarter`
- 每 L4/L5 独立幂等
- 批量走多 subagent, 一次一 ticker

---

## 全局依赖图

```
Step 1 Universe ──▶ Step 2 Raw Intake ──▶ (6 stages)
                                           ├── Step 3 SSOT
                                           ├── Step 4 Scorecard
                                           ├── Step 5 VERBATIM ◀── Step 8 T-0/T+1
                                           ├── Step 6 SOCIAL   ◀── Step 8 T-1 week
                                           ├── Step 7 SEC      ◀── Step 8 T-1/T+3/T+45
                                           ├── Step 8 Catalyst
                                           ├── Step 9 Daily Log
                                           └── Step 11 Reconciliation ◀── Step 8 T+1

Step 10 Audit ── session open + close (独立)
```

---

## Agent prompt 起草模板 (未来用)

建 team agent 时, 每个 agent prompt 最小结构:

```
You are the <Step N> agent for AI_Semi_Research.

## Contract
- Trigger: <copy 本文 Step N Trigger>
- Inputs: <copy 本文 Step N Inputs>
- Outputs: <copy 本文 Step N Outputs>
- Compliance: 强制套用 AGENT_PROMPT_TEMPLATE_v1.md <§N 清单> + DD_WORKFLOW_v2.md 相关节
- Handoff: <copy 本文 Step N Handoff>
- Resilience: R1a/R1b/R1c (见 STEP_CONTRACTS_v1.md §1 通用约束)

## 工作
<具体任务 / ticker / event>

## Report format
AGENT_PROMPT_TEMPLATE §8.
```

---

## 修订日志

- **v1.0 · 2026-04-23** · 初版, 11 Layer B tracks + R1a/b/c resilience 基线. 来自 plan `workflow-agent-wondrous-treasure.md`.
- **v1.1 · 2026-04-24** · Step 5 三方→四方加 Gemini; R1b 90s fail-fast 强化; R1d 新增 watchdog drip default. 配合 DD_WORKFLOW v3.0.
