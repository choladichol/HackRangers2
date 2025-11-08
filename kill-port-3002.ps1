# Script to kill process running on port 3002

$port = 3002
Write-Host "Checking for process on port $port..." -ForegroundColor Cyan

$connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($connection) {
    $pid = $connection.OwningProcess
    $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
    $processName = if ($process) { $process.ProcessName } else { "Unknown" }
    
    Write-Host "Found process: $processName (PID: $pid)" -ForegroundColor Yellow
    Write-Host "Killing process..." -ForegroundColor Yellow
    
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    
    # Verify it's killed
    Start-Sleep -Milliseconds 500
    $stillRunning = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if (-not $stillRunning) {
        Write-Host "Process successfully killed!" -ForegroundColor Green
    } else {
        Write-Host "Warning: Process may still be running" -ForegroundColor Red
    }
} else {
    Write-Host "No process found on port $port" -ForegroundColor Green
}

