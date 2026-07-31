# Lighthouse.guide — app

The whole product: marketing Home screen plus the real app screens, one Vite
project. React 19, Tailwind v4 design tokens, Supabase, Netlify Functions.

Rebuild phases and the full backend/data-layer reference are in
[`../ARCHITECTURE.md`](../ARCHITECTURE.md). Deploying for real (not just
`netlify dev`)? See [`DEPLOY.md`](DEPLOY.md) — it consolidates every
manual step below into one ordered checklist.

## Structure

- `src/screens/` — top-level screens switched by `App.jsx`'s screen-state
  router (no React Router; see `../ARCHITECTURE.md` §1 for why): `Home`,
  `FilterExplore`, `CareerDetail`, `AtlasChat`, `PractitionerDirectory`,
  `PractitionerProfile`, `MySessions`, `Profile`, `Admin` (direct `/admin`
  URL only, not a nav item)
- `src/components/marketing/` — the sections that make up `Home` (Hero,
  ProblemSpace, Features, Pricing, Testimonials, Footer) — their CTAs call
  `onNavigate` to jump into the real screens above, not anchor links
- `src/components/ui/` — shared atoms used by both marketing and product
  screens (Button, Logo, GlowOrb, AnimatedWords, TrajectoryGraphic)
- `src/components/` (top level) — product-screen components (CareerCard,
  PractitionerCard, Pagination, TopNav, AccountButton, SignInModal, SupportWidget,
  BookingSteps, EmptyState, SkeletonCareerCard, SkeletonSessionCard)
- `src/components/admin/` — `PractitionerAdminPanel`, `TestimonialAdminPanel`
  (list + create/edit/delete for each), used only by `Admin.jsx`
- `src/hooks/` — `useCareerPaths`, `useAuth`, `useProfile`,
  `useSupportTickets`, `useUserBookings`, `usePractitioners`,
  `useTestimonials` (public reads, anon key, no function needed),
  `useAdminAuth` (admin login/logout/token state), `useShortlist`
  (localStorage, one instance owned by `App.jsx`, shared by Explore and
  CareerDetail)
- `src/lib/mockAuth.js` — the one hardcoded demo account (`test` /
  `test@123`). `useAuth`, `useProfile`, `useUserBookings`, and
  `chatHistory` all check `isMockUser()` and skip Supabase entirely for
  it — see Phase 2 status below
- `src/lib/` — `streamChat` (SSE reader shared by Atlas + Compass),
  `chatHistory` (Supabase-backed Atlas history), `netlifyForms`,
  `bookingUtils` (slot generation, booking IDs, `.ics` files), `adminApi`
  (bearer-token fetch wrapper for the admin-* functions), `analytics`
  (posthog-js wrapper — safe no-op without `VITE_POSTHOG_KEY`/`_HOST`)
- `src/data/faqs.js` — Compass's grounding data (platform FAQs, not career
  content — that's Atlas's job). Practitioners and testimonials used to be
  static files here too; both moved into Supabase in Phase 5 so the admin
  dashboard can edit them without a code deploy
- `netlify/functions/admin-login.mjs` — checks `ADMIN_EMAIL`/`ADMIN_PASSWORD`,
  issues a signed session token; `admin-practitioners.mjs` /
  `admin-testimonials.mjs` — CRUD, gated on that token, writes via the
  Supabase **service role key** (bypasses RLS, server-side only — see
  `netlify/functions/lib/supabaseAdmin.mjs` and `lib/adminAuth.mjs`)
- `supabase/*.sql` — schema + RLS, **run these in the Supabase SQL editor**
  (see Manual steps below): `profiles.sql`, `chat_messages.sql`,
  `bookings.sql`, `practitioners.sql` (seeded with the real onboarded
  practitioners), `testimonials.sql` (seeded with the existing illustrative
  stories)

## Status

- **Phase 1** ✅ Home screen (marketing) with CTAs wired to real navigation;
  Explore + career detail backed by the real `/api/career-paths` Netlify
  Function; `/api/validate-careers` data-quality report. Shortlist:
  heart toggle on `CareerCard` + a "Shortlisted" pill on `CareerDetail`,
  `useShortlist` (localStorage). No dedicated Shortlist/compare screen
  yet — the old app had one with a side-by-side comparison table for 2+
  saved careers; intentionally out of scope for now, not forgotten
- **Phase 2** ✅ Google OAuth via Supabase (`useAuth`), `AccountButton` +
  `SignInModal` in `TopNav`, `Profile` screen (view/edit) backed by the
  `profiles` table (`useProfile`, with a dev-only localStorage fallback
  until the SQL below is run). `SignInModal` also has a permanent (not
  dev-gated) "sign in with username and password" option — currently just
  one hardcoded demo account (`test` / `test@123`, see `src/lib/mockAuth.js`),
  not open registration. It signs straight into a fully hardcoded, filled-
  in profile ("Test User") with no Supabase call at all — useProfile,
  useUserBookings, and chatHistory all short-circuit for it. Real
  self-serve email/password registration via Supabase was tried first but
  dropped: this project has "Confirm email" on and hit Supabase's rate
  limit during testing, so a working demo login couldn't depend on it
- **Phase 3** ✅ Atlas (full chat screen: streamed replies, markdown,
  career-name links into CareerDetail, follow-up chips, chat history) and
  Compass (global floating support widget, FAQ-grounded, escalates to a
  Netlify Forms ticket). Both need `GEMINI_API_KEY` to produce real replies
  — see Manual steps
- **Phase 4** ✅ Practitioner directory + profile, multi-step booking flow
  (session type → slot → contact → confirmed) gated on sign-in, `.ics`
  calendar files, "Talk to a real X" on a career page jumps straight to a
  matching practitioner by role when one exists, My Sessions (in the
  account dropdown) shows a signed-in user's bookings with cancel + add-
  to-calendar. Booking data needs `supabase/bookings.sql` run — see Manual
  steps. The slot → contact → confirmation path past the sign-in gate
  hasn't been tested with a real signed-in session (needs either real
  Google OAuth or a pre-confirmed dev test user)
- **Phase 5** ✅ Admin dashboard at `/admin` (single hardcoded login, no
  Supabase Auth account behind it). Practitioners and testimonials moved
  from static files into Supabase tables — public read via RLS, writes
  only through the admin-gated Netlify Functions using the service role
  key. Verified end-to-end: login accepts right credentials and rejects
  wrong ones cleanly, session persists across a reload, sign-out works,
  both CRUD panels validate before saving. **One bug found and fixed**
  while testing: the missing-service-role-key case originally leaked a
  raw Node stack trace as the API response instead of a clean JSON error
  — now returns `{"error": "..."}` properly. Needs `SUPABASE_SERVICE_ROLE_KEY`
  and `supabase/practitioners.sql` / `testimonials.sql` run before the
  dashboard can actually save anything, or the public Practitioners
  directory / Home testimonials can show real data — see Manual steps
- **Phase 6** ✅ PostHog wired (`src/lib/analytics.js`), gated so it's a
  safe no-op locally without `VITE_POSTHOG_KEY`/`_HOST` — verified no
  console errors and no network calls with them unset. Three capture
  points: `signed_in`, `atlas_message_sent`, `booking_confirmed`.
  [`DEPLOY.md`](DEPLOY.md) is the actual launch-day checklist — every env
  var, every SQL file, turning on Netlify Forms notifications (off by
  default), and a smoke-test list for everything that's only been
  verified locally so far

## Manual steps (can't be done from code)

- **Set `GEMINI_API_KEY`** (Netlify dashboard for prod; add to local `.env`
  for dev — it's not in there yet, unlike the other keys) for Atlas and
  Compass to return real replies instead of a graceful "having trouble
  connecting" message
- **Run `supabase/profiles.sql`** for the Profile screen to persist real
  data instead of the dev-only localStorage fallback
- **Run `supabase/chat_messages.sql`** for signed-in users' Atlas
  conversations to persist across visits (anonymous chat already works via
  sessionStorage regardless)
- **Run `supabase/bookings.sql`** before a real booking can be confirmed or
  My Sessions can show anything
- **Run `supabase/practitioners.sql` and `supabase/testimonials.sql`**
  before the Practitioners directory or Home's testimonials can show real
  data, and before the admin dashboard has anything to manage. Both are
  pre-seeded with the existing real content, so running them replaces the
  "couldn't load" state with exactly what was there before, not an empty
  dashboard
- **Set `SUPABASE_SERVICE_ROLE_KEY`** (Supabase dashboard → Project
  Settings → API → `service_role` key — **not** the anon key) for the
  admin dashboard's save/delete actions to actually reach Supabase.
  Netlify Functions only — never prefix this with `VITE_`, that would
  bundle it into the browser
- **Set `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_TOKEN_SECRET`** for
  production — the local `.env` values are dev-only placeholders, change
  them before ever deploying
- **Google OAuth provider**: already configured on this Supabase project
  (verified — clicking "Continue with Google" correctly redirects to
  Google's real sign-in). If it ever needs reconfiguring: Supabase
  dashboard → Authentication → Providers → Google, plus a matching
  redirect URL added for each domain the app is deployed to (production
  domain, once one exists — `localhost:8888` already works for local dev)
- **Testing the real booking flow end to end** (slot → contact →
  confirmation, past the sign-in gate) still needs either a real Google
  sign-in or a pre-confirmed Supabase test user — the hardcoded demo
  account (`test` / `test@123`) deliberately never touches Supabase, so it
  can't be used to test that these Supabase writes actually work. To
  create a real test user: Supabase dashboard → Authentication → Users →
  Add user → check **"Auto Confirm User"** (skips the confirmation email)

## Develop

```bash
npm install
npm run dev        # vite only — /api/* won't resolve (see below)
npm run dev:full    # netlify dev — serves the app AND the functions on :8888
npm run build
npm run lint
```

`npm run dev` alone is UI-only; screens that call `/api/*` (Explore, Atlas,
Compass, Admin) need Netlify Functions running. Use `npm run dev:full`
(wraps `netlify dev`) whenever you need real data. It's slower to boot the
first time (downloads a local functions runtime) but then serves both the
Vite dev server and the functions together on `http://localhost:8888`.

## Env vars

Copy `.env.example` to `.env` and fill in real values (already done for
most of these locally — `.env` is gitignored, never commit it):

- `CAREER_SHEET_URL`, `CAREER_SHEET_API_KEY` — Netlify Functions only
- `GEMINI_API_KEY` — Netlify Functions only, **not set locally yet** (see
  Manual steps above)
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — bundled into the frontend
  (anon key is public-safe by design)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` — the admin login credentials (set to
  dev-only placeholder values locally — see Manual steps)
- `ADMIN_TOKEN_SECRET` — signs the admin session token, unrelated to
  `ADMIN_PASSWORD` (set locally to a random dev value)
- `SUPABASE_SERVICE_ROLE_KEY` — Netlify Functions only, **not set locally
  yet** (see Manual steps above) — bypasses RLS, only admin-* functions
  use it
- `VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST` — not set locally; analytics is
  a no-op until these exist, which is fine for local dev
