# Changelog

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
