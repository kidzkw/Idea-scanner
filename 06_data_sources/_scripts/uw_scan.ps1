# UW Watchlist Scan — headless runner for Task Scheduler
# Usage:
#   .\uw_scan.ps1 -Session pre-market
#   .\uw_scan.ps1 -Session post-close

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("pre-market","post-close")]
    [string]$Session
)

$ErrorActionPreference = "Continue"

# --- UTF-8 强制 (PS 5.1 默认 ASCII 会吞中文 stdin) ---
[Console]::InputEncoding  = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$OutputEncoding           = [System.Text.UTF8Encoding]::new($false)

# --- 非交易日跳过 ---
$day = (Get-Date).DayOfWeek
if ($day -eq 'Saturday' -or $day -eq 'Sunday') {
    Write-Output "[$(Get-Date -Format s)] Weekend ($day), skipping UW scan."
    exit 0
}

# TODO: US market holiday list — add when needed. 初版不处理节假日, 会在节假日空跑.
# 节假日你可以临时 disable task 或在此处加日期列表 check.

# --- 路径 ---
$root = "D:\Claude\AI_Semi_Research"
$promptFile = Join-Path $root "06_data_sources\_scripts\uw_scan_prompt.md"
$logDir = Join-Path $root "06_data_sources\_downloads\uw_scans"
$ts = Get-Date -Format "yyyy-MM-dd_HHmm"
$logFile = Join-Path $logDir "${ts}_${Session}.log"

if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Force -Path $logDir | Out-Null
}

# --- 读取 prompt 并替换占位符 ---
if (-not (Test-Path $promptFile)) {
    Write-Output "[$(Get-Date -Format s)] ABORT: prompt file not found at $promptFile"
    exit 2
}
$prompt = Get-Content -Raw -Encoding UTF8 -Path $promptFile
$prompt = $prompt -replace "\{\{SESSION\}\}", $Session
$prompt = $prompt -replace "\{\{TIMESTAMP\}\}", $ts

# --- 执行 Claude CLI ---
# 前置: PATH 里必须有 `claude` 命令. 如果你用 Claude Code extension 的 CLI, 通常装在
# C:\Users\<user>\.claude\bin\claude.exe 或 via npm global.
#
# -p / --print : non-interactive mode
# --dangerously-skip-permissions : 避免权限交互 (headless 必需)
# 如果你希望保留权限提示, 删掉此参数但需有人值守.
#
# prompt 走 stdin 不走 argv: PS 5.1 native command argument passing 处理
# 多行 / 含特殊字符的大段字符串会静默失败 (claude.exe 收到损坏 argv → exit 0 无输出).
Write-Output "[$(Get-Date -Format s)] Starting UW scan: session=$Session ts=$ts"

# prompt → stdin; stdout + stderr 合并写日志
# NOTE: 内联参数而非 @splat — PS 5.1 下 `& claude @splat` + stdin pipe 的组合
#       会让 stdin 不传给 claude.exe, 导致 claude 立即 EOF exit 0 无输出.
$prompt | claude -p --dangerously-skip-permissions 2>&1 | Tee-Object -FilePath $logFile

$exitCode = $LASTEXITCODE
Write-Output "[$(Get-Date -Format s)] Scan finished with exit $exitCode, log: $logFile"
exit $exitCode
