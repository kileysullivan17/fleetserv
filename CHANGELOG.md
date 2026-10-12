# Changelog

## 2026-10-12: Dark mode, spark plugs, and the design files

**Dark mode.** The account menu has a Theme control with three choices: Light, Dark, and System, which follows the device. The choice is kept on that device and applies before the page draws, so a dark choice never flashes light. Quotes, invoices, and service reports stay on white paper in either theme, and printing is always light. Light mode looks the same as before.

**Spark plugs.** Spark plugs are a service type on the visit form, with a plug type, a plug count, and a price per plug, and they appear by name on quotes, invoices, service reports, and the QuickBooks export.

**Before deploying.** Run `supabase/migrations/007_spark_plugs_service_type.sql` in the Supabase SQL editor first. Until it runs, a visit with a spark plug line will not save; every other service type is unaffected.

**Design files.** `DESIGN.md`, `PRODUCT.md`, and `tokens.css` are now at the repo root. `tokens.css` is the one source for the app's colors, type, and spacing. `PRODUCT.md` lists what is planned and not yet built: separate technician and admin roles, and the Daily Log, Observation, and Incident Report forms.

The reasoning is recorded in `DECISIONS.md` under 2026-10-12.

## 2026-09-30: Photos are private, and accounts are by invitation

This release closes two gaps in how FleetServ protected its records. Both are described here in full, because keeping a customer's vehicle and service data private is part of what this app is for.

**What was exposed.**

- **Photos were public.** Visit photos were stored in a public storage bucket, and the app saved each photo's public web address. Anyone holding a photo's link could open it without signing in, and that link never expired.
- **Any account could read everything.** The sign-up page was protected by a shared access code that shipped inside the website's own code, so anyone who read that code could create an account. Every signed-in account could read every company's trucks, visits, quotes, invoices and photos.

**What was affected.** The live database has only ever held hand-entered filler records. No real customer's data or photos were stored in the app.

**What changed.**

- Photos live in a private bucket. The app stores where each photo sits in storage, not a link to it, and asks for a link that expires after an hour whenever a photo is shown.
- Service Report and invoice PDFs carry the image itself, captured when the PDF is made. A report sent to a customer keeps working, and nothing in it points back into storage.
- Self sign-up is gone. New staff accounts are created by invitation from an admin. The shared access code has been removed.

**Not yet changed.** Every staff account can still see every company. That is correct while only staff sign in. If customers are ever given logins, each will need rules limiting them to their own company's records first.

The reasoning is recorded in `docs/adr/0001-private-photos-and-invite-only-access.md`.

<!-- Before publishing: add the date the migrations were applied to the live database, and the number of existing accounts found and reviewed during the invite-only switch. -->
