://18.207.167.97/health

---

**Status**: Ready for Deployment
**Estimated Time**: 30-45 minutes
**Difficulty**: Medium
 EC2 instance accessible via SSH
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] Repository cloned on EC2
- [ ] Environment files created
- [ ] Docker containers running
- [ ] Nginx configured
- [ ] Security groups configured
- [ ] Services accessible via browser
- [ ] Auto-start configured
- [ ] Monitoring set up

---

## 🌐 Access URLs (After Deployment)

- **Main Portal**: http://18.207.167.97
- **API**: http://18.207.167.97:8000
- **API Docs**: http://18.207.167.97:8000/docs
- **Health Check**: http Update Docker images
docker-compose pull
docker-compose up -d
```

---

## 🎯 Quick Commands Reference

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Rebuild
docker-compose build

# Pull latest code
git pull origin main

# Full update
git pull && docker-compose build && docker-compose up -d
```

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ]se up -d frontend
```

---

## 📝 Maintenance Commands

### Backup Database
```bash
# Create backup
docker-compose exec backend cp unified_portal.db unified_portal.db.backup

# Copy to host
docker cp backend:/app/unified_portal.db ./backup_$(date +%Y%m%d).db
```

### Clean Up
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused containers
docker container prune
```

### Update System
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# groups in AWS Console
# Ensure port 80, 443, 22 are open

# Check Nginx status
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx
```

### Issue: Database errors
```bash
# Check database file
ls -la backend/unified_portal.db

# Reset database (if needed)
docker-compose exec backend rm unified_portal.db
docker-compose restart backend
```

### Issue: Frontend not loading
```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose build frontend
docker-compo`bash
# Rebuild images
docker-compose build

# Restart services
docker-compose down
docker-compose up -d
```

### 10.3 Quick Restart (without rebuild)
```bash
docker-compose restart
```

---

## 🐛 Troubleshooting

### Issue: Services not starting
```bash
# Check logs
docker-compose logs

# Check if ports are in use
sudo netstat -tulpn | grep :8000
sudo netstat -tulpn | grep :3003

# Restart Docker
sudo systemctl restart docker
docker-compose up -d
```

### Issue: Cannot connect to EC2
```bash
# Check security
# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 9.2 Check Resource Usage
```bash
# Docker stats
docker stats

# System resources
htop
df -h
free -h
```

### 9.3 Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

---

## 🔄 Step 10: Update Deployment

### 10.1 Pull Latest Changes
```bash
cd /home/ubuntu/gujarat-unified-services-portal
git pull origin main
```

### 10.2 Rebuild and Restart
``nAfterExit=yes
WorkingDirectory=/home/ubuntu/gujarat-unified-services-portal
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
User=ubuntu

[Install]
WantedBy=multi-user.target
```

### 8.3 Enable Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable gujarat-portal
sudo systemctl start gujarat-portal
```

---

## 📊 Step 9: Monitoring & Logs

### 9.1 View Logs
```bash
# Real-time logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

```

### 7.3 Access in Browser
- **Frontend**: http://13.127.12.126
- **Backend API**: http://13.127.12.126:8000
- **API Docs**: http://13.127.12.126:8000/docs
- **Health Check**: http://13.127.12.126/health

---

## 🔄 Step 8: Auto-Start on Reboot

### 8.1 Create Systemd Service
```bash
sudo nano /etc/systemd/system/gujarat-portal.service
```

### 8.2 Add Service Configuration
```ini
[Unit]
Description=Gujarat Unified Services Portal
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
Remaitance (18.207.167.97)
3. Actions → Security → Change Security Groups
4. Add/modify rules as above

---

## ✅ Step 7: Verify Deployment

### 7.1 Check Services
```bash
# On EC2
docker-compose ps

# Expected output:
# NAME                STATUS              PORTS
# backend             Up                  0.0.0.0:8000->8000/tcp
# frontend            Up                  0.0.0.0:3003->3003/tcp
```

### 7.2 Test URLs
```bash
# From your local machine
curl http://18.207.167.97/health
curl http://18.207.167.97/api/  8000          0.0.0.0/0 (temporary)
Custom TCP      TCP         3003          0.0.0.0/0 (temporary)
```

### 6.2 Apply Security Group
1. Go to AWS EC2 Console
2. Select your ins/gujarat-portal /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔒 Step 6: Configure Security Groups (AWS Console)

### 6.1 Required Inbound Rules
```
Type            Protocol    Port Range    Source
HTTP            TCP         80            0.0.0.0/0
HTTPS           TCP         443           0.0.0.0/0
SSH             TCP         22            Your IP
Custom TCP      TCP       xy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API Docs
    location /docs {
        proxy_pass http://localhost:8000/docs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Health Check
    location /health {
        proxy_pass http://localhost:8000/health;
    }
}
```

### 5.3 Enable Site
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-availablection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proUpgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Conne proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header 
# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### 4.3 Verify Services
```bash
# Check backend
curl http://localhost:8000/health

# Check frontend
curl http://localhost:3003
```

---

## 🌐 Step 5: Configure Nginx Reverse Proxy

### 5.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/gujarat-portal
```

### 5.2 Add Configuration
```nginx
server {
    listen 80;
    server_name 13.127.12.126;

    # Frontend
    location / {
       cure_token_2024

# RPA Settings
RPA_MODE=DEMO
DEMO_BASE_URL=http://localhost:8000/demo-govt
EOF

# Frontend .env.production
cat > frontend/.env.production << 'EOF'
VITE_API_URL=http://13.127.12.126:8000
VITE_APP_NAME=Gujarat Unified Services Portal
EOF
```

---

## 🐳 Step 4: Deploy with Docker

### 4.1 Build and Start Services
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

### 4.2 View Logs
```bash
# All services
docker-compose logs -f

WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_API_TOKEN=
WHATSAPP_VERIFY_TOKEN=my_se<< 'EOF'
APP_NAME=Gujarat Unified Services Portal
DATABASE_URL=sqlite:///./unified_portal.db
SECRET_KEY=CHANGE_THIS_TO_SECURE_RANDOM_STRING_IN_PRODUCTION
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Server Configuration
HOST=0.0.0.0
PORT=8000

# Frontend Configuration
FRONTEND_URL=http://13.127.12.126

# CORS Settings
BACKEND_CORS_ORIGINS=["http://13.127.12.126","http://localhost:3003"]

# Environment
ENVIRONMENT=production
DEBUG=false

# WhatsApp (Optional - add your credentials)
WHATSAPP_BUSINESS_ACCOUNT_ID=al.git
cd gujarat-unified-services-portal
```

### 3.2 Create Production Environment File
```bash
# Backend .env.prod
cat > backend/.env.prod ame -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 2.4 Install Git
```bash
sudo apt install git -y
```

### 2.5 Install Nginx (for reverse proxy)
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## 📦 Step 3: Clone Repository on EC2

### 3.1 Clone Repository
```bash
cd /home/ubuntu
git clone https://github.com/Vaidehip0407/gujarat-unified-services-port main
```

---

## 🔐 Step 2: Prepare EC2 Instance

### 2.1 Connect to EC2
```bash
ssh -i your-key.pem ubuntu@13.127.12.126
```

### 2.2 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2.3 Install Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(un
```bash
git push -u origin main
```

**Note**: If repository already has content, use:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin# 1.5 Push to GitHubit commit -m "Initial deployment: Gujarat Unified Services Portal

Features:
✅ React + FastAPI full-stack application
✅ Multi-utility name change services
✅ Company formation & government grants
✅ WhatsApp bot integration
✅ AI document processing
✅ Bilingual support (EN/HI/GU)
✅ Docker deployment ready
✅ Complete navigation system
✅ Responsive design

Tech Stack:
- Frontend: React 18, Vite, TailwindCSS
- Backend: FastAPI, Python 3.11
- Database: SQLite/PostgreSQL
- Deployment: Docker, Nginx, AWS EC2"
```

##
```bash
gitHub**: https://github.com/Vaidehip0407/gujarat-unified-services-portal
- **Branch**: main

### EC2 Instance
- **IP**: 13.127.12.126
- **Region**: ap-south-1 (Mumbai)
- **OS**: Ubuntu 22.04 LTS (recommended)

---

## 🚀 Step 1: Push Code to GitHub

### 1.1 Initialize Git (if not already)
```bash
git init
git branch -M main
```

### 1.2 Add Remote
```bash
git remote add origin https://github.com/Vaidehip0407/gujarat-unified-services-portal.git
```

### 1.3 Add All Files
```bash
git add .
```

### 1.4 Commit# Complete EC2 Deployment Guide

## 📋 Deployment Information

### Repository
- **G