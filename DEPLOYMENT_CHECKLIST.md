# Deployment Checklist

## ✅ Pre-Deployment

- [ ] Code is complete and tested locally
- [ ] Build passes: `npm run build`
- [ ] Environment variables documented
- [ ] Database schema is ready in `supabase-schema.sql`

## 🗄️ Supabase Setup

- [ ] Create Supabase account at https://supabase.com
- [ ] Create new project (takes ~2 minutes)
- [ ] Run SQL schema from `supabase-schema.sql` in SQL Editor
- [ ] Copy Project URL from Settings > API
- [ ] Copy anon/public key from Settings > API
- [ ] Verify tables created: `hunt_sessions`, `stop_progress`, `hunt_timer`
- [ ] Check real-time is enabled for all tables

## 🚀 Vercel Deployment

### Initial Setup
- [ ] Push code to GitHub
- [ ] Sign in to https://vercel.com with GitHub
- [ ] Click "New Project"
- [ ] Import your `blind-hunt` repository
- [ ] Configure project settings:
  - Framework Preset: Next.js
  - Root Directory: `./` (or blank)
  - Build Command: `npm run build`
  - Output Directory: `.next`

### Environment Variables
Add these in Vercel project settings:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key

### Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete (~2 minutes)
- [ ] Copy your deployment URL (e.g., `https://blind-hunt.vercel.app`)

## 📱 Post-Deployment Testing

### Desktop Testing
- [ ] Open deployment URL in browser
- [ ] Create a new hunt session
- [ ] Verify session creation works
- [ ] Open session in second browser tab/window
- [ ] Verify real-time sync between tabs
- [ ] Test starting the hunt
- [ ] Verify timer works
- [ ] Test photo capture (may need HTTPS)
- [ ] Test answer submission

### Mobile Testing
- [ ] Open deployment URL on mobile device
- [ ] Allow location permissions when prompted
- [ ] Create or join a session
- [ ] Start the hunt
- [ ] Navigate to first stop location
- [ ] Verify geolocation check works
- [ ] Test camera capture
- [ ] Test answer submission
- [ ] Verify progress to next stop
- [ ] Test hint functionality
- [ ] Test skip functionality
- [ ] Test coffee break timer (stop 7)

### Two-Device Real-time Testing
- [ ] Open app on two different phones
- [ ] Create session on device 1
- [ ] Share link and join on device 2
- [ ] Start hunt from either device
- [ ] Verify both devices show same stop
- [ ] Take photo on device 1
- [ ] Verify device 2 sees the photo
- [ ] Submit answer on device 1
- [ ] Verify device 2 moves to next stop
- [ ] Test hint on one device
- [ ] Verify penalty appears on both devices

## 🎨 PWA Setup (Optional)

### Create Icons
- [ ] Create 192x192px icon → save as `public/icon-192.png`
- [ ] Create 512x512px icon → save as `public/icon-512.png`
- [ ] Redeploy to Vercel
- [ ] Test PWA installation on mobile:
  - [ ] Open app in mobile browser
  - [ ] Look for "Add to Home Screen" prompt
  - [ ] Install app
  - [ ] Open from home screen
  - [ ] Verify it opens in standalone mode

## 🔍 Final Verification

### Functionality Checklist
- [ ] Session creation works
- [ ] Session joining via link works
- [ ] Hunt starts correctly
- [ ] Timer displays and updates
- [ ] Geolocation checks work at stops
- [ ] Photos can be captured
- [ ] Answers validate correctly
- [ ] Hints add penalties
- [ ] Skip button appears after 10 seconds
- [ ] Progress saves to database
- [ ] Real-time sync works between devices
- [ ] Coffee break timer works (stop 7)
- [ ] Completion screen shows after last stop
- [ ] Photo gallery displays on completion
- [ ] Stats are accurate on completion

### Performance Checklist
- [ ] Initial page load is fast (<3s)
- [ ] Images load efficiently
- [ ] No console errors
- [ ] Real-time updates are instant (<1s)
- [ ] App works on 3G connection

### Browser Compatibility
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Desktop Chrome
- [ ] Desktop Safari
- [ ] Desktop Firefox

## 📝 Documentation

- [ ] Update README.md with deployment URL
- [ ] Share setup instructions with partner
- [ ] Document any custom changes made
- [ ] Note any known issues

## 🎯 Ready to Launch!

Once all checkboxes are complete:
1. Share the deployment URL with Alison
2. Both install the PWA on your phones
3. Test it together before the hunt
4. Have an amazing adventure! ☔🍩

## 🆘 Troubleshooting

### If real-time sync doesn't work:
- Check Supabase credentials in Vercel env vars
- Verify SQL schema was run completely
- Check browser console for errors
- Ensure real-time is enabled in Supabase project settings

### If geolocation doesn't work:
- Ensure HTTPS is enabled (Vercel provides this)
- Check browser location permissions
- Try on different device/browser
- Use skip button if needed

### If photos don't capture:
- Check browser camera permissions
- Ensure HTTPS is enabled
- Try different browser
- Check file input supports camera capture

### If build fails:
- Check environment variables are set
- Verify all dependencies installed: `npm install`
- Check for TypeScript errors: `npm run build` locally
- Review Vercel build logs

## 📞 Support

For issues:
1. Check browser console for errors
2. Check Vercel deployment logs
3. Check Supabase logs in project dashboard
4. Review this checklist for missed steps


