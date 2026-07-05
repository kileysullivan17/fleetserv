-- FleetServ Hawaii: optional demo data
-- seed_demo_data.sql
--
-- Populates the live database with a believable slice of a Hawaii mobile-service
-- operation so the app looks real for a first-time viewer (three fleets, seven
-- trucks, service visits across every status, quotes, and invoices). This is
-- NOT schema and does NOT run on a fresh deploy. Paste it into the Supabase SQL
-- editor and Run it once whenever you want sample data.
--
-- Safe to run more than once: every row has a fixed id and inserts use
-- "on conflict do nothing", so re-running changes nothing.
--
-- Demo invoice numbers use an INV-1001+ range on purpose, so they never collide
-- with the app's own INV-0001 sequence. The sequence is left untouched.
--
-- To remove all demo data later, deletes cascade from the three companies:
--   delete from public.companies where id in (
--     'aaaaaaaa-0000-0000-0000-000000000001',
--     'bbbbbbbb-0000-0000-0000-000000000002',
--     'cccccccc-0000-0000-0000-000000000003');

-- ---------------------------------------------------------------------------
-- Fleets (companies)
-- ---------------------------------------------------------------------------

insert into public.companies
  (id, name, contact_name, contact_email, contact_phone, billing_address, hawaii_county, tax_rate)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Aloha Freight Lines', 'Keanu Kahale',
   'dispatch@alohafreight.com', '(808) 555-0142', '91-210 Hanua St, Kapolei, HI 96707',
   'Honolulu', 4.712),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'Kona Coast Haulers', 'Malia Ontai',
   'ops@konacoasthaulers.com', '(808) 555-0188', '74-425 Kealakehe Pkwy, Kailua-Kona, HI 96740',
   'Hawaii', 4.5),
  ('cccccccc-0000-0000-0000-000000000003', 'Valley Isle Logistics', 'Ikaika Souza',
   'fleet@valleyislelogistics.com', '(808) 555-0119', '250 Alamaha St, Kahului, HI 96732',
   'Maui', 4.0)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Trucks
-- ---------------------------------------------------------------------------

insert into public.trucks
  (id, company_id, unit_number, make, model, year, vin, license_plate, notes)
values
  ('10000000-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001',
   '101', 'Freightliner', 'Cascadia', 2021, '1FUJGLDR8MLAA1101', 'HFL-101', 'Reefer unit, runs the Kapolei to Hilo lane.'),
  ('10000000-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001',
   '102', 'Peterbilt', '579', 2019, '1XPBD49X9KD442102', 'HFL-102', ''),
  ('10000000-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001',
   '103', 'Kenworth', 'T680', 2022, '1XKYD49X0NJ333103', 'HFL-103', 'Newest tractor in the yard.'),
  ('10000000-0000-0000-0000-000000000004', 'bbbbbbbb-0000-0000-0000-000000000002',
   '7', 'International', 'LT', 2020, '3HSDZAPR1LN557007', 'KCH-007', ''),
  ('10000000-0000-0000-0000-000000000005', 'bbbbbbbb-0000-0000-0000-000000000002',
   '12', 'Volvo', 'VNL', 2018, '4V4NC9EH2JN889012', 'KCH-012', 'High mileage, watch the coolant.'),
  ('10000000-0000-0000-0000-000000000006', 'cccccccc-0000-0000-0000-000000000003',
   '44', 'Isuzu', 'NPR', 2021, 'JALC4W16XM7000044', 'VIL-044', 'Box truck for last-mile around Kahului.'),
  ('10000000-0000-0000-0000-000000000007', 'cccccccc-0000-0000-0000-000000000003',
   '45', 'Ford', 'F-750', 2017, '1FDXF7DT9HDA00045', 'VIL-045', 'No service logged yet.')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Service visits (one per status: draft, quoted, approved, invoiced, paid)
-- ---------------------------------------------------------------------------

insert into public.service_visits
  (id, truck_id, technician_name, visit_date, status, notes)
values
  -- Aloha Freight Lines
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   'Keoni Alana', '2026-06-10', 'paid', 'Full service, oil and coolant top-off.'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001',
   'Keoni Alana', '2026-06-18', 'invoiced', 'Pre-trip tire pressure and walk-around.'),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002',
   'Makoa Reyes', '2026-06-25', 'approved', 'Oil change and fuel top-off, quote approved.'),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003',
   'Makoa Reyes', '2026-07-01', 'quoted', 'Fluids plus an added filter, quote sent.'),
  -- Kona Coast Haulers
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000004',
   'Nalu Kealoha', '2026-07-02', 'draft', 'Visual inspection, still writing it up.'),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000005',
   'Nalu Kealoha', '2026-05-28', 'paid', 'Routine oil change.'),
  ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000004',
   'Nalu Kealoha', '2026-06-20', 'quoted', 'Fuel service, quote was declined by the customer.'),
  -- Valley Isle Logistics
  ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000006',
   'Keoni Alana', '2026-07-01', 'quoted', 'Oil change and tire air, quote sent.')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Line items
-- ---------------------------------------------------------------------------

insert into public.service_line_items
  (id, visit_id, service_type, description, quantity, unit, unit_price, subtotal)
values
  -- V1 (paid) subtotal 234.00
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001',
   'oil_change', 'Full synthetic oil and filter change', 1, 'service', 189.00, 189.00),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001',
   'fluid', 'Coolant top-off', 1, 'service', 45.00, 45.00),
  -- V2 (invoiced) subtotal 135.00
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002',
   'tire_air', 'Tire pressure set to spec, all axles', 1, 'service', 60.00, 60.00),
  ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002',
   'visual_inspection', 'Pre-trip walk-around inspection', 1, 'service', 75.00, 75.00),
  -- V3 (approved) subtotal 305.00
  ('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000003',
   'oil_change', 'Full synthetic oil and filter change', 1, 'service', 210.00, 210.00),
  ('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000003',
   'fuel', 'Diesel top-off', 1, 'service', 95.00, 95.00),
  -- V4 (quoted) subtotal 220.00
  ('30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000004',
   'fluid', 'Transmission and hydraulic fluid', 2, 'service', 50.00, 100.00),
  ('30000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000004',
   'add_on', 'Replacement fuel filter', 1, 'part', 120.00, 120.00),
  -- V5 (draft) subtotal 75.00
  ('30000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000005',
   'visual_inspection', 'Full DOT visual inspection', 1, 'service', 75.00, 75.00),
  -- V6 (paid) subtotal 199.00
  ('30000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000006',
   'oil_change', 'Full synthetic oil and filter change', 1, 'service', 199.00, 199.00),
  -- V7 (quoted) subtotal 230.00
  ('30000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000007',
   'oil_change', 'Full synthetic oil and filter change', 1, 'service', 175.00, 175.00),
  ('30000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000007',
   'tire_air', 'Tire pressure set to spec', 1, 'service', 55.00, 55.00),
  -- V8 (quoted, declined) subtotal 110.00
  ('30000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000008',
   'fuel', 'Diesel top-off', 1, 'service', 110.00, 110.00)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Quotes (tax by county: Honolulu 4.712, Hawaii 4.5, Maui 4.0)
-- ---------------------------------------------------------------------------

insert into public.quotes
  (id, visit_id, issued_date, expiry_date, subtotal, tax_amount, total, status)
values
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001',
   '2026-06-10', '2026-06-24', 234.00, 11.03, 245.03, 'accepted'),
  ('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002',
   '2026-06-18', '2026-07-02', 135.00, 6.36, 141.36, 'accepted'),
  ('40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003',
   '2026-06-25', '2026-07-09', 305.00, 14.37, 319.37, 'accepted'),
  ('40000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004',
   '2026-07-01', '2026-07-15', 220.00, 10.37, 230.37, 'sent'),
  ('40000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000006',
   '2026-05-28', '2026-06-11', 199.00, 8.96, 207.96, 'accepted'),
  ('40000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000007',
   '2026-07-01', '2026-07-15', 230.00, 9.20, 239.20, 'sent'),
  ('40000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000008',
   '2026-06-20', '2026-07-04', 110.00, 4.95, 114.95, 'declined')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Invoices (demo INV-1001+ range, will not collide with the app sequence)
-- ---------------------------------------------------------------------------

insert into public.invoices
  (id, visit_id, quote_id, invoice_number, issued_date, due_date, subtotal, tax_amount, total, status)
values
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001',
   '40000000-0000-0000-0000-000000000001', 'INV-1001', '2026-06-11', '2026-07-11',
   234.00, 11.03, 245.03, 'paid'),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002',
   '40000000-0000-0000-0000-000000000002', 'INV-1002', '2026-06-19', '2026-07-19',
   135.00, 6.36, 141.36, 'sent'),
  ('50000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000006',
   '40000000-0000-0000-0000-000000000006', 'INV-1003', '2026-05-29', '2026-06-28',
   199.00, 8.96, 207.96, 'paid')
on conflict (id) do nothing;
