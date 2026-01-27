Write-Host "🔧 Fixing deployment issues..." -ForegroundColor Yellow

# Stop any running containers
Write-Host "Stopping existing containers..." -ForegroundColor Blue
docker-compose down --remove-orphans

# Clean up Docker
Write-Host "Cleaning up Docker..." -ForegroundColor Blue
docker system prune -f

# Rebuild and start containers
Write-Host "Building and starting containers..." -ForegroundColor Blue
docker-compose up --build -d

# Wait for containers to start
Write-Host "Waiting for containers to start..." -ForegroundColor Blue
Start-Sleep -Seconds 30

# Check container status
Write-Host "Container status:" -ForegroundColor Green
docker-compose ps

# Test backend health
Write-Host "Testing backend health..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -TimeoutSec 10
    Write-Host "✅ Backend responding: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend not responding" -ForegroundColor Red
}

# Test frontend
Write-Host "Testing frontend..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3003" -TimeoutSec 10
    Write-Host "✅ Frontend responding: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend not responding" -ForegroundColor Red
}

# Test nginx proxy
Write-Host "Testing nginx proxy..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost/health" -TimeoutSec 10
    Write-Host "✅ Nginx proxy working: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Nginx proxy not working" -ForegroundColor Red
}

Write-Host "✅ Deployment fix complete!" -ForegroundColor Green
Write-Host "🌐 Access your portal at: http://54.235.42.222" -ForegroundColor Cyan