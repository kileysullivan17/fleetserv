# Forms, photos and access: build plan

Drafted 2026-09-30. Work through the phases in order. After each numbered step: run `npx tsc --noEmit` and `npm run build`, fix any errors, then commit with a descriptive message before starting the next step. Read `CLAUDE.md`, `CONTEXT.md`, `docs/form-template-format.md` and `docs/adr/0001-private-photos-and-invite-only-access.md` first. No em dashes anywhere.

Migrations are applied by hand in the Supabase SQL editor, in number order. Every migration must be safe to run twice (`if not exists`, `drop policy if exists`), matching 000 to 003.

About the data: the live database holds two hand-entered filler companies (see `supabase/repair_demo_data.sql`), created in the app, not from the seed file. The release notes describe them that way: filler records, never a real customer.

---

## Phase 1. Close the access gaps (ship this first, on its own)

### Step 1.1 Invite-only accounts

- Delete `src/pages/SignUpPage.tsx`, its route in `src/router.tsx`, and every link to it (check `LoginPage.tsx`).
- Remove `VITE_SIGNUP_ACCESS_CODE` from `.env.local.example`, `CLAUDE.md`, and the Vercel project settings.
- Manual, in the Supabase dashboard: Authentication settings, turn off "Allow new users to sign up". New staff are added with "Invite user".
- Manual: list every existing auth user and remove any you do not recognize. Write the count you found (not the emails) into the release note.

Done when: the sign-up page returns the app's 404, and a sign-up call made directly against the Supabase API is refused.

### Step 1.2 Store photo paths, not public links

- `supabase/migrations/004_private_photos.sql`:
  - add `photos.storage_path text`;
  - backfill it from `storage_url` by taking everything after `/object/public/visit-photos/`;
  - fail loudly (raise an exception) if any row is left with a null or empty path;
  - leave `storage_url` in place for now; it is dropped in step 1.4.
- `src/lib/photos.ts`: upload writes `storage_path` and stops calling `getPublicUrl`.
- New `src/hooks/useSignedPhotoUrls.ts`: takes a list of photos, returns `{ [photoId]: signedUrl }` from one `createSignedUrls` call, one hour expiry, cached by TanStack Query for less than that.
- `PhotoGrid.tsx` and `ServiceReportPdf.tsx` render from the signed URL map, never from `storage_url`.

Done when: every existing photo still shows in the app and in the Service Report PDF, reading from `storage_path`.

### Step 1.3 Make the bucket private

- `supabase/migrations/005_private_bucket.sql`: `update storage.buckets set public = false where id = 'visit-photos';` Update the comment block in 001 that says public read stays available.
- Verify with `curl` against one old public URL: it must no longer return the image.
- Generate a Service Report PDF, wait for the signed link to expire, and confirm the downloaded PDF still shows its photos (they are embedded at generation).

### Step 1.4 Drop the old column and write the release note

- `supabase/migrations/006_drop_photo_storage_url.sql` drops `photos.storage_url`. Update `src/types/database.ts`.
- Create `CHANGELOG.md` at the repo root. The first entry states plainly: what was exposed (photos reachable by anyone holding a link; any account created with the shared sign-up code could read every company's records), that the app held only hand-entered filler records, what changed, and the date. Plain, specific, no invented figures.

---

## Phase 2. Templates

### Step 2.1 The format in code

- `src/forms/templateFormat.ts`: a Zod schema that is a direct translation of `docs/form-template-format.md` version 1, plus TypeScript types inferred from it. Unknown answer types must parse (as an `unsupported` variant), not fail, per renderer rule 1.

### Step 2.2 Template storage and version pinning

- `supabase/migrations/008_form_templates.sql` (renumbered from 007, which became the spark plugs service type on 2026-10-12): table `form_templates` (`id uuid`, `template_id text`, `version int`, `form_type text`, `definition jsonb`, `created_at`), `unique (template_id, version)`.
- A trigger that rejects any update to a `form_templates` row once a Form references it. Editing a used template means inserting the next version.
- RLS in the same authenticated pattern as 001.

### Step 2.3 Starter templates

- Seed four templates, one per Form Type: a truck preventive maintenance inspection (start from `INSPECTION_CATEGORIES` in `src/lib/serviceTypes.ts`, adding tire pressure and tread as `number` items), a Daily Log, an Observation, and an Incident Report. Every template must parse against step 2.1's schema; add a check that fails the build if one does not.

---

## Phase 3. Forms, Responses, Observations

### Step 3.1 Schema

`supabase/migrations/009_forms.sql` (renumbered from 008):

- `forms`: `id`, `visit_id`, `form_template_id` (the pinned version's row), `status` (`draft`, `completed`), `completed_at`, `created_at`.
- `form_responses`: `id uuid` supplied by the client (no default), `form_id`, `item_id text`, `value jsonb`, `note text`, `unique (form_id, item_id)`.
- `observations`: `id`, `visit_id`, `response_id` (nullable, unique), `title`, `description`, `status` (`open`, `closed`), `service_line_item_id` (nullable), `created_at`, `closed_at`.
- `photos`: add nullable `response_id` and `observation_id`, and `customer_visible boolean not null default true`.
- Indexes on every foreign key, RLS in the 001 pattern.

### Step 3.2 The renderer

- `src/components/forms/FormRenderer.tsx` renders a pinned template version with React Hook Form and a Zod schema built from the template.
- One input component per answer type: `pass_fail_na`, `number` (unit shown, min and max enforced), `choice`, `text`, `date`, `signature`.
- Signature: a small canvas component, no new dependency. The image is saved to the private bucket under `signatures/`, and the Response stores its path, the signer's name and the time.
- Unknown types render read-only with "Not supported in this version".
- Items with `allow_photo` get the existing `PhotoDropzone`, linking the photo to that Response.
- Response ids are generated on the device with `crypto.randomUUID()`.

### Step 3.3 Forms on the visit

- On `VisitDetailPage`, an "Add form" action lists templates by Form Type (latest version) and creates a draft Form pinned to that version.
- A Form can be completed only when every required Item has a Response.

### Step 3.4 Fail opens an Observation

- Saving a `fail` on an Item whose `fail_opens_observation` is not false creates an Observation linked to that Response, once (the unique `response_id` makes it idempotent). Photos on the Response are linked to the Observation too.
- Observation list on the visit: open and closed, each with its photos.
- "Add to quote" on an Observation creates a `service_line_items` row (`add_on`) and records it in `service_line_item_id`. A declined quote leaves the Observation in place.

**Checkpoint before Phase 4:** decide whether the existing inspection grid (the `visual_inspection` line item) is retired in favor of the Inspection form or kept alongside it. Old prose records stay as they are either way; nothing is migrated.

---

## Phase 4. Customer documents

### Step 4.1 Service Report

- Rebuild `ServiceReportPdf.tsx` to show each completed Form, its Responses by section, open Observations, and every customer-visible Photo beside the Item or Observation it belongs to. Visit-level photos with no link go in a closing section.
- Signatures print where their Item sits.

### Step 4.2 Evidence Photos on the invoice

- `DocumentArtifact` (invoice kind) gets an Evidence section: customer-visible Photos linked to Observations whose line item is on this invoice. No section when there are none.

### Step 4.3 Customer-visible toggle

- Every photo in `PhotoGrid` gets an "Include on customer report" toggle, on by default. Hidden photos never reach a customer document.

---

## Phase 5. Documentation

- `CHANGELOG.md`: an entry for forms, photos per item, and the new documents.
- `CLAUDE.md`: update the directory layout, the environment variables, and the migrations list.
- Portfolio case study (separate repo, `~/Downloads/site`): only after Phases 1 to 4 are deployed and verified. It moves the inspection module past "specced", because the schema constraint it describes is resolved, and it carries the security disclosure from `CHANGELOG.md`. Keep the heading ids that `process.html` links to (`user-and-problem`, `prioritized-and-cut`, `judgment-call`, `how-ill-know`). Follow that repo's rules: state only what is true, no invented metrics, no em dashes.

## Hosting assumption

FleetServ runs on Supabase's free plan (decided 2026-09-30): it is a portfolio build with filler data and no paying operator. Free projects pause after about a week without traffic and must be restored by hand, so the live demo can be asleep when someone opens it. Moving to a paid plan, or to a paid auth and storage service, is a future-state need that starts when a real operator uses the app, and is recorded here rather than paid for now.

## Not in this plan

Per-company access for customer logins, offline saving, the answer types planned for format version 2, and Incident Report access rules for real data.
