# earnings_autofetch.ps1
# OS-level multi-ticker earnings raw capture.
# Runs independently of Claude Code session. Dumps raw HTML + text to _inbox/.
# Usage: -Tickers "AMD,POWL,ALAB,NVTS,WOLF" -EventTag "5-5-AH"

param(
    [Parameter(Mandatory=$true)][string]$Tickers,
    [Parameter(Mandatory=$true)][string]$EventTag  # e.g., "5-5-AH" / "5-6-AH"
)

$ErrorActionPreference = "Continue"
$base = "D:\Claude\AI_Semi_Research"
$inbox = "$base\02_raw\_inbox"
$log = "$base\06_data_sources\_downloads\earnings_autofetch.log"
$ts = Get-Date -Format "yyyy-MM-dd_HHmm"
$date = Get-Date -Format "yyyy-MM-dd"

New-Item -Path $inbox -ItemType Directory -Force | Out-Null
New-Item -Path (Split-Path $log) -ItemType Directory -Force | Out-Null

function Write-Log { param($msg) "$((Get-Date -Format 'HH:mm:ss')) [$EventTag] $msg" | Out-File -FilePath $log -Append -Encoding utf8 }

Write-Log "start tickers=$Tickers"

$tickerArr = $Tickers -split ','

# Source templates per ticker. Each ticker gets 2-3 sources scraped.
$sourceTemplates = @{
    "generic" = @(
        "https://www.stocktitan.net/sec-filings/{0}",
        "https://www.nasdaq.com/market-activity/stocks/{0}/press-releases",
        "https://finance.yahoo.com/quote/{0}/press-releases"
    )
}

foreach ($ticker in $tickerArr) {
    $ticker = $ticker.Trim()
    Write-Log "fetching $ticker"

    $combined = @"
---
source: autofetch
date: $date
ticker: $ticker
event_tag: $EventTag
source_detail: "OS-level PowerShell autofetch — survives Claude session death"
topic: "$ticker earnings raw capture — $EventTag event"
confidence: high
status: raw
source_weight: 70
data_quality: complete
primary_sources: []
fetch_timestamp: $ts
---

# $ticker autofetch · $EventTag · $ts

OS-level 自动抓取. Claude session 独立. 下次 Claude 唤醒处理.

"@

    foreach ($template in $sourceTemplates["generic"]) {
        $url = $template -f $ticker
        try {
            $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30 -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            $htmlPath = "$inbox\${ts}_${ticker}_autofetch_${EventTag}_$([System.IO.Path]::GetFileName($url -split '\?' | Select-Object -First 1)).html"
            $htmlPath = $htmlPath -replace '[<>:"/\\|?*]', '_'
            $resp.Content | Out-File -FilePath $htmlPath -Encoding utf8
            $text = $resp.Content -replace '<script[^>]*>[\s\S]*?</script>', '' -replace '<style[^>]*>[\s\S]*?</style>', '' -replace '<[^>]+>', ' ' -replace '\s+', ' '
            $textSnippet = $text.Substring(0, [Math]::Min(6000, $text.Length))
            $combined += "`n## Source: $url`n- HTML: ``$htmlPath``" + "`n- Status: $($resp.StatusCode)`n- Extract (first 6KB):`n`n$textSnippet`n`n---`n"
            Write-Log "OK $ticker $url"
        } catch {
            $combined += "`n## Source: $url`n- ERROR: $_`n`n---`n"
            Write-Log "FAIL $ticker $url :: $_"
        }
    }

    $mdPath = "$inbox\${ts}_${ticker}_autofetch_${EventTag}.md"
    $combined | Out-File -FilePath $mdPath -Encoding utf8
    Write-Log "wrote $mdPath"
}

Write-Log "end"
