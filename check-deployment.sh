#!/bin/bash

# 🚀 ProductiveBoards Deployment Status Checker
# This script checks if your deployment is ready and provides next steps

echo "🎯 ProductiveBoards Deployment Checker"
echo "======================================"

# Check if we're in the correct directory
if [ ! -f "package.json" ] && [ ! -f "backend/requirements.txt" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Check backend requirements
echo -n "🔍 Checking backend setup... "
if [ -f "backend/requirements.txt" ] && [ -f "backend/.env.example" ]; then
    echo "✅ Ready"
else
    echo "❌ Missing files"
fi

# Check frontend setup
echo -n "🔍 Checking frontend setup... "
if [ -f "frontend/package.json" ] && [ -f "frontend/.env.example" ]; then
    echo "✅ Ready"
else
    echo "❌ Missing files"
fi

# Check deployment configs
echo -n "🔍 Checking deployment configs... "
configs_found=0
[ -f "render.yaml" ] && ((configs_found++))
[ -f "docker-compose.yml" ] && ((configs_found++))
[ -f "vercel.json" ] && ((configs_found++))
[ -f "netlify.toml" ] && ((configs_found++))

if [ $configs_found -gt 0 ]; then
    echo "✅ Found $configs_found deployment configs"
else
    echo "❌ No deployment configs found"
fi

echo ""
echo "🚀 Deployment Options Available:"
echo "================================"

# Render
if [ -f "render.yaml" ]; then
    echo "✅ Render (Full-Stack) - render.com"
    echo "   → Push to GitHub and connect to Render"
fi

# Railway
if [ -f "railway.json" ]; then
    echo "✅ Railway (Backend) - railway.app"
    echo "   → Connect repo and add PostgreSQL"
fi

# Vercel
if [ -f "vercel.json" ]; then
    echo "✅ Vercel (Frontend) - vercel.com"
    echo "   → Import project with root: frontend/"
fi

# Docker
if [ -f "docker-compose.yml" ]; then
    echo "✅ Docker (Local/VPS) - Self-hosted"
    echo "   → Run: docker-compose up -d"
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. Choose a deployment platform above"
echo "2. Set up environment variables"
echo "3. Deploy backend first, then frontend"
echo "4. Update frontend VITE_API_URL with backend URL"
echo "5. Test the deployed application"
echo ""
echo "📖 Detailed guide: See DEPLOYMENT.md"
echo "🎯 Quick start: Choose Render for easiest deployment"