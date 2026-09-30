-- FleetServ Hawaii: store each photo's storage path instead of its public URL
-- 004_private_photos.sql
--
-- Until 2026-09-30 photos.storage_url held a full public URL from getPublicUrl,
-- and the visit-photos bucket was public, so anyone holding a link could open
-- the image, forever. The app now stores the object's path inside the bucket
-- and asks for a short-lived signed URL whenever a photo is shown or a document
-- is compiled. See docs/adr/0001-private-photos-and-invite-only-access.md.
--
-- This migration only adds and backfills storage_path. It does not make the
-- bucket private (005) or drop storage_url (006), so every step can be
-- verified before the next one removes the way back.
--
-- Safe to run twice: the column is added if missing and the backfill touches
-- only rows whose path is still empty.

alter table public.photos
  add column if not exists storage_path text not null default '';

comment on column public.photos.storage_path is
  'Object path inside the visit-photos bucket, for example <visit_id>/<file>. Display URLs are signed on demand and never stored.';

-- A public URL looks like
--   https://<ref>.supabase.co/storage/v1/object/public/visit-photos/<path>
-- Everything after the bucket segment is the path.
update public.photos
set storage_path = substring(storage_url from '/object/public/visit-photos/(.+)$')
where storage_path = ''
  and storage_url ~ '/object/public/visit-photos/.+$';

-- Refuse to finish with any photo left unresolved. A row without a path would
-- render as a broken image once the bucket is private, and nothing would say why.
do $$
declare
  unresolved integer;
begin
  select count(*) into unresolved from public.photos where storage_path = '';
  if unresolved > 0 then
    raise exception '004_private_photos: % photo row(s) have no storage_path. Inspect them with: select id, storage_url from public.photos where storage_path = '''';', unresolved;
  end if;
end $$;
