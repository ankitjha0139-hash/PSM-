# Career Clarity Platform — Phase 0 skeleton

This is the whole point of Phase 0: get something on GitHub, have it show up live
on Netlify, and prove the pipeline works before anyone writes real features.

## What this is (and isn't)

A single page that says "the deploy pipeline works." No Supabase, no PostHog,
no real UI yet — those come in Phases 2-4. Don't build on top of this file
structure expecting it to survive; Phase 1 will replace `App.jsx` entirely
with the real Explore flow.

## Getting this live

1. Clone your team's existing GitHub repo locally (the one Netlify is already
   connected to).
2. Copy everything from this folder into the repo — all files, including the
   hidden `.gitignore`.
3. From inside the repo:
   ```
   npm install
   npm run dev
   ```
   Open the local URL it prints and confirm you see "Career Clarity Platform"
   with a green "Deploy pipeline connected" pill. If that works locally, the
   build will work on Netlify too.
4. Commit and push (through whatever branch/PR flow your team agreed on, or
   straight to `main` if you haven't set branch protection yet):
   ```
   git add .
   git commit -m "Phase 0: skeleton"
   git push
   ```
5. In the Netlify dashboard, open the Deploys tab and watch it build. Takes
   under a minute typically.

## One thing to double check in Netlify

Since Netlify was connected before there was any real code to build, go to
**Site settings → Build & deploy → Build settings** and confirm:
- Build command: `npm run build`
- Publish directory: `dist`

This repo also includes a `netlify.toml` with those same settings — Netlify
should pick it up automatically, but if the dashboard shows something blank
or different, the `netlify.toml` values are the correct ones; update the
dashboard to match.

<<<<<<< HEAD
## Done when

You visit your `*.netlify.app` URL (not localhost) and see this same page live.
That's Phase 0 complete — ping me and we'll move into Phase 1.
=======
Two stages, narrowing from *"everything"* down to *"the one life you actually want"*:

1. **Discover** — explore every career path (filter, search, or chat with an AI guide). Understand what each really means: subjects, exams, fees, salary, and the doors it opens or closes.
2. **Reality-check** — book a paid 1-on-1 call with a practitioner who *actually does the job* (a "day in the life"), so you know before you commit — not a generic counsellor, someone living it.

## Who it's for

- Students in Class 10–12 standing at the stream/subject fork
- Their parents (the co-decision-makers)
- Especially: aspirational students in Tier-2/3 towns — big ambition, no network

## Why it's different

- **Not an information site — a trust engine.** Information is free online; what's scarce is *credible, personalised* guidance. We supply the credibility.
- **Neutral by design.** We're paid for the conversation itself — not for referring students to a coaching institute — so there's no hidden agenda.
- **Surfaces the unknown.** We reveal paths students didn't even know existed, not just the ones they think to ask about.

## Tech stack

| Layer | Tool |
|---|---|
| Frontend | Vite + React — hosted on **Netlify** |
| Database · Auth · Storage | **Supabase** (Postgres, Google OAuth) |
| Analytics | **PostHog** (funnel drop-off, session replay) |
| AI guide | Gemini API (RAG over our verified career data) |
| Booking | Cal.com / Calendly (practitioner calls) |

## Status & roadmap

Early build. Phased plan (each phase builds on the last):

- [ ] **Phase 0** — project skeleton + Netlify deploy
- [ ] **Phase 1** — Discover experience (filter / chat / search), local data
- [ ] **Phase 2** — analytics wired (funnel events)
- [ ] **Phase 3** — career data moved to Supabase
- [ ] **Phase 4** — auth (Google login) + wishlists
- [ ] **Phase 5** — practitioner booking + media
- [ ] **Phase 6** — soft-launch, measure, iterate

## Getting started

> Setup instructions will go here once the app is scaffolded.

```bash
# coming soon
npm install
npm run dev
```

## Team

| Name | Role |
|---|---|
| _add name_ | _add role_ |
| _add name_ | _add role_ |
>>>>>>> 6d7d7cdeab58f5113f46df5459d56e977db35442
