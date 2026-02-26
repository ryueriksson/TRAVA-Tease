-- Run this in your Supabase project: SQL Editor → New query → paste and run

-- Create waitlist table
create table if not exists waitlist (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table waitlist enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Allow public insert" on waitlist;
drop policy if exists "Allow authenticated read" on waitlist;

-- Allow anyone to insert (for signup) — anon key can add emails
create policy "Allow public insert" on waitlist
  for insert to anon
  with check (true);

-- Only allow authenticated users (you) to read — prevents public from seeing all emails
create policy "Allow authenticated read" on waitlist
  for select to authenticated
  using (true);
