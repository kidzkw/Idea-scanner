# UW Watchlist + Event Scan Prompt (headless)

**SESSION**: {{SESSION}} (pre-market = 08:00 ET, post-close = 17:30 ET)
**TIMESTAMP**: {{TIMESTAMP}}

你正在以 headless 模式执行每日 UW 自动扫描. 不要提问, 不要给操作建议, 只按流程完成后退出.

## 前置验证

1. 列出 Chrome 页面 (`mcp__chrome-devtools__list_pages`).
2. 如果没有任何 `unusualwhales.com` 页面, 或无法 navigate (例如 MCP server 未连), **立即失败退出**, 在输出中打印 `SCAN_ABORTED: no chrome-devtools session` 并不要写任何文件.
3. 如果找到 UW 页面但返回 "Sign in" / "Log in" / "Please authenticate", 打印 `SCAN_ABORTED: UW session expired` 退出.

## 扫描清单 (21 支 watchlist + event)

```
POET, AMKR, NVTS, WOLF, ALAB, MPWR, POWL, MP, USAR, UUUU, RMBS, INOD, BKSY, RKLB, PL, NBIS, CRWV, APP, MRVL, ORCL, BESI
```

## 每支标的流程

对每个 ticker:
1. `navigate_page` → `https://unusualwhales.com/stock/{TICKER}/overview?chart=options-volume`
2. 等 6s JS 渲染
3. `evaluate_script` 运行提取 (见下)
4. 如果返回 `{"err": "no DP table"}` 或 body 为空, 标记 `no_data: true`
5. 追加一行 JSON 到输出文件

## 提取脚本 (不要修改)

```javascript
() => {
  const text = document.body.innerText;
  const lines = text.split('\n').map(l => l.trim());
  const ksStart = lines.findIndex(l => l === 'Key Stats');
  const perfStart = lines.findIndex(l => l === 'Performance');
  let stats = {};
  if (ksStart > 0 && perfStart > ksStart) {
    const seg = lines.slice(ksStart, perfStart);
    const labels = ['Market Cap','P/E Ratio','Stock Vol','Avg Vol','Put/Call Ratio','Prev Close','Open','Day Low','Day High','52W Low','52W High','Div Yield','Ex-Div Date','Earnings','Net Prem','Net Vol','Call Prem','Call Vol','Put Prem','Put Vol'];
    const labelSet = new Set(labels);
    for (let i = 0; i < seg.length; i++) { if (labelSet.has(seg[i])) { for (let j = i+1; j < Math.min(i+5, seg.length); j++) { if (seg[j] && !labelSet.has(seg[j])) { stats[seg[i]] = seg[j]; break; } } } }
  }
  const m = text.match(/Ticker\t1 Week\t1 Month\t3 Months\t6 Months\tYTD\t1 Year\t5 Years\n([^\n]+)/);
  const pN = (s) => { if (!s||!s.trim()) return 0; s=s.replace(/,/g,'').trim(); if(s.endsWith('M')) return parseFloat(s)*1e6; if(s.endsWith('K')) return parseFloat(s)*1e3; if(s.endsWith('B')) return parseFloat(s)*1e9; return parseFloat(s)||0; };
  const pP = (s) => s ? parseFloat(s.replace('%',''))||0 : 0;
  let dp = null;
  for (const t of Array.from(document.querySelectorAll('table'))) {
    const h = t.innerText.slice(0, 200);
    if (h.includes('Price Group') && h.includes('Dark Pool')) {
      const rows = Array.from(t.querySelectorAll('tbody tr')).map(tr => { const c = Array.from(tr.querySelectorAll('td, th')).map(td => td.innerText.trim()); return { range: c[1]||'', dpVol: pN(c[4]), litVol: pN(c[5]), dpPct: pP(c[6]) }; }).filter(r => r.range && (r.dpVol + r.litVol > 0));
      const tD = rows.reduce((s,r)=>s+r.dpVol,0); const tL = rows.reduce((s,r)=>s+r.litVol,0);
      dp = { n: rows.length, dp: tD, lit: tL, pct: tD+tL>0?+(tD/(tD+tL)*100).toFixed(2):0, top3: [...rows].sort((a,b)=>b.dpVol-a.dpVol).slice(0,3).map(r=>({r:r.range,d:r.dpVol,l:r.litVol,p:r.dpPct})) };
      break;
    }
  }
  return { stats, perf: m ? m[1] : null, dp };
}
```

## 输出文件

**JSONL 主文件** (一行一票):
- 路径: `D:\Claude\AI_Semi_Research\06_data_sources\_downloads\uw_scans\{{TIMESTAMP}}_{{SESSION}}.jsonl`
- 每行格式: `{"ticker":"TICKER","session":"{{SESSION}}","ts":"ISO8601","stats":{...},"perf":"...","dp":{...}}`

**摘要 markdown** (只在检测到重要信号时生成, 标准见下):
- 路径: `D:\Claude\AI_Semi_Research\02_raw\_inbox\{{TIMESTAMP}}_MULTI_claude_uw-scan-{{SESSION}}.md`
- 摘要 frontmatter 严格按 `02_raw/README.md`:
  ```yaml
  ---
  date: YYYY-MM-DD
  ticker: MULTI
  related_tickers: [...只列触发信号的...]
  source: claude
  source_detail: "headless UW scan {{SESSION}} via chrome-devtools MCP + Task Scheduler"
  url: "https://unusualwhales.com/"
  topic: "自动扫描 {{SESSION}} — N 支触发 X 类信号"
  confidence: high
  status: raw
  source_weight: 62
  ---
  ```

## 重要信号触发标准 (任何一条即写摘要 md)

1. **单日 ±5% 以上** 股价变动
2. **Day High 突破 52w High** 或 **Day Low 跌破 52w Low**
3. **Net Prem ≥ +$5M 或 ≤ -$5M** (期权净资金流显著)
4. **DP % ≥ 75% 且总量 ≥ 100K 股** (机构暗池主导)
5. **Put/Call ≤ 0.25 或 ≥ 2.0** (期权偏向极端)
6. **DP 集中单价位 ≥ 50% of daily avg vol** (价位吸筹/派发)

## 行为边界

- **不给任何建仓/减仓/仓位 $/时机/margin 建议** (Hard rule per feedback memory)
- 不调用 WebFetch / WebSearch — 本次只扫 UW 自身
- 不自动 ingest 到 03_tickers/ SSOT — 只写 _inbox/, 等用户手动 "处理 inbox"
- 失败优于误报: 如果某支标的数据不全, 跳过且标 `no_data`, 不要补齐
- 执行完成后, 在 stdout 打印一行 `SCAN_OK: {{SESSION}} {{TIMESTAMP}} — scanned N / triggered M`

## 不做

- 不开新 Chrome tab, 只 reuse 现有 UW tab
- 不截图
- 不点击任何 UI 元素
- 不 login — 若 session 过期则 abort
