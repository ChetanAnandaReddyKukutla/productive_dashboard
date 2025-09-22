# 🚀 ProductiveBoards Deployment Guide

This guide covers multiple deployment options for your ProductiveBoards application.

## 📋 Table of Contents
1. [Quick Deploy (Recommended)](#quick-deploy)
2. [Render Deployment](#render-deployment)
3. [Railway Deployment](#railway-deployment)
4. [Vercel + Railway](#vercel--railway)
5. [Docker Deployment](#docker-deployment)
6. [Manual VPS Deployment](#manual-vps-deployment)

## 🚀 Quick Deploy (Recommended)

### Option 1: Render (Full-Stack)
1. Fork this repository
2. Create account at [render.com](https://render.com)
3. Import your repository
4. Render will automatically detect `render.yaml` and deploy both services
5. Update frontend environment variable with backend URL

### Option 2: Railway + Vercel
1. **Backend on Railway:**
   - Create account at [railway.app](https://railway.app)
   - Connect GitHub repository
   - Deploy backend with PostgreSQL addon
   
2. **Frontend on Vercel:**
   - Create account at [vercel.com](https://vercel.com)
   - Import repository
   - Set `VITE_API_URL` environment variable

## 🎯 Render Deployment (Full-Stack)

### Step 1: Database Setup
1. Go to [render.com](https://render.com) and create account
2. Create new PostgreSQL database:
   - Name: `productiveboards-db`
   - User: `productiveboards_user`
   - Copy the connection string

### Step 2: Backend Deployment
1. Create new Web Service
2. Connect your GitHub repository
3. Configure:
   - **Name**: `productiveboards-api`
   - **Environment**: `Python 3`
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. Set Environment Variables:
   ```
   DATABASE_URL=<your-postgres-connection-string>
   JWT_SECRET=<generate-secure-random-string>
   JWT_ALGORITHM=HS256
   JWT_EXPIRATION_MINUTES=1440
   ```

### Step 3: Frontend Deployment
1. Create new Static Site
2. Connect same repository
3. Configure:
   - **Build Command**: `cd frontend && npm ci && npm run build`
   - **Publish Directory**: `frontend/dist`

4. Set Environment Variables:
   ```
   VITE_API_URL=https://your-backend-service.onrender.com
   ```

## 🚂 Railway Deployment

### Backend on Railway
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Deploy from GitHub:
   - Select your repository
   - Railway detects `railway.json` automatically
5. Set environment variables:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=<generate-secure-string>
   ```

### Frontend on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import project from GitHub
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set environment variable:
   ```
   VITE_API_URL=https://your-railway-app.railway.app
   ```

## 🐳 Docker Deployment

### Local Docker Deployment
```bash
# Clone repository
git clone https://github.com/ChetanAnandaReddyKukutla/productive_dashboard.git
cd productive_dashboard

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Docker Deployment
1. Set production environment variables in `docker-compose.yml`
2. Use external PostgreSQL database
3. Configure reverse proxy (Nginx/Traefik)
4. Set up SSL certificates

## 🖥️ Manual VPS Deployment

### Prerequisites
- Ubuntu 20.04+ VPS
- Domain name (optional)
- SSL certificate

### Backend Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install python3-pip postgresql postgresql-contrib nginx supervisor -y

# Setup database
sudo -u postgres createuser --interactive productiveboards_user
sudo -u postgres createdb productiveboards

# Clone and setup application
git clone https://github.com/ChetanAnandaReddyKukutla/productive_dashboard.git
cd productive_dashboard/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your values

# Setup supervisor
sudo cp deploy/supervisor.conf /etc/supervisor/conf.d/productiveboards.conf
sudo supervisorctl reread
sudo supervisorctl update
```

### Frontend Setup
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Build frontend
cd ../frontend
npm install
npm run build

# Setup Nginx
sudo cp deploy/nginx.conf /etc/nginx/sites-available/productiveboards
sudo ln -s /etc/nginx/sites-available/productiveboards /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔧 Environment Variables Reference

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=1440
```

### Frontend (.env)
```bash
VITE_API_URL=https://your-backend-domain.com
```

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Update `origins` in `backend/app/main.py`
   - Add your frontend domain

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check network connectivity
   - Ensure PostgreSQL is running

3. **Environment Variables Not Loading**
   - Check `.env` file location
   - Verify variable names (case-sensitive)
   - Restart services after changes

4. **Build Failures**
   - Check Node.js version (18+)
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and reinstall

### Health Checks
- Backend: `https://your-backend-url/health`
- Frontend: Check browser console for errors
- Database: Test connection with provided credentials

## 📊 Monitoring & Logs

### Render
- Access logs from dashboard
- Set up health checks
- Monitor resource usage

### Railway
- Real-time logs in dashboard
- Metrics and analytics
- Automatic scaling

### Docker
```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Monitor resources
docker stats
```

## 🔒 Security Checklist

- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Set secure CORS origins
- [ ] Use environment variables for secrets
- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Implement rate limiting (optional)

## 🎯 Performance Optimization

- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Database connection pooling
- [ ] Frontend code splitting
- [ ] Image optimization
- [ ] Caching strategies

## 📞 Support

If you encounter issues:
1. Check logs for error messages
2. Verify environment variables
3. Test local deployment first
4. Check platform-specific documentation
5. Open GitHub issue with error details