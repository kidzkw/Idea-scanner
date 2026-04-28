$ports = @(9223, 9224, 9225, 9227)

foreach ($port in $ports) {
  $url = "http://127.0.0.1:$port/json/version"
  try {
    $result = Invoke-RestMethod -Uri $url -TimeoutSec 2
    [PSCustomObject]@{
      Port = $port
      Status = "ok"
      Browser = $result.Browser
      WebSocketDebuggerUrl = $result.webSocketDebuggerUrl
    }
  } catch {
    [PSCustomObject]@{
      Port = $port
      Status = "down"
      Browser = ""
      WebSocketDebuggerUrl = ""
    }
  }
}

