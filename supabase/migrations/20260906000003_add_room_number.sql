alter table checkins add column if not exists room_number text;

-- Allow front desk staff to update check-in status and room assignments
create policy "Allow client update for checkins"
  on checkins
  for update
  to anon, authenticated
  using (true);
