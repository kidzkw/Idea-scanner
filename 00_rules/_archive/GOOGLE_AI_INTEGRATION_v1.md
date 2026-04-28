---
file_type: integration_spec
version: v1.0
created: 2026-04-24
authority: extends DD_WORKFLOW_v2.md §4.1 (三方分工) → 四方分工
purpose: 接入 Google AI Pro 的 Gemini (web) + NotebookLM (web), 通过 chrome-devtools MCP, 与现有 ChatGPT/Grok 同一路径. 不使用 Gemini CLI / API.
status: DEPRECATED 2026-04-24 — content promoted into DD_WORKFLOW_v2.md v3.0
owner: 原话手, 研究员, 一致性稽查 (3 个 agent 是主要消费者)
---

> **⚠️ DEPRECATED 2026-04-24**: Content promoted into `DD_WORKFLOW_v2.md` v3.0 §4.1 + §5.4 + VERIFICATION_TOKENS_v1.md v1.1 §7.
> File preserved as historical reference. New work should reference DD_WORKFLOW v3.0.

# Google AI Pro 集成 · v1.0

## 1. 接入路径 — 绝对不用 CLI/API

| 服务 | URL | 接入 |
|---|---|---|
| Gemini 3 Pro | https://gemini.google.com | **chrome-devtools MCP tab** (与 ChatGPT/Grok 同模式) |
| NotebookLM | https://notebooklm.google.com | **chrome-devtools MCP tab** (需文件上传, workflow 稍复杂) |

**为什么不用 CLI**: Gemini CLI 需要额外 key 管理, 并且用户已付费 web 版订阅. API 额外消费. **web + MCP 零边际成本**, 复用已登录 session.

## 2. Chrome Tab 设置 (一次性)

用户登录 Chrome:
```
tab 1: chatgpt.com (已配, 现有)
tab 2: grok.com (已配, 现有)
tab 3: gemini.google.com  ← 新加
tab 4: notebooklm.google.com  ← 新加
```

所有 tab 必须保持登录状态. chrome-devtools MCP 通过 `list_pages` 探活, 按 URL 匹配 tab id.

## 3. Watchdog 探活协议 (R1b 扩展)

### 3.1 探活命令序列

每次需要调用 Gemini/NotebookLM 前, agent 执行:

```python
pages = mcp__chrome-devtools__list_pages()
gemini_tab = find(pages, url_contains="gemini.google.com")
notebooklm_tab = find(pages, url_contains="notebooklm.google.com")

if not gemini_tab:
    status.gemini = "down"
    # fallback: skip Gemini path, mark data_quality accordingly
if not notebooklm_tab:
    status.notebooklm = "down"
```

### 3.2 四方状态矩阵

| Claude | ChatGPT | Grok | Gemini | data_quality |
|---|---|---|---|---|
| ✅ | ✅ | ✅ | ✅ | `verified_quad` ⭐ (最高) |
| ✅ | ✅ | ✅ | ✗ | `verified_triple` (现有标准) |
| ✅ | ✅ | ✗ | ✅ | `verified_triple` |
| ✅ | ✅ | ✗ | ✗ | `verified_dual` |
| ✅ | ✗ | ✗ | ✗ | `primary_only_pending` → 进 BACKFILL_TRACKER |
| 仅非 Claude 单源 | | | | `dubious_not_for_anchor` (从不作 anchor) |

### 3.3 BACKFILL 拓展

`03_tickers/VERBATIM/_VERBATIM_BACKFILL_TRACKER.md` 加列:
```
| ticker | event | primary_fetched_at | chatgpt_status | grok_status | gemini_status | notebooklm_status | retry_by |
```

下次 MCP 全活时, backfill agent 重跑缺的那一路.

## 4. 分 agent 集成点

### 4.1 `原话手` (verbatim 三方 → 四方)

**改动**: `原话手.md` 的 "Step D — Parallel ChatGPT + Grok" 扩成 3-way Gemini 加入.

```python
# 探活
if gemini_alive:
    # 并行 dispatch (一 message, 3 parallel)
    Gemini task 模板:
      "Go to gemini.google.com, new chat, paste:
       '<TICKER> <CEO> earnings call transcript 2026-Q<N>, extract verbatim quotes by L1-L5 commit level,
        return source URL for each, minimum 5 L3+ commitments, do NOT fabricate, if no public record say so'"
    
    chatgpt_raw = fire_chatgpt_prompt(...)
    grok_raw = fire_grok_prompt(...)
    gemini_raw = fire_gemini_prompt(...)

# merge 阶段 (Opus)
for each L4/L5 quote:
    sources_matched = count(claude_has_it, chatgpt_has_it, grok_has_it, gemini_has_it)
    if 4: data_quality = verified_quad ⭐
    elif 3: verified_triple
    elif 2: verified_dual
    elif 1: primary_only_pending
```

### 4.2 `研究员` (Gemini Deep Research 预研)

**改动**: `研究员.md` 的 Phase 1 "Read" 之前加 optional Phase 0:

```
Phase 0 (optional, 仅新 SSOT 或用户明确要求):
    if gemini_alive:
        dispatch Gemini Deep Research:
          "Deep research on <TICKER>: business model, competitive moat, end markets,
           customer concentration, financial trajectory 2023-2026, key catalysts 12-18M,
           management track record. Return structured report with inline citations.
           Target: 3000-5000 words, primary sources only."
        wait ~10-20 min (Deep Research typical duration)
        save raw to: 02_raw/_processed/YYYY-MM/YYYY-MM-DD_<T>_gemini_deep-research.md
        tag: source_weight=70, source_type=gemini_deep_research
    else:
        skip, proceed to Phase 1 as usual
```

Gemini Deep Research 与 Claude WebSearch 的区别: Gemini 自主多步搜索, 像专业分析师做 pre-work. 耗时但节省 Claude 的 WebFetch 次数 (更省钱 + 更广覆盖).

### 4.3 `一致性稽查` (NotebookLM 作 grounded 二次校验)

**改动**: `一致性稽查.md` 的 Check 1 (revenue drift) 加 NotebookLM 回路:

```
Check 1 · revenue_drift (SEC ↔ SSOT)
  sec_latest_rev = parse from <T>_sec.md
  ssot_latest_rev = parse from <T>.md §六
  
  if drift > 1%:
      # 现有: 直接 flag 为 high-severity
      
      # v1.0 增强: NotebookLM tie-breaker
      if notebooklm_alive:
          # 检查 notebook for this ticker exists (should have uploaded transcripts + 10-Qs)
          nlm_notebook = find_notebook(ticker=<T>)
          if nlm_notebook:
              ask NotebookLM: "What was <T>'s revenue in <quarter>? cite source."
              nlm_response = parse (answer + source_chunk)
              if nlm_answer matches sec_latest_rev: 
                  winner = SEC + NotebookLM (triple-sourced, high confidence)
                  demote SSOT claim to dubious_pending_recheck
              elif nlm_answer matches ssot_latest_rev:
                  winner = contradicted (SEC vs NLM/SSOT agree) — rare, flag for human
              else:
                  flag all three disagree, #contradiction
```

**前提**: 每个 DD-0 ticker 要有对应 notebook, 装好 4Q 的 transcripts + 最新 10-Q + press releases. 手动维护 notebook 或 `notebook-loader` 新 agent (暂不建).

## 5. NotebookLM 特殊 workflow

NotebookLM 跟普通 chat 不同: **先上传 sources, 再问问题**. 自动化会遇到:
- 上传文件 (SEC.gov PDF 或 Seeking Alpha transcript) 需要先下载到本地再上传 → MCP file upload 工具
- 每 notebook 上限 300 sources — 足够每 ticker 一个 notebook 存 2-3 年数据

**推荐手动维护** (避免 agent 跑飞):
- 用户每季度 (或季度 earnings 后) 自己在 NotebookLM 加新文档 (10-Q PDF / transcript HTML)
- 现有 notebook 命名约定: `<TICKER>_due_diligence` (一 ticker 一 notebook)
- `一致性稽查` / `研究员` 读 notebook 只 query, 不写

## 6. Source Weight Ladder 更新 (DD_WORKFLOW §4.3)

```
权重 100: SEC 10-K/10-Q/8-K/Form 4/S-1
权重 95: 公司 IR 新闻稿
权重 90: Seeking Alpha / Motley Fool transcript
权重 85: Bloomberg / Reuters / WSJ / FT
权重 85: NotebookLM grounded 回答 ⭐新 (基于用户上传的 primary sources, 有 source chunk 可追溯)
权重 75: CNBC / Barron's / MarketWatch
权重 70: Gemini Deep Research ⭐新 (多步 primary, inline citations)
权重 70: 专业研究 Grant's / sell-side PT
权重 65: Yahoo Finance
权重 60: ChatGPT 分析
权重 60: Gemini 常规对话 ⭐新 (与 ChatGPT 同档)
权重 55: Seeking Alpha / MotleyFool aggregated news
权重 50: Grok 实时 signal
权重 40: 社交 X verified
权重 30: 分析师推文
```

## 7. 测谎员 Domain → Weight 预设扩展

`VERIFICATION_TOKENS_v1.md §7` 加行:
```
notebooklm.google.com            → 85
gemini.google.com (Deep Research tag) → 70
gemini.google.com (regular)      → 60
```

这样 `测谎员` 校验 source_url 时, 看到这些 domain 知道预期权重.

## 8. 落地 checklist

- [ ] 用户在 Chrome 登录 `gemini.google.com` + `notebooklm.google.com`
- [ ] 测试 `mcp__chrome-devtools__list_pages` 能看到 4 个 tab
- [ ] 手动试 1 次 Gemini prompt via MCP (new_page → navigate → type_text → wait_for → take_snapshot)
- [ ] 更新 `原话手.md` 加 Gemini 为 Step D 的第 3 并行路径
- [ ] 更新 `研究员.md` 加 Phase 0 optional Gemini Deep Research
- [ ] 更新 `测谎员.md` domain_weight_map 加 3 个新 domain
- [ ] 更新 `一致性稽查.md` Check 1 加 NotebookLM tie-breaker (需 notebook 存在)
- [ ] 为 DD-0 ticker (POET/BESI/NVTS/USAR/POWL 等) 手动在 NotebookLM 建 notebook, 上传过去 4 季度 SEC + transcript
- [ ] 更新 `VERBATIM_TOKENS_v1.md §7` 域名表
- [ ] DD_WORKFLOW v2.3 → v2.4 bump 记录

## 9. 验证 (试点 ticker)

先拿 **BESI** (今天 Q1 2026 earnings 刚出) 作试点:
1. NotebookLM 建 `BESI_due_diligence`, 上传 2025Q1-2026Q1 的 4 个 quarterly results + 最新 FY2025 annual
2. `原话手` 四方跑 BESI Q1 2026 earnings verbatim
3. 观察 verified_quad 占比 (预期 >60%, 因为 BESI 透明度高)
4. `一致性稽查` mode=ticker:BESI 带 NotebookLM tie-breaker, 看是否 catch 出任何 SSOT vs SEC drift

如果验证通过 → 推广到 DD-0 其它 ticker.

## 10. 风险 / 限制

| 风险 | Mitigation |
|---|---|
| Gemini/NotebookLM 的 Chrome tab 被关 | watchdog + fallback + BACKFILL_TRACKER |
| NotebookLM 上传文件自动化复杂 | 前期手动, 后期看 MCP file upload 能力 |
| Gemini Deep Research 单次 10-20 min | 只用于新 SSOT 或用户明示, 不高频跑 |
| Google session 过期 | MCP 探活检测登录失效 → 通知用户重登 |
| "4 方都 fabricate 同一 quote" 的平行世界撞车 | 概率极低; `测谎员` 仍然 WebFetch source_url 做最终校验 |

---

## 修订日志

- **v1.0 · 2026-04-24** · 初版, Gemini + NotebookLM 通过 chrome-devtools MCP, 不用 CLI/API
