# Plan B master pull - HN + SE + GH in sequence
# Run via Task Scheduler or manually:  powershell.exe -File pull_all.ps1
# Logs to _logs/plan_b_YYYY-MM-DD_HHmm.log

$ErrorActionPreference = "Continue"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$LogDir = Join-Path $ScriptDir "_logs"
if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir | Out-Null }

$Stamp = Get-Date -Format "yyyy-MM-dd_HHmm"
$LogFile = Join-Path $LogDir "plan_b_$Stamp.log"

function Run-Pull {
    param([string]$Script)
    $Path = Join-Path $ScriptDir $Script
    "=== $(Get-Date -Format 'HH:mm:ss') Running $Script ===" | Tee-Object -FilePath $LogFile -Append
    & python $Path 2>&1 | Tee-Object -FilePath $LogFile -Append
    if ($LASTEXITCODE -ne 0) {
        "WARNING: $Script exited with code $LASTEXITCODE" | Tee-Object -FilePath $LogFile -Append
    }
}

"=== Plan B run started at $(Get-Date) ===" | Tee-Object -FilePath $LogFile

Run-Pull "hn_pull.py"
Run-Pull "se_pull.py"
Run-Pull "gh_pull.py"

# Summary
$Inbox = Join-Path $ScriptDir "..\..\..\02_raw\_inbox"
$Count = (Get-ChildItem -Path $Inbox -File -ErrorAction SilentlyContinue | Measure-Object).Count
"=== Plan B run done. Inbox total: $Count files ===" | Tee-Object -FilePath $LogFile -Append
