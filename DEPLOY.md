# Deploy checklist

Everything below is a manual step — nothing here can be done from code, and
none of it has been done yet for a real deployment. This consolidates every
"Manual steps" note scattered across the phase docs (see `README.md` and
`../ARCHITECTURE.md`) into one ordered list for the actual launch day.

## 1. Supabase — run every SQL file, in this order

Project → SQL Editor → run each of these once:

1. `supabase/profiles.sql`
2. `supabase/bookings.sql`
3. `supabase/chat_messages.sql`
4. `supabase/practitioners.sql` (seeds the 4 real onboarded practitioners)
5. `supabase/testimonials.sql` (seeds the existing illustrative stories)

Then confirm Google OAuth is still correctly configured (it already is on
this project — Authentication → Providers → Google) and add the
**production domain** to Authentication → URL Configuration → Redirect
URLs (this is what the local-dev-goes-to-the-old-production-site bug
earlier in this project turned out to be — the domain actually being
deployed to has to be on this list, or Supabase silently falls back to
whatever Site URL is set).

## 2. Netlify environment variables

Set all of these in Site settings → Environment variables — **do not**
reuse the dev-only placeholder values currently in the local `.env`:

| Variable | Notes |
|---|---|
| `CAREER_SHEET_URL`, `CAREER_SHEET_API_KEY` | Same values as local dev — same Sheet |
| `GEMINI_API_KEY` | Not set anywhere yet (not even locally) — get one at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Same as local dev |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Project Settings → API → `service_role` key. **Never** add a `VITE_` prefix to this |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Pick real credentials — the local `.env` values are dev-only placeholders |
| `ADMIN_TOKEN_SECRET` | A fresh random value, different from the local dev one: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST` | From a PostHog project (create one if none exists yet) |

## 3. Netlify Forms — turn on notifications

The `support-ticket` and `booking` hidden forms in `index.html` are
detected automatically at build time, but **notifications are not on by
default** — without this step, tickets and bookings land in the dashboard
silently and nobody finds out:

Site settings → Forms → Form notifications → add an email (or Slack/
webhook) notification for both `support-ticket` and `booking`.

## 4. Smoke-test the real deployment

Once the above is done and the site is live, walk through each of these
for real — this is the first time any of them will have run against
production data/keys, since local testing only got as far as each phase's
"Manual steps" allowed:

- [ ] Home loads, testimonials marquee shows real content (not empty)
- [ ] Explore shows the real career list; a career detail page loads
- [ ] Sign in with Google actually completes and returns to the site
      (not the old `lighthouseguide.netlify.app` — confirms the redirect
      URL fix from step 1 took)
- [ ] Profile: add details, reload, confirm they persisted
- [ ] Atlas: ask a real question, confirm a real (non-error) reply streams
      in and follow-up chips appear
- [ ] Compass: ask a platform question, then submit a support ticket and
      confirm the notification arrives
- [ ] Practitioners directory shows real people; book a session end to end
      (this is the one flow that was **never verified even locally** —
      see `README.md`'s Phase 4 status)
- [ ] My Sessions shows the booking just made; cancel it; confirm it's gone
- [ ] `/admin` — sign in, edit a practitioner, confirm the change shows up
      on the public directory
- [ ] Check PostHog for events landing (`signed_in`, `atlas_message_sent`,
      `booking_confirmed`)

## Known gaps at launch (by design, not oversight)

- Career content is still Sheet-sourced, not admin-editable — edit the
  Google Sheet directly, same as before this rebuild
- No public review-submission flow — testimonials are admin-curated only
- No file upload for practitioner photos/videos — paste a URL / YouTube-
  Vimeo link
- Single admin login, not per-person accounts — fine for one operator,
  would need real roles if more than one person manages content
