# Private photo storage with expiring links, and invite-only accounts

Photos move to a private storage bucket. The app stores each photo's storage path, not a URL, and asks for a short-lived signed link whenever a photo is shown or a document is compiled. The Service Report and invoice PDFs embed the image itself at the moment they are generated, so a PDF sent to a customer keeps working after the link behind it has expired, and nothing a customer receives points back into storage.

Self sign-up is removed. New staff accounts are created only by invitation from an existing admin. The shared access code that used to guard sign-up is deleted: it shipped inside the client bundle, so anyone who read the site's code could open an account, and every account could read every customer's trucks, visits, invoices and photos.

Both gaps are stated plainly in the release notes and the portfolio case study, with what was exposed, what changed, and the date. Discretion over a customer's asset data is part of what this product is for, so a closed gap is described, not hidden.

## Considered options

- Keep the public bucket and rely on unguessable paths: rejected because a link, once forwarded, works forever and cannot be revoked short of deleting the file.
- Per-company access rules so customers can log in and see only their own records: deferred. It is the right end state if customers get logins, but no customer logs in today, and invite-only closes the gap that exists now.
- Store signed URLs in the photos table: rejected because they expire; the path is the durable fact, and a link is derived from it when needed.

## Consequences

- Existing photo rows hold full public URLs. A migration rewrites each one to its storage path before the bucket is made private, or every existing photo breaks.
- Every place that renders a photo, including PDF generation, must request a signed link first.
- Confirmed 2026-09-30: the app has only ever held filler data, never a real customer's records or photos. The disclosure says so.
