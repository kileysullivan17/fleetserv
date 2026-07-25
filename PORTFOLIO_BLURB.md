# FleetServ: portfolio blurb

Two lengths, both verified against this repo. Keep the client unnamed in public
materials ("a fleet-services company on Oahu" / "an unlaunched fleet-services
startup"). Never show real customer names, plates, or VINs in screenshots; use
demo or staged placeholder data.

## Short blurb (card-length, Recent Builds grid)

FleetServ is a quoting and invoicing platform built 0-to-1 for a mobile
fleet-maintenance business on Oahu. It replaces paper tickets and texted totals
with structured fleet and customer records, per-visit service logging with fields
tailored to each job (oil grade, fluid and fuel type, fuel gallons, tire PSI, and
a pass/fail visual-inspection checklist), photo capture on each visit, line-item
quotes with Hawaii GET tax and running totals, and PDF quotes, invoices, and
service reports plus a QuickBooks export. Built with Claude and Claude Code,
including a custom design system developed alongside the product. Hosted on Vercel
with Supabase, in early use at an unlaunched fleet-services startup.

## Full blurb (case study intro)

**What it is:** A quoting and invoicing platform for a mobile fleet-maintenance
business.

**The problem and what it does:** Mobile fleet-maintenance work (oil changes,
fluid service and top-offs, refueling, tire-pressure checks, visual inspections)
tends to run on paper tickets or texted totals, with no structured record tying a
service visit to a quote or an invoice. FleetServ gives the business fleet and
customer records ("Fleets"), per-visit service logging with dedicated fields for
each service type (oil grade and quantity; fluid type; fuel gallons; tire PSI and
location; and a pass/fail visual-inspection checklist across lights, brakes, tires
and wheels, belts and hoses, fluid leaks, and mirrors and glass), photo capture
attached to each visit, a quote builder with line items, Hawaii GET tax, and
running totals, and PDF quotes, invoices, and service reports, with a QuickBooks
export on invoices. Scheduling is not part of the build.

**Who it is for:** Built for a friend's mobile fleet-maintenance business on Oahu,
with the owner's real workflow driving the design from the start.

**Outcome:** In early use by the business owner. The company itself hasn't
launched or named itself yet; FleetServ is the working/placeholder name for the
product. No usage metrics claimed yet.

**How it was built:** Product-managed and built 0-to-1 with Claude and Claude
Code, including a custom design system (tokens, components, brand mark) developed
alongside the product itself, not retrofitted. Built as a React 18 single-page app
(Vite, React Router, TanStack Query, React Hook Form with Zod), with Supabase for
data, auth, and photo storage, and PDF generation via react-pdf.

**Status:** Working prototype, in early real use. Hosted on Vercel with Supabase
behind it. [Update once the business launches and names itself.]

**Screenshot:** Use demo or placeholder data only, never real customer names,
plates, or VINs. Strongest candidates: the quote builder with line items, the
per-service logging form (showing the type-specific fields), and the
visual-inspection checklist.

## Scope notes (what is and isn't built)

Verified against the repo as of this writing.

Shipped: fleet and customer records; trucks with service history; per-visit
service logging with type-specific fields (oil grade, fluid/fuel type, fuel
gallons, tire PSI and location); a pass/fail visual-inspection checklist across
six categories; photo capture attached to a visit; the quote-to-invoice pipeline
with status tracking; a line-item quote builder with Hawaii GET tax and totals;
PDF quotes, invoices, and service reports; a QuickBooks export on invoices;
atomic invoice numbering; single-operator auth with access-code-gated sign-up.

Not built (do not claim): scheduling; a customer portal or customer login
(customers receive PDF documents, not an account); separate technician or admin
roles (the app is single-tenant, one shared operator login); customer
lifetime-billed or open-balance totals (deliberately left out).

Roadmap (positioning only, not shipped): the deeper technician inspection module,
section-by-section, a value recorded per item, each photo bound to the specific
item, so a completed inspection becomes the structured evidence behind the quote.
Also named as next builds: a reusable line-item catalog, and a small dashboard
once there is enough history.
