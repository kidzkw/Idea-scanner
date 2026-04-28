---
file_type: user_operation_guide
version: v1.0
created: 2026-04-27
purpose: "为 Claude Code 添加 5 个 dedicated chrome-devtools MCP servers (per AI source). 完成后 main Claude / subagents 即可使用 mcp__chrome-<source>__* 隔离 namespace."
audience: 用户 (一次性配置)
ETA: 10-15 min (config + restart + sign-in)
---

# MCP Server 配置：5 个 Chrome MCP 实例

## 背景

每个 AI source 独立 chrome 实例 + 独立 chrome MCP server。
Tools 自动 namespace: `mcp__chrome-chatgpt__list_pages`, `mcp__chrome-grok__list_pages`, ...

## Step 1 — 启动 5 chrome 实例

打开 PowerShell, 跑:

```powershell
& D:\Claude\AI_Semi_Research\_AI_PROJECTS\launch_all_chrome.ps1
```

等 5 chrome 启动 (各自独立 profile, 独立 port).

验证端口:
```powershell
& D:\Claude\AI_Semi_Research\_AI_PROJECTS\check_ports.ps1
```

应看到 5 行 `Status=ok`, ports 9223-9227.

## Step 2 — 各 chrome 一次性 sign-in

| Window | URL | 登 |
|---|---|---|
| ChatGPT_Research_Sandbox (port 9223) | chatgpt.com | ChatGPT Plus account |
| Grok_Research_Sandbox (port 9224) | grok.com | X / Grok Premium |
| Gemini_Research_Sandbox (port 9225) | gemini.google.com | Google account |
| DeepSeek_Research_Sandbox (port 9226) | chat.deepseek.com | DeepSeek account |
| Claude_Research_Sandbox (port 9227) | claude.ai | (optional, 仅当用 web Claude 作为 4th-tier source) |

Cookies 持久存于各自 `chrome_profile/`, 一次登录即可.

## Step 3 — 添加 5 MCP server entries

### 找到 Claude Code MCP 配置文件

Windows 通常在以下位置之一:
- `%APPDATA%\Claude\claude_desktop_config.json` (Claude Desktop)
- 或通过 CLI: `claude mcp add ...` 命令逐个加

### Config 模板 (合并到现有 mcpServers)

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    },
    "chrome-chatgpt": {
      "command": "npx",
      "args": [
        "-y", "chrome-devtools-mcp@latest",
        "--browserUrl", "http://127.0.0.1:9223"
      ]
    },
    "chrome-grok": {
      "command": "npx",
      "args": [
        "-y", "chrome-devtools-mcp@latest",
        "--browserUrl", "http://127.0.0.1:9224"
      ]
    },
    "chrome-gemini": {
      "command": "npx",
      "args": [
        "-y", "chrome-devtools-mcp@latest",
        "--browserUrl", "http://127.0.0.1:9225"
      ]
    },
    "chrome-deepseek": {
      "command": "npx",
      "args": [
        "-y", "chrome-devtools-mcp@latest",
        "--browserUrl", "http://127.0.0.1:9226"
      ]
    },
    "chrome-claude": {
      "command": "npx",
      "args": [
        "-y", "chrome-devtools-mcp@latest",
        "--browserUrl", "http://127.0.0.1:9227"
      ]
    }
  }
}
```

**注**: 保留原 `chrome-devtools` (port 9222 默认) 作为 legacy fallback;
新加 5 个 namespace 隔离 server.

### CLI 命令 (alternate 添加方式)

```bash
claude mcp add chrome-chatgpt --command "npx" --args "-y" "chrome-devtools-mcp@latest" "--browserUrl" "http://127.0.0.1:9223"
claude mcp add chrome-grok    --command "npx" --args "-y" "chrome-devtools-mcp@latest" "--browserUrl" "http://127.0.0.1:9224"
claude mcp add chrome-gemini  --command "npx" --args "-y" "chrome-devtools-mcp@latest" "--browserUrl" "http://127.0.0.1:9225"
claude mcp add chrome-deepseek --command "npx" --args "-y" "chrome-devtools-mcp@latest" "--browserUrl" "http://127.0.0.1:9226"
claude mcp add chrome-claude  --command "npx" --args "-y" "chrome-devtools-mcp@latest" "--browserUrl" "http://127.0.0.1:9227"
```

## Step 4 — 重启 Claude Code

完全退出 Claude Code → 重新打开 → 验证新 tools 出现:

`/mcp` 命令应列出 6 chrome-devtools servers (legacy + 5 new).

或在对话中尝试:
```
mcp__chrome-chatgpt__list_pages → 应返回 chatgpt.com tab
mcp__chrome-grok__list_pages    → 应返回 grok.com tab
... 等等
```

## Step 5 — 完成

返回告知 main Claude "MCP 5 server 已加, 5 chrome 已起, 全 sign-in 完成", 即开始 Phase 3 pilot (NVDA).

## 故障排查

| 症状 | 原因 | 修复 |
|---|---|---|
| `Status=down` on `check_ports.ps1` | chrome 没启动 / 端口冲突 | 杀该 port chrome, 重跑 launch script |
| MCP tool 不出现 in `/mcp` | Claude Code 没重启 / config syntax 错 | 检查 JSON syntax, 重启 |
| `npx -y chrome-devtools-mcp` 慢 | 首次安装 npm package | 等首次, 后续 cached |
| 多个 chrome 同时 占内存高 | 5 chrome × ~300MB = 1.5 GB+ | 16GB+ RAM 推荐 |
| 某 AI tab 被踢出登录 | 长时间不动 cookies 过期 | 重新 sign-in, 重启该 chrome 不影响其他 |

## 当前状态

- ✅ 5 sandbox 文件夹已建
- ✅ 5 chrome_launch.ps1 已就位
- ✅ launch_all_chrome.ps1 一键启动
- ✅ MCP_PORT_REGISTRY.json 权威 port 表
- ⏳ 用户启动 5 chrome
- ⏳ 用户 sign-in × 5
- ⏳ 用户加 5 MCP server entries 到 Claude Code config
- ⏳ 重启 Claude Code

完成后可进 Phase 3 pilot.
