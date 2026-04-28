$profileDir = "D:\Claude\AI_Semi_Research\_AI_PROJECTS\grok_research\chrome_profile"
$port = 9224
$url = "https://grok.com"

New-Item -ItemType Directory -Force -Path $profileDir | Out-Null
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --user-data-dir="$profileDir" `
  --remote-debugging-port=$port `
  --window-name="Grok_Research_Sandbox" `
  $url

