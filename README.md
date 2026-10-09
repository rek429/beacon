# Beacon

Beacon is a gamified learning web application designed to make education more engaging through interactive lessons, progress tracking, rewards, and family-oriented learning goals.

## Features

- **Interactive Learning:** Explore learning tracks, units, lessons, and quizzes.
- **Progress Tracking:** Track completed challenges and learning progress.
- **Gamification:** Earn XP, collect rewards, manage hearts, and complete quests.
- **Leaderboard:** Compare progress and achievements.
- **Shop:** Use earned points for in-app rewards.
- **Family Features:** Manage family learning goals and invitations.
- **Admin Dashboard:** Manage learning tracks, units, lessons, challenges, and answer options.
- **Authentication:** User accounts and sign-in powered by Clerk.
- **Subscriptions:** Stripe integration for subscription-related functionality.

Some features are still being tested and improved.

## Tech Stack

| Category | Technologies |
| --- | --- |
| Framework | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS, Radix UI |
| Authentication | Clerk |
| Database | Neon PostgreSQL |
| ORM | Drizzle ORM |
| Payments | Stripe |
| State Management | Zustand |
| Admin Interface | React Admin |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js and npm
- A Neon PostgreSQL database
- A Clerk application
- Stripe credentials for payment functionality

### Installation

Clone the repository:

```bash
git clone https://github.com/rek429/beacon.git
cd beacon
```

Install dependencies:

```bash
npm ci
```

Create your local environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your own development credentials.

### Environment Variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in route |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up route |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Post-sign-in redirect |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Post-sign-up redirect |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `STRIPE_API_KEY` | Stripe secret API key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | Application base URL |
| `NEXT_PUBLIC_ADMIN_USER_ID` | Clerk user ID for admin access |

Never commit `.env.local`, API keys, database passwords, or other secrets.

### Run Locally

Start the development server:

```bash
npm run dev
```

Visit http://localhost:3000.

### Production Build

```bash
npm run build
npm run start
```

## Project Structure

```text
app/          Next.js pages, layouts, and API routes
actions/      Server actions
components/   Reusable UI components
db/           Database schema, queries, and connection
lib/          Shared utilities and integrations
public/       Static assets
scripts/      Database maintenance scripts
```

## Database

Beacon uses Neon PostgreSQL with Drizzle ORM.

Database-related commands are available in `package.json`, including `db:studio`, `db:push`, `db:seed`, and `db:reset`.

**Warning:** Database initialization, seeding, and reset operations may modify or delete existing data. Do not run them against a production database without reviewing their behavior and creating a backup.

## Development Status

Beacon is actively being improved. Current development priorities include:

- Fixing learning-track filtering and progression issues
- Improving family account and invitation functionality
- Strengthening subscription and webhook handling
- Updating dependencies and addressing security vulnerabilities
- Adding automated tests
- Improving performance and mobile responsiveness

## Author

**Redoyan Kobir**

GitHub: [@rek429](https://github.com/rek429)

## License

No license has been specified for this repository.
