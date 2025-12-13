# Release Notes

## v0.1.0 - Initial Release (December 2025)

### 🎉 Features

#### Study Timer
- Pomodoro-style timer with start/pause/stop controls
- Real-time elapsed time display
- Subject selection and inline creation
- Distraction detection with penalty modes (none, pause, streak debit)

#### Honesty System
- Post-session reflection modal
- 5-star focus self-rating
- Honesty toggle with impact scoring
- Notes for session review

#### Dashboard
- Today's study time progress
- Daily goal tracking
- Quick actions for starting sessions
- Recent activity feed

#### Reports & Analytics
- Period filters (Week, Month, Year, All Time)
- Subject multi-select filters
- Interactive timeline chart (Recharts)
- Subject distribution pie chart
- Summary cards (Total Time, Sessions, Avg Focus, Avg Honesty)
- CSV export functionality

#### Profile Management
- Display name and avatar
- Daily study goal setting (15-480 minutes)
- Preferred session duration presets
- Timezone selection

#### Achievements & Streaks
- Streak tracking with day count
- Achievement badges for milestones
- Visual progress indicators

#### Subjects
- Create subjects with custom colors
- Inline creation from timer and filters
- Subject-based session organization

### 🔧 Technical

- **Framework**: Next.js 16 with App Router
- **Database**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS with custom design tokens
- **Testing**: Vitest for unit tests, Playwright for E2E
- **Accessibility**: ARIA labels, focus states, keyboard navigation
- **Error Handling**: Global error boundary, loading states, 404 page

### 📦 Dependencies

- `@supabase/ssr` - Server-side Supabase client
- `recharts` - Charting library
- `lucide-react` - Icon library
- `vitest` - Unit testing
- `@playwright/test` - E2E testing

### 🐛 Known Issues

- External image URLs require HTTPS
- Some TypeScript strict mode warnings remain

### 🔮 Future Enhancements

- Supabase Storage for avatar uploads
- Push notifications for streak reminders
- Collaborative study features
- Mobile app (React Native)
