-- Add nationality and visa_status columns for international check-in flow
alter table checkins add column if not exists nationality text;
alter table checkins add column if not exists visa_status text;
