-- Track actual amount charged per booking (may differ from listed price)
alter table public.bookings add column if not exists amount_paid numeric;

-- Daily expenses table
create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  expense_date date not null default current_date,
  category text not null default 'General',
  amount numeric not null,
  note text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.expenses to authenticated;
grant all on public.expenses to service_role;
alter table public.expenses enable row level security;
create policy "Admins manage expenses" on public.expenses for all to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));
