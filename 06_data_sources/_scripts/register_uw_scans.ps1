# Register UW Daily Scan tasks via schtasks /create /xml.
# Two daily tasks: 08:00 (pre-market) and 17:30 (post-close).

param([switch]$Uninstall)

$script = "D:\Claude\AI_Semi_Research\06_data_sources\_scripts\uw_scan.ps1"

$tasks = @(
    @{ Name = "UW Watchlist Scan - Pre-market"; Time = "08:00:00"; Session = "pre-market" },
    @{ Name = "UW Watchlist Scan - Post-close"; Time = "17:30:00"; Session = "post-close" }
)

# Cleanup any prior versions (works whether they exist or not)
foreach ($t in $tasks) {
    cmd /c "schtasks /delete /tn `"$($t.Name)`" /f >nul 2>&1"
}

if ($Uninstall) {
    Write-Output "Unregistered (cleanup done)."
    exit 0
}

if (-not (Test-Path $script)) {
    Write-Output "ABORT: $script not found."
    exit 2
}

$user = "$env:USERDOMAIN\$env:USERNAME"

foreach ($t in $tasks) {
    $name = $t.Name
    $session = $t.Session
    $startBoundary = (Get-Date -Format "yyyy-MM-dd") + "T" + $t.Time
    $scriptXml = [System.Security.SecurityElement]::Escape($script)

    $xml = @"
<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Description>Headless UW flow+DP scan ($session) via chrome-devtools MCP</Description>
  </RegistrationInfo>
  <Triggers>
    <CalendarTrigger>
      <StartBoundary>$startBoundary</StartBoundary>
      <Enabled>true</Enabled>
      <ScheduleByDay>
        <DaysInterval>1</DaysInterval>
      </ScheduleByDay>
    </CalendarTrigger>
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
    <RunOnlyIfNetworkAvailable>true</RunOnlyIfNetworkAvailable>
    <IdleSettings>
      <StopOnIdleEnd>false</StopOnIdleEnd>
      <RestartOnIdle>false</RestartOnIdle>
    </IdleSettings>
    <AllowStartOnDemand>true</AllowStartOnDemand>
    <Enabled>true</Enabled>
    <Hidden>false</Hidden>
    <RunOnlyIfIdle>false</RunOnlyIfIdle>
    <WakeToRun>false</WakeToRun>
    <ExecutionTimeLimit>PT15M</ExecutionTimeLimit>
    <Priority>7</Priority>
  </Settings>
  <Actions Context="Author">
    <Exec>
      <Command>powershell.exe</Command>
      <Arguments>-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File "$scriptXml" -Session $session</Arguments>
    </Exec>
  </Actions>
</Task>
"@

    $xmlPath = Join-Path $env:TEMP "uw_scan_$session.xml"
    $xml | Out-File -FilePath $xmlPath -Encoding Unicode -Force

    Write-Output "Registering: $name at $($t.Time)"
    schtasks /create /tn $name /xml $xmlPath /f
    $rc = $LASTEXITCODE
    Remove-Item $xmlPath -Force -ErrorAction SilentlyContinue
    if ($rc -ne 0) {
        Write-Output "FAIL: schtasks /create exit $rc for $name"
        exit 1
    }
}

Write-Output ""
Write-Output "Both tasks registered."
Write-Output ""
Write-Output "Verify:"
Write-Output "  schtasks /query /tn `"UW Watchlist Scan - Pre-market`" /v /fo LIST"
Write-Output "  schtasks /query /tn `"UW Watchlist Scan - Post-close`" /v /fo LIST"
Write-Output ""
Write-Output "Test run now:"
Write-Output "  schtasks /run /tn `"UW Watchlist Scan - Post-close`""
