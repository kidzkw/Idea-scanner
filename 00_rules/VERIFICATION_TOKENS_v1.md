---
file_type: authoritative_data_format
version: v1.1
created: 2026-04-24
last_updated: 2026-04-24 (v1.0 → v1.1: verified_quad enum + Google domain table + SI Modifier rule)
authority: DD_WORKFLOW v3.0
purpose: 防撒谎 — 每条可疑 claim 必带 verification token, 使 测谎员 能机器校验
status: active (all new writes must comply)
---

# Verification Tokens v1.0

> **原则**: Agent 撒谎主要发生在"quote / 数字 / URL / Source Weight / data_quality 标签" 5 个地方。对每条可校验的 claim 强制附加 token, 让 测谎员 能 WebFetch + Grep 自动抽检。

---

## 1. 强制 token 字段 (任何 "claim" 必带)

```yaml
claim_id: <agent-name>_<YYYY-MM-DDTHH:MM:SS>_<short-hash>
source_url: https://...                     # 必填. 若无 URL → claim 不得写入
source_type: sec_filing | ir_press | transcript | bloomberg | reuters | wsj | ft | yahoo | chatgpt | grok | x_post | blog
source_weight: 100 | 95 | 90 | 85 | 75 | 70 | 65 | 60 | 55 | 50 | 40 | 30   # 按 DD_WORKFLOW §4.3 ladder
fetched_at: YYYY-MM-DDTHH:MM:SSZ
fetched_by: <agent-name>
quote_locator: "first 20 chars of quote..."  # quote claims 必填, 数字 claims 可省
data_quality: verified_quad | verified_triple | verified_dual | primary_only_pending | chatgpt_only | grok_only_unverified | gemini_only_unverified | contradicted
```

## 2. 在 VERBATIM `<TICKER>_verbatim.md` 的 Thesis Log 中的使用

### 旧格式 (v2.2, 已废)
```markdown
### 2026-04-22 · Smith, CEO · Q1 earnings
> "We will far exceed $5M Q2 order" [L4 Strong Guide]
- Context: RBC analyst Q&A
- Source: https://seekingalpha.com/...
```

### 新格式 (v1.0 verification tokens)
```markdown
### 2026-04-22 · Smith, CEO · Q1 earnings call
> "We will far exceed $5M Q2 order" [L4 Strong Guide]

- **claim_id**: 原话手_2026-04-22T14:30:00_a3f9c1
- **source_url**: https://seekingalpha.com/article/poet-q1-2026-transcript
- **source_type**: transcript
- **source_weight**: 90
- **fetched_at**: 2026-04-22T14:30:00Z
- **fetched_by**: 原话手
- **quote_locator**: "We will far exceed $5M"
- **data_quality**: verified_quad  (cross-ref: claude_raw ✓ / chatgpt_raw ✓ / grok_raw ✓ / gemini_raw ✓)
- **cross_source_files**:
  - 02_raw/_processed/2026-04/2026-04-22_POET_claude_verbatim-q1-earnings.md
  - 02_raw/_processed/2026-04/2026-04-22_POET_chatgpt_verbatim-q1-earnings.md
  - 02_raw/_processed/2026-04/2026-04-22_POET_grok_verbatim-q1-earnings.md
  - 02_raw/_processed/2026-04/2026-04-22_POET_gemini_verbatim-q1-earnings.md  ⭐v1.1
- Context: RBC analyst Q&A re Celestial ramp
- Impact: Celestial 2026 rev 比 guide 快 2 quarter
- Follow-up date: 2026-08-15 (Q2 earnings)
- Redemption: pending
```

**硬约束**:
- quote 没 `source_url` → 不得写入, 返回 `I did not find this quote`
- `source_weight` 必须与 URL 域名一致 (e.g. `source_type: transcript` 但 URL 是 `reddit.com` → 撒谎, 测谎员 会标 `weight_misclassified`)
- `data_quality: verified_triple` 必须列出 3 个 cross_source_files, 缺一不可
- `quote_locator` 必须是 quote 前 20 字符原样 (测谎员 用此字段 Grep 原文)
- `data_quality: verified_quad` 必须列出 4 个 cross_source_files (claude_raw + chatgpt_raw + grok_raw + gemini_raw), 缺一不可. 测谎员 Gate C 验证 4 文件存在且各含 quote_locator.
- `verified_quad` 解锁 Scorecard Integrity Modifier +1 (per DD_WORKFLOW v3.0 §3.2). 测谎员 抽检若发现 4-source 中任一为 stub / 重复内容 / fabrication → 降级到 verified_triple 并写 audit.

## 3. 在 SSOT Thesis Log 中的使用

每条 Thesis Log entry 第一行必须是:
```markdown
### YYYY-MM-DDTHH:MM:SS · <agent-name> · <raw_id>
```

`<raw_id>` = 触发此 entry 的 raw 文件 basename (不含路径/扩展名). 用于幂等 dedup — 同 raw_id 再来, skip.

entry 内部引用数字时:
```markdown
- Revenue Q1 2026: $48M (+12% YoY) [claim_id: 归档员_2026-04-22T09:15:00_b7d2e8]
```

claim_id 对应 raw 里的某条提取结论, 测谎员 可回溯到 raw 文件校验.

## 4. 在 Scorecard `_SCORECARD_2Y_3X.md` 中的使用

每维打分必带 4-evidence, 每条 evidence 必是 verification token:

```markdown
## POET · Scorecard 82 (2026-04-22)

### Upside: 15/20
1. claim_id: 打分员_2026-04-22T10:00:00_c9e4f2
   source_url: https://poet-technologies.com/investors/ir-deck-q1-2026.pdf
   source_type: ir_press
   source_weight: 95
   numeric: "bull_price = $18, current = $6 → 3x"
   reasoning: "dcf 敏感度 +5% base → $18 topside, 3x ≥ 3 threshold"

2. ... (3 more)
```

**硬约束**: 任一维 evidence <4 条 → dimension 标 `tentative_pending_evidence`, 不计入总分.

## 5. 在 SEC Filing Log 中的使用

每条 Filing Log 行:
```markdown
| 2026-04-23 | 8-K Item 2.02 | Q1 earnings release | +12% rev beat | [T:8K_poet_2026Q1] |
```

最后一列 `[T:<token-id>]` 指向文件末尾的 token 字典:
```markdown
## Verification Tokens
- **T:8K_poet_2026Q1**
  - claim_id: 文件员_2026-04-23T08:05:00_d1e7a3
  - source_url: https://www.sec.gov/cgi-bin/browse-edgar?...&type=8-K&...
  - source_weight: 100 (SEC filing, 最高)
  - fetched_at: 2026-04-23T08:05:00Z
  - accession_number: 0001234567-26-000123
```

## 6. 测谎员 的校验算法 (伪码)

```
for each claim_token in new_writes:
    1. resolve source_url → WebFetch content
    2. if source_url 404 or fetch fail:
         write _AUDITS/YYYY-MM-DD_url_404_<agent>_<claim_id>.md
         mark claim as FABRICATED
         continue
    3. if claim has quote_locator:
         grep content for quote_locator (case-insensitive, whitespace-normalized)
         if miss: write _AUDITS/..._quote_missing_*.md → mark DUBIOUS
    4. domain_weight_map[urlparse(source_url).domain] vs claim.source_weight
         if mismatch: mark WEIGHT_MISCLASSIFIED
    5. if claim.data_quality == verified_quad:
         verify 4 cross_source_files exist and each contain quote_locator
         if any miss: downgrade to verified_triple (if ≥3 valid) / verified_dual / primary_only_pending
         if duplicate content detected (e.g. Gemini raw is verbatim copy of ChatGPT raw): mark FABRICATED_QUAD; downgrade to verified_triple
       elif claim.data_quality == verified_triple:
         verify 3 cross_source_files exist and each contain quote_locator
         if any miss: downgrade to verified_dual / primary_only_pending
       (back-compat: pre-2026-04-24 verified_triple entries pass with 3-file check; do not require gemini)
    6. write audit result to _AUDITS/YYYY-MM-DD_verification_<batch>.md
```

## 7. Domain → Weight 预设表 (测谎员 用)

```
sec.gov, efts.sec.gov                                → 100
*.com/investors, *.com/ir                            → 95
seekingalpha.com/article, fool.com                   → 90
bloomberg.com, reuters.com, wsj.com, ft.com          → 85
notebooklm.google.com (with source chunks)           → 85   ⭐v1.1
cnbc.com, barrons.com, marketwatch.com               → 75
google.com/finance, finance.google.com               → 70   ⭐v1.1
gemini.google.com (Deep Research mode)               → 70   ⭐v1.1
(research reports, various)                          → 70
google.com/finance (via gemini summary)              → 65   ⭐v1.1
finance.yahoo.com, public.com                        → 65   (备用, v3.0 demoted by tag)
chat.openai.com, chatgpt.com                         → 60
gemini.google.com (regular chat)                     → 60   ⭐v1.1
seekingalpha.com/news, fool.com/blog                 → 55
grok.com, x.ai                                       → 50
twitter.com/*, x.com/* (verified)                    → 40
twitter.com/*, x.com/* (unverified)                  → 30
reddit.com, stocktwits.com                           → 30
```

未列域名 → 默认 55 + 标 `unknown_domain` 让 agent 人工判断.

## 8. Integrity Modifier · verified_quad bonus rule (v3.0)

Per DD_WORKFLOW v3.0 §3.2, the Scorecard Integrity Modifier is:
- **+1** if ≥50% of the SSOT's anchor-eligible quotes carry `data_quality: verified_quad`
- **0** baseline
- **-2** if ≥50% are single-source (chatgpt_only / grok_only / gemini_only / primary_only_pending without backfill)

打分员 reads the SSOT VERBATIM section and counts. 测谎员 cross-validates the count.

Note: this Integrity Modifier is OUTSIDE the 100 base score (sits as ±N adjustment in the final scorecard line).

## 9. 实施与迁移

### 立即生效 (2026-04-24 起)
- 所有新 VERBATIM / SSOT / Scorecard / SEC / daily_log write 必带 token
- 历史数据 **不强制回填**, 但 测谎员 抽检历史条目发现 fabrication 时归档 `_AUDITS/`

### 回填触发 (可选)
- 某 ticker 触发 `一致性稽查` 警报 → 回填该 ticker 过去 1 年所有 token
- 用户手动要求 "audit <TICKER>" → 回填

---

## 修订日志

- **v1.0 · 2026-04-24** · 初版, 配合 测谎员 发布
- **v1.1 · 2026-04-24** · `verified_quad` enum + 4 Google domain rows + SI Modifier verified_quad +1 rule + back-compat verified_triple preserved.
