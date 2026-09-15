-- FleetServ Hawaii: reconcile live demo data with seed_demo_data.sql
-- repair_demo_data.sql, drafted 2026-09-15
--
-- WHY THIS EXISTS. The live database has drifted from supabase/seed_demo_data.sql.
-- As of 2026-09-15 the Fleets table shows two companies, not three, and one truck
-- each, not seven total:
--
--   Aloha Freight Lines  contact "Barry Santos"  barrygetdaukus@afl.com
--   Radiatah Freightah   contact "Kay Ifuku"     nemminyou@kifuku.net
--
-- Both rows are stamped 07/04/26, the seed commit date, so these began as seeded
-- rows and were edited afterwards through the app. Re-running the seed alone does
-- NOT repair them: every insert there is "on conflict (id) do nothing", which
-- skips rows that already exist rather than correcting them.
--
-- Run the steps in order. Step 1 changes nothing. Read its output before going on.

-- ---------------------------------------------------------------------------
-- STEP 1. Inspect. Read-only. Run this first, on its own.
-- ---------------------------------------------------------------------------
-- Tells you which of the two cases you are in for each live row: a seed row that
-- was edited (id matches one of the three below), or a row created in the app
-- (id matches none of them).

select
  id,
  name,
  contact_name,
  contact_email,
  hawaii_county,
  case id
    when 'aaaaaaaa-0000-0000-0000-000000000001' then 'seed: Aloha Freight Lines'
    when 'bbbbbbbb-0000-0000-0000-000000000002' then 'seed: Kona Coast Haulers'
    when 'cccccccc-0000-0000-0000-000000000003' then 'seed: Valley Isle Logistics'
    else 'NOT a seed row, created in the app'
  end as origin,
  (select count(*) from public.trucks t where t.company_id = c.id) as trucks
from public.companies c
order by origin, name;

-- ---------------------------------------------------------------------------
-- STEP 2. Repair edited seed rows in place. Safe and idempotent.
-- ---------------------------------------------------------------------------
-- Restores the three companies' details to their seed values, matching on the
-- fixed ids. UPDATE rather than delete-and-reinsert on purpose: trucks, service
-- visits, quotes and invoices hang off these ids and are left untouched.
--
-- Rows that already match are rewritten with identical values, so running this
-- twice is the same as running it once. Rows that do not exist are not created
-- here; step 3 handles those.

begin;

update public.companies set
  name            = 'Aloha Freight Lines',
  contact_name    = 'Keanu Kahale',
  contact_email   = 'dispatch@alohafreight.com',
  contact_phone   = '(808) 555-0142',
  billing_address = '91-210 Hanua St, Kapolei, HI 96707',
  hawaii_county   = 'Honolulu',
  tax_rate        = 4.712
where id = 'aaaaaaaa-0000-0000-0000-000000000001';

update public.companies set
  name            = 'Kona Coast Haulers',
  contact_name    = 'Malia Ontai',
  contact_email   = 'ops@konacoasthaulers.com',
  contact_phone   = '(808) 555-0188',
  billing_address = '74-425 Kealakehe Pkwy, Kailua-Kona, HI 96740',
  hawaii_county   = 'Hawaii',
  tax_rate        = 4.5
where id = 'bbbbbbbb-0000-0000-0000-000000000002';

update public.companies set
  name            = 'Valley Isle Logistics',
  contact_name    = 'Ikaika Souza',
  contact_email   = 'fleet@valleyislelogistics.com',
  contact_phone   = '(808) 555-0119',
  billing_address = '250 Alamaha St, Kahului, HI 96732',
  hawaii_county   = 'Maui',
  tax_rate        = 4.0
where id = 'cccccccc-0000-0000-0000-000000000003';

commit;

-- ---------------------------------------------------------------------------
-- STEP 3. Restore anything missing.
-- ---------------------------------------------------------------------------
-- Step 1 showed one truck per company where the seed defines seven (three for
-- Aloha, two each for the others), and one seed company absent entirely. Open
-- supabase/seed_demo_data.sql from the repo, paste the whole file in, and run it.
--
-- Its inserts are all "on conflict (id) do nothing", so it fills the gaps and
-- changes nothing that step 2 just corrected. Run step 2 BEFORE this, not after:
-- the order does not matter for correctness, but doing it this way means every
-- statement you run after the repair is a no-op on the rows you fixed.

-- ---------------------------------------------------------------------------
-- STEP 4. The non-seed row. DESTRUCTIVE. Left commented out deliberately.
-- ---------------------------------------------------------------------------
-- If step 1 reported "Radiatah Freightah" as NOT a seed row, it was created in
-- the app and nothing in the repo describes it. Two options.
--
-- Option A, keep the row and clear the joke. Preserves its trucks and any visits,
-- quotes or invoices attached to it. Substitute the id from step 1 and pick a
-- name that is obviously demo data.
--
--   update public.companies set
--     name          = 'Windward Cartage',
--     contact_name  = 'Nalani Fisher',
--     contact_email = 'dispatch@windwardcartage.com',
--     contact_phone = '(808) 555-0165'
--   where id = 'PASTE-THE-ID-FROM-STEP-1';
--
-- Option B, remove it. DELETES CASCADE the whole way down. Only company_id lives
-- on companies' children directly; everything else hangs off the visit:
--
--   companies -> trucks (company_id)
--             -> service_visits (truck_id)
--                 -> service_line_items, photos, quotes, invoices (visit_id)
--
-- Every one of those is "on delete cascade", so deleting the company removes its
-- trucks, visits, line items, photos, quotes and invoices with it. Only do this
-- once you are certain nothing real is attached.
--
--   delete from public.companies where id = 'PASTE-THE-ID-FROM-STEP-1';
--
-- Prefer Option A unless you know the row is empty. Count what would go with it,
-- joining through trucks and visits, since none of these tables carry company_id:
--
--   select
--     (select count(*) from public.trucks t
--        where t.company_id = 'PASTE-THE-ID') as trucks,
--     (select count(*) from public.service_visits v
--        join public.trucks t on t.id = v.truck_id
--        where t.company_id = 'PASTE-THE-ID') as visits,
--     (select count(*) from public.quotes q
--        join public.service_visits v on v.id = q.visit_id
--        join public.trucks t on t.id = v.truck_id
--        where t.company_id = 'PASTE-THE-ID') as quotes,
--     (select count(*) from public.invoices i
--        join public.service_visits v on v.id = i.visit_id
--        join public.trucks t on t.id = v.truck_id
--        where t.company_id = 'PASTE-THE-ID') as invoices;

-- ---------------------------------------------------------------------------
-- STEP 5. Verify. Read-only.
-- ---------------------------------------------------------------------------
-- Expect three companies, all reporting "seed", seven trucks in total, and no
-- address outside the 555 range or the three seed domains.

select
  c.name,
  c.contact_name,
  c.contact_email,
  (select count(*) from public.trucks t where t.company_id = c.id) as trucks
from public.companies c
order by c.name;
