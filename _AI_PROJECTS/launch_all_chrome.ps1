$root = "D:\Claude\AI_Semi_Research\_AI_PROJECTS"
$scripts = @(
  "$root\chatgpt_research\chrome_launch.ps1",
  "$root\grok_research\chrome_launch.ps1",
  "$root\gemini_research\chrome_launch.ps1",
  "$root\claude_research\chrome_launch.ps1"
)

foreach ($script in $scripts) {
  if (Test-Path $script) {
    Start-Process powershell.exe -WindowStyle Hidden -ArgumentList @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $script)
  }
}


