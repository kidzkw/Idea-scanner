# Chrome MCP Watchdog
# On each run:
#   1. Check http://localhost:PORT/json/version (real DevTools Protocol response)
#   2. If dead: kill Chrome with --user-data-dir=C:\ChromeMCP, then restart
#   3. If alive: no-op
# Idempotent; safe to run every 5 minutes via Task Scheduler.

param(
    [int]$Port = 9222,
    [string]$UserDataDir = "C:\ChromeMCP",
    [string[]]$InitialTabs = @(
        "https://unusualwhales.com/",
        "https://chatgpt.com/",
        "https://grok.com/"
    ),
    [switch]$VerboseLog,
    [switch]$ForceRestart
)

$ErrorActionPreference = "Continue"

# Hard-coded log file path (independent of script location; uses only ASCII in code).
$script:LogFile = "D:\Claude\AI_Semi_Research\06_data_sources\_downloads\uw_scans\chrome_watchdog.log"

function Write-Log {
    param([string]$msg)
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$ts] $msg"
    Write-Output $line
    try {
        $dir = Split-Path -Path $script:LogFile -Parent
        if ($dir -and -not (Test-Path $dir)) {
            New-Item -ItemType Directory -Force -Path $dir | Out-Null
        }
        Add-Content -Path $script:LogFile -Value $line -ErrorAction SilentlyContinue
    } catch {
        # Non-fatal: if logging fails, stdout still has the line.
    }
}

function Test-DevToolsAlive {
    param([int]$Port)
    try {
        $resp = Invoke-WebRequest -Uri "http://localhost:$Port/json/version" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
        if ($resp.StatusCode -eq 200) {
            if ($VerboseLog) {
                try {
                    $json = $resp.Content | ConvertFrom-Json
                    Write-Log "DevTools alive on port $Port (Browser: $($json.Browser))"
                } catch {
                    Write-Log "DevTools alive on port $Port (parse failed)"
                }
            }
            return $true
        }
    } catch {
        if ($VerboseLog) { Write-Log "DevTools check failed: $($_.Exception.Message)" }
    }
    return $false
}

function Get-ChromeMcpInstance {
    param([string]$UserDataDir)
    return Get-CimInstance Win32_Process -Filter "Name = 'chrome.exe'" -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -and $_.CommandLine -like "*--user-data-dir=$UserDataDir*" }
}

function Find-ChromeExe {
    $candidates = @(
        "C:\Program Files\Google\Chrome\Application\chrome.exe",
        "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
    )
    foreach ($p in $candidates) { if (Test-Path $p) { return $p } }
    return $null
}

function Stop-ChromeMcpInstance {
    param([string]$UserDataDir)
    $procs = Get-ChromeMcpInstance -UserDataDir $UserDataDir
    if ($procs) {
        Write-Log "Killing $($procs.Count) stale Chrome MCP process(es) using profile $UserDataDir"
        foreach ($p in $procs) {
            try { Stop-Process -Id $p.ProcessId -Force -ErrorAction Stop } catch { }
        }
        Start-Sleep -Seconds 2
    }
}

function Start-ChromeMcp {
    param([string]$ExePath, [string]$UserDataDir, [int]$Port, [string[]]$Tabs)
    if (-not (Test-Path $UserDataDir)) {
        New-Item -ItemType Directory -Force -Path $UserDataDir | Out-Null
    }
    $argList = @(
        "--remote-debugging-port=$Port",
        "--user-data-dir=$UserDataDir",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-background-mode",
        "--disable-features=CalculateNativeWinOcclusion"
    )
    $argList += $Tabs
    Write-Log "Starting Chrome MCP (port=$Port, profile=$UserDataDir)"
    Start-Process -FilePath $ExePath -ArgumentList $argList -WindowStyle Minimized
}

# --- Main flow ---

# If ForceRestart: kill and restart even if alive (useful to replace a foreign Chrome on the port).
if ($ForceRestart) {
    Write-Log "ForceRestart requested"
    Stop-ChromeMcpInstance -UserDataDir $UserDataDir
    $chrome = Find-ChromeExe
    if (-not $chrome) { Write-Log "ABORT: chrome.exe not found"; exit 2 }
    Start-ChromeMcp -ExePath $chrome -UserDataDir $UserDataDir -Port $Port -Tabs $InitialTabs
    Start-Sleep -Seconds 5
    if (Test-DevToolsAlive -Port $Port) { Write-Log "OK: Chrome MCP restarted"; exit 0 }
    Write-Log "FAIL: Chrome MCP did not come up after ForceRestart"
    exit 1
}

if (Test-DevToolsAlive -Port $Port) {
    if ($VerboseLog) { Write-Log "OK: port $Port already alive, no-op" }
    exit 0
}

Write-Log "Chrome MCP DOWN on port $Port, restarting..."

$chrome = Find-ChromeExe
if (-not $chrome) {
    Write-Log "ABORT: chrome.exe not found in any standard location"
    exit 2
}

Stop-ChromeMcpInstance -UserDataDir $UserDataDir
Start-ChromeMcp -ExePath $chrome -UserDataDir $UserDataDir -Port $Port -Tabs $InitialTabs

# Wait up to 10s for port to come up
$ok = $false
for ($i = 0; $i -lt 10; $i++) {
    Start-Sleep -Seconds 1
    if (Test-DevToolsAlive -Port $Port) { $ok = $true; break }
}

if ($ok) {
    Write-Log "OK: Chrome MCP recovered on port $Port"
    exit 0
} else {
    Write-Log "FAIL: Chrome MCP did not come up within 10s"
    exit 1
}
