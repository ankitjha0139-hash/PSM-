-- Run once in the Supabase SQL editor (Project -> SQL Editor) before the
-- My Sessions screen (src/screens/MySessions.jsx) can read or write anything.
--
-- Same RLS pattern as profiles.sql / chat_messages.sql: the browser talks
-- to Supabase with the public anon key, so without these policies either
-- every signed-in user could read every other user's bookings, or (RLS on
-- with no policy) nobody could write at all.
--
-- No status column — cancelling a booking is a hard delete, matching the
-- confirm/cancel behavior in PractitionerProfile.jsx / MySessions.jsx.

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
  created_at timestamptz default now(),
  -- Makes double-booking the same practitioner/date/time impossible at
  -- the database level, not just discouraged by the UI. Availability is
  -- read via /api/practitioner-availability (netlify/functions/
  -- practitioner-availability.mjs), which needs the service role key
  -- since RLS below only lets a user see their own bookings, not
  -- everyone's — a real cross-user availability check can't be done with
  -- the anon key alone.
  constraint unique_practitioner_slot unique (practitioner_id, date_key, time)
);

alter table bookings enable row level security;

create policy "select own bookings" on bookings
  for select using (auth.uid() = user_id);
create policy "insert own bookings" on bookings
  for insert with check (auth.uid() = user_id);
create policy "delete own bookings" on bookings
  for delete using (auth.uid() = user_id);

-- If bookings already exists from before this constraint was added, run
-- just this line once in the SQL editor (the CREATE TABLE above is a
-- no-op on an existing table, so the constraint won't apply retroactively
-- otherwise):
-- alter table bookings add constraint unique_practitioner_slot unique (practitioner_id, date_key, time);
