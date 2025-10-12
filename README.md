# Rain & Donuts - Blind Hunt PWA

A mobile-first Progressive Web App for a scavenger hunt adventure in Vancouver with real-time sync between participants.

## Features

- 📍 Geolocation validation at each stop
- 📸 Photo capture at each location
- ✅ Answer validation with hints
- ⏱️ Time tracking with penalties
- 🔄 Real-time sync between users via Supabase
- 📱 Progressive Web App (installable on mobile)
- ☕ Coffee break timer at stop 7

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to Project Settings > API
3. Copy your project URL and anon key
4. Run the SQL schema from `supabase-schema.sql` in the SQL Editor

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add the environment variables in Vercel project settings
4. Deploy!

**Important:** The app requires HTTPS to use geolocation APIs. Vercel provides this automatically.

## How to Play

### Starting a Hunt

1. One person creates a new hunt with a team name
2. Share the generated link with your partner
3. Both people should see the same session
4. Press "Start the Hunt!" when ready

### During the Hunt

- Navigate to each location using the geolocation checker
- Take a photo at each stop
- Answer the prompt question
- Use hints if needed (2-minute penalty each)
- Skip locations if necessary (available after 10 seconds)

### Coffee Break

At stop 7, you can pause the timer for a 10-minute coffee break!

### Completion

After all 11 stops, view your photo gallery, stats, and memories!

## Tech Stack

- **Framework:** Next.js 14+ with App Router
- **UI:** React + Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL + Real-time)
- **PWA:** next-pwa
- **Geolocation:** Browser Geolocation API
- **Photos:** Base64 encoding (stored in Supabase)

## Project Structure

```
blind-hunt/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main hunt page
│   └── globals.css         # Global styles
├── components/
│   ├── StartScreen.tsx     # Session creation/joining
│   ├── StopCard.tsx        # Main stop interface
│   ├── CompletionScreen.tsx # Final results
│   ├── Timer.tsx           # Time tracking display
│   ├── GeolocationChecker.tsx # Location validation
│   └── PhotoCapture.tsx    # Camera interface
├── contexts/
│   └── HuntContext.tsx     # Hunt state & real-time sync
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── hunt-config.ts      # Hunt configuration
│   ├── validation.ts       # Answer validation
│   └── geolocation.ts      # Distance calculations
└── public/
    └── manifest.json       # PWA manifest
```

## Database Schema

See `supabase-schema.sql` for the complete schema. Main tables:

- `hunt_sessions` - Hunt session data
- `stop_progress` - Progress at each stop
- `hunt_timer` - Timer state

## Customization

To create your own hunt, modify `lib/hunt-config.ts` with:

- Hunt name and time limits
- Stop locations (lat/lng coordinates)
- Prompts and questions
- Answer validation rules
- Hints

## Notes

- Photos are stored as base64 in the database (simple but not optimal for production)
- For production, consider using Supabase Storage for photos
- Geolocation accuracy varies by device and environment
- The app works best on mobile devices with GPS

## License

Created for Owen & Alison's blind hunt adventure! 🎯☔🍩
