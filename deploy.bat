@echo off
echo 🚀 India Portal - EC2 Deployment
echo.

set EC2_IP=50.19.189.29
set PEM_FILE=government-portal.pem

echo 📋 Configuration:
echo    EC2 IP: %EC2_IP%
echo    PEM File: %PEM_FILE%
echo.

echo 🔐 Testing SSH connection...
ssh -i %PEM_FILE% -o ConnectTimeout=10 ubuntu@%EC2_IP% "echo SSH OK" >nul 2>&1
if errorlevel 1 (
    echo ❌ SSH connection failed!
    echo Please check:
    echo   1. PEM file exists: %PEM_FILE%
    echo   2. EC2 instance is running
    echo   3. Security group allows SSH
    pause
    exit /b 1
)
echo ✅ SSH connection successful

echo.
set /p API_KEY="🔑 Enter your OpenAI API key: "
if "%API_KEY%"=="" (
    echo ❌ API key is required!
    pause
    exit /b 1
)

echo.
echo 🛠️  Deploying to EC2...
echo This will take a few minutes...

ssh -i %PEM_FILE% ubuntu@%EC2_IP% "
echo '📦 Installing dependencies...'
sudo apt update -y
sudo apt install -y docker.io docker-compose-v2 git curl nginx

echo '🐳 Starting Docker...'
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

echo '🔥 Configuring firewall...'
sudo ufw allow 22,80,443/tcp
sudo ufw --force enable

echo '📁 Setting up project directory...'
sudo mkdir -p /opt/india-portal
sudo chown ubuntu:ubuntu /opt/india-portal

echo '📥 Cloning repository...'
cd /opt/india-portal
if [ -d '.git' ]; then
    git pull origin main
else
    git clone https://github.com/Vaidehip0407/India-Portal.git .
fi

echo '🔧 Setting up environment...'
cp backend/.env.prod backend/.env
cp frontend/.env.production frontend/.env.local

echo '🔑 Setting API key...'
sed -i 's/\${OPENAI_API_KEY}/%API_KEY%/g' backend/.env

echo '🔒 Creating SSL certificates...'
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/key.pem -out /etc/nginx/ssl/cert.pem -subj '/C=IN/ST=Gujarat/L=Ahmedabad/O=IndiaPortal/CN=%EC2_IP%' 2>/dev/null

echo '🏗️  Building and deploying...'
docker compose -f docker-compose.prod.yml down 2>/dev/null || true
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d

echo '⏳ Waiting for services...'
sleep 30

echo '📊 Service status:'
docker compose -f docker-compose.prod.yml ps

echo '✅ Deployment completed!'
"

echo.
echo 🧪 Testing deployment...
timeout 10 curl -s http://%EC2_IP%/health >nul 2>&1
if errorlevel 1 (
    echo ⚠️  HTTP test failed
) else (
    echo ✅ HTTP test passed
)

echo.
echo 🎉 Deployment completed!
echo.
echo 🌐 Access your portal:
echo    HTTP:  http://%EC2_IP%
echo    HTTPS: https://%EC2_IP%
echo.
echo 🤖 Test AI Automation:
echo    https://%EC2_IP%/name-change-application/electricity?provider=torrent-power
echo.
echo 📋 Useful commands:
echo    SSH:      ssh -i %PEM_FILE% ubuntu@%EC2_IP%
echo    Logs:     docker logs india-portal-backend -f
echo    Restart:  docker compose -f docker-compose.prod.yml restart
echo.
pause