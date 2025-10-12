# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Install Dependencies (30 seconds)

```bash
cd blind-hunt
npm install
```

### 2. Set Up Supabase Database (2 minutes)

1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in project details (any name/password is fine)
4. Wait ~2 minutes for database to initialize
5. Go to **SQL Editor** in left sidebar
6. Copy ALL text from `supabase-schema.sql`
7. Paste into SQL Editor and click **Run**

### 3. Get Your Credentials (30 seconds)

In your Supabase project:
1. Click **Project Settings** (gear icon bottom left)
2. Click **API** in the left menu
3. Copy these two values:
   - **Project URL**
   - **anon public** key

### 4. Create .env.local File (30 seconds)

Create a new file called `.env.local` in the `blind-hunt` folder:

```env
NEXT_PUBLIC_SUPABASE_URL=paste-your-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-your-key-here
```

### 5. Run the App! (10 seconds)

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## 🧪 Test It Works

1. Open http://localhost:3000 in **two different browser tabs**
2. In Tab 1: Click "Create New Hunt", enter "Test Team"
3. Copy the share link that appears
4. In Tab 2: Paste the link and press Enter
5. In either tab: Click "Start the Hunt!"
6. **Both tabs should update in real-time!** 🎉

## 📱 Deploy for Mobile Use

The geolocation features need HTTPS to work properly. Deploy to Vercel for free:

1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add the same environment variables from `.env.local`
5. Deploy!

You'll get a URL like `https://blind-hunt.vercel.app` that works perfectly on mobile!

## 🎯 Ready to Hunt

Once deployed:
1. Open the Vercel URL on both phones
2. One person creates a session
3. Share the link with your partner
4. Start the hunt and follow the prompts!

Have fun exploring Vancouver! ☔🍩

