#!/bin/bash

echo "🔧 Fixing deployment issues..."

# Stop any running containers
echo "Stopping existing containers..."
sudo docker-compose down --remove-orphans

# Stop nginx if running on host
echo "Stopping host nginx..."
sudo systemctl stop nginx

# Kill any processes using port 80
echo "Freeing up port 80..."
sudo fuser -k 80/tcp 2>/dev/null || true

# Clean up Docker
echo "Cleaning up Docker..."
sudo docker system prune -f

# Rebuild and start containers
echo "Building and starting containers..."
sudo docker-compose up --build -d

# Wait for containers to start
echo "Waiting for containers to start..."
sleep 30

# Check container status
echo "Container status:"
sudo docker-compose ps

# Test backend health
echo "Testing backend health..."
curl -f http://localhost:8000/health || echo "❌ Backend not responding"

# Test frontend
echo "Testing frontend..."
curl -f http://localhost:3003 || echo "❌ Frontend not responding"

# Test nginx proxy
echo "Testing nginx proxy..."
curl -f http://localhost/health || echo "❌ Nginx proxy not working"

echo "✅ Deployment fix complete!"
echo "🌐 Access your portal at: http://54.235.42.222"