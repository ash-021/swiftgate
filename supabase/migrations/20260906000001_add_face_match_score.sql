-- Add face_match_score column for the 3-step verification pipeline
alter table checkins add column if not exists face_match_score text;
