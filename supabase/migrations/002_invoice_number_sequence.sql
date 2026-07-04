-- FleetServ Hawaii: atomic invoice number allocation
-- 002_invoice_number_sequence.sql
--
-- Replaces the client-side "read max invoice_number and increment" logic,
-- which can hand two concurrent writers the same number. A Postgres sequence
-- allocates each number atomically, so every caller gets a distinct value.
--
-- Note: gaps are acceptable. nextval advances even inside a transaction that
-- later rolls back, so a rolled-back invoice (for example when the follow-up
-- visit status update fails) permanently consumes its number. Invoice numbers
-- are guaranteed unique and monotonically increasing, not strictly contiguous.

-- ---------------------------------------------------------------------------
-- Sequence
-- ---------------------------------------------------------------------------

create sequence if not exists invoice_number_seq;

-- Seed the sequence from existing data so newly allocated numbers continue
-- past the highest invoice already on record. Strips non-digits from each
-- invoice_number (for example "INV-0007" becomes 7) and takes the max, then
-- adds 1 to get the next number to hand out. The three-argument setval form
-- with is_called = false makes the first nextval return exactly that value.
-- On an empty database max is NULL, so coalesce yields 0, +1 gives 1, and the
-- first invoice is INV-0001. We deliberately do not call setval with 0: a
-- default sequence has minvalue 1, so setval(seq, 0) is out of bounds and
-- would abort the migration on a fresh database.
select setval('invoice_number_seq', coalesce((select max(nullif(regexp_replace(invoice_number, '\D', '', 'g'), '')::bigint) from public.invoices), 0) + 1, false);

-- ---------------------------------------------------------------------------
-- Allocation function
-- ---------------------------------------------------------------------------
-- security definer so it runs with the owner's rights: the sequence itself
-- does not need to be granted to every caller, only execute on this function.

create or replace function allocate_invoice_number()
  returns text
  language sql
  security definer
  set search_path = public
as $$
  select 'INV-' || lpad(nextval('invoice_number_seq')::text, 4, '0');
$$;

-- ---------------------------------------------------------------------------
-- Grants: authenticated users only, never public or anon.
-- ---------------------------------------------------------------------------

revoke execute on function allocate_invoice_number() from public;
revoke execute on function allocate_invoice_number() from anon;
grant execute on function allocate_invoice_number() to authenticated;
