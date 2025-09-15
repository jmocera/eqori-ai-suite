# Render.com Deployment Guide (Free Tier)

## 📋 Prerequisites

1. GitHub repository: **https://github.com/jmocera/eqori-ai-suite**
2. OpenAI API key
3. Render.com account (free tier works!)

## 🆓 Free Tier Deployment

This guide shows you how to deploy the complete AI Marketing Suite on Render's **free tier**. You'll create two services from the same repository:

1. **Backend** (Web Service) - Python FastAPI
2. **Frontend** (Static Site) - React application

---

## 🔧 Step 1: Deploy Backend Service

### Create Backend Web Service

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click **"New"** → **"Web Service"**

2. **Connect Repository**
   - Connect your GitHub account if not already connected
   - Select repository: `jmocera/eqori-ai-suite`
   - Click **"Connect"**

3. **Configure Backend Settings**
   ```
   Name: eqori-backend
   Branch: main
   Root Directory: backend
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   Instance Type: Free
   ```

4. **Add Environment Variables**

   Click **"Advanced"** → **"Add Environment Variable"** and add these:

   | Key | Value |
   |-----|-------|
   | `OPENAI_API_KEY` | `sk-your-openai-api-key-here` |
   | `SECRET_KEY` | `your-secure-random-string-123` |
   | `DATABASE_URL` | `sqlite:///./eqori.db` |
   | `ENVIRONMENT` | `production` |

5. **Deploy Backend**
   - Click **"Create Web Service"**
   - Wait for deployment (3-5 minutes)
   - ✅ Note your backend URL: `https://eqori-backend-[random].onrender.com`

---

## 🌐 Step 2: Deploy Frontend Service

### Create Frontend Static Site

1. **Create New Static Site**
   - From Render Dashboard, click **"New"** → **"Static Site"**
   - Use the same repository: `jmocera/eqori-ai-suite`

2. **Configure Frontend Settings**
   ```
   Name: eqori-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm ci && npm run build
   Publish Directory: build
   ```

3. **Add Environment Variable**

   Click **"Advanced"** → **"Add Environment Variable"**:

   | Key | Value |
   |-----|-------|
   | `REACT_APP_API_URL` | `https://eqori-backend-[random].onrender.com` |

   ⚠️ **Important**: Replace `[random]` with your actual backend URL from Step 1

4. **Deploy Frontend**
   - Click **"Create Static Site"**
   - Wait for deployment (2-3 minutes)

---

## 🎉 Your Live Application

After both deployments complete:

- **🌐 Frontend (Main App)**: `https://eqori-frontend-[random].onrender.com`
- **🔗 Backend API**: `https://eqori-backend-[random].onrender.com`
- **📚 API Docs**: `https://eqori-backend-[random].onrender.com/docs`

---

## 🧪 Test Your Deployment

1. **Visit your frontend URL**
2. **Register a new account**:
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `password123`

3. **Test AI Content Generation**:
   - Product Name: "Wireless Bluetooth Headphones"
   - Category: "Electronics"
   - Features: "Active noise cancellation, 30-hour battery, quick charge"
   - Target Audience: "Music enthusiasts"
   - Tone: "Professional"
   - Keywords: "wireless, bluetooth, headphones, audio"

4. **Verify Results**:
   - ✅ Product description generated
   - ✅ Social media ads created
   - ✅ Email marketing content produced
   - ✅ Content saved to history

---

## ⚠️ Free Tier Limitations & Important Notes

### Service Sleep Behavior:
- **Services sleep after 15 minutes** of inactivity
- **First request after sleep takes 30-60 seconds** (cold start)
- **Database persists** between sleep/wake cycles

### Monthly Limits:
- **750 hours per service** (enough for demos and light usage)
- **No credit card required** for free tier

### Performance Tips:
- Keep a browser tab open to prevent sleeping during demos
- Consider upgrading to **Starter plan ($7/month)** for production use
- Use external uptime monitoring to prevent sleeping

---

## 🔧 Environment Variables Reference

### Backend Service:
```bash
OPENAI_API_KEY=sk-proj-your-key-here
SECRET_KEY=your-secure-random-string-change-in-production
DATABASE_URL=sqlite:///./eqori.db
ENVIRONMENT=production
```

### Frontend Service:
```bash
REACT_APP_API_URL=https://your-backend-name.onrender.com
```

---

## 🐛 Troubleshooting

### Backend Issues:

**Build Fails**
- Ensure Root Directory is set to `backend`
- Check Python version (requires 3.11+)
- Verify `requirements.txt` exists in backend folder

**OpenAI Errors**
- Check API key is correct and has credits
- Visit: `https://platform.openai.com/account/billing`
- Ensure API key has proper permissions

**Database Errors**
- SQLite files persist on Render's disk storage
- Check backend logs for specific database errors

### Frontend Issues:

**Build Fails**
- Ensure Root Directory is set to `frontend`
- Check `package.json` exists in frontend folder
- Monitor build logs for specific npm errors

**Can't Connect to Backend**
- Verify `REACT_APP_API_URL` is correct
- Test backend health: `https://your-backend-url.onrender.com/health`
- Check both services are deployed and running

**CORS Errors**
- Backend is pre-configured for Render domains
- Ensure both services are on Render.com

---

## 🔒 Security Features

- ✅ **JWT Authentication**: Secure token-based login
- ✅ **Password Hashing**: bcrypt encryption
- ✅ **Input Validation**: Pydantic schemas
- ✅ **SQL Injection Prevention**: SQLAlchemy ORM
- ✅ **CORS Protection**: Configured for Render domains
- ✅ **Environment Variables**: API keys secured

---

## 📊 Monitoring Your App

### Health Checks:
- **Backend**: `https://your-backend-url.onrender.com/health`
- **Frontend**: Should load and be responsive

### Render Dashboard:
- Monitor deployment status
- View build and runtime logs
- Check service activity
- Monitor resource usage

---

## 🚀 Going Live Checklist

- [ ] Backend service deployed successfully
- [ ] Frontend service deployed successfully
- [ ] OpenAI API key configured and working
- [ ] Test user registration and login
- [ ] Test AI content generation end-to-end
- [ ] Verify content persistence (history page)
- [ ] Check both services respond to health checks
- [ ] Share your live URL! 🎉

---

## 💰 Upgrade Path (Optional)

For production use, consider upgrading:

- **Starter Plan**: $7/month per service
  - No sleeping
  - Custom domains
  - More compute resources
  - Priority support

- **Database**: Add PostgreSQL for better performance
- **Monitoring**: Error tracking and analytics
- **CDN**: Faster global content delivery

---

## ✨ Your AI Marketing Suite is Live!

🎯 **Repository**: https://github.com/jmocera/eqori-ai-suite

🌐 **Frontend**: `https://eqori-frontend-[your-random].onrender.com`

🔗 **Backend**: `https://eqori-backend-[your-random].onrender.com`

Start generating AI-powered marketing content! 🚀