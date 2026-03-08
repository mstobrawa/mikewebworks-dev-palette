create extension if not exists "pgcrypto";

create table if not exists public.palettes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  colors jsonb not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.palettes enable row level security;

create policy "Users can read own palettes"
on public.palettes
for select
using (auth.uid() = user_id);

create policy "Users can insert own palettes"
on public.palettes
for insert
with check (auth.uid() = user_id);

create policy "Users can delete own palettes"
on public.palettes
for delete
using (auth.uid() = user_id);
