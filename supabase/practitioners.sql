-- Run once in the Supabase SQL editor before the admin dashboard or the
-- Practitioners directory can read/write anything real.
--
-- Unlike profiles/bookings/chat_messages, this table is NOT user-scoped —
-- it's site content, editable only by the root/admin login (Phase 5).
-- There is no Supabase auth user tied to "admin" (the login is a single
-- hardcoded env-var credential check, not a Supabase Auth account — see
-- netlify/functions/admin-login.mjs), so RLS can't key writes off auth.uid()
-- the way the user-scoped tables do. Instead:
--   - Public (anon key) can SELECT — the app itself needs to browse these
--   - No public INSERT/UPDATE/DELETE policy exists at all
--   - Admin writes go through Netlify Functions (admin-practitioners.mjs)
--     using the SERVICE ROLE key, which bypasses RLS entirely — that key
--     never reaches the browser, only ever lives server-side
create table if not exists practitioners (
  id text primary key,
  name text not null,
  photo text,
  video_url text,
  role text not null,
  credibility text not null,
  matches_role text not null,
  rating numeric,
  sessions_completed integer default 0,
  bio text not null,
  languages text[] default '{}',
  journey jsonb default '[]',
  topics text[] default '{}',
  testimonials jsonb default '[]',
  session_types jsonb not null default '[]',
  display_order integer default 0,
  updated_at timestamptz default now()
);

alter table practitioners enable row level security;

create policy "public read practitioners" on practitioners
  for select using (true);

-- Seed with the real onboarded practitioners from the old app (same data
-- src/data/practitioners.js used to hold as a static file — now editable
-- from the admin dashboard instead of requiring a code deploy).
insert into practitioners (id, name, photo, role, credibility, matches_role, rating, sessions_completed, bio, languages, journey, topics, testimonials, session_types, display_order)
values
  (
    'lokesh-pakhale', 'Lokesh Pakhale', '/images/practitioners/lokesh-pakhale.jpg',
    'Architect', 'Architect & Co-founder · Far Sides of Design, Nagpur', 'Architect',
    null, 0,
    'Had a ''best out of waste'' streak as a kid, which turned into an Architecture degree from Priyadarshini Institute of Architecture and Design Studies (PIADS), Nagpur by 22. Now co-runs Far Sides of Design, where low-cost sustainable builds (like a CSEB mud-block house in Nagpur) sit alongside more experimental concept work. Open to talking through whether architecture is right for you, or what it takes to start your own firm.',
    array['English', 'Hindi', 'Marathi'],
    '[{"when":"School","what":"CBSE through 10th and 12th; always the kid turning scrap into something useful"},{"when":"By 22","what":"Architecture degree from PIADS, Nagpur"},{"when":"Now","what":"Co-founder, Far Sides of Design — Nagpur"}]',
    array['Is architecture right for you?', 'Starting your own architecture firm', 'Sustainable & low-cost construction (CSEB/mud block)'],
    '[]',
    '[{"id":"quick","label":"Quick Chat","duration":"15 min","price":"₹349","description":"A focused question about architecture as a career or starting a firm."},{"id":"deep","label":"Deep Dive","duration":"45 min","price":"₹899","description":"Full picture: studio life, sustainable design practice, and your specific questions."}]',
    1
  ),
  (
    'sakshi-bishnoi', 'Sakshi Bishnoi', null,
    'Market Research', 'Associate Project Lead, Market Research · Escalent', 'Research Assistant',
    null, 0,
    'Took the commerce stream in school, then a BA and MA in Philosophy — and turned that into a corporate research career. Now an Associate Project Lead in market research at Escalent, supporting the corporate development team of a leading global technology company: tracking emerging high-growth domains and screening prospective acquisition targets that feed the client''s M&A strategy. Living proof that an arts degree can land squarely in the business world.',
    array['English', 'Hindi'],
    '[{"when":"2015","what":"Finished school — commerce stream"},{"when":"2018","what":"BA in Philosophy"},{"when":"2020","what":"MA in Philosophy"},{"when":"2022–23","what":"Research Associate at Modulus"},{"when":"Now","what":"Associate Project Lead at Escalent, since 2023"}]',
    array['Commerce stream choices', 'Philosophy degree → corporate career', 'Breaking into market research'],
    '[]',
    '[{"id":"quick","label":"Quick Chat","duration":"30 min","price":"₹499","description":"Your questions about commerce, an arts degree, or market research — answered directly."}]',
    2
  ),
  (
    'purnamrita-das', 'Dr. Purnamrita Das', null,
    'Doctor', 'MBBS, Practitioner', 'Doctor',
    null, 0,
    'MBBS-qualified medical practitioner. Full bio coming soon — ask her about the medicine path (biology, physics, chemistry) from someone who lived it.',
    array['English', 'Hindi', 'Bengali'],
    '[]',
    array['Science', 'Biology', 'Physics', 'Chemistry'],
    '[]',
    '[{"id":"quick","label":"Quick Chat","duration":"30 min","price":"₹499","description":"One or two specific questions about medicine or the MBBS path."},{"id":"deep","label":"Deep Dive","duration":"1 hr","price":"₹699","description":"Full picture of the path into medicine and what practice is really like."}]',
    3
  ),
  (
    'jibin-jose', 'Jibin Jose', null,
    'Commerce Educator', 'Asst. Professor, Kannur University', 'School Teacher',
    null, 0,
    'Commerce professor with 10 years of teaching experience across government and private colleges — undergraduate and postgraduate. Can speak honestly to what a B.Com actually leads to, what studying for a B.Ed involves, and what teaching commerce as a career looks like day to day.',
    array['English', 'Malayalam'],
    '[{"when":"2009","what":"Finished school — commerce stream"},{"when":"2012","what":"B.Com"},{"when":"2014","what":"M.Com"},{"when":"2015","what":"B.Ed"},{"when":"Now","what":"Assistant Professor, Kannur University — 10 years teaching"}]',
    array['Choosing a B.Com', 'Path to becoming a teacher (B.Ed)', 'Life as a commerce lecturer'],
    '[]',
    '[{"id":"quick","label":"Quick Chat","duration":"30 min","price":"₹499","description":"Your questions about commerce or teaching, answered directly."}]',
    4
  )
on conflict (id) do nothing;
