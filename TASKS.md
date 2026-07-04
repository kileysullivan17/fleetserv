# FleetServ Hawaii: Remaining Build Tasks

Work through these tasks in order. After each task: run `npx tsc --noEmit`
and `npm run build`, fix any errors, then commit with a descriptive message
before starting the next task. Read CLAUDE.md first for project conventions,
directory layout, and output standards. No em dashes anywhere.

---

## Task 1: Quote acceptance flow (quoted > approved)

The status pipeline has a gap: nothing transitions a visit from `quoted` to
`approved`. Build the acceptance flow.

Requirements:
- On `src/pages/QuoteDetailPage.tsx`, when `quote.status` is `draft` or
  `sent`, show two buttons in the header actions: "Accept Quote" (primary)
  and "Decline Quote" (secondary).
- Accept: create a mutation hook `src/hooks/useAcceptQuote.ts` that sets
  `quotes.status` to `accepted` AND `service_visits.status` to `approved`
  for the linked visit, in that order, rolling back the quote status if the
  visit update fails. Follow the rollback pattern in
  `src/hooks/useGenerateQuote.ts`.
- Decline: same hook file, `useDeclineQuote`, sets `quotes.status` to
  `declined` only. The visit stays `quoted` so a new quote can be issued
  later.
- Invalidate: `quoteDetailKeys.detail`, `quoteKeys.byVisit`,
  `visitDetailKeys.detail`, `visitKeys.byTruck`, and the visits board key
  `["visits", "board"]`.
- After accept, the visit detail action bar (already built) will show
  Create Invoice automatically because the visit is `approved`. Verify this
  renders by reading `src/pages/VisitDetailPage.tsx`; do not modify it
  unless broken.
- When the quote is `accepted` or `declined`, replace the buttons with the
  status badge only (badge already renders).
- Loading spinners via the Button `loading` prop, inline error text on
  failure, matching existing patterns.

Done when: a quoted visit can be accepted from its quote page, the visit
shows `approved` with a working Create Invoice button, and declining leaves
the visit `quoted`.

---

## Task 2: Invoice number race condition fix (Postgres sequence)

`src/hooks/useCreateInvoice.ts` currently reads the max invoice_number and
increments client-side. Replace with an atomic server-side allocation.

Requirements:
- Create `supabase/migrations/002_invoice_number_sequence.sql`:
  - `create sequence if not exists invoice_number_seq;`
  - Set the sequence's current value from existing data so it continues
    after the highest existing invoice:
    `select setval('invoice_number_seq', coalesce((select max(nullif(regexp_replace(invoice_number, '\D', '', 'g'), '')::bigint) from public.invoices), 0));`
  - A SQL function `allocate_invoice_number()` returning text, marked
    `security definer`, that returns
    `'INV-' || lpad(nextval('invoice_number_seq')::text, 4, '0')`.
  - `grant execute on function allocate_invoice_number() to authenticated;`
    and revoke from public/anon.
- Update `useCreateInvoice.ts`: replace the `nextInvoiceNumber()` select
  logic with `supabase.rpc("allocate_invoice_number")`. Keep the rest of
  the mutation (net-30 due date, quote copy, visit status advance,
  rollback) unchanged.
- Add the function to the `Database` type in `src/types/database.ts` under
  `Functions` so the rpc call is typed:
  `allocate_invoice_number: { Args: Record<string, never>; Returns: string }`.
  Note: `Functions` is currently `Record<string, never>`; change it to an
  object type with this entry.
- Note in the migration comments that gaps in the sequence are acceptable
  (a rolled-back invoice consumes a number).

Done when: tsc is clean, the migration parses, and invoice creation calls
the RPC instead of select-max.

---

## Task 3: Supabase Auth (login page and route guard)

The RLS migration (001) locks all tables to authenticated users, so the app
needs auth before it can read anything.

Requirements:
- `src/hooks/useAuth.ts`: a small auth module using
  `supabase.auth.onAuthStateChange` and `supabase.auth.getSession`,
  exposing `session`, `loading`, `signIn(email, password)`, and `signOut`.
  Use React context: `AuthProvider` + `useAuth`. Provider file can live at
  `src/components/auth/AuthProvider.tsx` with the hook co-located or in
  hooks; follow existing naming conventions.
- `src/pages/LoginPage.tsx`: centered card on the sand background with the
  FleetServ wordmark (copy the brand block from
  `src/components/layout/Sidebar.tsx`), email + password fields validated
  with Zod + React Hook Form, inline auth error display ("Invalid email or
  password"), submit with loading state. No sign-up flow: accounts are
  created by the admin in the Supabase dashboard. Note this in small text
  under the form.
- Route guard: in `src/router.tsx`, wrap the `AppLayout` route in a
  `RequireAuth` component that renders a loading state while the session
  resolves, redirects to `/login` when signed out, and renders the Outlet
  when signed in. `/login` itself redirects to `/fleets` if already signed
  in.
- Wrap the app in `AuthProvider` in `src/App.tsx` (outside the router).
- Sidebar footer: replace the static "Technician" block with the signed-in
  user's email and a Sign Out button that calls `signOut` and returns to
  `/login`.

Done when: signed-out users see only the login page, signing in lands on
/fleets with data loading correctly under RLS, and sign out returns to
login.

---

## After all tasks

Run the full verification: `npx tsc --noEmit && npm run build`. Then update
CLAUDE.md's directory layout section to include the new auth files and the
second migration.
