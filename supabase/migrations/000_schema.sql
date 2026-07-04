-- FleetServ Hawaii: base schema
-- 000_schema.sql
--
-- Creates the enums, application tables, indexes, and the visit-photos storage
-- bucket that migrations 001 (RLS) and 002 (invoice number sequence) assume
-- already exist. Column definitions mirror src/types/database.ts exactly.
--
-- Apply order: 000_schema.sql, then 001_rls_policies.sql, then
-- 002_invoice_number_sequence.sql.
--
-- Design choices worth reviewing:
--   * Ownership deletes cascade down the chain (company > truck > visit >
--     line items / photos / quotes), and an invoice keeps its row if its quote
--     is deleted (quote_id set null).
--   * Money and quantity are numeric(12,2); tax_rate is numeric(6,3) so county
--     rates like 4.712 fit exactly.
--   * invoice_number is unique, which backstops the sequence allocator in 002.
--   * The visit-photos bucket is public so photo display URLs resolve; writes
--     are gated by the storage policies in 001.

-- gen_random_uuid() lives in pgcrypto (present by default on Supabase).
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

do $$ begin
  create type hawaii_county as enum ('Hawaii', 'Honolulu', 'Maui', 'Kauai');
exception when duplicate_object then null; end $$;

do $$ begin
  create type service_visit_status as enum
    ('draft', 'quoted', 'approved', 'invoiced', 'paid');
exception when duplicate_object then null; end $$;

do $$ begin
  create type service_type as enum
    ('oil_change', 'fluid', 'fuel', 'tire_air', 'visual_inspection', 'add_on');
exception when duplicate_object then null; end $$;

do $$ begin
  create type quote_status as enum ('draft', 'sent', 'accepted', 'declined');
exception when duplicate_object then null; end $$;

do $$ begin
  create type invoice_status as enum ('draft', 'sent', 'paid', 'overdue');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text not null default '',
  contact_email text not null default '',
  contact_phone text not null default '',
  billing_address text not null default '',
  hawaii_county hawaii_county not null,
  tax_rate numeric(6, 3) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.trucks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  unit_number text not null,
  make text not null default '',
  model text not null default '',
  year integer not null default 0,
  vin text not null default '',
  license_plate text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.service_visits (
  id uuid primary key default gen_random_uuid(),
  truck_id uuid not null references public.trucks(id) on delete cascade,
  technician_name text not null default '',
  visit_date date not null default current_date,
  status service_visit_status not null default 'draft',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.service_line_items (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references public.service_visits(id) on delete cascade,
  service_type service_type not null,
  description text not null default '',
  quantity numeric(12, 2) not null default 1,
  unit text not null default '',
  unit_price numeric(12, 2) not null default 0,
  subtotal numeric(12, 2) not null default 0
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references public.service_visits(id) on delete cascade,
  storage_url text not null default '',
  caption text not null default '',
  uploaded_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references public.service_visits(id) on delete cascade,
  issued_date date not null default current_date,
  expiry_date date not null default current_date,
  subtotal numeric(12, 2) not null default 0,
  tax_amount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  pdf_url text not null default '',
  status quote_status not null default 'draft'
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references public.service_visits(id) on delete cascade,
  quote_id uuid references public.quotes(id) on delete set null,
  invoice_number text not null unique,
  issued_date date not null default current_date,
  due_date date not null default current_date,
  subtotal numeric(12, 2) not null default 0,
  tax_amount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  qbo_export_url text,
  status invoice_status not null default 'draft'
);

-- ---------------------------------------------------------------------------
-- Indexes on the foreign keys the app filters by constantly
-- ---------------------------------------------------------------------------

create index if not exists trucks_company_id_idx
  on public.trucks(company_id);
create index if not exists service_visits_truck_id_idx
  on public.service_visits(truck_id);
create index if not exists service_line_items_visit_id_idx
  on public.service_line_items(visit_id);
create index if not exists photos_visit_id_idx
  on public.photos(visit_id);
create index if not exists quotes_visit_id_idx
  on public.quotes(visit_id);
create index if not exists invoices_visit_id_idx
  on public.invoices(visit_id);
create index if not exists invoices_quote_id_idx
  on public.invoices(quote_id);

-- ---------------------------------------------------------------------------
-- Storage bucket for visit photos
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('visit-photos', 'visit-photos', true)
on conflict (id) do nothing;
