#!/bin/bash

# 🚀 India Portal - EC2 Deployment Script
# EC2 IP: 50.19.189.29

echo "🚀 Starting India Portal deployment to EC2..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# EC2 Configuration
EC2_IP="50.19.189.29"
PEM_FILE="government-portal.pem"
PROJECT_DIR="/opt/india-portal"

echo -e "${YELLOW}📋 Deployment Configuration:${NC}"
echo "   EC2 IP: $EC2_IP"
echo "   PEM File: $PEM_FILE"
echo "   Project Directory: $PROJECT_DIR"
echo ""

# Function to run commands on EC2
run_on_ec2() {
    ssh -i "$PEM_FILE" ubuntu@$EC2_IP "$1"
}

# Step 1: Test SSH Connection
echo -e "${YELLOW}🔐 Testing SSH connection...${NC}"
if ssh -i "$PEM_FILE" -o ConnectTimeout=10 ubuntu@$EC2_IP "echo 'SSH connection successful'"; then
    echo -e "${GREEN}✅ SSH connection successful${NC}"
else
    echo -e "${RED}❌ SSH connection failed. Please check:${NC}"
    echo "   1. PEM file path: $PEM_FILE"
    echo "   2. EC2 instance is running"
    echo "   3. Security group allows SSH (port 22)"
    exit 1
fi

# Step 2: Setup EC2 Environment
echo -e "${YELLOW}🛠️  Setting up EC2 environment...${NC}"
run_on_ec2 "
    # Update system
    sudo apt update -y
    
    # Install Docker if not installed
    if ! command -v docker &> /dev/null; then
        sudo apt install -y docker.io docker-compose-v2
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -aG docker \$USER
    fi
    
    # Install other tools
    sudo apt install -y git curl nginx
    
    # Configure firewall
    sudo ufw allow 22
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw --force enable
"

# Step 3: Clone/Update Repository
echo -e "${YELLOW}📥 Cloning/updating repository...${NC}"
run_on_ec2 "
    # Create project directory
    sudo mkdir -p $PROJECT_DIR
    sudo chown \$USER:\$USER $PROJECT_DIR
    
    # Clone or update repository
    if [ -d '$PROJECT_DIR/.git' ]; then
        cd $PROJECT_DIR
        git pull origin main
    else
        git clone https://github.com/Vaidehip0407/India-Portal.git $PROJECT_DIR
        cd $PROJECT_DIR
    fi
"

# Step 4: Setup Environment Variables
echo -e "${YELLOW}🔧 Setting up environment variables...${NC}"
echo "Please enter your OpenAI API key:"
read -s OPENAI_API_KEY

run_on_ec2 "
    cd $PROJECT_DIR
    
    # Setup backend environment
    cp backend/.env.prod backend/.env
    
    # Set API key in environment file
    sed -i 's/\\\${OPENAI_API_KEY}/$OPENAI_API_KEY/g' backend/.env
    
    # Setup frontend environment
    cp frontend/.env.production frontend/.env.local
    
    # Create SSL certificates
    sudo mkdir -p /etc/nginx/ssl
    sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/key.pem \
        -out /etc/nginx/ssl/cert.pem \
        -subj '/C=IN/ST=Gujarat/L=Ahmedabad/O=India Portal/CN=$EC2_IP'
"

# Step 5: Build and Deploy
echo -e "${YELLOW}🏗️  Building and deploying application...${NC}"
run_on_ec2 "
    cd $PROJECT_DIR
    
    # Stop existing services
    docker compose -f docker-compose.prod.yml down
    
    # Build and start services
    docker compose -f docker-compose.prod.yml build --no-cache
    docker compose -f docker-compose.prod.yml up -d
    
    # Wait for services to start
    sleep 30
"

# Step 6: Test Deployment
echo -e "${YELLOW}🧪 Testing deployment...${NC}"
if curl -s http://$EC2_IP/health > /dev/null; then
    echo -e "${GREEN}✅ HTTP health check passed${NC}"
else
    echo -e "${RED}❌ HTTP health check failed${NC}"
fi

if curl -k -s https://$EC2_IP/health > /dev/null; then
    echo -e "${GREEN}✅ HTTPS health check passed${NC}"
else
    echo -e "${RED}❌ HTTPS health check failed${NC}"
fi

# Step 7: Show Service Status
echo -e "${YELLOW}📊 Service Status:${NC}"
run_on_ec2 "cd $PROJECT_DIR && docker compose -f docker-compose.prod.yml ps"

echo ""
echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo ""
echo -e "${YELLOW}🌐 Access your portal:${NC}"
echo "   HTTP:  http://$EC2_IP"
echo "   HTTPS: https://$EC2_IP"
echo ""
echo -e "${YELLOW}🤖 Test AI Automation:${NC}"
echo "   https://$EC2_IP/name-change-application/electricity?provider=torrent-power"
echo ""
echo -e "${YELLOW}📋 Useful commands:${NC}"
echo "   SSH to EC2: ssh -i $PEM_FILE ubuntu@$EC2_IP"
echo "   View logs: docker logs india-portal-backend -f"
echo "   Restart:   docker compose -f docker-compose.prod.yml restart"