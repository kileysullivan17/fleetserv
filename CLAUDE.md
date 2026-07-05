# FleetServ Hawaii: Project Guide

## Directory layout

```
fleetserv/
  src/
    components/
      ui/           # Primitive UI components: Button, Card, StatusBadge, etc.
      layout/       # AppLayout, Sidebar
      auth/         # AuthProvider: session context over Supabase auth
      fleet/        # Fleet and truck-specific components
      visits/       # Service visit form and detail components
      quotes/       # Quote generation and PDF components
      invoices/     # Invoice table and QBO export components
    pages/          # Route-level page components (one per route, plus LoginPage)
    lib/
      supabase.ts   # Typed Supabase client and db() helper
      queryClient.ts
    types/
      database.ts   # Full schema types: Company, Truck, ServiceVisit, etc.
    utils/
      cn.ts         # Tailwind class merge utility
      format.ts     # Currency, date, status label formatters
    hooks/          # Custom React hooks (useTrucks, useAuth, etc.)
    router.tsx      # React Router v6 routes, guarded by RequireAuth
    App.tsx         # Root: AuthProvider > QueryClientProvider > RouterProvider
    main.tsx        # ReactDOM.createRoot entry point
    index.css       # Tailwind directives + global base styles
  public/
    favicon.svg
  supabase/
    migrations/
      000_schema.sql                  # Enums, tables, indexes, photo bucket
      001_rls_policies.sql            # RLS: authenticated-only access
      002_invoice_number_sequence.sql # Atomic invoice number allocation
    seed_demo_data.sql                # Optional sample data (not run on deploy)
  index.html
  tailwind.config.ts
  vite.config.ts
  tsconfig.json
  vercel.json       # SPA rewrite rule
  .env.local.example
  CLAUDE.md         # This file
```

## Conventions

- TypeScript strict mode. No implicit any. All props typed.
- Zod schema for every form (paired with React Hook Form via useForm + zodResolver).
- TanStack Query for all server state. No fetch() calls outside query/mutation fns.
- Tailwind only. No inline styles. Use cn() from utils/cn.ts for conditional classes.
- Component files: PascalCase. Utility files: camelCase.
- One component per file. Named exports only (no default exports from components).
- No em dashes anywhere: use periods, commas, or colons.
- Status badges: always use the StatusBadge component with the typed variant prop.
- Currency: always formatCurrency(). Dates: always formatDate() or formatDateShort().

## Environment variables

Required in .env.local (local) and Vercel project settings (production/preview):
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Optional:
- VITE_SIGNUP_ACCESS_CODE: shared code required on the sign-up page. Ships in
  the client bundle (a deterrent, not a secret). If unset, self sign-up is
  disabled (fail safe).

## Key dependencies

| Purpose | Package |
|---|---|
| Routing | react-router-dom v6 |
| Server state | @tanstack/react-query v5 |
| Forms | react-hook-form + zod |
| Database | @supabase/supabase-js v2 |
| PDF export | @react-pdf/renderer v3 |
| Primitives | @radix-ui/react-* |
| Styling | tailwindcss + clsx + tailwind-merge |

## Status flow

ServiceVisit.status: draft > quoted > approved > invoiced > paid
Quote.status: draft > sent > accepted | declined
Invoice.status: draft > sent > paid | overdue

## Hawaii tax rates by county (set at Company level)

Hawaii: 4.5%
Honolulu: 4.712%
Maui: 4.0%
Kauai: 4.0%

(Verify current rates before going live: these are illustrative.)
