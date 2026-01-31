# 🚀 India Portal - Simple EC2 Deployment Script
param(
    [string]$PemFile = "government-portal.pem",
    [string]$EC2IP = "50.19.189.29"
)

Write-Host "🚀 Starting India Portal deployment to EC2..." -ForegroundColor Green
Write-Host "   EC2 IP: $EC2IP" -ForegroundColor Yellow
Write-Host "   PEM File: $PemFile" -ForegroundColor Yellow
Write-Host ""

# Test SSH Connection
Write-Host "🔐 Testing SSH connection..." -ForegroundColor Yellow
try {
    $testResult = ssh -i $PemFile -o ConnectTimeout=10 ubuntu@$EC2IP "echo 'Connected'"
    if ($testResult -eq "Connected") {
        Write-Host "✅ SSH connection successful" -ForegroundColor Green
    } else {
        throw "Connection failed"
    }
} catch {
    Write-Host "❌ SSH connection failed!" -ForegroundColor Red
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "  1. PEM file exists: $PemFile"
    Write-Host "  2. EC2 instance is running"
    Write-Host "  3. Security group allows SSH (port 22)"
    exit 1
}

# Get OpenAI API Key
Write-Host "🔑 Enter your OpenAI API key:" -ForegroundColor Yellow
$apiKey = Read-Host -MaskInput

if ([string]::IsNullOrEmpty($apiKey)) {
    Write-Host "❌ API key is required!" -ForegroundColor Red
    exit 1
}

Write-Host "🛠️  Setting up EC2 environment..." -ForegroundColor Yellow

# Create deployment script on EC2
$deployScript = @"
#!/bin/bash
set -e

echo "📦 Installing dependencies..."
sudo apt update -y
sudo apt install -y docker.io docker-compose-v2 git curl nginx

echo "🐳 Starting Docker..."
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

echo "🔥 Configuring firewall..."
sudo ufw allow 22,80,443/tcp
sudo ufw --force enable

echo "📁 Setting up project directory..."
sudo mkdir -p /opt/india-portal
sudo chown ubuntu:ubuntu /opt/india-portal

echo "📥 Cloning repository..."
cd /opt/india-portal
if [ -d '.git' ]; then
    git pull origin main
else
    git clone https://github.com/Vaidehip0407/India-Portal.git .
fi

echo "🔧 Setting up environment..."
cp backend/.env.prod backend/.env
cp frontend/.env.production frontend/.env.local

# Set API key
sed -i 's/\$\{OPENAI_API_KEY\}/$apiKey/g' backend/.env

echo "🔒 Creating SSL certificates..."
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/key.pem \
    -out /etc/nginx/ssl/cert.pem \
    -subj "/C=IN/ST=Gujarat/L=Ahmedabad/O=IndiaPortal/CN=$EC2IP" 2>/dev/null

echo "🏗️  Building and deploying..."
docker compose -f docker-compose.prod.yml down 2>/dev/null || true
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d

echo "⏳ Waiting for services to start..."
sleep 30

echo "📊 Service status:"
docker compose -f docker-compose.prod.yml ps

echo "✅ Deployment completed!"
"@

# Upload and execute deployment script
Write-Host "📤 Uploading deployment script..." -ForegroundColor Yellow
$deployScript | ssh -i $PemFile ubuntu@$EC2IP "cat > deploy.sh && chmod +x deploy.sh"

Write-Host "🚀 Executing deployment..." -ForegroundColor Yellow
ssh -i $PemFile ubuntu@$EC2IP "./deploy.sh"

# Test deployment
Write-Host "🧪 Testing deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri "http://$EC2IP/health" -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ HTTP health check passed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  HTTP health check failed" -ForegroundColor Yellow
}

try {
    $response = Invoke-WebRequest -Uri "https://$EC2IP/health" -SkipCertificateCheck -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ HTTPS health check passed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  HTTPS health check failed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access your portal:" -ForegroundColor Cyan
Write-Host "   HTTP:  http://$EC2IP" -ForegroundColor White
Write-Host "   HTTPS: https://$EC2IP" -ForegroundColor White
Write-Host ""
Write-Host "🤖 Test AI Automation:" -ForegroundColor Cyan
Write-Host "   https://$EC2IP/name-change-application/electricity?provider=torrent-power" -ForegroundColor White
Write-Host ""
Write-Host "📋 Useful commands:" -ForegroundColor Cyan
Write-Host "   SSH:      ssh -i $PemFile ubuntu@$EC2IP" -ForegroundColor White
Write-Host "   Logs:     docker logs india-portal-backend -f" -ForegroundColor White
Write-Host "   Restart:  docker compose -f docker-compose.prod.yml restart" -ForegroundColor White
Write-Host ""
Write-Host "🔍 If something doesn't work, check logs with:" -ForegroundColor Yellow
Write-Host "   ssh -i $PemFile ubuntu@$EC2IP 'cd /opt/india-portal && docker logs india-portal-backend'" -ForegroundColor White