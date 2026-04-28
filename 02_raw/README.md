# RAW Folder 使用手册 · v1

本文件夹是你的信息入库总闸。所有从 ChatGPT / Grok / 新闻 / 研报 / 自己笔记来的原始材料，全部先进这里，再由 Claude 按固定流程处理后归档到 `03_tickers/`。

---

## 文件夹结构

```
02_raw/
├── _inbox/              ← ★ 你新数据丢这里, 等 Claude 处理
├── _processing/         ← Claude 处理中的临时区(幂等锁)
├── _processed/YYYY-MM/  ← 处理完归档, 按月分目录, 不删
├── _rejected/           ← 无效/无关的, 带原因
├── RAW_TEMPLATE.md      ← 每次新建文件时复制这个
└── README.md            ← 本文件
```

`_processed` 永不删除, 是审计追溯的证据链。

---

## 命名规则（强约束）

> **权威规范**: `00_rules/FILENAME_FORMAT_v1.md` (v1.0, 2026-04-25 总监决策, 解决 README v1 vs v3.0 quad verbatim 冲突)
> 本节为概要, 完整规则 / 正则 / 例外见 FILENAME_FORMAT_v1.md。

```
<YYYY-MM-DD>_<TICKER>_<SOURCE>_<topic-kebab-case>.md
```

| 字段 | 规则 | 示例 |
|---|---|---|
| `YYYY-MM-DD` | 信息发生日期(不是你粘贴日期) | `2026-04-21` |
| `TICKER` | 单标的用代码; 多标的 `MULTI`; 宏观 `MACRO`; 组合 `PORTFOLIO`; 篮子 `BASKET`; 全集 `UNIVERSE`; 评分卡 `SCORECARD` | `WOLF` / `MULTI` |
| `SOURCE` | `chatgpt` / `grok` / `gemini` / `claude` / `news` / `research` / `transcript` / `exec` / `self` / `autofetch` | `gemini` |
| `topic-kebab-case` | 3–6 个英文词, 小写, 连字符 | `pre-earnings-verbatim` |

完整示例：
- `2026-04-21_WOLF_grok_utilization-q3-update.md`
- `2026-04-24_AGX_claude_pre-earnings-verbatim.md` (v3.0 quad verbatim)
- `2026-04-21_MULTI_news_semicon-west-preview.md`
- `2026-04-23_1200_BESI_autofetch_call.md` (intraday HHMM 例外, 见 FILENAME_FORMAT_v1.md §4)

**禁止**: 空格 / `<source>_<TICKER>_..._<date>.md` (source 在最前 + date 在最后, 04-24 旧产出已 rename) / date 出现两次 / 大写 source / 小写 ticker。

---

## 每个文件必填的 frontmatter

```yaml
---
date: 2026-04-21              # 必填
ticker: WOLF                  # 必填
related_tickers: []           # MULTI 时必填
source: grok                  # 必填, 枚举
source_detail: "Grok 4, ..."  # 建议填
url: ""                       # 有就填
topic: "一句话点题"            # 必填
confidence: medium            # 必填, low/medium/high
status: raw                   # 必填, 固定 raw, Claude 处理后改为 processed
---
```

缺必填字段 → Claude 会退回, 让你补全后再处理, 不会静默放过。

---

## 处理流程（Claude 端, 六阶段）

你只要说「处理一下 inbox」, Claude 会对 `_inbox/` 里每个文件严格跑完六阶段。

### Stage 1 — Triage 分流
- 校验 frontmatter 完整性
- 判断相关性（是否涉及你的 12 层产业链 / 持仓 / 规则里的 trigger）
- 通过 → 移到 `_processing/`; 不通过 → 移到 `_rejected/` 并写原因

### Stage 2 — Extract 提取
按四维度扫全文抽证据：
1. SanDisk 框架四条（瓶颈 / 成本曲线 / IP / 平台稀缺性）
2. 关键 trigger（规则 §四 时间表）
3. 论点止损信号（规则 §七-A 四条）
4. 数字事实（利用率 / 毛利率 / 市占率 / 产能 / ASP 等可量化指标）

### Stage 3 — Diff 对比
读 `03_tickers/TICKER.md` 最近 3 次卡片, 生成：
- ✅ 新增 · 🔁 确认 · ⚠️ 矛盾 · 📊 数据更新

### Stage 4 — Rule Check 规则校验
不靠记忆, 每次重读 `trading_rules_2026-04-21.md` §七, 逐条判定：
- §七-A 四条论点止损 → ✅ 无 / ⚠️ 观察 / ❌ 触发
- §七-D 时间止损

### Stage 5 — Archive 归档（三处同步）
1. 生成卡片片段, append 到 `03_tickers/TICKER.md`
2. 在 `04_daily_log/YYYY-MM-DD.md` 加一行摘要
3. Raw 文件 `status: raw` 改 `processed`, 移到 `_processed/YYYY-MM/`

### Stage 6 — Handoff 回执
返回标准回执（见下节）, 你扫两行就知道要不要动仓。

---

## 标准回执格式（Claude 返回给你的样子）

```
## 📥 Processed: [文件名]

**Ticker**: WOLF
**Source**: Grok (confidence: medium)
**Topic**: Q3FY26 利用率 & 成本曲线

### 关键变化
- ✅ 新增 N 条: ...
- 🔁 确认 N 条: ...
- ⚠️ 矛盾 N 条: ...
- 📊 数据更新: ...

### SanDisk 四条体检（本次变化）
1. 瓶颈: ✅/⚠️/❌ + 一句话
2. 成本曲线: ...
3. IP: ...
4. 平台稀缺性: ...

### 规则触发
- §七-A 四条论点止损: ✅ 无触发 / ❌ 触发第 X 条
- §七-D 时间止损: ...

### 建议动作
无动作 / 观察 / 减仓 / 清仓

### 已写入
- 03_tickers/WOLF.md
- 04_daily_log/YYYY-MM-DD.md
- Raw 已归档至 02_raw/_processed/YYYY-MM/

[如有你的问题, 在此回答]
```

---

## 边界规则（一次讲清, 处理时不再问你）

| 情况 | Claude 的处理方式 |
|---|---|
| ChatGPT 说 A, Grok 说 ¬A | 两条都写卡片, 打 `#contradiction` 标签, daily_log 首条显示, **不调和** |
| 同一条 raw 被丢两次 | 按文件名 + 内容 hash 查重, 第二次跳过并告知 |
| Raw 质量差 / 纯情绪发泄 | 移到 `_rejected/` 并写明原因, 不静默丢弃 |
| 老数据回填（date < 最新卡片） | 按 date 插入历史位置, 打 `[backfill]` 标签, **不改变当前 thesis** |
| Raw 涉及非持仓 / 非关注标的 | 仍处理, 写到 `03_tickers/WATCHLIST/` 子目录 |
| Raw 里提了具体问题 | 回执最后追加「你的问题回答」一节 |
| 单条 raw ❌ 触发论点止损 | 回执顶部用 🚨 横幅高亮, **要求你明确回复「知悉」** 后才归档 |

---

## 版本记录

- v1 · 2026-04-21 · 初始版本
