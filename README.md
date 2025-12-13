# StudyBit 📚

A modern study tracking application designed to help students build consistent study habits through focused sessions, honest self-reflection, and progress analytics.

## Features

### Core Functionality
- **Study Timer** - Pomodoro-style timer with distraction detection and honesty system
- **Session Logging** - Manual session entry with subject tagging
- **Dashboard** - Overview of daily progress, goals, and recent activity
- **Reports & Analytics** - Visual charts, filters, and CSV export

### Gamification & Motivation
- **Streaks** - Track consecutive study days
- **Achievements** - Unlock badges for milestones
- **Honesty System** - Self-reflection prompts to build awareness

### User Experience
- **Profile Management** - Customize daily goals, session preferences, and timezone
- **Subject Management** - Create and organize study subjects with colors
- **Responsive Design** - Works on desktop and mobile
- **Accessibility** - ARIA labels, focus states, keyboard navigation

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL + Auth)
- **Charts**: Recharts
- **Testing**: Vitest (unit), Playwright (E2E)
- **Language**: TypeScript

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Lint code
npm run lint

# Build for production
npm run build
```

### Database Setup

Run the migrations in `supabase/migrations/` in order:
1. `20251213_data_model.sql` - Core tables
2. `20251213_add_honesty_system.sql` - Honesty columns
3. `20251213_add_penalty_mode.sql` - Penalty mode setting

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (protected)/        # Auth-required routes
│   │   ├── dashboard/      # Main dashboard
│   │   ├── sessions/       # Study timer
│   │   ├── reports/        # Analytics
│   │   ├── profile/        # User settings
│   │   └── achievements/   # Badges & streaks
│   ├── actions/            # Server actions
│   └── api/                # API routes
├── components/             # React components
├── lib/                    # Utilities & business logic
│   ├── db/                 # Database queries
│   ├── streaks/            # Streak calculations
│   ├── achievements/       # Achievement rules
│   ├── honesty/            # Honesty scoring
│   └── reports/            # Report aggregation
└── types/                  # TypeScript definitions
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |

## Branch Summary

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `develop` | Integration branch |
| `feature/*` | Feature development |

## Contributing

1. Create a feature branch from `develop`
2. Make changes with atomic commits
3. Run tests and lint before PR
4. Create PR targeting `develop`

## License

MIT
