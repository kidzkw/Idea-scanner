---
file_type: dd_consolidated_authority
version: v3.2
created: 2026-04-27
supersedes: DD_WORKFLOW_v2.md (v3.1) + STEP_CONTRACTS_v1.md (v1.1) + DD_ENFORCEMENT_v1.md (v1.1)
status: active (每次会话开始必读)
authority: v3.2 覆盖以上 3 文件; 冲突以本文件为准
companions:
  - 00_rules/AI_AGENT_ISOLATION_ARCHITECTURE_v1.0.md (per-AI sandbox)
  - 00_rules/AGENT_OUTPUT_AUTHORITY_v2.0.md (prompt + SSOT schema)
  - 00_rules/SYNTHESIS_SOP_v1.0.md (synthesis 8-step)
  - 00_rules/VERIFICATION_TOKENS_v1.md
  - 00_rules/FILENAME_FORMAT_v1.md
---

# 🎯 DD Authority · v3.2 (Workflow + Enforcement + Step Contracts)

> Consolidates 3 prior files. Same content, deduped. Same authority hierarchy.
> Claude 是主观判断 + 仲裁 + 修复方. 5 AI sources 是 evidence providers, 不是 canonical writers.

---

## Part 1 · Workflow Foundation

### §0 P0 HARD RULE — 用户输入必经 总监 routing

任何用户 message → 主 Claude 第一动作必为 **总监 routing**:
1. 解析 task → 决定 phase 结构 + 目标 主管
2. 必要时 Phase 0 反问 scope
3. 通过 **Agent tool dispatch** 子 agent
4. 主线只存 receipt

主 Claude 允许直接执行 (仅 4 项):
- Tier-1 trivial reads (Read/Glob/Grep 用于 routing 决策)
- Lock file management
- Apply 已 Phase 3 审批的 inline patches
- Final ≤400-word 用户汇报

**主 Claude 禁止**: 跳 Phase 1/2/3 / 跳 总监 classification / 不走 chain 创 routine.

用户 "go"/"ok" = 对**已 staged dispatch plan 的批准**, 不绕过 plan.

---

### §1 Raw Pipeline (六阶段)

#### 1.1 文件流转
```
新 raw → 02_raw/_inbox/ → _processing/ → _processed/YYYY-MM/
                                  OR _rejected/
```

#### 1.2 命名 (FILENAME_FORMAT_v1 权威)
```
<YYYY-MM-DD>_<TICKER>_<SOURCE>_<topic-kebab-case>.md
```
- TICKER: 单票 / MULTI / MACRO / PORTFOLIO / BASKET / UNIVERSE / SCORECARD / _GLOBAL
- SOURCE: chatgpt / grok / gemini / deepseek / claude / news / research / transcript / exec / self
- 禁止: 空格 / 大写 (TICKER 除外) / 驼峰

#### 1.3 Frontmatter (强制)
```yaml
source: <see SOURCE list>
date: YYYY-MM-DD
ticker: TICKER
related_tickers: []
url: ""
topic: "一句话点题"
confidence: low|medium|high
status: raw → processed
source_weight: 0-100
data_quality: complete|partial|contradicted
primary_sources: [URL, URL]
scorecard_version: v3.0
```

#### 1.4 六阶段
1. **Triage** — frontmatter 校验 + 相关性 + truncation 检测 (Grok / Gemini "...")
2. **Extract** — 强制数值化: AI Industry Fit 五条 (URL+数值, 否则 `tentative_pending_evidence`) + Catalyst + 止损信号 + 数字事实 + L3+ 高管发言 (→ VERBATIM 队列)
3. **Diff** — vs 最近 3 张卡: ✅/🔁/⚠️/📊 + Source Weight Ladder 仲裁; 旧 verified_quad 金身, 新单源不可覆盖, 标 ⚠️ #contradiction
4. **Rule Check** — `trading_rules_*.md` §七 逐条 ✅/⚠️/❌
5. **Archive** — DeepSeek 润色 + SSOT append + daily_log 一行 + raw → _processed/ + catalyst_calendar update
6. **Handoff** — 标准 receipt

---

### §2 Universe + WATCHLIST + SSOT

#### 2.1 单一主表
`03_tickers/_INDEX.md`:
```
| Ticker | Name | Tier | Mcap | DD Priority | Scorecard | Position | SSOT? | thesis | 下 Catalyst |
```

#### 2.2 SSOT 必建条件 (任一)
- Scorecard ≥70
- 持仓 (即使 <70)
- 硬 catalyst ≤30 天 + DD-1 priority

---

### §3 Scorecard v3.0 / 7-dim v2.0 (双轨)

#### 3.1 5-dim v3.0 (legacy, 仍 active)

| Dim | 满分 | 说明 |
|---|---|---|
| Upside | 20 | bull/current ratio (5x=20, 3-5x=15, 2-3x=10, 1.5-2x=5, <1.5x=0) |
| Probability | 20 | 已 locked catalyst + 执行 track |
| Catalyst density | 20 | 12M 内 3+ 硬 trigger=20 |
| AI Industry Fit 5×4 | 20 | 5 sub-dim × 4 (生态绑定/Moat/AI 财务/量产 beat/R&D 突破) |
| Theme Differentiation | 20 | 全新 tier=20, 高度重复=0 |

每 dim 必带 **4 evidence per dim**: Source URL + Date + Numeric + Reason.
Integrity Modifier: verified_quad ≥50% → +1; 单源 ≥50% → -2.

详见 `AGENT_OUTPUT_AUTHORITY_v2.0.md` §B.4 (full dim definitions).

#### 3.2 7-dim v2.0 (升级版, RBv2 框架)
新增 dim6 财务质量 + dim7 估值锚定。详见 `AGENT_OUTPUT_AUTHORITY_v2.0.md` §C.

#### 3.3 Claude 是唯一打分权威
ChatGPT / Grok / Gemini / DeepSeek 给打分 = **不采纳, 仅参考**. Claude 自己按 §3.1 重算 + 写 Thesis Log.

---

### §4 Source Weight Ladder (v3.0 final)

| 权重 | 源 |
|---|---|
| 100 | SEC: 10-K/10-Q/8-K/Form 4/S-1 |
| 95 | 公司 IR press release |
| 90 | Earnings call transcript (Seeking Alpha / Motley Fool) |
| 85 | Tier-1 媒体 (Bloomberg/Reuters/WSJ/FT) + NotebookLM grounded |
| 75 | Tier-2 媒体 (CNBC/Barron's/MarketWatch) |
| 70 | Google Finance direct + Gemini Deep Research + Sell-side PT + 行业报告 |
| 65 | Yahoo Finance / Public.com / Google Finance via Gemini |
| 60 | ChatGPT 分析 + Gemini 常规 |
| 55 | Seeking Alpha / MotleyFool / StockTitan |
| 50 | Grok 实时 signal |
| 40 | X/Reddit (verified) |
| 30 | 分析师推文 |

**冲突仲裁**: 高权重赢 (差≥10) → 同权重时间最新赢 → Claude WebFetch primary 仲裁 → 无法仲裁标 ⚠️ #contradiction.

---

### §5 VERBATIM Authority (4-way mandatory)

#### 5.1 触发时机 (任一)
- 新 SSOT baseline / 财报 48h 内 / 投资者会议 / CNBC-Bloomberg-FT-WSJ 访谈 / X verified exec post / IR sell-side 会议 / ≥20% 单日变动

#### 5.2 4-way 角色分工

| 源 | 主用途 | 不用于 |
|---|---|---|
| Claude (主) | WebSearch/WebFetch primary 源 + 最终 SSOT 写作 + 打分 + 仲裁 | - |
| ChatGPT | 分析框架 / 估值 / 结构化枚举 | 实时信号 / insider / 精确 mcap |
| Grok | 30-90d 实时信号 / insider 10b5-1 / X 热度 / IPO | 大规模枚举 / 估值 |
| Gemini | Google Finance 实时报价 / Deep Research / NotebookLM grounded / OCR | 实时 X / 中文小众媒体. **Deep Research FORBIDDEN per v1.3** |
| DeepSeek | red-team / 反 thesis / 估值挑战 (per `AI_AGENT_ISOLATION_ARCHITECTURE_v1.0` §1) | 单源数字 (永远 quarantine-first) |

#### 5.3 数据质量标签

| Label | 含义 |
|---|---|
| `verified_quad` ⭐ | 4 源独立复现, +1 Integrity Modifier |
| `verified_triple` | 3-of-4 独立复现, anchor-eligible |
| `verified_dual` | 2 源 |
| `primary_only_pending` | 仅 Claude primary, 不作 anchor |
| `chatgpt_only` / `grok_only_unverified` / `gemini_only_unverified` | NEVER anchor |
| `contradicted` | 多源分歧, Claude 仲裁 |

**Back-compat**: v2.3 写入的 `verified_triple` 在 v3.0+ 下保持 anchor 资格.

#### 5.4 默认派遣 = Watchdog Drip
- CronCreate durable=true, 1 ticker/fire/day
- 90s fail-fast per source (不是 600s)
- 超时 → emit `mcp_fallback_waiver`, 退出 clean, 下个 cycle 重试
- Burst Mode: 一周 >2 财报时 3-4 线程并发

In-session realtime 是 fallback (用户明确要求 ad-hoc T+0).

#### 5.5 Per-AI Sandbox (v1.0 active)
所有 chrome MCP 操作通过 `_AI_PROJECTS/<source>_research/` 沙箱 + 各自 dedicated port 9223-9227.
详见 `AI_AGENT_ISOLATION_ARCHITECTURE_v1.0.md`.

---

### §6 Catalyst Calendar / Daily Log / SOCIAL / SEC (compact)

- **Catalyst Calendar** (`05_triggers/catalyst_calendar.md`): Date / Ticker / Event / Binary? / Priority / Source / SSOT link. T-7 / T-1 / T+0 / T+1 alerts. 幂等 append (dedup key=date+ticker+event).
- **Daily Log** (`04_daily_log/YYYY-MM-DD.md`): cap ≤5 alerts / ≤30 处理行 / ≤100 总行. 超量 → `_batchN.md`.
- **SOCIAL Tracker**: follower ≥60K verified accounts only. 触发: 新 SSOT 首扫 / 财报前 1 周 / 财报后 48h / ≥20% 异动.
- **SEC Tracker**: T+14 内财报 ticker (auto 建) + Scorecard ≥70 + insider (永久 active) + 事件驱动. EDGAR 403 fallback: WebSearch → IR 页 → SEC full-text. Foreign filer (BESI/TSM/ASML) → 20-F/6-K + 本国 register.

---

## Part 2 · Enforcement Gates

### §7.1 Gate A — 三 raw 文件必存

```
YYYY-MM-DD_<TICKER>_claude_verbatim-<event>.md     (mandatory)
YYYY-MM-DD_<TICKER>_chatgpt_verbatim-<event>.md    (Gate A mandatory)
YYYY-MM-DD_<TICKER>_grok_verbatim-<event>.md       (Gate A mandatory)
YYYY-MM-DD_<TICKER>_gemini_verbatim-<event>.md     (BONUS, 解锁 verified_quad)
YYYY-MM-DD_<TICKER>_deepseek_verbatim-<event>.md   (BONUS, red-team only)
```

任一 mandatory 缺 → raw 退 `02_raw/_rejected/` 原因 `three_way_triplet_missing`.

**Exemption**: pre-IPO 票 (无 earnings call) 标 `inaugural_pre_ipo`, Gate A waived; Gate B 仍生效.

### §7.2 Gate B — MCP 证据 receipt

每 worker artifact 必带 receipt JSON (bottom of report):
```json
{
  "contract_id": "DC-YYYY-MM-DD-<TICKER>-NNN",
  "ticker": "<T>",
  "event": "<e.g. Q2_FY26_earnings>",
  "worker": "<agent>",
  "mcp_evidence": {
    "chatgpt": {"list_pages_call_id":"...","evaluate_script_call_id":"...","raw_text_excerpt_sha256":"...","raw_file":"..."},
    "grok":    {"list_pages_call_id":"...","evaluate_script_call_id":"...","raw_text_excerpt_sha256":"...","raw_file":"..."},
    "gemini":  {"list_pages_call_id":"...","evaluate_script_call_id":"...","raw_text_excerpt_sha256":"...","raw_file":"..."},
    "deepseek":{"list_pages_call_id":"...","evaluate_script_call_id":"...","raw_text_excerpt_sha256":"...","raw_file":"..."},
    "claude_primary": {"websearch_or_webfetch_urls":["..."],"raw_file":"..."}
  },
  "tab_freshness_check": {"existing_msg_count": N, "action": "reused|new_tab"},
  "fabrication_logged": <row_n_or_null>,
  "mcp_fallback_waiver": null,
  "artifacts_written": ["..."]
}
```

**Hard fields**: contract_id / mcp_evidence (chatgpt+grok+claude_primary 至少) / artifacts_written.
**90s ceiling**: 每 list_pages / evaluate_script 90s 上限. timeout → emit waiver, 退出 clean. 不许 inline retry / extend.
**MCP fallback waiver**: 必含 `reason / attempted_at / mcp_list_pages_call_id / list_pages_result`. 缺 call_id → `WAIVER_FABRICATED`.

### §7.3 Gate C — 测谎员 mechanical check

```
for each (ticker, event):
    triplet = glob(claude+chatgpt+grok)
    if len < 3 AND no valid waiver:
        mark TRIPLET_MISSING; demote to data_quality=dubious_pending_recheck
    if quad_optional present:
        if sha256(gemini_first_500) == sha256(chatgpt_first_500):
            mark FABRICATED_QUAD; downgrade to verified_triple
        else mark VERIFIED_QUAD_ELIGIBLE
    if receipt missing or hash mismatch:
        mark RECEIPT_INCOMPLETE / RECEIPT_HASH_MISMATCH
    if evaluate_script_duration > 90s and no waiver:
        mark TIMEOUT_BYPASS; escalate 总监
    if waiver lacks list_pages_call_id:
        mark WAIVER_FABRICATED; escalate 总监
```

`primary_only_pending` only valid if waiver with real call_id + T+48h backfill 未过期.

### §7.4 Dispatch contract protocol

总监 dispatch message 必含:
```
contract_id: DC-YYYY-MM-DD-<TICKER>-NNN
enforcement: DD_AUTHORITY_v3.2 §7 Gates A+B+C
required_receipt_fields: [contract_id, mcp_evidence.{chatgpt,grok,claude_primary}.raw_file, list_pages_call_id, artifacts_written]
default_dispatch: watchdog_drip_croncreate_durable
fail_fast_seconds: 90
waiver_policy: mcp_fallback_waiver requires real list_pages_call_id + 48h backfill
```
主管 relay intact. Worker echoes `enforcement_contract_id: DC-...` in every file header.

### §7.5 Pre-enforcement retro

Pre-2026-04-24 8 票 (NBIS/MPWR/FLY/FN/POWL/ALAB/WOLF/NVTS) 标 `enforcement_status: pre_enforcement_v1` + 进 `_VERBATIM_BACKFILL_TRACKER.md` (next earnings T-3). 不可作 anchor for Scorecard/SSOT thesis 直到 backfill.

---

## Part 3 · Step Contracts (11 Layer B Tracks, compact)

通用 R1 (resilience baseline, see Part 4 §9). 全 step 套 §1 (六阶段, 若涉及 raw) + §2 Compliance Rules 1-5.

| # | Track | Trigger | Outputs (主) | Critical Compliance |
|---|---|---|---|---|
| 1 | Universe Scan & Discovery | 用户 "Round N scan" | `02_raw/_inbox/...UNIVERSE_claude_round-N.md` + `_WATCHLIST_ADDITIONS_PENDING.md` | Rule 1 (no China ADR), Rule 2 (no ETF) |
| 2 | Raw Intake Pipeline (6 stage) | inbox 有新文件 | SSOT Thesis Log / daily_log / _processed/ / catalyst_calendar | 全 6 stage; Extract 发现高管 → trigger Step 5 |
| 3 | SSOT Build & Maintain | Scorecard ≥70 / 持仓 / 硬 catalyst | `03_tickers/<T>.md` + `_INDEX.md` 行 | §3 raw 审计链, §5 二级管理层 |
| 4 | Scorecard Scoring | 新 SSOT / 维度新证据 / 季度 review | `_SCORECARD_2Y_3X.md` + Thesis Log + `_INDEX.md` Score 列 | §4 4-evidence-per-dim 强制 |
| 5 | VERBATIM 4-way | (见 §5.1 触发) | 4 raw + VERBATIM Thesis Log + SSOT §四/§七-A 同步 | §5 secondary exec, §6 4-way, §7 Gates A+B+C |
| 6 | SOCIAL Signal | 新 SSOT 首扫 / 财报前后 / 异动 / M&A | `02_raw/...social-scan.md` + SOCIAL Post Log | follower ≥60K verified |
| 7 | SEC Filing Tracker | T+14 财报 / Scorecard ≥70+insider / 事件 / Daily 48h 扫 | SEC Filing Log + INSIDER 警报 + 8-K → 新 raw | SEC=Source 100; foreign filer 双轨 |
| 8 | Catalyst Calendar 维护 | Step 2/5/7 副作用 + 会话开头 T-7/T-1 | `catalyst_calendar.md` 排序 + upcoming_triggers.md | 每行 7 字段; 幂等 dedup key=date+ticker+event |
| 9 | Daily Log | Step 2 副作用 + 会话收尾 | `04_daily_log/<date>.md` (≤100 行) | cap; ≥5 警报建议 focused review |
| 10 | Index Honesty Audit | `03_tickers/` 改 / 用户 "audit" | `_AUDITS/<date>_index_audit.md` | Rule 5 index_honesty 核心 |
| 11 | Earnings Reconciliation | 季度 T+1 / Step 8 catalyst T+1 | VERBATIM ✅/⚠️/❌ + Thesis Log 胜率 δ + 通胀警报 | §5 兑现追踪 |

**全局依赖图**:
```
Step 1 → Step 2 → (内 6 stage)
                    ├── Step 3 SSOT
                    ├── Step 4 Scorecard
                    ├── Step 5 VERBATIM ◀── Step 8 T-0/T+1
                    ├── Step 6 SOCIAL ◀── Step 8 T-1 week
                    ├── Step 7 SEC ◀── Step 8 T-1/T+3/T+45
                    ├── Step 8 Catalyst
                    ├── Step 9 Daily Log
                    └── Step 11 Reconciliation ◀── Step 8 T+1

Step 10 Audit ── session open + close (独立)
```

每 step 完整 Trigger / Inputs / Outputs / Compliance / Handoff / Resilience 见 archive `00_rules/_archive/STEP_CONTRACTS_v1.md` (历史参考, 不再 active).

---

## Part 4 · Universal Resilience + Forbidden + Warmup

### §9 Resilience Baseline (R1)

**R1a · Watchdog**: step 开始写 `_processing_lock` (一行 `step=N ticker=T started=ISO stage=k`), 结束移除. 会话开头扫 stale lock (>30 min) → 报告用户, 不静默清理.

**R1b · Chrome MCP down / 90s fail-fast**:
- fire 前 list_pages 探活
- **每 list_pages 90s 上限**, 每 evaluate_script 90s 上限
- 超时 → emit `mcp_fallback_waiver` (per §7.2), 退出 clean
- 死 / 超时 → 切 primary-only (Claude WebSearch 独立)
- 禁止 chatgpt_only / grok_only_unverified / gemini_only_unverified / deepseek_only 作 anchor

**R1c · 单次对话过长**:
- 每 step 无状态可重入, 只读文件恢复
- 单 step ≤800 字摘要 + ≤3 文件写入, 超则拆子任务
- 调度优先 subagent, 主线只存 receipt

**R1d · Watchdog drip default**:
- VERBATIM 默认 = CronCreate durable=true, 1 ticker/fire/day
- durable=true Claude 重启后存活
- chrome MCP reach 必须 local Claude harness 活时 fire
- in-session realtime 仅 fallback (ad-hoc), 同样 90s
- 不混淆: Chrome MCP Watchdog (PowerShell schtask 5 min, 维护 chrome:9222 实例) ≠ Watchdog drip (CronCreate, VERBATIM fetcher)

### §10 禁止事项

- ❌ Grok / Gemini 单轮 >100 ticker 枚举 (必 truncate)
- ❌ 未引用 Source URL 给 Scorecard 打分
- ❌ 跳过 6 stages 直接写 SSOT
- ❌ exec 发言 paraphrase 后存 VERBATIM (必须原话)
- 🚨 ❌ 新建 SSOT / earnings event 不跑四方并行 VERBATIM
- ❌ 单日 daily_log >100 行不分批
- ❌ 忽略 catalyst_calendar T-1 提示
- ❌ ChatGPT / Grok / Gemini / DeepSeek 打分直接采信
- 🚨 ❌ Disable / extend 90s fail-fast on list_pages / evaluate_script
- 🚨 ❌ AI Industry Fit 评分凭印象 (必 evidence URL + 数值)
- 🚨 ❌ 任何建仓/减仓/仓位$/时机/margin 建议 (Rule 3)
- 🚨 ❌ Chinese ADRs / 中国大陆私企 (Rule 1)
- 🚨 ❌ AI source 直接编辑 canonical SSOT (per AI_AGENT_ISOLATION_ARCHITECTURE_v1.0)

### §11 Session Warmup

会话开始必读 (prefix-cache):
1. `00_rules/DD_AUTHORITY_v3.2.md` (本文件)
2. `00_rules/AI_AGENT_ISOLATION_ARCHITECTURE_v1.0.md`
3. `00_rules/AGENT_OUTPUT_AUTHORITY_v2.0.md`
4. `_AUDITS/_总监_战略建议队列.md`
5. `_AUDITS/_FABRICATION_LOG.md` (pattern 警报)
6. `05_triggers/catalyst_calendar.md` (今日 ±14 天)
7. `04_daily_log/最新.md`
8. `memory/MEMORY.md`
9. `03_tickers/_SCORECARD_2Y_3X.md` Top 20

简述当前状态 1-2 行后再做事.

---

## 修订日志

- **v3.2 · 2026-04-27** · CONSOLIDATION: 合并 DD_WORKFLOW_v2 (v3.1) + STEP_CONTRACTS_v1 (v1.1) + DD_ENFORCEMENT_v1 (v1.1) 为单一 authority. 同步引入 5-AI sandbox (DeepSeek 第 5 源), Receipt 加 fabrication_logged + tab_freshness_check 字段. 旧 3 文件 archive 到 `_archive/`.
- v3.1 · 2026-04-25 · 增设架构部 + Research OS Phase 2&3 蓝图
- v3.0 · 2026-04-24 · MAJOR: 4-way (加 Gemini), Watchdog drip default, AI Industry Fit 五条, Source Weight Ladder 加 Google/NotebookLM
- v2.3 · 2026-04-24 · Verification Tokens + 3 checker + Trust Hierarchy + Session Warmup
- v2.0 · 2026-04-22 · 10 大修复 + VERBATIM + Source 权重梯 + Catalyst 日历
- v1.0 · 2026-04-21 · 初始
