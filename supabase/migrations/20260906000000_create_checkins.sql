-- Create checkins table for SwiftGate Edge-OCR check-in flow
create table if not exists checkins (
  id uuid default gen_random_uuid() primary key,
  guest_name text,
  document_type text,
  masked_id_preview text,
  company_gst text,
  status text default 'Completed',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for real-time dashboards & ordering
create index if not exists checkins_created_at_idx on checkins (created_at desc);

-- Enable Supabase Realtime broadcast
alter publication supabase_realtime add table checkins;

-- Enable Row Level Security (RLS)
alter table checkins enable row level security;

-- Allow insert from client (Edge Scanner)
create policy "Allow client insert for checkins"
  on checkins
  for insert
  to anon, authenticated
  with check (true);

-- Allow reading checkins for status/dashboard tracking
create policy "Allow read checkins"
  on checkins
  for select
  to anon, authenticated
  using (true);
