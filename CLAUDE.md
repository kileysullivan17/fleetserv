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
      invoices/     # Invoice table, invoice PDF, and QBO export components
    pages/          # Route-level page components (one per route, plus LoginPage)
    lib/
      supabase.ts   # Typed Supabase client and db() helper
      queryClient.ts
      theme.ts      # Light / Dark / System preference: read, store, apply
    types/
      database.ts   # Full schema types: Company, Truck, ServiceVisit, etc.
    utils/
      cn.ts         # Tailwind class merge utility
      format.ts     # Currency, date, status label formatters
    hooks/          # Custom React hooks (useTrucks, useAuth, useTheme, etc.)
    router.tsx      # React Router v6 routes, guarded by RequireAuth
    App.tsx         # Root: AuthProvider > QueryClientProvider > RouterProvider
    main.tsx        # ReactDOM.createRoot entry point
    index.css       # Imports ../tokens.css, then Tailwind directives + base styles
  public/
    favicon.svg
  supabase/
    migrations/
      000_schema.sql                  # Enums, tables, indexes, photo bucket
      001_rls_policies.sql            # RLS: authenticated-only access
      002_invoice_number_sequence.sql # Atomic invoice number allocation
      003_tax_rate_attestation.sql    # Tax rate confirmation on the company row
      004_private_photos.sql          # photos.storage_path, backfilled from URLs
      005_private_bucket.sql          # visit-photos bucket made private
      006_drop_photo_storage_url.sql  # Drops the old public URL column
      007_spark_plugs_service_type.sql # Adds spark_plugs to the service_type enum
    seed_demo_data.sql                # Optional sample data (not run on deploy)
  index.html        # Includes the pre-paint theme script
  tokens.css        # The one token source: semantic B4 tokens + the --fs-* app layer
  DESIGN.md         # The design system (B4 Route Tablet), read with tokens.css
  PRODUCT.md        # What the product is, who it serves, copy rules, planned work
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

## Design source of truth

- `tokens.css` at the repo root is the only token file the app reads. `src/index.css` imports it and every `fs.*` color in `tailwind.config.ts` points at one of its custom properties. `DESIGN.md` describes the system those tokens implement; change a value in `tokens.css`, never in a component.
- `design/tokens.css` is the July v1 sidecar for the local design canvases (`design/*.dc.html`). It is gitignored, frozen, and not read by the build.
- Light, dark, and print all come from `tokens.css`. Dark is set by `data-theme` on `<html>` (the account menu toggle) or by `prefers-color-scheme` when the choice is System.
- On a card or the app background, use the role colors: `fs-surface`, `fs-ink-*`, `fs-line-*`, `fs-link`, `fs-focus`, `fs-strong`, `fs-rule`, `fs-tint`, `fs-tag`, `fs-primary`, `fs-danger` (text) and `fs-danger-solid` (fill). The `fs-navy-*` and `fs-teal-*` steps are for navy grounds only (sidebar, mobile bar, overlays); they do not change in dark. Never `bg-white`, `text-black`, or a hex value for a surface or text color.
- Customer documents are paper: the on-screen document carries `fs-light`, which re-applies the light tokens inside a dark page. The PDFs set their own colors and do not read the theme.
- Check contrast in both themes for any new color pair.

## Environment variables

Required in .env.local (local) and Vercel project settings (production/preview):
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

There is no self sign-up (removed 2026-09-30; see
docs/adr/0001-private-photos-and-invite-only-access.md). Staff accounts are
created by invitation from the Supabase dashboard, with "Allow new users to sign
up" turned off. Set the invite redirect to /reset-password so a new user picks a
password on arrival.

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

# Writing style rules
- No em dashes anywhere. Use "to" for date ranges; otherwise commas, colons, semicolons, or parentheses.
- Banned phrases: "at the intersection of", "I thrive", "leverage", "passionate about",
  "driving outcomes", "impactful", "I bring", "spanned", "in today's landscape",
  "collaborative environment".
- Prose over templated section labels. Bullets for outcomes only.
- No suspiciously balanced three-part lists.
- Plain, specific, confident. Concrete detail over adjectives.
