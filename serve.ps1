param(
    [int]$Port = 8090,
    [string]$RootDir = $PSScriptRoot
)

Add-Type -AssemblyName System.Net.HttpListener -ErrorAction SilentlyContinue

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Output "Serving $RootDir on http://localhost:$Port/"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".webp" = "image/webp"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".txt"  = "text/plain; charset=utf-8"
    ".mp4"  = "video/mp4"
    ".webm" = "video/webm"
    ".mov"  = "video/quicktime"
}

# A real browser opens several parallel connections per page (main doc + css
# + js + a dozen images). The old version of this script handled one request
# at a time in a single loop: on an image-heavy page the backlog piled up,
# some connections got refused, and a failed write on a keep-alive connection
# could desync the TCP stream so the NEXT unrelated request received a
# mismatched response (looked like navigating to the wrong page). This pool
# lets several requests be read/served concurrently, same as a real server.
$maxConcurrent = 12
$rsPool = [System.Management.Automation.Runspaces.RunspaceFactory]::CreateRunspacePool(1, $maxConcurrent)
$rsPool.Open()
$pending = New-Object System.Collections.Generic.List[System.Management.Automation.PowerShell]

$handler = {
    param($context, $RootDir, $mimeTypes)
    try {
        $request = $context.Request
        $response = $context.Response
        $response.KeepAlive = $false

        $urlPath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath)
        if ($urlPath -eq "/") { $urlPath = "/index.html" }

        $filePath = Join-Path $RootDir ($urlPath.TrimStart("/"))

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = $mimeTypes[$ext]
            if (-not $contentType) { $contentType = "application/octet-stream" }
            $response.ContentType = $contentType
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $response.ContentLength64 = $notFoundBytes.Length
            $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
        }
    } catch {
        Write-Output "Error: $_"
    } finally {
        try { $context.Response.OutputStream.Close() } catch {}
    }
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()

        $ps = [System.Management.Automation.PowerShell]::Create()
        $ps.RunspacePool = $rsPool
        [void]$ps.AddScript($handler).AddArgument($context).AddArgument($RootDir).AddArgument($mimeTypes)
        $asyncResult = $ps.BeginInvoke()
        $pending.Add($ps)

        # Periodically reap finished handles so $pending doesn't grow forever.
        if ($pending.Count -gt 200) {
            $stillRunning = New-Object System.Collections.Generic.List[System.Management.Automation.PowerShell]
            foreach ($p in $pending) {
                if ($p.InvocationStateInfo.State -eq 'Running' -or $p.InvocationStateInfo.State -eq 'NotStarted') {
                    $stillRunning.Add($p)
                } else {
                    $p.Dispose()
                }
            }
            $pending = $stillRunning
        }
    } catch {
        Write-Output "Error: $_"
    }
}
