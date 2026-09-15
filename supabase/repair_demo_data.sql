-- FleetServ Hawaii: clean the joke contact data out of the live database
-- repair_demo_data.sql, drafted 2026-09-15, rewritten the same day against the real rows
--
-- WHAT IS ACTUALLY THERE. Inspected 2026-09-15 through the app, which puts company
-- ids in its own URLs:
--
--   Aloha Freight Lines   9871b515-4f5c-4421-9370-10e7f67afb50   Barry Santos
--   Radiatah Freightah    199b1496-f6a4-4ad6-87c2-6a3c5c745f88   Kay Ifuku
--
-- NEITHER IS SEED DATA. Both were created in the app. All three companies in
-- seed_demo_data.sql (aaaaaaaa..0001, bbbbbbbb..0002, cccccccc..0003) are absent
-- from this database entirely, so the seed was evidently never applied here.
--
-- The first draft of this file assumed these were seeded rows that had been edited,
-- because one shares a name with a seed company and both carry the seed's 07/04/26
-- date. That was wrong. Its repair step keyed on the seed ids, so it would have
-- matched zero rows and reported success having changed nothing.
--
-- Run step 1 first. It changes nothing and confirms the ids below are still current.

-- ---------------------------------------------------------------------------
-- STEP 1. Inspect. Read-only.
-- ---------------------------------------------------------------------------
-- Expect two rows, both labelled "created in the app". If a row instead reports a
-- seed id, or an id below does not appear, the database has moved since 2026-09-15
-- and the updates in step 2 will silently match nothing. Reconcile before going on.

select
  id,
  name,
  contact_name,
  contact_email,
  contact_phone,
  hawaii_county,
  case id
    when 'aaaaaaaa-0000-0000-0000-000000000001' then 'seed: Aloha Freight Lines'
    when 'bbbbbbbb-0000-0000-0000-000000000002' then 'seed: Kona Coast Haulers'
    when 'cccccccc-0000-0000-0000-000000000003' then 'seed: Valley Isle Logistics'
    when '9871b515-4f5c-4421-9370-10e7f67afb50' then 'created in the app, known 2026-09-15'
    when '199b1496-f6a4-4ad6-87c2-6a3c5c745f88' then 'created in the app, known 2026-09-15'
    else 'UNKNOWN, created since 2026-09-15'
  end as origin,
  (select count(*) from public.trucks t where t.company_id = c.id) as trucks
from public.companies c
order by origin, name;

-- ---------------------------------------------------------------------------
-- STEP 2. Clean both rows in place. Non-destructive. Recommended.
-- ---------------------------------------------------------------------------
-- UPDATE rather than delete and reinsert: trucks hang off these ids, and service
-- visits hang off the trucks, with every foreign key set to cascade on delete.
-- Updating keeps all of it attached.
--
-- Values follow the seed's conventions: plausible Hawaii operators, role-based
-- addresses, and 555 numbers, which are reserved for fiction and cannot ring a
-- real person. The replaced values were barrygetdaukus@afl.com, nemminyou@kifuku.net
-- and the phone 9996382646, none of which are in a reserved range.

begin;

-- Name is already fine and matches the seed's wording. Only the contact is a joke.
update public.companies set
  contact_name  = 'Keanu Kahale',
  contact_email = 'dispatch@alohafreight.com',
  contact_phone = '(808) 555-0142'
where id = '9871b515-4f5c-4421-9370-10e7f67afb50';

-- Name, contact and phone all replaced. "Windward Cartage" is deliberately not one
-- of the seed's three, so this row cannot collide with them if the seed is ever run.
update public.companies set
  name          = 'Windward Cartage',
  contact_name  = 'Nalani Fisher',
  contact_email = 'dispatch@windwardcartage.com',
  contact_phone = '(808) 555-0165'
where id = '199b1496-f6a4-4ad6-87c2-6a3c5c745f88';

commit;

-- ---------------------------------------------------------------------------
-- STEP 3. Optional. The truck plate.
-- ---------------------------------------------------------------------------
-- Windward Cartage's truck carries plate "KIF 253", which is the old contact's
-- initials. Cosmetic, and only visible on the fleet detail page. The VIN is
-- already meaningless.
--
--   update public.trucks set license_plate = 'WWC 253'
--   where company_id = '199b1496-f6a4-4ad6-87c2-6a3c5c745f88';

-- ---------------------------------------------------------------------------
-- STEP 4. Do NOT run the seed after step 2 without reading this.
-- ---------------------------------------------------------------------------
-- seed_demo_data.sql inserts its own "Aloha Freight Lines" under a different id.
-- Running it after step 2 leaves two companies with that name, which looks worse
-- than the joke did. Pick one:
--
--   a) Step 2 only. Two clean fleets, all trucks kept. Nothing else to do.
--   b) The seed's three fleets instead. Delete both rows below, then run
--      seed_demo_data.sql. DESTRUCTIVE: delete cascades from companies through
--      trucks, service_visits, service_line_items, photos, quotes and invoices.
--      Count what would go first:
--
--        select
--          (select count(*) from public.trucks t
--             where t.company_id in ('9871b515-4f5c-4421-9370-10e7f67afb50',
--                                    '199b1496-f6a4-4ad6-87c2-6a3c5c745f88')) as trucks,
--          (select count(*) from public.service_visits v
--             join public.trucks t on t.id = v.truck_id
--             where t.company_id in ('9871b515-4f5c-4421-9370-10e7f67afb50',
--                                    '199b1496-f6a4-4ad6-87c2-6a3c5c745f88')) as visits;
--
--        delete from public.companies
--        where id in ('9871b515-4f5c-4421-9370-10e7f67afb50',
--                     '199b1496-f6a4-4ad6-87c2-6a3c5c745f88');

-- ---------------------------------------------------------------------------
-- STEP 5. Verify. Read-only.
-- ---------------------------------------------------------------------------
-- After step 2: two rows, no joke names, every address on a company domain, every
-- phone in the 555 range.

select name, contact_name, contact_email, contact_phone,
       (select count(*) from public.trucks t where t.company_id = c.id) as trucks
from public.companies c
order by name;
