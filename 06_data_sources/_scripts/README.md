# AI Semi Research — 本地自动化基础设施

两层调度:
1. **Chrome MCP Watchdog** — 保持 Chrome (带 debug port) 始终在线, 供 chrome-devtools MCP 连接. 登录时启动 + 每 5 分钟自愈.
2. **UW Daily Scan** — 每天 **08:00 ET (pre-market)** 和 **17:30 ET (post-close)** 扫 21 支 watchlist + event 标的, 抓 options flow + dark pool, 触发阈值时写 `02_raw/_inbox/` 摘要.

---

## 文件清单

| 文件 | 作用 |
|---|---|
| `chrome_mcp_watchdog.ps1` | 检查 port 9222 是否活, 不活则重启专用 Chrome 实例 (user-data-dir=`C:\ChromeMCP`) |
| `register_chrome_mcp.ps1` | 注册/注销 `Chrome MCP Watchdog` 调度 (登录 + 每 5 分钟) |
| `uw_scan_prompt.md` | Claude headless 扫描 prompt (21 票 + 提取 JS + 触发阈值) |
| `uw_scan.ps1` | PowerShell runner — 调 `claude -p`, 写日志 |
| `register_uw_scans.ps1` | 注册/注销两档 UW scan (08:00 / 17:30) |

---

## 首次安装顺序 (按这个顺序!)

### Step 1 — 注册 Chrome MCP watchdog (只装一次)

打开 PowerShell (不需要 admin):
```powershell
cd "D:\Claude\AI_Semi_Research\06_data_sources\_scripts"
.\register_chrome_mcp.ps1
```

立即手动跑一次, Chrome 会启动到 `C:\ChromeMCP` 专用 profile (分开你日常 Chrome):
```powershell
schtasks /run /tn "Chrome MCP Watchdog - Logon"
```

约 10s 后应能看到一个最小化的 Chrome 窗口, 打开了 UW / ChatGPT / Grok 三个 tab.

### Step 2 — 在这个专用 Chrome 实例里手动登录三个站

**重要**: 这个 Chrome 和你日常 Chrome 用不同 profile, cookie 不共享. **每个站都要独立登录一次**.

- UW: `https://unusualwhales.com/` → Sign in
- ChatGPT: `https://chatgpt.com/` → Log in
- Grok: `https://grok.com/` → Log in

登录态持久化存在 `C:\ChromeMCP`, 只要不删该目录就不用再登 (UW session 通常 30 天有效, ChatGPT/Grok 更长).

### Step 3 — 测试 chrome-devtools MCP 能连上

在 Claude Code 里发一条: "列一下 Chrome 当前所有 tab". Claude 应该能看到你刚登录的三个站.

### Step 4 — 注册 UW 每日扫描

```powershell
.\register_uw_scans.ps1
```

立即测一次:
```powershell
Start-ScheduledTask -TaskName "UW Watchlist Scan - Post-close"
# 3-5 分钟后:
Get-ChildItem "D:\Claude\AI_Semi_Research\06_data_sources\_downloads\uw_scans\" | Sort-Object LastWriteTime -Desc | Select-Object -First 3
```

---

## 前置条件

### Claude Code CLI 在 PATH
```powershell
claude --version
```
找不到: 加 `C:\Users\%USERNAME%\.claude\bin` 到 PATH, 或 `npm install -g @anthropic-ai/claude-code` 全局装.

### 电脑在调度时点要开机 + 登录
`-RunLevel Limited` + `LogonType Interactive` 要求你桌面 session 活着. 睡眠/休眠会推迟到你解锁后执行 (可能错过时点).

**推荐**: 电源设置让电脑 07:55 / 17:25 自动唤醒 (Control Panel → Power → Advanced → Sleep → Allow Wake Timers = On; 另加 Task Scheduler 设置 "Wake the computer" — 需在任务属性里勾).

### 时区
所有任务按**本机本地时间**. 如果你不在 ET 时区, 改 `register_uw_scans.ps1` 里 `/st 08:00` 和 `/st 17:30` 成你当地对应 08:00 ET / 17:30 ET 的时刻.

---

## 输出文件

**Chrome MCP Watchdog**:
- 日志: `06_data_sources/_downloads/uw_scans/chrome_watchdog.log`
- 每次启动/重启/失败都写一行

**UW Daily Scan** (每次 scan 生成):
- JSONL: `06_data_sources/_downloads/uw_scans/{YYYY-MM-DD_HHMM}_{session}.jsonl` (21 票全记录)
- Log: 同目录下 `.log` 文件 (Claude stdout)
- 异常信号摘要 md (仅当触发阈值时): `02_raw/_inbox/{YYYY-MM-DD_HHMM}_MULTI_claude_uw-scan-{session}.md`

---

## 触发阈值 (生成摘要 md 的条件)

任一满足即生成:
1. 单日 ±5% 以上
2. Day High 破 52w High (或 Low 破 52w Low)
3. |Net Prem| ≥ $5M
4. DP % ≥ 75% 且量 ≥ 100K 股
5. Put/Call ≤ 0.25 或 ≥ 2.0
6. 单价位 DP 量 ≥ daily avg vol 50%

调整: 改 `uw_scan_prompt.md` 里 "重要信号触发标准" 章节.

---

## 故障排查

### Chrome MCP 挂了
```powershell
# 看最新日志
Get-Content "D:\Claude\AI_Semi_Research\06_data_sources\_downloads\uw_scans\chrome_watchdog.log" -Tail 20

# 手动触发一次
schtasks /run /tn "Chrome MCP Watchdog - Logon"

# 或直接跑脚本看详细
& "D:\Claude\AI_Semi_Research\06_data_sources\_scripts\chrome_mcp_watchdog.ps1" -VerboseLog
```

常见原因:
- Chrome 被用户手动关 → watchdog 5 min 内自愈
- Chrome 自动更新重启 → 同上
- `C:\ChromeMCP` 目录被锁 → kill 所有 chrome.exe 进程后重试
- UW/ChatGPT/Grok session 过期 → 手动在专用 Chrome 里重新登录一次 (cookie 会持久化)

### UW scan 任务报 "SCAN_ABORTED: no chrome-devtools session"
Claude CLI 起来时 Chrome MCP 没连上. 检查:
1. 两个 watchdog 任务是否都在 (`schtasks /query /tn "Chrome MCP Watchdog - Repeat" /v /fo LIST`)
2. `http://localhost:9222/json/version` 在浏览器打开有无 JSON 响应
3. Claude Code 本身的 MCP 配置是否指向 `localhost:9222`

### UW scan 任务报 "SCAN_ABORTED: UW session expired"
专用 Chrome 的 UW cookie 过期, 手动去 `C:\ChromeMCP` Chrome 里重新登录.

### 任务从没跑过
```powershell
Get-ScheduledTask "UW Watchlist Scan - Pre-market" | Get-ScheduledTaskInfo
```
看 `LastRunTime` + `LastTaskResult`. `0` = 成功, `0x41301` = 已运行, `0x41303` = 从未运行 (可能电脑那时睡着了).

### 临时停一天
```powershell
Disable-ScheduledTask -TaskName "UW Watchlist Scan - Pre-market"
Disable-ScheduledTask -TaskName "UW Watchlist Scan - Post-close"
# 恢复
Enable-ScheduledTask -TaskName "UW Watchlist Scan - Pre-market"
Enable-ScheduledTask -TaskName "UW Watchlist Scan - Post-close"
```

### 全部卸载
```powershell
.\register_uw_scans.ps1 -Uninstall
.\register_chrome_mcp.ps1 -Uninstall
# 可选: 删专用 profile
Remove-Item -Recurse -Force "C:\ChromeMCP"
```

---

## 已知限制 / 设计取舍

1. **美股节假日不自动跳** — 初版只跳周末. Thanksgiving/圣诞等会空跑 (scan 会成功但数据是前一日的).
2. **ChatGPT/Grok 登录过期** — watchdog 只维护 Chrome 进程, 不维护登录. 发现 scan 报 session expired 时需手动补登.
3. **专用 Chrome profile** — `C:\ChromeMCP` 和你日常 Chrome cookie 不共享. 首次需分别登录; 好处: 日常 Chrome 关了不影响 MCP.
4. **watchdog 5 分钟颗粒度** — 最坏情况 scan 触发时 Chrome 刚挂了还没自愈. 可以把 interval 改成 2 分钟但 Task Scheduler 最小 1 分钟.
5. **Claude CLI billing** — 每次 scan 约 5-10 分钟 session × 2/天 = ~60/月. 自己 monitor 用量.
6. **多 Chrome 实例冲突** — 如果你日常 Chrome 也带 `--remote-debugging-port=9222`, 会和 MCP 实例抢 port. 日常 Chrome 不加这个参数就没事.
