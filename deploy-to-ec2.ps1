# 🚀 India Portal - EC2 Deployment Script (PowerShell)
# EC2 IP: 50.19.189.29

Write-Host "🚀 Starting India Portal deployment to EC2..." -ForegroundColor Green

# EC2 Configuration
$EC2_IP = "50.19.189.29"
$PEM_FILE = "government-portal.pem"
$PROJECT_DIR = "/opt/india-portal"

Write-Host "📋 Deployment Configuration:" -ForegroundColor Yellow
Write-Host "   EC2 IP: $EC2_IP"
Write-Host "   PEM File: $PEM_FILE"
Write-Host "   Project Directory: $PROJECT_DIR"
Write-Host ""

# Step 1: Test SSH Connection
Write-Host "🔐 Testing SSH connection..." -ForegroundColor Yellow
try {
    $result = ssh -i $PEM_FILE -o ConnectTimeout=10 ubuntu@$EC2_IP "echo 'SSH connection successful'"
    if ($result -eq "SSH connection successful") {
        Write-Host "✅ SSH connection successful" -ForegroundColor Green
    } else {
        throw "SSH failed"
    }
} catch {
    Write-Host "❌ SSH connection failed. Please check:" -ForegroundColor Red
    Write-Host "   1. PEM file path: $PEM_FILE"
    Write-Host "   2. EC2 instance is running"
    Write-Host "   3. Security group allows SSH (port 22)"
    exit 1
}

# Step 2: Get OpenAI API Key
Write-Host "🔑 Please enter your OpenAI API key:" -ForegroundColor Yellow
$OPENAI_API_KEY = Read-Host -AsSecureString
$OPENAI_API_KEY_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($OPENAI_API_KEY))

# Step 3: Setup EC2 Environment
Write-Host "🛠️  Setting up EC2 environment..." -ForegroundColor Yellow
$setupCommands = @"
# Update system
sudo apt update -y

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    sudo apt install -y docker.io docker-compose-v2
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker `$USER
fi

# Install other tools
sudo apt install -y git curl nginx

# Configure firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
"@

ssh -i $PEM_FILE ubuntu@$EC2_IP $setupCommands

# Step 4: Clone/Update Repository
Write-Host "📥 Cloning/updating repository..." -ForegroundColor Yellow
$repoCommands = @"
# Create project directory
sudo mkdir -p $PROJECT_DIR
sudo chown `$USER:`$USER $PROJECT_DIR

# Clone or update repository
if [ -d '$PROJECT_DIR/.git' ]; then
    cd $PROJECT_DIR
    git pull origin main
else
    git clone https://github.com/Vaidehip0407/India-Portal.git $PROJECT_DIR
    cd $PROJECT_DIR
fi
"@

ssh -i $PEM_FILE ubuntu@$EC2_IP $repoCommands

# Step 5: Setup Environment Variables
Write-Host "🔧 Setting up environment variables..." -ForegroundColor Yellow
$envCommands = @"
cd $PROJECT_DIR

# Setup backend environment
cp backend/.env.prod backend/.env

# Set API key in environment file
sed -i 's/\\$\{OPENAI_API_KEY\}/$OPENAI_API_KEY_PLAIN/g' backend/.env

# Setup frontend environment
cp frontend/.env.production frontend/.env.local

# Create SSL certificates
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/key.pem \
    -out /etc/nginx/ssl/cert.pem \
    -subj "/C=IN/ST=Gujarat/L=Ahmedabad/O=IndiaPortal/CN=$EC2_IP"
"@

ssh -i $PEM_FILE ubuntu@$EC2_IP $envCommands

# Step 6: Build and Deploy
Write-Host "🏗️  Building and deploying application..." -ForegroundColor Yellow
$deployCommands = @"
cd $PROJECT_DIR

# Stop existing services
docker compose -f docker-compose.prod.yml down

# Build and start services
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d

# Wait for services to start
sleep 30
"@

ssh -i $PEM_FILE ubuntu@$EC2_IP $deployCommands

# Step 7: Test Deployment
Write-Host "🧪 Testing deployment..." -ForegroundColor Yellow
try {
    $httpTest = Invoke-WebRequest -Uri "http://$EC2_IP/health" -TimeoutSec 10
    Write-Host "✅ HTTP health check passed" -ForegroundColor Green
} catch {
    Write-Host "❌ HTTP health check failed" -ForegroundColor Red
}

try {
    $httpsTest = Invoke-WebRequest -Uri "https://$EC2_IP/health" -SkipCertificateCheck -TimeoutSec 10
    Write-Host "✅ HTTPS health check passed" -ForegroundColor Green
} catch {
    Write-Host "❌ HTTPS health check failed" -ForegroundColor Red
}

# Step 8: Show Service Status
Write-Host "📊 Service Status:" -ForegroundColor Yellow
ssh -i $PEM_FILE ubuntu@$EC2_IP "cd $PROJECT_DIR && docker compose -f docker-compose.prod.yml ps"

Write-Host ""
Write-Host "🎉 Deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access your portal:" -ForegroundColor Yellow
Write-Host "   HTTP:  http://$EC2_IP"
Write-Host "   HTTPS: https://$EC2_IP"
Write-Host ""
Write-Host "🤖 Test AI Automation:" -ForegroundColor Yellow
Write-Host "   https://$EC2_IP/name-change-application/electricity?provider=torrent-power"
Write-Host ""
Write-Host "📋 Useful commands:" -ForegroundColor Yellow
Write-Host "   SSH to EC2: ssh -i $PEM_FILE ubuntu@$EC2_IP"
Write-Host "   View logs: docker logs india-portal-backend -f"
Write-Host "   Restart:   docker compose -f docker-compose.prod.yml restart"