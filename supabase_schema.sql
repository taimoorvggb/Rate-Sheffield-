-- ─────────────────────────────────────────────────────────────────────────────
--  RateShield AI — Supabase Database Schema
--  Run this entire file in: Supabase Dashboard → SQL Editor → New Query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- ── LOADS ────────────────────────────────────────────────────────────────────
create table if not exists public.loads (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  load_id       text,
  origin        text,
  dest          text,
  customer      text,
  customer_rate numeric(10,2) default 0,
  carrier_cost  numeric(10,2) default 0,
  fuel          numeric(10,2) default 0,
  other         numeric(10,2) default 0,
  payment_days  integer default 30,
  date          date default current_date,
  created_at    timestamptz default now()
);

-- ── INVOICES ─────────────────────────────────────────────────────────────────
create table if not exists public.invoices (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  invoice_no  text,
  customer    text,
  amount      numeric(10,2) default 0,
  issue_date  date default current_date,
  due_date    date,
  status      text default 'pending' check (status in ('pending','paid','overdue')),
  created_at  timestamptz default now()
);

-- ── EXPENSES ─────────────────────────────────────────────────────────────────
create table if not exists public.expenses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade unique,
  payroll    numeric(10,2) default 0,
  insurance  numeric(10,2) default 0,
  fuel       numeric(10,2) default 0,
  other      numeric(10,2) default 0,
  updated_at timestamptz default now()
);

-- ── ROW LEVEL SECURITY (RLS) ─────────────────────────────────────────────────
-- Each user can only see and modify their own data

alter table public.loads    enable row level security;
alter table public.invoices enable row level security;
alter table public.expenses enable row level security;

-- Loads policies
create policy "Users can view own loads"
  on public.loads for select
  using (auth.uid() = user_id);

create policy "Users can insert own loads"
  on public.loads for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own loads"
  on public.loads for delete
  using (auth.uid() = user_id);

-- Invoices policies
create policy "Users can view own invoices"
  on public.invoices for select
  using (auth.uid() = user_id);

create policy "Users can insert own invoices"
  on public.invoices for insert
  with check (auth.uid() = user_id);

create policy "Users can update own invoices"
  on public.invoices for update
  using (auth.uid() = user_id);

create policy "Users can delete own invoices"
  on public.invoices for delete
  using (auth.uid() = user_id);

-- Expenses policies
create policy "Users can view own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own expenses"
  on public.expenses for update
  using (auth.uid() = user_id);
