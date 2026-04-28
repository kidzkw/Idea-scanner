# BESI autofetch — OS-level fallback for BESI Q1 2026 earnings raw capture
# Runs independently of Claude Code session. Dumps raw HTML + text extract to _inbox/.
# Claude processes inbox on next wake.

param(
    [string]$Mode = "press"  # "press" (01:05 EDT) or "call" (12:00 EDT)
)

$ErrorActionPreference = "Continue"
$base = "D:\Claude\AI_Semi_Research"
$inbox = "$base\02_raw\_inbox"
$log = "$base\06_data_sources\_downloads\besi_autofetch.log"
$ts = Get-Date -Format "yyyy-MM-dd_HHmm"
$date = Get-Date -Format "yyyy-MM-dd"

New-Item -Path $inbox -ItemType Directory -Force | Out-Null
New-Item -Path (Split-Path $log) -ItemType Directory -Force | Out-Null

function Write-Log { param($msg) "$((Get-Date -Format 'HH:mm:ss')) [$Mode] $msg" | Out-File -FilePath $log -Append -Encoding utf8 }

Write-Log "start"

$targets = @()
if ($Mode -eq "press") {
    $targets = @(
        @{ url = "https://www.besi.com/news-investors/press-releases/"; tag = "besi-press-releases" },
        @{ url = "https://www.besi.com/news-investors/financial-calendar/"; tag = "besi-financial-calendar" },
        @{ url = "https://www.besi.com/news-investors/latest-news/"; tag = "besi-latest-news" }
    )
} else {
    $targets = @(
        @{ url = "https://www.besi.com/news-investors/press-releases/"; tag = "besi-press-releases-call" },
        @{ url = "https://www.investing.com/equities/be-semicond-earnings"; tag = "investing-besi-earnings" },
        @{ url = "https://seekingalpha.com/symbol/BESIY/earnings/transcripts"; tag = "seekingalpha-besiy-transcripts" }
    )
}

$combined = @"
---
source: autofetch
date: $date
ticker: BESI
source_detail: "OS-level PowerShell autofetch, Mode=$Mode, survives Claude session death"
topic: "BESI Q1 2026 earnings raw $Mode — fallback capture"
confidence: high
status: raw
source_weight: 70
data_quality: complete
primary_sources: []
fetch_timestamp: $ts
---

# BESI autofetch $Mode · $ts

本文件为 OS-level 自动抓取, Claude session 崩溃亦不影响. 下次 Claude 唤醒自动处理.

"@

foreach ($t in $targets) {
    try {
        Write-Log "fetching $($t.url)"
        $resp = Invoke-WebRequest -Uri $t.url -UseBasicParsing -TimeoutSec 30 -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        $htmlPath = "$inbox\${ts}_BESI_autofetch_$($t.tag).html"
        $resp.Content | Out-File -FilePath $htmlPath -Encoding utf8
        $text = $resp.Content -replace '<script[^>]*>[\s\S]*?</script>', '' -replace '<style[^>]*>[\s\S]*?</style>', '' -replace '<[^>]+>', ' ' -replace '\s+', ' '
        $textSnippet = $text.Substring(0, [Math]::Min(8000, $text.Length))
        $combined += "`n## Source: $($t.url)`n- HTML: ``$htmlPath``" + "`n- Status: $($resp.StatusCode)`n- Extract (first 8KB):`n`n$textSnippet`n`n---`n"
        Write-Log "OK $($t.url) -> $htmlPath"
    } catch {
        $combined += "`n## Source: $($t.url)`n- ERROR: $_`n`n---`n"
        Write-Log "FAIL $($t.url) :: $_"
    }
}

$mdPath = "$inbox\${ts}_BESI_autofetch_${Mode}.md"
$combined | Out-File -FilePath $mdPath -Encoding utf8
Write-Log "wrote $mdPath"
Write-Log "end"
