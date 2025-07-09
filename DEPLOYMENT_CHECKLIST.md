# 🚀 Quick Deployment Checklist

## ✅ Pre-Deployment (Do This First!)

### 1. Environment Variables
Create `.env` file with:
```env
SUPABASE_URL=https://mwtenoalqvadgcmyszqe.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_DATABASE_URL=postgresql://postgres:[PASSWORD]@db.mwtenoalqvadgcmyszqe.supabase.co:5432/postgres
VITE_SUPABASE_URL=https://mwtenoalqvadgcmyszqe.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
OPENAI_API_KEY=your_openai_key_here
SESSION_SECRET=random_secret_string_here
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

## 🎯 Choose Your Deployment Platform

### Option A: Vercel (Easiest) ⭐
1. Install: `npm i -g vercel`
2. Deploy: `npm run deploy:vercel`
3. Set env vars in Vercel dashboard

### Option B: Railway
1. Connect GitHub repo to Railway
2. Add env vars in Railway dashboard
3. Auto-deploys on push

### Option C: Render
1. Connect GitHub repo to Render
2. Add env vars in Render dashboard
3. Auto-deploys on push

### Option D: Docker
1. Build: `npm run docker:build`
2. Run: `npm run docker:run`

---

## 🔧 Post-Deployment

### 1. Test Your App
- [ ] Homepage loads
- [ ] Image generation works
- [ ] Database operations work
- [ ] File uploads work

### 2. Security Check
- [ ] No API keys in code
- [ ] CORS configured
- [ ] Rate limiting active
- [ ] HTTPS enabled

### 3. Monitoring
- [ ] Health check endpoint works
- [ ] Error logging set up
- [ ] Performance monitoring active

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check Node.js version (18+) |
| Env vars missing | Add all required vars |
| Database connection | Verify Supabase credentials |
| CORS errors | Update allowed origins |
| File uploads fail | Configure storage bucket |

---

## 📞 Quick Commands

```bash
# Test production build
npm run build && npm start

# Deploy to Vercel
npm run deploy:vercel

# Build Docker image
npm run docker:build

# Check health
curl https://your-app.vercel.app/api/health
```

---

## 🎉 You're Ready!

Your AI Image Generator is now live! 🚀 