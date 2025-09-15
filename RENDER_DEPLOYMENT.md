# Render.com Deployment Guide

## 📋 Prerequisites

1. GitHub repository with your code
2. OpenAI API key
3. Render.com account

## 🚀 Backend Deployment

### Option 1: Manual Setup

1. **Create a New Web Service**
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub repository
   - Select the repository: `your-username/eqori`

2. **Configure Build Settings**
   - **Name**: `eqori-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Environment Variables**
   ```
   OPENAI_API_KEY = your-openai-api-key-here
   SECRET_KEY = auto-generated-by-render
   DATABASE_URL = sqlite:///./eqori.db
   ENVIRONMENT = production
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

## 🌐 Frontend Deployment

### Option 1: Manual Setup

1. **Create a New Static Site**
   - Go to Render Dashboard → New → Static Site
   - Connect the same GitHub repository

2. **Configure Build Settings**
   - **Name**: `eqori-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `build`

3. **Environment Variables**
   ```
   REACT_APP_API_URL = https://your-backend-url.onrender.com
   ```
   *(Replace with your actual backend URL after it's deployed)*

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete

### Option 2: Using render.yaml (Blueprint)

1. **Add render.yaml to your repository root** *(already created)*

2. **Create Blueprint**
   - Go to Render Dashboard → New → Blueprint
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Configure Environment Variables**
   - Add your `OPENAI_API_KEY` when prompted
   - Other variables will be auto-configured

## 🔧 Important Configuration Notes

### Backend Specific
- ✅ Python 3.11+ compatible dependencies
- ✅ Automatic database creation on startup
- ✅ Health check endpoint at `/health`
- ✅ CORS configured for Render domains

### Frontend Specific
- ✅ React build process optimized
- ✅ Static file serving configured
- ✅ Client-side routing handled

## 🌍 Production URLs

After deployment, your application will be available at:
- **Frontend**: `https://your-frontend-name.onrender.com`
- **Backend API**: `https://your-backend-name.onrender.com`
- **API Docs**: `https://your-backend-name.onrender.com/docs`

## 🔄 Environment Variables Setup

### Required Environment Variables:

**Backend Service:**
```bash
OPENAI_API_KEY=sk-your-openai-key-here
SECRET_KEY=your-secure-random-string
DATABASE_URL=sqlite:///./eqori.db
ENVIRONMENT=production
```

**Frontend Service:**
```bash
REACT_APP_API_URL=https://your-backend-name.onrender.com
```

## 🐛 Troubleshooting

### Common Issues:

1. **Build Failed - Python Dependencies**
   - Check that `requirements.txt` is in the `backend` directory
   - Verify Python version compatibility (3.11+)

2. **OpenAI API Errors**
   - Verify your OpenAI API key is correct
   - Check API key has sufficient credits
   - Ensure API key has proper permissions

3. **CORS Issues**
   - Update `REACT_APP_API_URL` to match your backend URL
   - Check backend CORS configuration allows your frontend domain

4. **Database Issues**
   - SQLite files persist between deployments on Render
   - For production, consider upgrading to PostgreSQL

## 💡 Performance Tips

1. **Free Tier Limitations**
   - Services spin down after 15 minutes of inactivity
   - First request after spin-down takes 30+ seconds
   - Consider upgrading to paid tier for production

2. **Database Persistence**
   - SQLite files persist on Render's disk
   - For high-traffic, consider PostgreSQL addon

3. **Environment Variables**
   - Use Render's secret management
   - Never commit API keys to repository

## 🚀 Going Live Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables configured
- [ ] OpenAI API key working
- [ ] User registration/login tested
- [ ] AI content generation tested
- [ ] Custom domain configured (optional)

## 🔒 Security Considerations

- ✅ JWT tokens for authentication
- ✅ Password hashing with bcrypt
- ✅ CORS properly configured
- ✅ Environment variables secured
- ✅ No API keys in code

Your Eqori AI Marketing Suite is now ready for production on Render.com!