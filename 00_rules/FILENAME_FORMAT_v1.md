---
file_type: authoritative_naming_spec
version: v1.1
created: 2026-04-25
authority: 总监 (统一权威决策)
supersedes:
  - 02_raw/README.md §"命名规则" (v1 实质性升级, 旧规则 back-compat 见 §6)
  - 04-24 临时格式 `<source>_<TICKER>_pre_earnings_verbatim_<date>.md` (废弃, 须 rename)
  - 04-24 mixed 格式 `<date>_<source>_<TICKER>_pre_earnings_verbatim_<date>.md` (date 重复, 须 rename)
companions:
  - DD_WORKFLOW_v2.md §1.2
  - AGENT_PROMPT_TEMPLATE_v1.md §3
status: active
---

# FILENAME_FORMAT · v1.1 (2026-04-25)

> **总监决策**: 在 README v1 (date-prefix) 与 v3.0 实际产出 (source-prefix) 之间做折中, 取 **date-prefix + source-token + verbatim-as-topic** 统一格式。
> **决策日期**: 2026-04-25
> **理由**:
> 1. date-prefix 让 `ls` / 审计 sort 按时间, 是证据链溯源核心 (优于 source-prefix 按源聚合)
> 2. 保留 source token 在 ticker 后位置 (v3.0 习惯), 多源并行扫读不丢辨识度
> 3. `verbatim` / `pre-earnings-verbatim` 作 topic 一部分, 不再单独 segment, 避免 date 重复

---

## §1 标准格式 (强约束)

```
<YYYY-MM-DD>_<TICKER>_<SOURCE>_<topic-kebab-case>.md
```

**正则** (CI/审计自动校验用):

```regex
^(\d{4}-\d{2}-\d{2}(T\d{4})?)_([A-Z0-9]{1,6}|MULTI|MACRO|PORTFOLIO|BASKET|UNIVERSE|SCORECARD|_GLOBAL)_([a-z]+)_([a-z0-9-]+)\.md$
```

| 段 | 规则 | 示例 |
|---|---|---|
| `YYYY-MM-DD` | **事件日**, 非入库日; 事件不明则用 fetched_at | `2026-04-24` |
| `TICKER` | 大写, A-Z0-9, 1-6 字符; 多票用 `MULTI` / 宏观 `MACRO` / 组合 `PORTFOLIO` / 篮子 `BASKET` / 全集 `UNIVERSE` / 评分卡 `SCORECARD` / 全局 `_GLOBAL` | `WOLF` / `MULTI` |
| `SOURCE` | 小写枚举: `chatgpt` / `grok` / `gemini` / `claude` / `news` / `research` / `transcript` / `exec` / `self` / `autofetch` | `gemini` |
| `topic-kebab-case` | 3-6 词, 小写, 连字符; **必须**含 verbatim/事件类型 token | `pre-earnings-verbatim` / `q1-2026-verbatim-retrofit` |
| 扩展名 | `.md` 唯一 | — |

---

## §2 标准 Topic Tokens (常用)

| 用途 | Token | 示例文件名 |
|---|---|---|
| 财报前 verbatim | `pre-earnings-verbatim` | `2026-04-24_AGX_claude_pre-earnings-verbatim.md` |
| 财报后 verbatim | `post-earnings-verbatim` | `2026-04-24_NBIS_chatgpt_post-earnings-verbatim.md` |
| 季度 verbatim retrofit | `q<N>-fy<YY>-verbatim-retrofit` | `2026-04-22_AVGO_grok_q1-fy26-verbatim-retrofit.md` |
| Real-time intel | `realtime-intel` | `2026-04-22_NVTS_grok_realtime-intel.md` |
| Pressure test / DD | `pressure-test` / `dd-fundamentals` / `dd-valuation` | `2026-04-22_FN_claude_dd-fundamentals.md` |
| Catalyst calendar | `catalyst-update` | `2026-04-25_MULTI_claude_catalyst-update.md` |
| UW scan (intraday) | `uw-scan-<window>` | `2026-04-23T0800_MULTI_claude_uw-scan-pre-market.md` (intraday 例外见 §4) |

---

## §3 Frontmatter 同步 (必填)

```yaml
---
date: YYYY-MM-DD                # 必须 = 文件名 date 段
ticker: TICKER                  # 必须 = 文件名 TICKER 段
source: chatgpt|grok|gemini|claude|news|research|transcript|exec|self
topic: "<完整 topic, 不带 kebab>"
status: raw|processed|rejected
source_weight: 0-100            # v3.0 后必填
data_quality: complete|partial|contradicted|primary_transcript_grounded|primary_only_pending
fetched_at: YYYY-MM-DD          # 与 date 可不同 (data 是几天前但今天抓取)
url: "..."
confidence: low|medium|high
scorecard_version: v3.0
---
```

文件名 date/ticker/source 三段必须与 frontmatter 一致。**冲突 → 规则稽查 自动 ❌ reject**。

---

## §4 例外 (允许的偏离)

| 偏离 | 何时允许 | 示例 |
|---|---|---|
| **Intraday 时段前缀** | 一天有多个版本 (UW scan / autofetch press call), 在 date 后加 `THHMM` (严格保持 3 个下划线) | `2026-04-23T1200_BESI_autofetch-call.md` |
| **`SCORECARD` / `UNIVERSE` 合集** | 跨 ticker 评分/全集扫描 | `2026-04-22_SCORECARD_chatgpt_scoring-35tickers.md` |
| **Backfill 标记** | 老数据回填 → topic 加 `-backfill` | `2026-03-15_TLN_grok_q4-2025-verbatim-backfill.md` |

---

## §5 禁止 (硬约束 — 自动 reject)

- 空格 / 中文字符 / `._-` 之外特殊字符
- 大写 source / 小写 ticker
- date 出现两次 (e.g. `2026-04-24_X_2026-04-24.md` ❌)
- 无 source 段 / 无 topic 段
- 驼峰命名

---

## §6 Back-compat & Migration

### 6.1 README v1 (`<date>_<TICKER>_<source>_<topic>.md`)
**完全兼容**, 无需改动。这是 v1.0 标准的来源。

### 6.2 v3.0 临时格式 (`<source>_<TICKER>_pre_earnings_verbatim_<date>.md`)
**废弃**, 必须 rename。Migration script:
```bash
# 100 个 _inbox 文件 (chatgpt/claude/gemini/grok × 25 ticker)
for f in <source>_<TICKER>_pre_earnings_verbatim_<date>.md; do
  mv "$f" "<date>_<TICKER>_<source>_pre-earnings-verbatim.md"
done
```

### 6.3 v3.0 mixed 格式 (`<date>_<source>_<TICKER>_pre_earnings_verbatim_<date>.md`)
**废弃**, 必须 rename (date 重复 + 段顺序错):
```
2026-04-24_chatgpt_MPWR_pre_earnings_verbatim_2026-04-24.md
  → 2026-04-24_MPWR_chatgpt_pre-earnings-verbatim.md
```

### 6.4 Migration 完成 deadline
- 04-25 _inbox 100 文件: 即时 rename (本次会话)
- 04-24 _processed mixed 4 文件: T+24h
- 旧 _processed/_archive 已合规 ones: 保留, 不 retro-rename (审计稳定性 > 一致性)

---

## §7 Validation 工具

合规主管 跑 `规则稽查` 时, 用以下 grep 找违例:

```bash
# Pattern 不符
ls 02_raw/_inbox/ | grep -vP '^\d{4}-\d{2}-\d{2}_[A-Z0-9_]+_[a-z]+_[a-z0-9-]+\.md$'

# date 重复
ls 02_raw/_inbox/ 02_raw/_processed/ -R | grep -P '\d{4}-\d{2}-\d{2}.*\d{4}-\d{2}-\d{2}'

# Source 大写
ls -R | grep -P '_[A-Z][a-z]+_'
```

---

## §8 引用关系

下列文件已更新引用本规范 (2026-04-25):
- `02_raw/README.md` §"命名规则"
- `00_rules/DD_WORKFLOW_v2.md` §1.2
- `00_rules/AGENT_PROMPT_TEMPLATE_v1.md` §3
- `.claude/agents/分诊员.md` (raw triage 第一关)
- `.claude/agents/规则稽查.md` (审计执行)
- `.claude/agents/原话手.md` (verbatim 文件命名)
- `.claude/agents/归档员.md` (移文件到 _processed)
- `MEMORY.md` user auto-memory (新增 reference 条)

---

## §9 修订日志

| Version | Date | Change |
|---|---|---|
| v1.1 | 2026-04-25 | 优化 Intraday 命名为 `T` 分隔符，保障前端 Next.js 解析器严格 split 4 段，修复 `autofetch_call` 破损问题 |
| v1.0 | 2026-04-25 | 初版, 总监决策, 解决 README v1 vs v3.0 实际产出冲突 |
