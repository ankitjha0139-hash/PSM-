-- Run once in the Supabase SQL editor (Project -> SQL Editor) before the
-- My Sessions screen (src/screens/MySessions.jsx) can read or write anything.
--
-- Same RLS pattern as profiles.sql / chat_messages: the browser talks to
-- Supabase with the public anon key, so without these policies either
-- every signed-in user could read every other user's bookings, or (RLS on
-- with no policy) nobody could write at all.
--
-- No status column — cancelling a booking is a hard delete, matching the
-- pre-existing localStorage-backed behavior this replaces.

create table if not exists bookings (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  practitioner_id text not null,
  practitioner_name text not null,
  session_label text not null,
  duration text not null,
  price text not null,
  date_key date not null,
  date_label text not null,
  day_label text not null,
  time text not null,
  contact_name text not null,
  contact text not null,
  created_at timestamptz default now()
);

alter table bookings enable row level security;

create policy "select own bookings" on bookings
  for select using (auth.uid() = user_id);
create policy "insert own bookings" on bookings
  for insert with check (auth.uid() = user_id);
create policy "delete own bookings" on bookings
  for delete using (auth.uid() = user_id);
