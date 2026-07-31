-- Run once in the Supabase SQL editor (Project -> SQL Editor) before Atlas
-- chat history persists for signed-in users (src/lib/chatHistory.js).
-- Anonymous visitors don't need this — their history is sessionStorage-only.
--
-- Same RLS pattern as profiles.sql: the browser talks to Supabase with the
-- public anon key, so without these policies either every signed-in user
-- could read every other user's chat history, or (RLS on with no policy)
-- nobody could write at all.

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'model')),
  text text not null,
  followups text[],
  created_at timestamptz default now()
);

create index if not exists chat_messages_user_id_created_at_idx
  on chat_messages (user_id, created_at);

alter table chat_messages enable row level security;

create policy "select own chat messages" on chat_messages
  for select using (auth.uid() = user_id);
create policy "insert own chat messages" on chat_messages
  for insert with check (auth.uid() = user_id);
