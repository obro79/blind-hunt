# Environment Variables Setup

## 🔑 Required Environment Variables

This app requires two environment variables to connect to Supabase:

1. `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

## 📋 How to Get Your Credentials

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Choose organization and fill in:
   - Project name (e.g., "blind-hunt")
   - Database password (save this somewhere)
   - Region (choose closest to Vancouver)
5. Click "Create new project"
6. Wait ~2 minutes for setup to complete

### Step 2: Get Your Credentials
1. In your Supabase project dashboard
2. Click the **Settings** icon (⚙️) in the bottom left
3. Click **API** in the settings menu
4. You'll see two values:
   - **Project URL** - looks like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public** key - long string starting with `eyJ...`
5. Copy both values (use the copy button)

## 💻 Local Development Setup

Create a file named `.env.local` in the `blind-hunt` folder:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYWN0aWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDY0MjE2OTcsImV4cCI6MTk2MTk5NzY5N30.example
```

**Replace** the values with your actual credentials from Step 2.

### Important Notes:
- The file must be named exactly `.env.local` (starts with a dot)
- Do NOT commit this file to Git (it's already in `.gitignore`)
- Do NOT share these credentials publicly

## ☁️ Vercel Deployment Setup

When deploying to Vercel:

1. Go to your Vercel project dashboard
2. Click **Settings**
3. Click **Environment Variables** in the left menu
4. Add each variable:
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://xxxxxxxxxxxxx.supabase.co` (your URL)
   - Environment: Select all (Production, Preview, Development)
   - Click "Save"
   
5. Add second variable:
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Your long anon key
   - Environment: Select all
   - Click "Save"

6. Redeploy your project for changes to take effect

## ✅ Verify Setup

### Local Verification
After creating `.env.local`:
```bash
npm run dev
```

If you see the app running at http://localhost:3000 without errors, you're good!

### Deployment Verification
After adding env vars to Vercel:
1. Open your deployment URL
2. Try creating a session
3. If you can create and see a session ID, it's working!

## 🚨 Troubleshooting

### "supabaseUrl is required" error
- Check that `.env.local` exists in the `blind-hunt` folder
- Check that variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Make sure there are no typos or extra spaces
- Restart the dev server after creating `.env.local`

### Environment variables not working in Vercel
- Make sure you selected all environments (Production, Preview, Development)
- Redeploy the project after adding variables
- Check the deployment logs for errors

### Can't find credentials in Supabase
- Make sure you're in the right project
- Settings → API should show your credentials
- If you don't see them, your project might not be finished initializing

## 📝 Example .env.local File

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyNTkyMDAsImV4cCI6MjAxNDgzNTIwMH0.example-signature-string-here

# Note: Replace these with your actual values from Supabase!
```

## 🔒 Security Notes

- The `anon` key is safe to expose in client-side code (that's why it's called "public")
- Database security is handled by Supabase Row Level Security (RLS) policies
- Never commit `.env.local` to Git
- Never share your database password publicly
- For production apps with sensitive data, implement authentication

## ✨ You're All Set!

Once your environment variables are configured:
1. ✅ Local development works
2. ✅ Deployment builds successfully  
3. ✅ Real-time sync functions
4. ✅ Ready to hunt!


