# Deployment Guide for AI Image Generator App

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)
### Option 2: Railway
### Option 3: Render
### Option 4: DigitalOcean App Platform

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup
Make sure you have these environment variables ready:

```env
# Supabase Configuration
SUPABASE_URL=https://mwtenoalqvadgcmyszqe.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_DATABASE_URL=postgresql://postgres:[PASSWORD]@db.mwtenoalqvadgcmyszqe.supabase.co:5432/postgres

# Client-side environment variables
VITE_SUPABASE_URL=https://mwtenoalqvadgcmyszqe.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Session Secret (generate a random string)
SESSION_SECRET=your_random_session_secret_here
```

### 2. Database Setup
```bash
npm run db:push
```

### 3. Test Locally
```bash
npm run build
npm start
```

---

## 🎯 Option 1: Vercel Deployment

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Create vercel.json
Create a `vercel.json` file in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "dist/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "dist/public/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 3: Deploy
```bash
vercel
```

### Step 4: Set Environment Variables
In Vercel dashboard:
1. Go to your project settings
2. Add all environment variables from the checklist above

---

## 🚂 Option 2: Railway Deployment

### Step 1: Create railway.json
Create a `railway.json` file:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Step 2: Deploy to Railway
1. Connect your GitHub repo to Railway
2. Railway will auto-detect and deploy
3. Add environment variables in Railway dashboard

---

## 🌊 Option 3: Render Deployment

### Step 1: Create render.yaml
Create a `render.yaml` file:

```yaml
services:
  - type: web
    name: ai-image-generator
    env: node
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
    healthCheckPath: /api/health
```

### Step 2: Deploy to Render
1. Connect your GitHub repo to Render
2. Render will auto-deploy
3. Add environment variables in Render dashboard

---

## 🐳 Option 4: Docker Deployment

### Step 1: Create Dockerfile
Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Step 2: Create .dockerignore
Create a `.dockerignore` file:

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.vscode
```

### Step 3: Build and Deploy
```bash
docker build -t ai-image-generator .
docker run -p 3000:3000 --env-file .env ai-image-generator
```

---

## 🔧 Production Optimizations

### 1. Update package.json Scripts
Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "postinstall": "npm run build"
  }
}
```

### 2. Add Health Check Endpoint
Your app already has a health check at `/api/health` - this is perfect for deployment platforms.

### 3. Environment-Specific Config
Create `config/production.ts`:

```typescript
export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  supabase: {
    url: process.env.SUPABASE_URL!,
    anonKey: process.env.SUPABASE_ANON_KEY!,
    databaseUrl: process.env.SUPABASE_DATABASE_URL!,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
  },
  session: {
    secret: process.env.SESSION_SECRET!,
  },
};
```

---

## 🛡️ Security Checklist

### 1. Environment Variables
- ✅ All sensitive data in environment variables
- ✅ No hardcoded API keys
- ✅ Session secret is random and secure

### 2. CORS Configuration
Update your server to handle CORS properly:

```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));
```

### 3. Rate Limiting
Add rate limiting to prevent abuse:

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 📊 Monitoring & Analytics

### 1. Add Logging
```bash
npm install winston
```

### 2. Error Tracking
Consider adding Sentry for error tracking:

```bash
npm install @sentry/node @sentry/integrations
```

### 3. Performance Monitoring
- Use Vercel Analytics (if on Vercel)
- Add Google Analytics
- Monitor Supabase usage

---

## 🚀 Post-Deployment

### 1. Test Your App
- ✅ All features work
- ✅ Image generation works
- ✅ Database operations work
- ✅ Authentication works (if implemented)

### 2. Set Up Custom Domain
- Configure DNS
- Set up SSL certificate
- Update CORS origins

### 3. Monitor Performance
- Check response times
- Monitor error rates
- Track API usage

### 4. Set Up Backups
- Database backups (Supabase handles this)
- File backups
- Configuration backups

---

## 🆘 Troubleshooting

### Common Issues:

1. **Build Fails**: Check Node.js version compatibility
2. **Environment Variables**: Ensure all required vars are set
3. **Database Connection**: Verify Supabase credentials
4. **CORS Errors**: Check origin configuration
5. **File Uploads**: Ensure storage bucket is configured

### Debug Commands:
```bash
# Check build locally
npm run build

# Test production build
npm start

# Check environment variables
node -e "console.log(process.env.NODE_ENV)"
```

---

## 📞 Support

If you encounter issues:
1. Check the deployment platform's logs
2. Verify all environment variables are set
3. Test locally with production build
4. Check Supabase dashboard for database issues

Your app is now ready for public deployment! 🎉 