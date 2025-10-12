# Quick Setup Guide

## Prerequisites

You need:
1. Node.js installed (v18 or higher)
2. A Supabase account (free tier is fine)

## Step-by-Step Setup

### 1. Supabase Database Setup

1. Go to https://supabase.com and create a new project
2. Wait for the database to be ready (takes ~2 minutes)
3. Go to the SQL Editor in the left sidebar
4. Copy the entire contents of `supabase-schema.sql` and paste it into the SQL Editor
5. Click "Run" to create all tables

### 2. Get Your Supabase Credentials

1. In your Supabase project, go to **Project Settings** (gear icon) > **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### 3. Create Environment File

Create a file named `.env.local` in the `blind-hunt` folder with this content:

```env
NEXT_PUBLIC_SUPABASE_URL=paste-your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-your-anon-key-here
```

Replace the values with your actual Supabase credentials from step 2.

### 4. Install and Run

```bash
cd blind-hunt
npm install
npm run dev
```

The app will open at http://localhost:3000

**Note:** Geolocation won't work perfectly in development. For full testing, you need to deploy to Vercel (which provides HTTPS).

### 5. Deploy to Vercel (Optional but Recommended)

1. Push your code to GitHub
2. Go to https://vercel.com and sign in with GitHub
3. Click "New Project" and import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

After deployment, you'll get a URL like `https://your-app.vercel.app` that works on mobile with full geolocation support!

## Testing the Hunt

### Test Locally (Without Geolocation)

1. Open http://localhost:3000 in two browser windows
2. Create a session in one window
3. Copy the share link and open it in the second window
4. Click "Start the Hunt" in either window
5. You should see both windows sync in real-time!

**Note:** Geolocation will ask for permission but might not work perfectly on localhost. You can skip locations for testing.

### Test on Mobile (After Deploying)

1. Open your Vercel URL on your phone
2. Allow location permissions when prompted
3. Navigate to the actual Vancouver locations for the real experience!

## PWA Icons (Optional)

The app includes a manifest for PWA installation, but uses placeholder icon paths. To add real icons:

1. Create a 192x192px icon and save as `public/icon-192.png`
2. Create a 512x512px icon and save as `public/icon-512.png`

Or use a tool like https://realfavicongenerator.net to generate all icon sizes.

## Troubleshooting

### "No linter errors" but app won't run
- Make sure you're in the `blind-hunt` directory
- Delete `node_modules` and `.next` folders, then run `npm install` again

### Real-time sync not working
- Check that your Supabase credentials are correct in `.env.local`
- Make sure you ran the SQL schema from `supabase-schema.sql`
- Check the browser console for error messages

### Geolocation not working
- Must use HTTPS (deploy to Vercel)
- Allow location permissions in browser
- Some browsers block geolocation on HTTP (except localhost)

### Photos not displaying
- Check browser console for errors
- Images are stored as base64, so very large images might cause issues
- Try taking smaller photos or compressing them

## Ready to Hunt!

Once everything is set up:
1. One person creates a hunt session
2. Share the link with your partner
3. Both people click "Start the Hunt!"
4. Follow the prompts at each of the 11 stops in Vancouver
5. Have fun! 🎯☔🍩

