-- ==============================================================================
-- SwiftGate: Database Initialization & Realtime Setup
-- Execute this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/uvhhaewuzrfhwhxxghzv/sql/new
-- ==============================================================================

create table if not exists checkins (
  id uuid default gen_random_uuid() primary key,
  guest_name text,
  document_type text,
  masked_id_preview text,
  face_match_score text,
  company_gst text,
  nationality text,
  visa_status text,
  room_number text,
  status text default 'Completed',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Realtime subscription
alter publication supabase_realtime add table checkins;

-- Row Level Security (RLS) policies
alter table checkins enable row level security;

create policy "Allow client insert for checkins"
  on checkins
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow read checkins"
  on checkins
  for select
  to anon, authenticated
  using (true);

create policy "Allow client update for checkins"
  on checkins
  for update
  to anon, authenticated
  using (true);
