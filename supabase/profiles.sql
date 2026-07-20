-- Run once in the Supabase SQL editor (Project -> SQL Editor) before the
-- profile page (src/screens/Profile.jsx) can read or write anything.
--
-- RLS is required, not optional: the browser talks to Supabase with the
-- public anon key (see src/lib/supabaseClient.js), so without these
-- policies either every signed-in user could read every other user's
-- profile row, or (RLS on with no policy) nobody could write at all.

create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  education_level text,
  comfortable_with_maths boolean,
  interests text[] default '{}',
  career_goal text,
  preferred_course_level text,
  marks_percentage numeric,
  preferred_location text,
  budget text,
  entrance_exams text,
  phone text,
  address text,
  birthday date,
  gender text,
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "select own profile" on profiles
  for select using (auth.uid() = user_id);
create policy "insert own profile" on profiles
  for insert with check (auth.uid() = user_id);
create policy "update own profile" on profiles
  for update using (auth.uid() = user_id);

-- If you already ran an earlier version of this file, run this block
-- instead of the create table above — adds any columns you're missing
-- without touching RLS.
--
-- alter table profiles add column if not exists preferred_course_level text;
-- alter table profiles add column if not exists marks_percentage numeric;
-- alter table profiles add column if not exists preferred_location text;
-- alter table profiles add column if not exists budget text;
-- alter table profiles add column if not exists entrance_exams text;
-- alter table profiles add column if not exists phone text;
-- alter table profiles add column if not exists address text;
-- alter table profiles add column if not exists birthday date;
-- alter table profiles add column if not exists gender text;
