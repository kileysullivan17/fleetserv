-- FleetServ Hawaii: make the visit-photos bucket private
-- 005_private_bucket.sql
--
-- Run only after 004 has succeeded and the app has been deployed with the
-- signed-link code (commit "Store photo paths and sign display links on
-- demand"). Before that deploy, the running app still builds public URLs, and
-- every photo would break the moment this runs.
--
-- The storage policies in 001 already restrict reading objects to signed-in
-- users; createSignedUrls relies on that select policy. What changes here is
-- the bucket's public flag, which let anyone fetch an object by its public URL
-- with no session at all. The comment above those policies in 001, "Public read
-- stays available through the bucket's public flag", stops being true now.
--
-- Safe to run twice.

update storage.buckets
set public = false
where id = 'visit-photos';

-- Fail loudly if the flag did not change, for example because the bucket id
-- differs in this project.
do $$
begin
  if exists (select 1 from storage.buckets where id = 'visit-photos' and public) then
    raise exception '005_private_bucket: visit-photos is still public';
  end if;
  if not exists (select 1 from storage.buckets where id = 'visit-photos') then
    raise exception '005_private_bucket: no bucket with id visit-photos';
  end if;
end $$;
