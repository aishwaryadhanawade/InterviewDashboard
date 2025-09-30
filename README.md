# Interview Management Dashboard

A comprehensive frontend-only Interview Management Dashboard built with Next.js, TypeScript, and Tailwind CSS. This application demonstrates role-based access control, secure authentication patterns, and OWASP Top 10 UI security compliance.

## Features

- **Authentication & Role Simulation**: Login with DummyJSON API supporting three roles (admin, ta_member, panelist)
- **Dashboard**: KPI cards showing interviews scheduled, average feedback scores, and no-shows
- **Candidate Management**: Search, filter, sort, and paginate candidate lists
- **Candidate Details**: Tabbed interface with Profile, Schedule, and Feedback sections
- **Feedback System**: Panelists can submit structured feedback with validation
- **Admin Panel**: Role management interface (admin-only access)

## Tech Stack

### Core
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **shadcn/ui** for UI components

### Forms & Validation
- **React Hook Form** for form management
- **Zod** for schema validation

### State Management
- **Context API** for authentication state
- **SWR** for data fetching and caching (optional enhancement)

### API Integration
- **DummyJSON API** (https://dummyjson.com) for all data

## Project Structure

\`\`\`
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx          # Login page with role selection
│   ├── (dashboard)/
│   │   └── dashboard/page.tsx      # Main dashboard with KPIs
│   ├── candidates/
│   │   ├── page.tsx                # Candidate list with search/filter
│   │   └── [id]/page.tsx           # Candidate detail page
│   ├── admin/
│   │   └── roles/page.tsx          # Role management (admin only)
│   ├── layout.tsx                  # Root layout with AuthProvider
│   └── globals.css                 # Global styles and theme
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── top-nav.tsx                 # Navigation header
│   ├── role-guard.tsx              # RBAC component
│   ├── kpi-cards.tsx               # Dashboard KPI cards
│   ├── dashboard-filters.tsx       # Dashboard filters
│   ├── interview-chart.tsx         # Weekly interview chart
│   ├── candidate-table.tsx         # Candidate list table
│   ├── candidate-search.tsx        # Debounced search input
│   ├── candidate-detail-tabs.tsx   # Tabbed candidate details
│   ├── feedback-form.tsx           # Feedback submission form
│   └── pagination.tsx              # Pagination controls
├── context/
│   └── auth-context.tsx            # Authentication context
├── lib/
│   ├── api/
│   │   ├── auth.ts                 # Authentication API calls
│   │   ├── users.ts                # User/candidate API calls
│   │   ├── todos.ts                # Schedule/todos API calls
│   │   └── posts.ts                # Feedback/posts API calls
│   ├── types.ts                    # TypeScript type definitions
│   ├── storage.ts                  # Browser storage utilities
│   ├── rbac.ts                     # Role-based access control
│   └── fetcher.ts                  # Typed fetch wrapper
└── README.md
\`\`\`

## Role & Permission Matrix

| Permission | Admin | TA Member | Panelist |
|------------|-------|-----------|----------|
| View Dashboard | ✅ | ✅ | ✅ |
| View Candidates | ✅ | ✅ | ✅ |
| View Candidate Details | ✅ | ✅ | ✅ |
| Submit Feedback | ❌ | ❌ | ✅ |
| View All Feedback | ✅ | ✅ | ❌ |
| Manage Roles | ✅ | ❌ | ❌ |

## OWASP Top 10 UI Security Coverage

### 1. Broken Access Control
- Role-based guards hide unauthorized UI elements
- Route protection redirects unauthorized users
- Conditional rendering based on permissions

### 2. Cryptographic Failures
- No passwords stored in localStorage
- Only necessary session data persisted
- Session expiration implemented

### 3. Injection
- All user inputs sanitized with `.trim()`
- Zod validation on all forms
- No `dangerouslySetInnerHTML` usage

### 4. Security Misconfiguration
- No hardcoded secrets or API keys
- Minimal development-only logging
- No debug information exposed

### 5. Authentication Issues
- Reliable login/logout flow
- Session hydration prevents redirect loops
- Token expiration checking

### 6. Software/Data Integrity
- Only trusted libraries (shadcn/ui, React Hook Form)
- No CDN dependencies
- Type-safe API calls

### 7. Logging & Monitoring
- Development-safe logging only
- No sensitive data in logs
- Console logs prefixed with `[v0]`

### 8. CSRF Awareness
- Submit buttons disabled during requests
- Visual feedback on form submission
- Idempotent UI patterns

## Setup Instructions

1. **Install dependencies** (handled automatically by v0)
2. **Run the development server**:
   - The app runs in the v0 preview environment
   - No terminal commands needed

3. **Test credentials** (DummyJSON):
   - Username: `emilys`
   - Password: `emilyspass`
   - Role: Select any (admin, ta_member, or panelist)

## API Endpoints Used

- `POST /auth/login` - User authentication
- `GET /users` - Fetch candidate list
- `GET /users/:id` - Fetch candidate details
- `GET /todos/user/:id` - Fetch interview schedule
- `GET /posts/user/:id` - Fetch feedback
- `POST /posts/add` - Submit feedback (simulated)

## Key Features

### Authentication
- Login page with role selection dropdown
- Session stored in localStorage (no password)
- Automatic session expiration after 1 hour
- Hydration-safe authentication guards

### Dashboard
- KPI cards: interviews this week, average score, no-shows
- Filters: role, interviewer, date range
- Weekly interview distribution chart

### Candidate Management
- Debounced search (300ms delay)
- Sortable table columns
- Pagination (10 items per page)
- Role-based action buttons

### Candidate Details
- Profile tab: contact info, resume link
- Schedule tab: interview tasks from DummyJSON todos
- Feedback tab: view previous feedback, submit new (panelist only)

### Admin Panel
- User role management table
- Role assignment dropdown
- Permission matrix display
- Admin-only access enforcement

## Best Practices Implemented

- **Component Modularity**: Reusable, single-responsibility components
- **Type Safety**: Full TypeScript coverage with interfaces
- **Secure Storage**: Only non-sensitive data in localStorage
- **State Discipline**: Global state only for auth, local state otherwise
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Responsive Design**: Mobile-first with Tailwind breakpoints
- **Error Handling**: Loading, error, and empty states everywhere
- **Performance**: Debounced inputs, pagination, lazy loading ready
- **Code Quality**: Consistent naming, no dead code, clear structure

## API Layer Separation

All API calls are separated into dedicated files under `lib/api/`:
- Components never call `fetch` directly
- Centralized error handling
- Type-safe responses
- Easy to mock for testing

## Development Notes

- Dark mode enabled by default
- Enterprise-grade design aesthetic
- All forms use React Hook Form + Zod
- No backend required - fully frontend simulation
- Ready for Storybook integration
- Test-ready architecture

