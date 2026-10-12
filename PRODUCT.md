# PRODUCT.md: FleetServ

Assembled from `PORTFOLIO_BLURB.md`, `CLAUDE.md`, `CONTEXT.md`, `DECISIONS.md`, the schema and components under `src/`, and the briefs given during the design exploration, then updated with the owner's answers on 2026-10-12. Anything still undecided is listed under Open questions rather than stated as fact.

## What it is

FleetServ is a quoting, invoicing, and service-record platform for a mobile fleet maintenance business in Hawaii. The business drives to the customer's yard and performs scheduled maintenance on trucks: oil changes, fluid service and top-offs, refueling, tire-pressure checks, spark plug service, and a pass/fail visual inspection. It is maintenance, not repair; the product never positions the business as a mechanic shop.

The app replaces paper tickets and texted totals with fleet and customer records, per-visit service logging with fields specific to each service type, photos attached to each visit, a line-item quote with Hawaii GET and running totals, PDF quotes, invoices, and service reports, and a QuickBooks export on invoices. Scheduling is not part of the build.

FleetServ is the working placeholder name; the business has not launched or named itself. In public materials the client is unnamed ("a fleet-services company on Oahu" or "an unlaunched fleet-services startup").

## Who it is for

- The operator and office: the owner who logs visits, builds quotes, sends invoices, and reads the pipeline on a laptop or tablet. Today the app has one shared operator login, created by invitation; there is no self sign-up.
- Field technicians on tablets: the people performing the work on site, logging services, inspection results, and photos. They use the shared login for now. The design treats the tablet in daylight, often with gloves, as the primary field surface (17px body, 44px minimum targets, 52px primary controls).
- Fleet customers receive PDF quotes, invoices, and service reports. There is no customer portal or customer login.

## The job

Give the business one structured record that ties a service visit to its quote and its invoice, so nothing is lost between the yard and the books. The pipeline is the spine: a visit moves draft, quoted, approved, invoiced, paid. Urgency on the jobs list follows money: invoiced work needs collecting first, approved is ready to bill, quoted is waiting on the customer, drafts are not out yet, paid is finished.

## Service types

Oil change, fluid, fuel, tire air, visual inspection, spark plugs, and add-on. Each has its own fields (oil grade, fluid type, fuel type, PSI and tire position, a six-point pass/fail grid, plug type and count) and saves as a line item with a quantity, a unit, and a unit price that the technician enters. The service types are a database enum, so a new type needs a migration as well as the form change.

## Forms

FleetServ follows the four Procore-style form types defined in `CONTEXT.md`.

- Inspection: shipped as the six-point visual inspection checklist (lights, brakes, tires and wheels, belts and hoses, fluid leaks, mirrors and glass), recorded on the visit as a pass/fail line item.
- Daily Log: planned.
- Observation: planned.
- Incident Report: planned.

The planned forms come through the template, renderer, and Observation work in `docs/plans/forms-build-plan.md`. No dates are set.

## Display

The app offers Light, Dark, and System themes from the account menu; System follows the device. The choice is per device. Quotes, invoices, service reports, and print are paper and stay light in any theme.

## Planned

Planned means intended and not built; none of these has a date.

- Separate technician and admin roles. Today everyone signs in with the shared operator login; the auth model is unchanged until roles are built.
- The Daily Log, Observation, and Incident Report forms (see Forms).
- The B4 light restyle, screen by screen, as described in `DESIGN.md`.

## Voice

Plain, specific, confident. Concrete detail over adjectives. Short labels, full sentences only where a reader needs context. The voice is a competent service provider talking to a fleet manager: it states what was done, what it costs, and what comes next, and does not sell.

## Copy rules

- The customer pays for a maintenance service. Never "buy", "purchase", or "order". Prefer "Total for this maintenance service", "Payment for this maintenance service is due", "Approve this quote".
- Scheduled maintenance, not repair. Say "service visit", "maintenance service", "serviced on"; do not say "repair", "fix", or "shop".
- Status words are the five pipeline states plus overdue, declined, and sent where a quote or invoice object uses them. Status always appears as text; color is never the only carrier.
- Money is formatted with `formatCurrency()`, dates with `formatDate()` or `formatDateShort()`; never hand-format either.
- No em dashes anywhere. Use "to" for ranges; otherwise commas, colons, semicolons, or parentheses.
- Banned phrases: the list in `CLAUDE.md` under "Writing style rules" applies verbatim (the AI-register stock phrases about thriving, leveraging, passion, impact, and landscapes). No suspiciously balanced three-part lists.
- Documents carry only data the app stores: the brand mark, name, and tagline, the customer, the vehicle (unit, year, make, model, VIN), line items, GET at the company's rate, totals, and dates. Remit language is generic ("Check payable to FleetServ Hawaii; reference the number with payment"). Never invent license numbers, bank or routing numbers, or a street address.
- Public materials and screenshots use demo or placeholder data only: never real customer names, plates, or VINs; no real client or OEM names. The portfolio case study makes no usage or outcome metrics claims.
- Planned work is described as planned, without dates, and never as shipped.
- Hawaii GET rates are set per company at the company level (Hawaii 4.5, Honolulu 4.712, Maui 4.0, Kauai 4.0 percent); the app marks them illustrative until verified.

## Anti-references

- Not a consumer marketplace: no "shop", "cart", "buy now".
- Not a repair-shop system: no diagnostic or parts-catalog framing.
- Not a generic SaaS dashboard: no hero metrics, no stat tiles for their own sake; the money band exists because collecting is the job.

## Open questions

1. Name and tagline. "FleetServ Hawaii" and "Mobile fleet service across the islands" are the placeholder identity in the PDFs. Keep them as placeholders until the business names itself?
