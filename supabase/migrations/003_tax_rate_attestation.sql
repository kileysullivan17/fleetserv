-- Move the tax rate confirmation out of the browser and onto the row it is about.
--
-- Until 2026-09-15 the confirmation lived in localStorage keyed per company, so it
-- was per browser and per device: confirming on a laptop left the banner showing
-- on a phone, and clearing site data reset every attestation. For something that
-- gates billing, that is too thin.
--
-- tax_rate_confirmed_value records WHICH rate was attested. An attestation is
-- about a specific number, so if the rate is edited afterwards the confirmation
-- no longer applies and the reminder returns. Without this column, confirming
-- 4.712 would silently cover a later change to any other value, which is the
-- failure the reminder exists to prevent.
--
-- Both columns are nullable. Null means never confirmed, which is the correct
-- state for every row that exists today.
--
-- No RLS change is needed: the policies in 001 are row level, to authenticated,
-- using (true) with check (true), so they already cover these columns.

alter table public.companies
  add column if not exists tax_rate_confirmed_at timestamptz,
  add column if not exists tax_rate_confirmed_value numeric(6, 3);

comment on column public.companies.tax_rate_confirmed_at is
  'When the owner attested that tax_rate is a verified Hawaii GET rate. Null means never confirmed.';

comment on column public.companies.tax_rate_confirmed_value is
  'The tax_rate value that was attested. If it no longer equals tax_rate, the attestation is stale and the reminder returns.';
