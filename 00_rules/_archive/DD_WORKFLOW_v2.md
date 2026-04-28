---
file_type: authoritative_workflow
version: v3.1
created: 2026-04-22 (v2.0 baseline)
last_updated: 2026-04-25 (v3.0 → v3.1: 增设架构部，引入 Research OS Phase 2&3 蓝图)
supersedes: v2.0 / v2.1 / v2.2 / v2.3 / v3.0
status: active (每次会话开始必读)
owner: Claude (Opus 4.7)
authority: v3.1 覆盖 v1.0-v3.0, 冲突以 v3.1 为准
companions:
  - 00_rules/STEP_CONTRACTS_v1.md (v1.1+)
  - 00_rules/AGENT_PROMPT_TEMPLATE_v1.md (v1.1+)
  - 00_rules/VERIFICATION_TOKENS_v1.md (v1.1+)
  - 00_rules/DD_ENFORCEMENT_v1.md (v1.1+)
---

# 🎯 AI_Semi_Research DD Workflow · v3.1

> **核心原则**: Claude 是主观判断方 + 最终仲裁方 + 修复方. ChatGPT/Grok/Gemini 是输入不是权威.
> **触发**: 每次会话开始先读此文件, 不靠脑内缓存.
> **v3.0 定位**: major / breaking. 升级路径见 §修订日志 v3.0 entry.

---

## §0 P0 HARD RULE — 用户输入必经 总监 routing

**任何**用户 message (问题 / 命令 / 单字 "go"/"ok"/"继续"/确认 / 闲聊) → 主 Claude 第一动作必为 **总监 routing classification**:

1. 解析 task → 决定 phase 结构 + 目标 主管
2. 必要时 Phase 0 反问 scope
3. TaskCreate 反映 phase 计划
4. 通过 **Agent tool dispatch** 子 agent (general-purpose acting as <主管>), 不主 Claude 直接干

**主 Claude 允许直接执行的 (仅这 4 项)**:
- Tier-1 trivial reads (单 Read/Glob/Grep 用于 routing 决策)
- Lock file management (`_AUDITS/_lock_总监_session.txt`)
- Apply 已 Phase 3 审批的 inline patches
- Final ≤400-word 用户汇报

**主 Claude 禁止**:
- 跳 Phase 1 dispatch 直接干研究/分析
- 跳 Phase 2 audit 直接 apply 规则/agent/routine 改动
- 跳 总监 classification 直接 TaskCreate+Bash 干活
- /schedule / RemoteTrigger 创 routine 不走 chain

用户 "go"/"ok" = 对**已 staged dispatch plan 的批准**, 立即按 plan dispatch, 不绕过 plan 自己干.

详见 `memory/feedback_总监_routes_everything.md`. Violation tracked with timestamp.

---

## 0. v3.0 对 v2.3 的 4 大变更 (breaking)

| # | v2.3 状态 | v3.0 变更 |
|---|---|---|
| 1 | VERBATIM 三方并行 (Claude/ChatGPT/Grok); `verified_triple` 是最高 anchor 标 | **四方并行** (加 Gemini); 新增 `verified_quad` 作 BONUS 层 (+1 Integrity Modifier); `verified_triple` 保持 anchor-eligible (back-compat) |
| 2 | VERBATIM 默认 in-session interactive run; 600s 超时常 hang | **Watchdog drip 为默认** (CronCreate durable=true, 90s 每源 fail-fast); in-session 降级为 fallback |
| 3 | Scorecard 维度 4 = SanDisk 四条 (20 = 4×5) | **AI Industry Fit 五条** (20 = 5×4): AI 生态 / Moat / AI 财务 / 量产+beat / R&D 突破 |
| 4 | Source Weight Ladder 含 Yahoo Finance 65; 不含 Google Finance | **新增 Google Finance** (direct via MCP 70 / via Gemini 65) + NotebookLM 85 + Gemini Deep Research 70 + Gemini regular 60; Yahoo 标"备用" |

---

## 1. Raw Pipeline (六阶段, v3.0)

### 1.1 文件流转 (与 v1.0 同)

```
新 raw → 02_raw/_inbox/ → _processing/ → _processed/YYYY-MM/
                                  OR
                              _rejected/ (带原因)
```

### 1.2 命名 (严格)

> **权威**: `00_rules/FILENAME_FORMAT_v1.md` (v1.0, 2026-04-25 总监统一决策)
> 本节为概要, 完整规则/正则/migration script 见上面 spec 文件。

```
<YYYY-MM-DD>_<TICKER>_<SOURCE>_<topic-kebab-case>.md
```

- `TICKER`: 单票代码 / `MULTI` / `MACRO` / `PORTFOLIO` / `BASKET` / `UNIVERSE` / `SCORECARD` / `_GLOBAL`
- `SOURCE`: `chatgpt` / `grok` / `gemini` ⭐新 / `claude` / `news` / `research` / `transcript` / `exec` / `self` / `autofetch`
- `topic-kebab-case`: 3-6 词小写, e.g. `pre-earnings-verbatim`, `q1-fy26-verbatim-retrofit`
- 禁止旧 v3.0 临时格式 `<source>_<TK>_pre_earnings_verbatim_<date>.md` — 已 100 inbox + 6 processed 全 rename 2026-04-25
- Intraday HHMM 例外: `<date>_<HHMM>_<TK>_<src>_<topic>.md` (见 FILENAME_FORMAT_v1.md §4)
- **禁止**: 空格 / 大写 TICKER 以外字符 / 驼峰命名

### 1.3 Frontmatter (v3.0 增强)

```yaml
---
source: chatgpt | grok | gemini | claude | news | research | transcript | exec | self
date: YYYY-MM-DD                    # 事件日, 非入库日
ticker: TICKER
related_tickers: [ ]
source_detail: "具体模型/报告/访谈名"
url: ""
topic: "一句话点题"
confidence: low | medium | high
status: raw                         # 处理完改 processed
source_weight: 0-100                # 按 §4.3 源权重表
data_quality: complete | partial | contradicted
primary_sources: [URL, URL]
scorecard_version: v3.0             # 新增 — 区分 v2.3 SanDisk vs v3.0 AI Industry Fit ledger
---
```

### 1.4 六阶段 (v3.0)

1. **Triage** — 校验 frontmatter + 相关性 + 检查 truncation (Grok / Gemini "..." 模式)
2. **Extract (强制数值化)** — 提取 **AI Industry Fit 五条** 且必须附带 URL+数值事实（否则标 `tentative_pending_evidence`） + §四 trigger + §七-A 止损信号 + 拦截任何 L3+ 高管承诺（直接送入四方 VERBATIM 队列追求 `verified_quad`）。
3. **Diff (信源仲裁)** — 对比最近 3 次卡片 (✅/🔁/⚠️/📊)。遇冲突强制调用 v3.0 Source Weight Ladder（如 NotebookLM 85 > Gemini 60）；若旧数据拥有 `verified_quad` 金身，新来的单源数据不可覆盖，需打 ⚠️ #contradiction 记录日志。
4. **Rule Check** — 每次重读 `trading_rules` §七 逐条 ✅/⚠️/❌
5. **Archive** — (1) **DeepSeek 词语优化与润色**: 直接调用 DeepSeek 将生硬的机器提炼内容润色为结构化、专业流畅的投研中文； (2) `03_tickers/TICKER.md` append / (3) `04_daily_log/YYYY-MM-DD.md` 一行 / (4) raw → `_processed/YYYY-MM/` + status=processed / (5) Catalyst 提到新事件 → 更新 `05_triggers/catalyst_calendar.md`
6. **Handoff** — 标准回执

---

## 2. Universe + WATCHLIST (合并, v2.0 不变)

### 2.1 废除 11 tier 文件
保留 `07_archive/2026-04-22_tier_legacy/`.

### 2.2 新结构: `03_tickers/_INDEX.md` 单一主表

```markdown
| Ticker | Name | Tier | Market Cap | DD Priority | Scorecard | Position | SSOT? | 一句话 thesis | 下 Catalyst |
```

### 2.3 SSOT 什么时候建

**必建 SSOT 条件 (任一)**:
- Scorecard ≥70
- 持仓 (即使 scorecard <70 仍建)
- 硬 catalyst ≤30 天 + DD-1 priority

---

## 3. Scorecard v3.0 (`_SCORECARD_2Y_3X.md`)

### 3.1 打分公式 (Claude 强制遵守, 带证据)

```
赔率 Upside (20):
  20 = bull price / current price ≥ 5x
  15 = 3-5x
  10 = 2-3x
  5  = 1.5-2x
  0  = <1.5x
  证据: bull price 来自 SSOT §二 Bull 推导, 有 DCF/comps/precedent

胜率 Probability (20):
  20 = 基于已 locked catalyst + 执行 track record, 主观 >60%
  15 = 40-60% (2 硬 lock + 部分执行)
  10 = 20-40% (option-like)
  5  = 10-20% (lottery)
  0  = <10%
  证据: 列 3-5 条 "why 胜率 = X%" 论据

Catalyst 密度 (20):
  20 = 12M 内 3+ 硬 trigger (财报 beat / 订单 / M&A / IPO / regulatory)
  15 = 2 硬
  10 = 1 硬 或 2+ 12-24M
  5  = 24M+ unlock
  0  = 纯 narrative
  证据: `05_triggers/catalyst_calendar.md` 查询结果, 列日期

AI Industry Fit 五条 (20 = 5×4):  ⭐v3.0 替代 SanDisk 四条
  每条 4 / 2 / 0 (成立 / 半成立 / 不成立)

  1. AI 生态绑定 — NVDA / Google / Anthropic / OpenAI / Meta / xAI 头部合作 / 设计胜出 / 入选 reference
     - 4: ≥2 头部 named customer/partner (公开 confirmed)
     - 2: 1 头部 named OR 多个 tier-2 (TSMC ecosystem 等)
     - 0: 无可验证 AI 头部绑定
     - 证据: 公司 IR 公告 / earnings transcript / SEC filing

  2. Moat + 不可替代 — ≥2 类强 moat (技术 / 客户锁定 / scale / IP / regulatory) + 5y 无可见替代路径
     - 4: ≥2 强 moat + 5y 替代路径 minimal
     - 2: 1 moat OR 替代路径 24-60 月
     - 0: 替代路径 ≤24 月 / 无显著 moat
     - 证据: ≥2 独立 sell-side / Grant's / 行业报告 / SSOT §五 moat 段

  3. AI 财务溢价 — Rev YoY ≥30% + GM 同比 ↑3pp + FCF 正
     - 4: 三条全成立 (近 LTM)
     - 2: 两条成立
     - 0: ≤1 条成立
     - 证据: 最近 4 季度 10-Q / 8-K / IR press release; 引数字 + 同比

  4. 量产 + 出货 beat — 供应链稳 + 历史 beat ≥75% + 增量空间未饱和
     - 4: 供应链 ≥2 source 验证稳 + 过去 4 季度 ≥3 beat + TAM 未饱和
     - 2: 中等 (1-2 项满足)
     - 0: 供应链单一 OR beat <50% OR TAM 已饱和
     - 证据: SEC 供应链披露 + 4Q 财报 actual vs guide + TAM 报告

  5. R&D 突破 + 长期 AI 地位 — 6-18mo 突破窗口 (产品 / 工艺 / 标准) + ≤2 真竞品
     - 4: 已 publicly disclosed 6-18mo 突破 + 真竞品 ≤2
     - 2: 突破窗口 18-36mo OR 真竞品 3-5
     - 0: 无明确突破 OR 真竞品 ≥6
     - 证据: 公司 R&D pipeline / 行业 roadmap / 竞品 landscape 分析

  总分上限 20, 无 round-up.
  硬约束: 每条 ≥1 evidence URL + 数值/fact, 否则该条标 `tentative_pending_evidence` 不计分.
```

**注**: 上述阈值 (Rev YoY ≥30% / GM ↑3pp / 6-18mo R&D 突破窗口 / 历史 beat ≥75%) 为初版启发式 (heuristic, v3.0 起).
进化员 weekly cycles 收集足量 catalyst outcome 后会回测并提议调整 (per `进化员.md` v1.1 firewall, scorecard 维度阈值在白名单内).

```
Theme Differentiation (20, 维持不变):
  20 = 全新主题 tier, universe 无同类 SSOT
  15 = Tier 内差异化强, 1-2 同类 SSOT 但论点正交
  10 = Tier 重叠中等, 3-4 同类 SSOT
  5  = 高度重复 (>5 同类 SSOT)
  0  = 纯 beta, universe 已覆盖同逻辑
  证据: 引用 `_INDEX.md` 该 tier 其他 SSOT + 论点重叠分析
```

### 3.2 Integrity Modifier (v3.0)

总分 100 之外, 软调:
- `verified_quad` 占 ≥50% 的关键 anchor → **+1** (v3.0 新)
- 单源 anchor 占 ≥50% → **-2**
- 历史 SSOT 持续 verified_triple → 不变

### 3.3 打分审计 (v3.0 强制)

每次打分改动 (新建 / 升级 / 降级) 必写 Thesis Log 一条:
```markdown
### YYYY-MM-DD · Scorecard N → M (scorecard_version: v3.0)
- 变化维度: [赔率 / 胜率 / Cat / AI Industry Fit / Theme Differentiation]
- 证据: [Source URL + 具体数据]
- Claude 判断理由: [1-2 句]
```

### 3.4 Claude 是唯一打分权威
ChatGPT / Grok / Gemini 给"我认为 POET 值 80 分" — **不采纳, 只作为参考**. Claude 自己按 §3.1 重算.

---

## 4. 四方闭环 + Source 权重仲裁 (v3.0)

### 4.1 四方职责分工 (v3.0)

| 方 | 主用途 | 不用于 |
|---|---|---|
| **Claude (主)** | WebSearch/WebFetch 公开源 (官方 filing/IR/Bloomberg/Reuters) + 最终 SSOT 写作 + 打分 + 仲裁 | - |
| **ChatGPT (辅分析)** | 分析框架 / 估值 / 决策矩阵 / 结构化枚举 | 实时信号 / insider / 市值精确值 |
| **Grok (辅社交/insider)** | 30-90d 实时信号 / insider 10b5-1 / M&A chatter / X 热度 / IPO 进度 | 大规模枚举 (易 truncate) / 估值 / 结构分析 |
| **Gemini (辅 grounded + multimodal)** ⭐新 | Google Finance 实时报价 / Deep Research 多步预研 / NotebookLM grounded Q&A / PDF/图片 OCR | 实时 X 热度 (Grok 强项) / 中文小众媒体 |

### 4.2 场景决策树 (v3.0)

```
新 ticker 发现 (Round N scan)
    ↓
Claude 先 WebSearch (IR/Bloomberg/Reuters/SEC) → 建 raw draft
    ↓
有明显 data gap?
  Yes → 可选 fire ChatGPT (分析框架) + Grok (实时信号) + Gemini (Deep Research / Google Finance 锚)
  No  → Claude 独自完成 SSOT v1.0
    ↓
四方返回 → Claude 按 §4.3 源权重融合
    ↓
冲突 → Claude 用 WebFetch 拉 primary source 仲裁
    ↓
SSOT v1.N 写入, Thesis Log 记录四方分歧
```

### 4.3 Source Weight Ladder (v3.0 核心)

| 权重 | 源类型 | 示例 |
|---|---|---|
| 100 | 官方 SEC 文件 | 10-K / 10-Q / 8-K / Form 4 / S-1 |
| 95 | 公司 IR 新闻稿 | investors.company.com press release |
| 90 | 财报电话会议 transcript | Seeking Alpha / Motley Fool transcript |
| 85 | Tier-1 财经媒体 | Bloomberg / Reuters / WSJ / FT |
| 85 | NotebookLM grounded 回答 ⭐新 | (基于用户上传的 primary sources, 有 source chunk 可追溯) |
| 75 | Tier-2 财经媒体 | CNBC / Barron's / MarketWatch |
| 70 | Google Finance (direct URL via MCP) ⭐新 | google.com/finance/quote/ |
| 70 | Gemini Deep Research ⭐新 | (多步 primary, inline citations) |
| 70 | 专业研究 | Grant's / 权威 sell-side PT / 行业报告 |
| 65 | Google Finance (via Gemini summary) ⭐新 | (Gemini interface, 需 cross-check) |
| 65 | Yahoo Finance / Public.com | (备用, 历史引用保留) |
| 60 | ChatGPT 分析 / 估值 | (基于公开数据推导, 不是 primary) |
| 60 | Gemini 常规对话 ⭐新 | (与 ChatGPT 同档) |
| 55 | Seeking Alpha / MotleyFool / StockTitan | (third-party 聚合) |
| 50 | Grok 实时 signal | (基于 X / web 实时抓取) |
| 40 | 社交媒体 X / Reddit | (需 verified account) |
| 30 | 分析师推文 / Discord | (anecdotal) |

### 4.4 冲突仲裁规则

1. **高权重赢** (差 ≥10 分)
2. **同权重**: 时间最新赢
3. **同时间**: Claude 用 WebFetch 拉 primary (权重 95+) 仲裁
4. **无法仲裁**: SSOT 标 `⚠️ #contradiction`, 在 Thesis Log 记录, 不作 anchor

---

## 5. 🆕 Exec Verbatim Tracker (`03_tickers/VERBATIM/`)

### 5.1 - 5.3 (与 v2.3 同)
(目的 / 文件结构 / Thesis Log 格式不变)

### 5.4 抓取 workflow (🔴 强制 — 新 SSOT 或 earnings event 必跑)

VERBATIM 是强制 DD 环节, 不是可选. 每个新建 SSOT + 每次目标 ticker 的财报/投资者日/重大 exec 访谈, **必须** 跑完整 VERBATIM 流程.

#### 触发时机 (任一发生即触发)
- 新 SSOT 建立 (baseline)
- 财报电话会议后 48h 内 (tone 对比)
- 投资者会议后 (CES / OFC / GTC / Semicon West / CES Asia)
- 高管 CNBC / Bloomberg / FT / WSJ 电视访谈
- X 上 verified exec 账号新 post
- IR 宣布的 sell-side 会议
- 任何 ≥20% 单日变动

### 5.4.1 Default: Watchdog Drip (CronCreate durable=true) ⭐v3.0 新

**v3.0 默认**: VERBATIM 抓取通过 CronCreate durable=true 调度 local cron, 不再 inline interactive Claude session 跑.

**为什么 drip 是默认**:
- 6 ticker × ~10 min 串行 = 60 min interactive — 烧 wall clock
- in-session 易 hit `list_pages` stall → 600s timeout → session 浪费
- CronCreate durable=true 在 Claude 重启后存活, 在 local Claude harness 活时 fire (chrome-devtools MCP reach 必须本地)

**Fail-fast 协议**:
- 每个 `mcp__chrome-devtools__list_pages` 90s 上限 (不是 600s)
- 每源抓取 (ChatGPT / Grok / Gemini) 90s 上限
- 超时 → emit `mcp_fallback_waiver` receipt (DD_ENFORCEMENT §2 Gate B), 干净退出, 下个 drip cycle 重试

**Cadence**:
- **日常 Drip 模式**: 1 ticker/fire, daily drip, 按 earnings-date 优先序.
- **财报季并发爆破模式 (Earnings Burst Mode)**: 当日历员检测到一周内有 >2 个财报时自动切换，启用 3-4 线程并发，确保 T+1 早上清空测谎队列。
生产 spec 见 `_AUDITS/2026-04-24_watchdog_backfill_routing_spec.md`.

### 5.4.2 Fallback: In-session realtime (interactive Claude window)

用户明确要求即时 VERBATIM 时 (e.g. 财报 T+0 ad-hoc tone capture), 原话手 可在 active session 内同步跑 chrome-devtools MCP. 同样 90s fail-fast.

### 5.4.3 Infrastructure 两层 (clarification)

**两层 watchdog 不同, 不要混淆**:

| 层 | 机制 | 用途 |
|---|---|---|
| **Chrome MCP Watchdog** | PowerShell `schtasks` 每 5 min 跑 `chrome_mcp_watchdog.ps1` | 保持 local Chrome 实例 port 9222 活 (crash 自重启). INFRASTRUCTURE 支撑 chrome-devtools MCP transport. |
| **Watchdog drip** | CronCreate durable=true, 1 ticker/day | 调度型 VERBATIM fetcher, 通过 chrome-devtools MCP 驱动 ChatGPT/Grok/Gemini tabs. v3.0 VERBATIM 默认派遣机制. |

watchdog drip 依赖 Chrome MCP Watchdog 在线. 互补, 非替代.

### 5.4.4 🚨 四方并行 VERBATIM 抓取 (v3.0, 升自 v2.1 三方)

单源 (Claude only) 会漏 hallucination, 四方并行交叉验证最大化降低 false verbatim 风险.

| 源 | 角色 | 主用途 |
|---|---|---|
| **Claude WebSearch/WebFetch (主)** | Primary-source aggregator | 抓 Seeking Alpha / Motley Fool / Investing.com / IR press release 官方 transcripts (权重 85-95) |
| **ChatGPT (辅分析)** | 结构化 quote extractor | 按 commit level L1-L5 模板提取 + 语言模式分析 |
| **Grok (辅社交)** | 实时 + X 覆盖 | 抓近期 X verified exec posts + 非主流媒体访谈 |
| **Gemini (辅 grounded)** ⭐新 | Google Finance 价格锚 + Deep Research 长尾 + NotebookLM grounded Q&A | Multimodal OCR + 用户上传 sources 的 grounded 回答 + Deep Research |

**Anchor threshold (v3.0)**:
- ≥3 独立源复现同一 quote → 可作 anchor (verified_triple)
- 4 独立源复现 → `verified_quad` ⭐ (最高 confidence; **Integrity Modifier +1** per §3.2)
- 单源 quote → `primary_only_pending`, 不作 anchor

**Back-compat**: v2.3 写入的 `verified_triple` 在 v3.0 下保持 anchor 资格. 不需要 retrofit.

#### 并行 prompt 模板 (从 GOOGLE_AI_INTEGRATION_v1.md §4.1 promote)

**Claude (主, WebSearch)**:
```
"[TICKER] [CEO/CFO 名] earnings call transcript 2026-Q[N]"
"[TICKER] CEO interview site:cnbc.com OR site:bloomberg.com"
```

**ChatGPT (辅, 经 chrome-devtools)**:
```
从 [TICKER] 最近财报 (20[YY]-Q[N]) + 过去 90 天投资者活动里, 提取 CEO/CFO/COO 原话 (verbatim, 不 paraphrase). 按 L1-L5 commit level 分级. 每条返回: 原话 + 日期 + event + context + commit level + source URL. 最少 5 条 L3+. 不编造.
```

**Grok (辅, Expert mode, 经 chrome-devtools)**:
```
过去 30-90 天内, [TICKER] CEO/CFO/COO 的所有公开发言 + verified X 账号 posts + 访谈 (需给 X tweet URL 或 article URL). 焦点: L4-L5 commit level + tone shift + 删推事件 + 60K+ follower verified accounts 评论.
```

**Gemini (辅, Deep Research / NotebookLM, 经 chrome-devtools)** ⭐新:
```
Go to gemini.google.com (or notebooklm.google.com), paste:
"[TICKER] [CEO] earnings call transcript 2026-Q[N], extract verbatim quotes by L1-L5 commit level, return source URL for each, minimum 5 L3+ commitments, do NOT fabricate, if no public record say so"

If using NotebookLM: query the <TICKER>_due_diligence notebook (must be pre-loaded with 4Q transcripts + 10-Qs). Use NotebookLM's grounded answer + source chunk feature.
```

#### Claude 终裁 (§4.3 Source Weight Ladder)

1. Claude primary transcripts (90-95) baseline
2. ChatGPT/Gemini quotes 交叉 — 矛盾时按 Source Weight 仲裁
3. Grok X/social quotes — 必须 verify follower count + verified badge 才 high commit
4. **四源独立给同一 L4-L5 quote** → `verified_quad`, +1 Integrity Modifier
5. **三源** → `verified_triple` (anchor-eligible)
6. **仅 Grok / 仅 Gemini / 仅 ChatGPT** → 不作 anchor

#### 数据质量标签 (v3.0)

| Label | 含义 |
|---|---|
| `verified_quad` ⭐新 | 四源 (Claude + ChatGPT + Grok + Gemini) 独立复现同一 quote |
| `verified_triple` | 三源独立复现 (任意 3-of-4) — anchor-eligible |
| `verified_dual` | 2 源独立复现 |
| `primary_only_pending` | 仅 Claude 从 primary transcript 抓, 无外部复核 |
| `chatgpt_only` | 仅 ChatGPT — 需二次验证 |
| `grok_only_unverified` | 仅 Grok — 不作 anchor |
| `gemini_only_unverified` ⭐新 | 仅 Gemini — 不作 anchor |
| `contradicted` | 多源分歧, Claude 仲裁 |

### 5.5 - 5.7 (与 v2.3 同)
(兑现追踪 / 跨 ticker pattern / X 高管发言 不变)

---

## 5b. Social Signal Tracker / 5c. SEC Filing Tracker
(与 v2.3 同, 内容不变)

---

## 6. Catalyst Calendar (`05_triggers/catalyst_calendar.md`)
(与 v2.3 同)

---

## 7. Daily Log 精简
(与 v2.3 同)

---

## 8. Chrome-devtools MCP 与 Watchdog 关系 (v3.0 重写)

### 8.1 优先级 (v3.0)

1. **Watchdog drip (CronCreate durable=true)** — VERBATIM 默认派遣 (§5.4.1)
2. **Claude WebSearch/WebFetch** — 始终可用, primary 源抓取主路径
3. **In-session chrome-devtools MCP** — VERBATIM fallback (§5.4.2)
4. **API fallback** — 如用户配置, 但权重低于 web (Gemini API ≠ Gemini web Deep Research)

### 8.2 Chrome MCP Watchdog (基础设施)

PowerShell `schtasks` 维护 `C:\ChromeMCP` 专用 Chrome 实例 port 9222 在线 (5 min 自愈). 4 个 tab 持登录:
- chatgpt.com
- grok.com
- gemini.google.com ⭐新
- notebooklm.google.com ⭐新

详见 `06_data_sources/_scripts/README.md`.

### 8.3 无 MCP / 无 Watchdog 时降级

```
Round N 广网 (仅 Claude WebSearch) → SSOT v1.0 draft
    ↓
Claude 自检 (5 维 scorecard 打分, 含 AI Industry Fit + Source 权重 ≥85)
    ↓
data_quality 标 primary_only_pending; backfill tracker entry; 下次 watchdog drip cycle 补
    ↓
SSOT v1.0 finalize
```

---

## 9. Grok / Gemini Anti-Truncation (v3.0)

### 9.1 检测
任一输出包含: `...` / `(additional X+)` / `... (15+ more)` / 章节内 ticker 数 < 要求 → **自动**标 `data_quality: partial`.

### 9.2 分批策略
大规模枚举禁用 Grok / Gemini chat. 改用:
- ChatGPT 负责枚举 (20-30 ticker 每 tier)
- Grok 负责 30-90d 信号 (缩小范围)
- Gemini 负责 Deep Research 多步 (单 ticker 深挖)

### 9.3 续发 protocol
Truncation 后重发, Claude draft continuation prompt, 用户/drip 手动粘贴.

---

## 10. 文件结构 v3.0

```
AI_Semi_Research/
├── _RESEARCH_LOG.md
├── 00_rules/
│   ├── DD_WORKFLOW_v2.md          ← 本文件 (filename 保留, 内 v3.0)
│   ├── AGENT_PROMPT_TEMPLATE_v1.md (v1.1)
│   ├── STEP_CONTRACTS_v1.md       (v1.1)
│   ├── VERIFICATION_TOKENS_v1.md  (v1.1)
│   ├── DD_ENFORCEMENT_v1.md       (v1.1)
│   ├── GOOGLE_AI_INTEGRATION_v1.md  ← 🛑 DEPRECATED, content promoted
│   ├── trading_rules_*.md
│   └── README.md
├── 02_raw/  (与 v2.3 同)
├── 03_tickers/  (与 v2.3 同)
├── 04_daily_log/
├── 05_triggers/
├── 06_data_sources/
│   ├── source_weight_ladder.md    ← mirrors §4.3 v3.0
│   └── _scripts/
│       ├── chrome_mcp_watchdog.ps1   (Chrome MCP Watchdog 基础设施)
│       ├── register_chrome_mcp.ps1
│       ├── uw_scan_prompt.md
│       ├── uw_scan.ps1
│       ├── register_uw_scans.ps1
│       └── earnings_autofetch.ps1
└── 07_archive/
```

---

## 11. v3.0 迁移计划

### Phase 4 (write live rules)
- [ ] 写 `DD_WORKFLOW_v2.md` v3.0 (本文件正式版)
- [ ] 写 5 companion rule v1.1 patches
- [ ] Deprecate `GOOGLE_AI_INTEGRATION_v1.md` (banner)
- [ ] 同步 `06_data_sources/source_weight_ladder.md`
- [ ] 14 agent .md 文件更新 (per impact map)
- [ ] memory MEMORY.md 更新 + 3 new feedback files

### Phase 5 (background routine)
- [ ] 37 SSOT SanDisk → AI Industry Fit retrofit (per `2026-04-24_ai_industry_fit_retrofit_queue.md`)
- [ ] 进化员 ledger schema migrate
- [ ] FN T-1 / 进化员 / 6-ticker watchdog drip routine prompt 更新

### Phase 6+7
- [ ] _INDEX honesty audit post-retrofit
- [ ] User announcement

---

## 12. 会话开始 Claude 必做清单 (v3.0)

```
[ ] 读 00_rules/DD_WORKFLOW_v2.md (本文件 v3.0)
[ ] 读 05_triggers/catalyst_calendar.md (今日 ±14 天)
[ ] 读 04_daily_log/最新一日.md
[ ] 读 memory/MEMORY.md
[ ] 读 03_tickers/_SCORECARD_2Y_3X.md Top 20
[ ] 扫 02_raw/_inbox/ (有 pending?)
[ ] 简述当前状态 1-2 行
```

---

## 13. 禁止事项 (v3.0)

- ❌ Grok / Gemini 单轮 >100 ticker 枚举 (必 truncate)
- ❌ 未引用 Source URL 给 Scorecard 打分
- ❌ 跳过 six stages 直接写 SSOT
- ❌ 把 exec 发言 paraphrase 后存 VERBATIM (必须原话)
- 🚨 ❌ 新建 SSOT 或 earnings event 不跑四方并行 VERBATIM (§5.4.4 强制)
  - 仅 Claude WebSearch 建 VERBATIM = 单源 hallucination 风险
  - 三源独立复现同一 quote 才 `verified_triple`; 四源 → `verified_quad`
  - 单源 quote 不作 anchor
- ❌ 单日 daily log 超 100 行不分批
- ❌ 忽略 `catalyst_calendar.md` 的 T-1 提示
- ❌ ChatGPT / Grok / Gemini 打的 Scorecard 直接采信
- ❌ v3.0 与 v2.3 冲突时用 v2.3
- 🚨 **❌ Disable / extend the 90 s fail-fast timeout on `list_pages` / `evaluate_script`** (v3.0 §5.4.1)
  - 90 s 是硬上限. workers 必须 emit `mcp_fallback_waiver` on timeout, 不能 inline retry, 不能 extend.
  - 测谎员 通过 `evaluate_script_call_id` timestamp delta 检测 bypass.
- 🚨 **❌ AI Industry Fit 评分凭印象** (v3.0 §3.1, replaces SanDisk forbid)
  - 5 dim 每条必带 evidence URL + 数值/fact (≥1 per dim, 4 per dim recommended)
  - 无 evidence → dim 标 `tentative_pending_evidence`, 不计入总分
- 🚨 **❌ Conflate Chrome MCP Watchdog (PowerShell schtask) with Watchdog drip (CronCreate)** (v3.0 §5.4.3)
  - 两层基础设施, 不是替代关系
- 🚨 ❌ 任何建仓/减仓/仓位 $/时机/margin 建议 (硬规则, `feedback_never_manage_positions.md`)
- 🚨 ❌ 任何 Chinese ADRs / 中国大陆私企 (硬规则, `feedback_no_china_adrs.md`)

---

## 14. Verification Tokens (v3.0 强制, 含 verified_quad)

详见 `00_rules/VERIFICATION_TOKENS_v1.md` v1.1. data_quality 枚举包含 `verified_quad`. 域名表含 google.com/finance + notebooklm.google.com + gemini.google.com.

---

## 15. Checker Agents (v3.0)

19 agent 团队下的 3 checker 持续:
- `测谎员` — 含 verified_quad 校验 (4 cross_source_files)
- `回执稽查` — Gate B receipt 含 90s fail-fast 验证
- `一致性稽查` — 含 NotebookLM tie-breaker (per old GOOGLE_AI_INTEGRATION §4.3)

---

## 16. Trust Hierarchy (v3.0)
(与 v2.3 同)

---

## 17. Session Warmup (v3.0)
读 3 个文件 prefix-cache:
- `00_rules/DD_WORKFLOW_v2.md` (本文件)
- `00_rules/STEP_CONTRACTS_v1.md`
- `00_rules/AGENT_PROMPT_TEMPLATE_v1.md`

---

## 18. Research OS (Phase 2 & 3 架构扩建) ⭐ v3.1 新增

新增第四大部门：**架构部 (Architecture Dept)**，由 `架构主管` 统帅，专职构建底层的决策引擎与自动化流转，不直接干预投研决策。

### 18.1 Phase 2: Unified Signal Engine (量化信号引擎)
- **Signal Score 模型**: `信号算法员` 负责将 SSOT 和日历转化为 0-100 的数值化强度信号 (如：财报 T-7 基础 50 分 + 期权异动 30 分)。取代原有前端 Heuristics。
- **Quote Engine 实体化**: 强推 `verified_quad` 与 SSOT 的锚定，前端渲染必须一键溯源，绝对禁止 Paraphrase 污染。
- **N:N Graph 图谱**: `图谱建模师` 动态维护资金漂移时的 Sector-Ticker 上下游关系，不依赖静态标签。

### 18.2 Phase 3: Autonomous Workflow (深度闭环自动化)
- **T-48 唤醒 (Event-Driven)**: `自动化工程师` 监听 `catalyst_calendar.md`，在重要事件前 48 小时自动唤醒 `研究部` 准备财报对比清单。
- **双向写回 (Bidirectional Sync)**: 允许 Agent 将提取的核心发现（如技术 Milestone）暂存入 SSOT 的 `<pending_approval>` 区块，由前端的 `Approve` 按钮实现持久化写入。
- **The Research Canvas**: `前端全栈员` 在 `research-dashboard` 项目中实现极客级的 UI：左栏资金流 + 中栏 SSOT 与原话 + 右栏 Agent 交互流。

---

## 修订日志

- **v3.1 · 2026-04-25** · 新增架构部（Architecture Dept），引入 Research OS Phase 2 (Unified Signal Engine) 与 Phase 3 (Autonomous Workflow) 规范。
- **v3.0 · 2026-04-24** · MAJOR breaking: (1) VERBATIM 三方→四方加 Gemini, 新 `verified_quad` +1 Integrity Modifier; (2) Watchdog drip CronCreate durable=true 默认, 90s 每源 fail-fast; in-session 降级为 fallback; §5.4.3 explicit two-layer infrastructure clarification; (3) Scorecard dim 4 SanDisk 四条 → AI Industry Fit 五条 (5×4=20); (4) Source Weight Ladder 加 Google Finance + NotebookLM + Gemini Deep Research / regular; Yahoo 标"备用". GOOGLE_AI_INTEGRATION_v1.md DEPRECATED (content promoted). Companions bumped to v1.1.
- v2.3 · 2026-04-24 · Verification Tokens 强制 + 3 checker agent + Trust Hierarchy + Session Warmup
- v2.0 · 2026-04-22 · 10 大修复 + VERBATIM + Source 权重梯 + Catalyst 日历
- v1.0 · 2026-04-21 · 初始 02_raw/README.md
