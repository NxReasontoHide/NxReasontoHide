# Simple Static Web Server using PowerShell and .NET
# Usage: .\server.ps1 [[-Port] <Int32>]

param([int]$Port = 8080)

$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add("http://localhost:$Port/")
$Listener.Start()

Write-Host "Server started at http://localhost:$Port/"
Write-Host "Press Ctrl+C to stop."

$MimeTypes = @{
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
}

try {
    while ($Listener.IsListening) {
        $Context = $Listener.GetContext()
        $Request = $Context.Request
        $Response = $Context.Response

        $Path = $Request.Url.LocalPath
        if ($Path -eq "/") { $Path = "/index.html" }
        
        $LocalPath = Join-Path $PWD $Path.TrimStart('/')
        
        if (Test-Path $LocalPath -PathType Leaf) {
            try {
                $Content = [System.IO.File]::ReadAllBytes($LocalPath)
                $Extension = [System.IO.Path]::GetExtension($LocalPath).ToLower()
                
                if ($MimeTypes.ContainsKey($Extension)) {
                    $Response.ContentType = $MimeTypes[$Extension]
                } else {
                    $Response.ContentType = "application/octet-stream"
                }
                
                $Response.ContentLength64 = $Content.Length
                $Response.OutputStream.Write($Content, 0, $Content.Length)
                $Response.StatusCode = 200
            } catch {
                $Response.StatusCode = 500
            }
        } else {
            $Response.StatusCode = 404
        }
        
        $Response.Close()
    }
} finally {
    $Listener.Stop()
}
