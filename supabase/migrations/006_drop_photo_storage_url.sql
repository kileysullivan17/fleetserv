-- FleetServ Hawaii: drop the old public photo URL column
-- 006_drop_photo_storage_url.sql
--
-- Run only after 005, once photos have been checked in the app and in a
-- downloaded Service Report. Until then storage_url is the way back: 004
-- derived every storage_path from it.
--
-- Nothing in the app reads this column since the signed-link change, and the
-- URLs it holds stopped working when 005 made the bucket private.

alter table public.photos drop column if exists storage_url;
