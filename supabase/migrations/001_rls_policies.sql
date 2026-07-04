-- FleetServ Hawaii: Row Level Security migration
-- 001_rls_policies.sql
--
-- Model: single-tenant business. Every authenticated user is a FleetServ
-- technician or admin and shares full access to all business data.
-- Anonymous (anon) requests get no access to any table.
--
-- Prerequisite: the application tables (companies, trucks, service_visits,
-- service_line_items, photos, quotes, invoices) already exist, and the
-- storage bucket "visit-photos" has been created.

-- ---------------------------------------------------------------------------
-- Enable RLS on every application table
-- ---------------------------------------------------------------------------

alter table public.companies          enable row level security;
alter table public.trucks             enable row level security;
alter table public.service_visits     enable row level security;
alter table public.service_line_items enable row level security;
alter table public.photos             enable row level security;
alter table public.quotes             enable row level security;
alter table public.invoices           enable row level security;

-- Belt and braces: force RLS even for the table owner role used by
-- connection poolers, so a misconfigured connection cannot bypass policies.

alter table public.companies          force row level security;
alter table public.trucks             force row level security;
alter table public.service_visits    force row level security;
alter table public.service_line_items force row level security;
alter table public.photos             force row level security;
alter table public.quotes             force row level security;
alter table public.invoices           force row level security;

-- ---------------------------------------------------------------------------
-- companies
-- ---------------------------------------------------------------------------

drop policy if exists "companies_select_authenticated" on public.companies;
create policy "companies_select_authenticated"
  on public.companies for select
  to authenticated
  using (true);

drop policy if exists "companies_insert_authenticated" on public.companies;
create policy "companies_insert_authenticated"
  on public.companies for insert
  to authenticated
  with check (true);

drop policy if exists "companies_update_authenticated" on public.companies;
create policy "companies_update_authenticated"
  on public.companies for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "companies_delete_authenticated" on public.companies;
create policy "companies_delete_authenticated"
  on public.companies for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- trucks
-- ---------------------------------------------------------------------------

drop policy if exists "trucks_select_authenticated" on public.trucks;
create policy "trucks_select_authenticated"
  on public.trucks for select
  to authenticated
  using (true);

drop policy if exists "trucks_insert_authenticated" on public.trucks;
create policy "trucks_insert_authenticated"
  on public.trucks for insert
  to authenticated
  with check (true);

drop policy if exists "trucks_update_authenticated" on public.trucks;
create policy "trucks_update_authenticated"
  on public.trucks for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "trucks_delete_authenticated" on public.trucks;
create policy "trucks_delete_authenticated"
  on public.trucks for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- service_visits
-- ---------------------------------------------------------------------------

drop policy if exists "service_visits_select_authenticated" on public.service_visits;
create policy "service_visits_select_authenticated"
  on public.service_visits for select
  to authenticated
  using (true);

drop policy if exists "service_visits_insert_authenticated" on public.service_visits;
create policy "service_visits_insert_authenticated"
  on public.service_visits for insert
  to authenticated
  with check (true);

drop policy if exists "service_visits_update_authenticated" on public.service_visits;
create policy "service_visits_update_authenticated"
  on public.service_visits for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "service_visits_delete_authenticated" on public.service_visits;
create policy "service_visits_delete_authenticated"
  on public.service_visits for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- service_line_items
-- ---------------------------------------------------------------------------

drop policy if exists "service_line_items_select_authenticated" on public.service_line_items;
create policy "service_line_items_select_authenticated"
  on public.service_line_items for select
  to authenticated
  using (true);

drop policy if exists "service_line_items_insert_authenticated" on public.service_line_items;
create policy "service_line_items_insert_authenticated"
  on public.service_line_items for insert
  to authenticated
  with check (true);

drop policy if exists "service_line_items_update_authenticated" on public.service_line_items;
create policy "service_line_items_update_authenticated"
  on public.service_line_items for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "service_line_items_delete_authenticated" on public.service_line_items;
create policy "service_line_items_delete_authenticated"
  on public.service_line_items for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- photos
-- ---------------------------------------------------------------------------

drop policy if exists "photos_select_authenticated" on public.photos;
create policy "photos_select_authenticated"
  on public.photos for select
  to authenticated
  using (true);

drop policy if exists "photos_insert_authenticated" on public.photos;
create policy "photos_insert_authenticated"
  on public.photos for insert
  to authenticated
  with check (true);

drop policy if exists "photos_update_authenticated" on public.photos;
create policy "photos_update_authenticated"
  on public.photos for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "photos_delete_authenticated" on public.photos;
create policy "photos_delete_authenticated"
  on public.photos for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- quotes
-- ---------------------------------------------------------------------------

drop policy if exists "quotes_select_authenticated" on public.quotes;
create policy "quotes_select_authenticated"
  on public.quotes for select
  to authenticated
  using (true);

drop policy if exists "quotes_insert_authenticated" on public.quotes;
create policy "quotes_insert_authenticated"
  on public.quotes for insert
  to authenticated
  with check (true);

drop policy if exists "quotes_update_authenticated" on public.quotes;
create policy "quotes_update_authenticated"
  on public.quotes for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "quotes_delete_authenticated" on public.quotes;
create policy "quotes_delete_authenticated"
  on public.quotes for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- invoices
-- ---------------------------------------------------------------------------

drop policy if exists "invoices_select_authenticated" on public.invoices;
create policy "invoices_select_authenticated"
  on public.invoices for select
  to authenticated
  using (true);

drop policy if exists "invoices_insert_authenticated" on public.invoices;
create policy "invoices_insert_authenticated"
  on public.invoices for insert
  to authenticated
  with check (true);

drop policy if exists "invoices_update_authenticated" on public.invoices;
create policy "invoices_update_authenticated"
  on public.invoices for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "invoices_delete_authenticated" on public.invoices;
create policy "invoices_delete_authenticated"
  on public.invoices for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Storage: visit-photos bucket
-- Authenticated users manage objects. Public read stays available through
-- the bucket's public flag for photo display URLs.
-- ---------------------------------------------------------------------------

drop policy if exists "visit_photos_insert_authenticated" on storage.objects;
create policy "visit_photos_insert_authenticated"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'visit-photos');

drop policy if exists "visit_photos_select_authenticated" on storage.objects;
create policy "visit_photos_select_authenticated"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'visit-photos');

drop policy if exists "visit_photos_update_authenticated" on storage.objects;
create policy "visit_photos_update_authenticated"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'visit-photos')
  with check (bucket_id = 'visit-photos');

drop policy if exists "visit_photos_delete_authenticated" on storage.objects;
create policy "visit_photos_delete_authenticated"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'visit-photos');
