# beacon — financial literacy for the whole family

A Duolingo-style financial literacy platform. Every family member gets an age-appropriate learning track with gamified lessons, XP, streaks, hearts, a family leaderboard, and shared savings goals.

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 App Router |
| Auth | Clerk |
| Database | Neon Postgres + Drizzle ORM |
| Payments | Stripe |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Admin | react-admin |

---

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/beacon.git
cd beacon
npm install
cp .env.example .env.local   # fill in your keys
npm run db:push              # push schema to Neon
npm run db:seed              # seed financial literacy content
npm run dev                  # http://localhost:3000
```

---

## Environment Variables

```env
# Clerk — https://clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/learn
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/learn

# Neon — https://neon.tech
DATABASE_URL=

# Stripe — https://stripe.com
STRIPE_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Your Clerk user ID (get from Clerk dashboard → Users)
NEXT_PUBLIC_ADMIN_USER_ID=
```

---

## Project Structure

```
beacon/
├── app/
│   ├── (marketing)/         Landing page
│   ├── (main)/
│   │   ├── learn/           Lesson path with unit + lesson nodes
│   │   ├── tracks/          Track selection (age-grouped)
│   │   ├── family-goals/    Shared family savings goals
│   │   ├── leaderboard/     Family XP rankings
│   │   ├── quests/          Weekly XP challenges
│   │   └── shop/            Hearts refill + Beacon Pro
│   ├── lesson/              Quiz engine (shared by /lesson and /lesson/[id])
│   ├── admin/               react-admin content manager
│   └── api/
│       ├── admin/           REST endpoints for react-admin (CRUD on all tables)
│       └── webhooks/stripe/ Stripe subscription webhooks
├── components/
│   ├── ui/                  Button, Progress, Dialog, Sheet, Avatar, Separator
│   ├── modals/              Exit, Hearts, Practice modals
│   └── ...                  Sidebar, MobileHeader, UserProgress, FeedWrapper
├── db/
│   ├── schema.ts            Drizzle schema (tracks, units, lessons, challenges, family)
│   ├── drizzle.ts           DB client
│   └── queries.ts           Cached server queries
├── actions/                 Server actions (progress, hearts, Stripe)
├── store/                   Zustand stores for modals
├── lib/                     Constants, utils, stripe, admin guard
└── scripts/                 seed.ts, reset.ts
```

---

## Admin Panel

Go to `/admin` (you must be the user ID set in `NEXT_PUBLIC_ADMIN_USER_ID`).

From there you can create, edit, and delete:
- Tracks → Units → Lessons → Challenges → Challenge Options

No code needed to add new financial literacy content.

---

## Audio Files

`/public/correct.wav`, `incorrect.wav`, and `finish.mp3` are silent placeholders.
Replace them with real sound effects before launch — good free sources:
- https://freesound.org (search "correct answer", "wrong buzz", "fanfare")
- https://mixkit.co/free-sound-effects/

---

## Deploying to Vercel

1. Push to GitHub
2. Import at vercel.com → add all env vars
3. Deploy
4. Set Stripe webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
5. Run `npm run db:seed` once against your production DB
