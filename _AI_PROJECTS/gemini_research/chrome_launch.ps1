$profileDir = "D:\Claude\AI_Semi_Research\_AI_PROJECTS\gemini_research\chrome_profile"
$port = 9225
$url = "https://gemini.google.com"

New-Item -ItemType Directory -Force -Path $profileDir | Out-Null
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --user-data-dir="$profileDir" `
  --remote-debugging-port=$port `
  --window-name="Gemini_Research_Sandbox" `
  $url

