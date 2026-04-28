$profileDir = "D:\Claude\AI_Semi_Research\_AI_PROJECTS\chatgpt_research\chrome_profile"
$port = 9223
$url = "https://chatgpt.com"

New-Item -ItemType Directory -Force -Path $profileDir | Out-Null
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --user-data-dir="$profileDir" `
  --remote-debugging-port=$port `
  --window-name="ChatGPT_Research_Sandbox" `
  $url

