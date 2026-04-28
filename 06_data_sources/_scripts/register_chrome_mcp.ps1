# Register Chrome MCP Watchdog Task
#
# 用 schtasks /create /xml 导入 XML 定义, 完全绕开 PS 模块版本差异.
# 单任务, 两 trigger (登录 + 每 5 分钟).

param([switch]$Uninstall)

# NOTE: 不设 $ErrorActionPreference = "Stop" — PS 5.1 会把 native cmd stderr 当 terminating error

$taskName = "Chrome MCP Watchdog"
$script = "D:\Claude\AI_Semi_Research\06_data_sources\_scripts\chrome_mcp_watchdog.ps1"

# --- 清理旧任务 (v1/v2/v3 遗留). 用 cmd /c + >nul 2>&1 吞掉 schtasks 对不存在任务的 stderr ---
$oldNames = @("Chrome MCP Watchdog", "Chrome MCP Watchdog - Logon", "Chrome MCP Watchdog - Repeat")
foreach ($n in $oldNames) {
    cmd /c "schtasks /delete /tn `"$n`" /f >nul 2>&1"
}

if ($Uninstall) {
    Write-Output "Unregistered (cleanup done)."
    exit 0
}

if (-not (Test-Path $script)) {
    Write-Output "ABORT: $script not found."
    exit 2
}

# --- 生成 XML ---
$user = "$env:USERDOMAIN\$env:USERNAME"
$startBoundary = (Get-Date).AddMinutes(1).ToString("s")  # ISO 8601 local time, no tz

# XML-escape script path (& < > ' " → entities)
$scriptXml = [System.Security.SecurityElement]::Escape($script)

$xml = @"
<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Description>Keeps Chrome MCP alive on port 9222 for UW/ChatGPT/Grok pipeline</Description>
  </RegistrationInfo>
  <Triggers>
    <LogonTrigger>
      <Enabled>true</Enabled>
      <UserId>$user</UserId>
    </LogonTrigger>
    <TimeTrigger>
      <Repetition>
        <Interval>PT5M</Interval>
        <StopAtDurationEnd>false</StopAtDurationEnd>
      </Repetition>
      <StartBoundary>$startBoundary</StartBoundary>
      <Enabled>true</Enabled>
    </TimeTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author">
      <UserId>$user</UserId>
      <LogonType>InteractiveToken</LogonType>
      <RunLevel>LeastPrivilege</RunLevel>
    </Principal>
  </Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <AllowHardTerminate>true</AllowHardTerminate>
    <StartWhenAvailable>true</StartWhenAvailable>
    <RunOnlyIfNetworkAvailable>false</RunOnlyIfNetworkAvailable>
    <IdleSettings>
      <StopOnIdleEnd>false</StopOnIdleEnd>
      <RestartOnIdle>false</RestartOnIdle>
    </IdleSettings>
    <AllowStartOnDemand>true</AllowStartOnDemand>
    <Enabled>true</Enabled>
    <Hidden>false</Hidden>
    <RunOnlyIfIdle>false</RunOnlyIfIdle>
    <WakeToRun>false</WakeToRun>
    <ExecutionTimeLimit>PT3M</ExecutionTimeLimit>
    <Priority>7</Priority>
  </Settings>
  <Actions Context="Author">
    <Exec>
      <Command>powershell.exe</Command>
      <Arguments>-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File "$scriptXml"</Arguments>
    </Exec>
  </Actions>
</Task>
"@

# --- 写 XML 到临时文件 (UTF-16 LE with BOM — Task Scheduler 要这个编码) ---
$xmlPath = Join-Path $env:TEMP "chrome_mcp_watchdog_task.xml"
$xml | Out-File -FilePath $xmlPath -Encoding Unicode -Force

# --- 导入 ---
Write-Output "Creating task '$taskName' from XML..."
schtasks /create /tn $taskName /xml $xmlPath /f
$rc = $LASTEXITCODE
Remove-Item $xmlPath -Force -ErrorAction SilentlyContinue

if ($rc -ne 0) {
    Write-Output "FAIL: schtasks /create exit $rc"
    exit 1
}

# --- 验证 ---
$verify = cmd /c "schtasks /query /tn `"$taskName`" /fo LIST 2>nul"
if (-not $verify) {
    Write-Output "FAIL: Task not found after create."
    exit 1
}

Write-Output ""
Write-Output "OK: '$taskName' registered."
Write-Output "Triggers: AtLogOn + every 5 min (starting $startBoundary)"
Write-Output ""
Write-Output "Trigger once now:"
Write-Output "  schtasks /run /tn `"$taskName`""
Write-Output ""
Write-Output "Verify status:"
Write-Output "  schtasks /query /tn `"$taskName`" /v /fo LIST"
Write-Output ""
Write-Output "Live watchdog log:"
Write-Output "  Get-Content `"D:\Claude\AI_Semi_Research\06_data_sources\_downloads\uw_scans\chrome_watchdog.log`" -Tail 20 -Wait"
