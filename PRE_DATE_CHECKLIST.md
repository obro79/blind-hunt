# 🚨 PRE-DATE CHECKLIST - CRITICAL
## Must complete BEFORE the date to avoid issues!

## ✅ COMPLETED (Verified)
- [x] Next.js project created and configured
- [x] All components built (15 React components)
- [x] Environment variables set in `.env.local`
- [x] Production build passes
- [x] No TypeScript errors
- [x] Supabase credentials configured

## ⚠️ CRITICAL - MUST DO NOW

### 1. Database Setup (5 minutes - DO THIS NOW!)
- [ ] Go to https://supabase.com/dashboard/project/fhkgqbwvfkppvuzmbvbr/sql
- [ ] Copy ALL contents from `supabase-schema.sql`
- [ ] Paste into SQL Editor
- [ ] Click **Run**
- [ ] Verify you see "Success. No rows returned"
- [ ] Check tables exist: Go to Table Editor, should see 3 tables:
  - `hunt_sessions`
  - `stop_progress`
  - `hunt_timer`

**WHY CRITICAL**: Without this, the app will crash when you try to create a session!

### 2. Deploy to Vercel (10 minutes - DO THIS NOW!)

**WHY CRITICAL**: Geolocation ONLY works on HTTPS. localhost won't work on your phones!

#### Steps:
1. **Push to GitHub**:
   ```bash
   cd "/Users/owenfisher/hunt w alison/blind-hunt"
   git add .
   git commit -m "Blind hunt app ready"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Add these environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL` = `https://fhkgqbwvfkppvuzmbvbr.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoa2dxYnd2ZmtwcHZ1em1idmJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyODg1MzgsImV4cCI6MjA3NTg2NDUzOH0.iZfvqSYoIFCc0KEJnwJOEAMh9QsuyL-ogRCFn2YL9Q4`
   - Click "Deploy"
   - Save your deployment URL!

## 🧪 CRITICAL - TEST BEFORE DATE

### Test on Desktop (5 minutes)
- [ ] Open your Vercel URL in browser
- [ ] Create a hunt with team name "Test Run"
- [ ] Verify you get a shareable link
- [ ] Open link in incognito/private window
- [ ] Verify both windows show same session
- [ ] Click "Start the Hunt"
- [ ] Verify timer starts and both windows sync
- [ ] Take a test photo
- [ ] Try answering "5" for first question
- [ ] Verify it moves to next stop

**If ANY of these fail, DO NOT GO ON THE DATE YET - ask for help!**

### Test on Mobile (10 minutes - DAY BEFORE DATE)
- [ ] Open Vercel URL on YOUR phone
- [ ] Allow location permissions when prompted
- [ ] Create a session
- [ ] Share link to Alison
- [ ] Both open the link
- [ ] Start the hunt
- [ ] Verify geolocation shows distance at first stop
- [ ] Test camera capture works
- [ ] Test answer submission works
- [ ] Test hint button works
- [ ] Test skip button appears after 10 seconds

## ⚠️ POTENTIAL ISSUES & FIXES

### Issue: "Error creating session"
**Fix**: Database schema not run. Go to Supabase SQL Editor and run the schema.

### Issue: Geolocation says "Location error"
**Fix**: 
- Make sure you allowed location permissions
- Make sure you're using HTTPS (Vercel URL, not localhost)
- Try refreshing the page
- Worst case: Skip button appears after 10 seconds

### Issue: Camera doesn't work
**Fix**:
- Check browser permissions
- Try different browser (Chrome/Safari)
- Make sure you're on HTTPS

### Issue: Real-time sync not working
**Fix**:
- Check Supabase credentials are correct in Vercel
- Check you ran the SQL schema including the real-time section
- Wait 5 seconds and refresh

### Issue: Photos look broken
**Fix**: This is expected - they're stored as base64 and might load slowly. They WILL display.

### Issue: Answer says "Not quite!" but it's correct
**Fix**: Check the answers in `lib/hunt-config.ts`:
- First stop: answer is `5` (the number)
- Some answers are case-insensitive
- Some need exact matches

## 📱 DAY-OF-DATE CHECKLIST

### Before Leaving Home:
- [ ] Both phones fully charged
- [ ] Vercel URL bookmarked on both phones
- [ ] Test app works on both phones
- [ ] Screenshot the Vercel URL as backup
- [ ] Turn on location services on both phones
- [ ] Make sure you have data/WiFi

### At Canada Place (First Stop):
- [ ] One person creates session with silly team name
- [ ] Share link via text/airtag/email to partner
- [ ] Both open link and verify you see same session
- [ ] Click "Start the Hunt" when ready
- [ ] Verify timer is running
- [ ] Check geolocation shows distance
- [ ] Take first selfie photo
- [ ] Answer: `5` (number of sail peaks)
- [ ] If it doesn't work: Use skip button and continue

### During Hunt:
- [ ] Keep phones unlocked when checking stops (prevents location timeout)
- [ ] If stuck: Use hint button (2 min penalty is worth it!)
- [ ] If totally stuck: Use skip button
- [ ] At Coffee Stop (Stop 7): Start coffee break timer
- [ ] Have fun! The app is a tool, not the main event 😊

## 🆘 EMERGENCY BACKUP PLAN

If the app completely fails:
1. **Don't panic** - you still have the hunt JSON config
2. Use Google Maps to navigate to each location
3. Take photos manually
4. Write answers in Notes app
5. Keep track of time manually
6. You can enter everything after the date for memories

## 🎯 FINAL VERIFICATION (Run Right Before Date)

Run this command to verify everything:
```bash
cd "/Users/owenfisher/hunt w alison/blind-hunt"
npm run build
```

Should say: `✓ Compiled successfully`

Then open your Vercel URL and test creating a session.

## 📞 CRITICAL CONTACTS

- Supabase Dashboard: https://supabase.com/dashboard/project/fhkgqbwvfkppvuzmbvbr
- Vercel Dashboard: https://vercel.com/dashboard
- Your deployment URL: _________________________ (fill this in!)

## ✨ CONFIDENCE CHECK

Before the date, you should:
- ✅ Have run database schema in Supabase
- ✅ Have deployed to Vercel
- ✅ Have tested on both phones
- ✅ Have verified geolocation works
- ✅ Have verified camera works
- ✅ Have verified real-time sync works
- ✅ Have a backup plan

**If all above are checked, YOU'RE READY! 🎉**

---

## 🚀 QUICK START (If Everything Above is Done)

1. Both open Vercel URL on phones
2. One person: Click "Create New Hunt"
3. Enter silly team name
4. Share link with partner
5. Both see same session
6. Click "Start the Hunt!"
7. Have an amazing date! ☔🍩🎯

Good luck! The app is solid, but having a backup mindset keeps it fun even if tech hiccups happen.


