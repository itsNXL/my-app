# Supabase Setup Guide

This project has been updated to use Supabase instead of Neon. Follow these steps to configure Supabase:

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key from the project settings

## 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Client-side environment variables (for Vite)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Session Secret
SESSION_SECRET=your_session_secret
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Database Migration

Run the database migration to create the tables:

```bash
npm run db:push
```

## 5. Supabase Database URL

To get your Supabase database URL:
1. Go to your Supabase project dashboard
2. Navigate to Settings > Database
3. Copy the connection string and replace `[YOUR-PASSWORD]` with your database password

## 6. Features

The app now includes:
- Supabase client for server-side operations
- Supabase client for client-side operations
- Drizzle ORM integration with Supabase
- Authentication ready (can be extended with Supabase Auth)
- Real-time subscriptions ready (can be extended with Supabase Realtime)

## 7. Next Steps

You can now:
- Use Supabase Auth for user authentication
- Use Supabase Storage for file uploads
- Use Supabase Realtime for real-time features
- Use Supabase Edge Functions for serverless functions 