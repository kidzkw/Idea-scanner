---
file_type: google_alerts_config_starter
created: 2026-04-24
purpose: 用户在 google.com/alerts 批量建 alert, 为 Gmail-to-_inbox routine 提供 signal 源
status: draft (待用户配置)
---

# Google Alerts 起步清单

## 怎么用

1. 打开 https://google.com/alerts (需登录个人 Gmail)
2. 每行一个 alert, 把 "Query" 列粘到顶部输入框
3. 点 "Show options":
   - **How often**: As-it-happens (实时, 对 DD-0 ticker) / Once a day (其他)
   - **Sources**: News (首选) / Blogs (只对 IPO 选)
   - **Language**: English
   - **Region**: Any (或 US)
   - **How many**: Only the best results
   - **Deliver to**: 你的 Gmail (默认)
4. 点 Create Alert
5. 在 Gmail 里建一个 label `AI_Semi_Research_Alerts`, 设 filter: `from:googlealerts-noreply@google.com` → apply label + skip inbox (避免污染主 inbox, 方便 routine 抓)

---

## Alert 分组 (按优先级)

### 组 1 · DD-0 Tickers (实时推送, high priority)

每个 DD-0 ticker 建 3 条:
```
"POET Technologies" earnings
"POET Technologies" insider
"POET Technologies" CEO

"BE Semiconductor" earnings
"BE Semiconductor" hybrid bonding
"BE Semiconductor" insider

"Navitas Semiconductor" earnings
"Navitas Semiconductor" GaN
"Navitas Semiconductor" insider

"Wolfspeed" earnings
"Wolfspeed" SiC
"Wolfspeed" bankruptcy

"US Antimony" rare earth
"US Antimony" Serra Verde
"US Antimony" DOD

"Powell Industries" earnings
"Powell Industries" data center

"Astera Labs" earnings
"Astera Labs" insider

"MP Materials" rare earth
"MP Materials" DOD

"Planet Labs" earnings
"Planet Labs" DOD contract

"Rocket Lab" Neutron
"Rocket Lab" earnings

"BlackSky" earnings
"BlackSky" DOD
```

(按你实际 DD-0 list 调整)

### 组 2 · 行业风声 (每日聚合)

```
semiconductor M&A "billion"
AI chip IPO 2026
"data center" power contract
rare earth "Department of Defense"
nuclear SMR announcement
quantum computing "earnings"
optical interconnect "design win"
GaN SiC "market share"
"CPO" co-packaged optics
"HBM" shortage
```

### 组 3 · 监管 / 政策 (每日聚合)

```
CHIPS Act grant announcement
"export control" semiconductor China
"Section 232" rare earth
FTC antitrust semiconductor
DOD "Other Transaction Authority"
ITAR "rare earth"
```

### 组 4 · 高管动向 (每日聚合)

```
"Suresh Venkatesan" (POET CEO)
"Michael Hurlston" (大多数 DD-0 CEO 名字这样写)
"Gene Banucci" (Navitas CEO)
"Gregg Lowe" (Wolfspeed CEO)
"Gary Evans" (US Antimony CEO)
"Brett Moody" (Powell CEO)
"Jitendra Mohan" (Astera Labs CEO)
"Jim Litinsky" (MP Materials CEO)
"Will Marshall" (Planet Labs CEO)
"Peter Beck" (Rocket Lab CEO)

# 加你主要持仓/关注 ticker 的 CEO/CFO 名字
```

### 组 5 · Catalyst Keywords (每日聚合)

```
"guidance raised" semiconductor
"guidance cut" semiconductor  
"S-1 filed" chip
"8-K" merger chip
"13G" 5% semiconductor
"short interest" semiconductor
```

---

## 预期效果

- 组 1 + 2 大概 20-30 封邮件/天 (信号密度高)
- 组 3 + 4 + 5 大概 10-20 封邮件/天 (宽频)
- 全加 ≈ 30-50 封/天, routine 过滤后转成 5-15 个新 raw 到 _inbox/
- 试运行 1 周后, 用户根据 signal/noise 调整 (删掉噪音太多的 alert)

---

## 云端 routine 会怎么处理

当 Gmail MCP token 重新授权后, 一个 /schedule 每日 06:00 agent 会:

1. `search_threads query='label:AI_Semi_Research_Alerts newer_than:1d'`
2. 对每个 thread: `get_thread` 取正文
3. Parse Google Alerts 邮件结构 (每封有 2-5 条结果, 每条带 title + URL + 摘要)
4. 按 ticker 归类 (正则匹配 ticker 符号或公司名)
5. 每 ticker 生成一个 raw 文件:
   ```
   02_raw/_inbox/YYYY-MM-DD_<TICKER>_google-alerts_<date>.md
   ---
   source: news
   date: YYYY-MM-DD
   ticker: <T>
   source_detail: "Google Alerts daily digest"
   url: [<news url 1>, <news url 2>, ...]
   topic: "<聚合标题>"
   confidence: medium
   status: raw
   source_weight: 65
   data_quality: complete
   primary_sources: [<URLs>]
   ---
   
   ## Google Alerts headlines (past 24h)
   
   1. <title 1> (<source domain>, <date>)
      URL: <url>
      Snippet: ...
   
   2. ...
   ```
6. Git commit + push
7. 用户本地 `git pull` 就看到新 raw

---

## 配置后通知

完成 alert 配置 + Gmail label filter 后, 告诉我:
- 大概建了多少条 alert
- label 名字是 `AI_Semi_Research_Alerts` 还是别的

然后我启用云端 /schedule routine.
