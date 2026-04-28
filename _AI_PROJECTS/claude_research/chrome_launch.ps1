$profileDir = "D:\Claude\AI_Semi_Research\_AI_PROJECTS\claude_research\chrome_profile"
$port = 9227
$url = "https://claude.ai"

New-Item -ItemType Directory -Force -Path $profileDir | Out-Null
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --user-data-dir="$profileDir" `
  --remote-debugging-port=$port `
  --window-name="Claude_Research_Sandbox" `
  $url

