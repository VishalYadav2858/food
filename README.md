# FoodLink — Food Redistribution Platform

**Rescue Food. Reduce Waste. Feed Communities.**

FoodLink is a full-stack food redistribution platform that connects people and organizations with surplus food to verified NGOs that can collect and redistribute that food to people in need.

## Features

### Donor Portal
- Create food donations with full details (category, quantity, servings, pickup window, location)
- Track donation status (Available → Claimed → Picked Up)
- View claim information and NGO details
- Cancel donations
- Dashboard with impact statistics (meals donated, food rescued)
- Donation history and analytics

### NGO Portal
- Browse available food donations with search and filters (category, city, food type, distance)
- Sort by newest, nearest, or pickup deadline
- Claim food with confirmation modal
- View donor contact details and pickup location on map
- Mark donations as picked up
- Dashboard with meals rescued and food collected statistics
- NGO verification required before claiming

### Admin Portal
- Platform-wide dashboard with real-time statistics
- NGO verification (approve/reject with reason)
- User management (search, filter, activate/deactivate)
- Donation moderation (view all, cancel inappropriate listings)
- Analytics with charts (donations over time, by category, by city, status distribution)
- Reports with CSV export

### Cross-cutting
- JWT authentication with role-based access control (donor, ngo, admin)
- In-app notification system with real-time updates
- Protected routes with role-based permissions
- Responsive design (desktop, tablet, mobile)
- Loading, empty, and error states on every page
- OpenStreetMap integration for pickup locations and directions
- Atomic claim system prevents double-claiming (database-enforced)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, TypeScript, Tailwind CSS, React Router, Recharts, Lucide React |
| Backend | Supabase (PostgreSQL, Auth, Realtime, Row Level Security) |
| Database | PostgreSQL via Supabase |
| Maps | OpenStreetMap (embedded, no API key required) |

## Architecture

```
src/
├── components/          # Shared UI components (Logo, DonationCard, MapView, etc.)
│   └── ui/             # Primitives (Loading, EmptyState, StatusBadge)
├── context/            # AuthContext (authentication state)
├── layouts/            # PublicLayout, DashboardLayout, AuthLayout
├── lib/                # Supabase client
├── pages/              # All page components
│   ├── auth/           # Login, Register, ForgotPassword
│   ├── donor/          # Donor dashboard, donations, create, edit, history
│   ├── ngo/            # NGO dashboard, find food, food detail, claims, history
│   └── admin/          # Admin dashboard, NGOs, users, donations, analytics, reports, settings
├── routes/             # ProtectedRoute wrapper
├── services/           # API layer (Supabase queries)
├── types/              # TypeScript types
└── utils/              # Formatting utilities
```

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

## Environment Variables

Supabase credentials are pre-configured in `.env`. The application uses:
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anonymous key

No additional environment variables are required for local development.

## Database

The database uses Supabase (PostgreSQL) with the following tables:
- **profiles** — User profiles extending auth.users (role, verification, NGO fields)
- **donations** — Food donations with full lifecycle tracking
- **claims** — Audit trail of NGO claims
- **notifications** — In-app notifications

Row Level Security is enabled on all tables with role-based policies. Atomic claim operations use SECURITY DEFINER functions to prevent race conditions.

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@foodlink.com | Admin@123 |
| Donor | donor@foodlink.com | Donor@123 |
| NGO (Verified) | ngo@foodlink.com | Ngo@123 |

Additional demo accounts:
- Donor: priya@foodlink.com / Donor@123
- NGO (Pending): care@foodlink.com / Ngo@123
- NGO (Verified): feed@foodlink.com / Ngo@123

## Testing the Full Workflow

1. **Login as donor** (donor@foodlink.com) → Create a donation
2. **Login as verified NGO** (ngo@foodlink.com) → Find food → Claim it
3. **Login as donor again** → See the claim notification and status change
4. **Login as NGO** → Mark donation as picked up
5. **Login as admin** (admin@foodlink.com) → Verify pending NGOs, view dashboard stats
6. Try claiming with a second NGO → Should be prevented (already claimed)
7. Try claiming with an unverified NGO → Should be prevented

## Deployment

The application is built with Vite and can be deployed to any static hosting provider:

```bash
npm run build
# Deploy the dist/ folder
```

The Supabase backend is already provisioned and requires no additional deployment steps.

## License

Built for social impact. © 2026 FoodLink.
