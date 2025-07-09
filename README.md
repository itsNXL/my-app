# Application Deployment Guide

## Prerequisites
- Node.js and npm installed
- Git installed
- Render account

## Deploying to Render

1. Create a new Web Service on Render:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" -> "Web Service"
   - Connect your GitHub repository
   - Select your branch (usually `main` or `master`)

2. Configure the service:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables:
     ```
     NODE_ENV=production
     SUPABASE_DATABASE_URL=https://mwtenoalqvadgcmyszqe.supabase.co
     ```

3. Click "Create Web Service"

4. Wait for the deployment to complete

## Local Development

To run the application locally:

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
