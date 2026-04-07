# Onigiri.Z Blockchain - Deployment Guide

## Quick Start Deployment

### Current Status
 **Frontend**: Deployed to GitHub Pages
 **Backend**: Ready to deploy to Render (Free Tier)

---

## 📋 Backend Deployment (Render)

### Prerequisites
- GitHub account (already connected to your repo)
- Render account (free)

### Step 1: Create Render Account
1. Go to https://render.com
2. Click **"Sign up with GitHub"**
3. Authorize your GitHub account
4. Complete signup

### Step 2: Deploy Backend Service
1. In Render dashboard, click **"New +"** → **"Web Service"**
2. **Select Repository**: Choose `zinlynhtet/onigiri.w` 
3. **Configure Service**:
   - **Name**: `onigiri.w-api` 
   - **Environment**: `Go`
   - **Build Command**: `go build -o server .`
   - **Start Command**: `./server`
   - **Instance Type**: `Free` (adequate for development)
   - **Region**: Select closest to you

4. Click **"Create Web Service"**
5. Wait for deployment (status will be green when ready)

### Step 3: Get Your Backend URL
Once deployed (green status):
- Your backend URL will display at the top, e.g., `https://onigiri-api.onrender.com`
- Save this URL

### Step 4: Update Frontend Configuration
Edit `frontend/src/shared/config.ts` line 19:
```typescript
export const API_BASE = window.location.hostname === 'localhost'
  ? ''
  : 'https://onigiri-w-api.onrender.com/'; 
```

### Step 5: Deploy Frontend (Auto)
```bash
git add frontend/src/shared/config.ts
git commit -m "Update backend URL to Render"
git push origin main
```

GitHub Actions automatically deploys - no manual steps!

### Step 6: Test the Connection
1. Visit https://zinlynhtet.github.io/onigiri.w/login.html
2. Health check: Visit https://onigiri-w-api.onrender.com/api/health
3. Try signing up or logging in

---

## 🔗 Environment Variables (Render)

Render automatically sets:
- **PORT**: Managed by Render
- **ALLOWED_ORIGIN**: Set in `render.yaml` to allow GitHub Pages

If you need more env vars, add them in Render dashboard:
1. Your Service → **"Environment"**
2. Add key-value pairs
3. Changes auto-restart the service

---

## 🧪 Local Testing

### Start Backend Locally
```bash
go run .
# Server runs on http://localhost:8080
```

### Start Frontend Dev Server
```bash
cd frontend
npm run dev
# Frontend on http://localhost:5173
```

The frontend auto-proxies API calls to localhost:8080 via Vite.

---

## 📊 Health Checks

### Backend Health (Render)
```bash
curl https://onigiri-w-api.onrender.com/api/health
# Response: {"status":"healthy","message":"Onigiri.Z Enterprise Node is running"}
```

### Frontend Status (GitHub Pages)
- Login: https://zinlynhtet.github.io/onigiri.w/login.html
- Signup: https://zinlynhtet.github.io/onigiri.w/signup.html
- Forgot Password: https://zinlynhtet.github.io/onigiri.w/forgot-password.html
- Reset Password: https://zinlynhtet.github.io/onigiri.w/reset-password.html

---

## 🔧 Backend Features

### Endpoints

**Public (No Auth)**:
- `POST /api/register` - Create account
- `POST /api/login` - Login
- `POST /api/request-reset` - Request password reset
- `POST /api/reset-password` - Reset password
- `GET /api/blockchain` - Get all blocks
- `GET /api/balance/{address}` - Get wallet balance
- `GET /api/health` - Health check

**Protected (Auth Required)**:
- `GET /api/mempool` - Get pending transactions
- `POST /api/transaction` - Submit transaction
- `POST /api/mine` - Mine a new block

### CORS
Backend automatically allows requests from:
- Local: `*` (dev mode)
- Production: `https://zinlynhtet.github.io` (configured in render.yaml)

---

## 🛠️ Common Issues

### "Failed to fetch" on Forms
- ✅ Check Render service is running (green status)
- ✅ Verify backend URL in `config.ts` matches Render URL
- ✅ Wait 2-3 minutes after deployment for full startup

### Render Service Keeps Restarting
- Check logs in Render dashboard
- Verify `render.yaml` is correct
- Ensure `go.mod` has all dependencies

### CORS Errors
- Backend has CORS enabled for GitHub Pages
- If still getting CORS errors, check browser console for exact error

---

## 📝 Files Modified for Production

- `main.go` - Added PORT environment variable support
- `handlers.go` - Added `/api/health` endpoint
- `render.yaml` - New Render deployment config
- `frontend/src/shared/config.ts` - Backend URL configured
- `frontend/vite.config.ts` - Base path `/onigiri.w/` for production

---

## ✨ You're Done!

Once Render shows green status:
1. Your backend is live and accessible
2. GitHub Pages frontend automatically uses it
3. Users can create accounts, login, and interact with blockchain
4. All API calls are proxied through Render

**Render Free Tier Limitations**:
- Service spins down after 15 mins of inactivity
- First request takes ~30 seconds
- Suitable for dev/demo projects
- Upgrade anytime as users grow

