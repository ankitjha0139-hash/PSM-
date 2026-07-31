-- Run once in the Supabase SQL editor. Same pattern as practitioners.sql:
-- site content, not user data — public read, admin-only write via
-- Netlify Functions using the service role key (see admin-testimonials.mjs).

create table if not exists testimonials (
  -- Text slug, not a generated uuid — so the seed insert below is
  -- actually idempotent (ON CONFLICT needs a stable key to match against;
  -- a fresh gen_random_uuid() on every run would never conflict and would
  -- just keep duplicating rows).
  id text primary key,
  initials text not null,
  name text not null,
  tag text not null,
  quote text not null,
  from_situation text not null,
  to_outcome text not null,
  display_order integer default 0,
  created_at timestamptz default now()
);

alter table testimonials enable row level security;

create policy "public read testimonials" on testimonials
  for select using (true);

-- Seed with the illustrative stories the marketing Home screen shipped
-- with — swap for real, permissioned testimonials via the admin dashboard
-- as they're collected.
insert into testimonials (id, initials, name, tag, quote, from_situation, to_outcome, display_order)
values
  ('ananya-nagpur', 'AN', 'Ananya', 'Class 12, Nagpur', 'I thought architecture just meant drawing buildings. One call and I understood the actual degree, the fees, all of it.', 'Confused about Science vs. Arts', 'Decided on Architecture', 1),
  ('rahul-indore', 'RK', 'Rahul', 'Class 11, Indore', 'Atlas asked me what I actually enjoyed instead of just listing careers. That changed the whole conversation.', 'No idea what to pick', 'Shortlisted 3 real options', 2),
  ('priya-parents-bhopal', 'PS', 'Priya''s parents', 'Bhopal', 'The honest note about slow years in market research was more useful than any brochure we''d read.', 'Worried, no one to ask', 'Confident about the plan', 3),
  ('vikram-tier2', 'VM', 'Vikram', 'Class 12, Tier-2 town', 'Every site said "become a CA" like it was one step. The practitioner call showed me what the years actually look like.', 'Only knew the "safe" options', 'Exploring 5 alternate paths', 4)
on conflict (id) do nothing;
