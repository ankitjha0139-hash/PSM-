# Lighthouse.guide

*(product name used in-app; final name pending team sign-off)*

A career-clarity platform that helps Indian students discover *every* path open to them — and reach credible people who've actually walked it — before they make choices they can't undo.

> PSM Project Part B · a product built to learn the product-development process.
> **Live:** https://psm-b.netlify.app

---

## The problem

Indian students make **irreversible** career decisions — streams, subjects, entrance exams — as early as age 15, with almost no clarity. Information is scattered, contradictory, and overwhelming; most don't even know which options exist. Choices quietly close doors they never saw.

Well-off students have a network to guide them (an uncle who's an architect, a family friend who's a CA). Aspirational students from smaller towns have the same ambition — and no one to ask. **This platform gives every student that guidance.**

## What it does

Two stages, narrowing from *"everything"* down to *"the one life you actually want"*:

1. **Discover** — explore every career path (filter, search, or chat with Atlas, the AI guide). Understand what each really means: subjects, exams, fees, salary, and the doors it opens or closes.
2. **Reality-check** — book a paid 1-on-1 call with a practitioner who *actually does the job* (a "day in the life"), so you know before you commit — not a generic counsellor, someone living it.

## Who it's for

- Students in Class 10–12 standing at the stream/subject fork
- Their parents (the co-decision-makers — the app speaks parent when a parent visits)
- Especially: aspirational students in Tier-2/3 towns — big ambition, no network

## Why it's different

- **Not an information site — a trust engine.** Information is free online; what's scarce is *credible, personalised* guidance. We supply the credibility.
- **Neutral by design.** We're paid for the conversation itself — not for referring students to a coaching institute — so there's no hidden agenda.
- **Honest by default.** Every career page carries "the honest bit" — the downside nobody else mentions — and every practitioner profile shows the stumbles, not just the wins.

## What's built (live today)

- **Brand & feel** — lighthouse intro video, "Foam" glass theme (frosted cards on a sky gradient), SVG icon system
- **Onboarding** — role gate (student / parent / practitioner) with role-aware copy; parents get family-framed onboarding and a parent-toned Atlas
- **Explore** — filter/search career paths from the shared Google Sheet, stream badges, shortlisting
- **Career pages** — metrics, collapsible roadmap, honest note, resources, govt-route info, **share for a second opinion** (WhatsApp-ready summary + `?career=<id>` deep links)
- **Atlas (AI guide)** — Gemini, streamed token-by-token, grounded in our sheet (RAG) for careers we cover and **Google Search** for ones we don't (labelled "from the web"); markdown replies, career deep-links, follow-up chips, chat memory, personalised by role/journey/shortlist
- **Compass (support bot)** — Gemini, grounded in a platform FAQ, streams, escalates to a human ticket
- **Booking flow** — session types, day/time slot picker, contact capture, booking ID, real `.ics` "Add to calendar", My bookings list (fulfilment is manual for now — Wizard-of-Oz by design)
- **Practitioner side** — application flow (pitch → form) feeding the team's vetting queue
- **Ops pipes** — tickets, bookings, and practitioner applications all land in **Netlify Forms**; `/api/validate-careers` renders a live data-quality report on the career sheet

## Tech stack

| Layer | Tool | Status |
|---|---|---|
| Frontend | Vite + React, hosted on **Netlify** | live |
| AI (Atlas + Compass) | **Gemini** via Netlify Functions (key server-side) | live |
| Career data | Shared **Google Sheet** → `/api/career-paths` (20-min cache) | live |
| Tickets / applications | **Netlify Forms** | live (enable form detection in dashboard) |
| Analytics | **PostHog** | pending wiring |
| Database · Auth | **Supabase** (Postgres, Google OAuth) | project created, wiring pending |
| Booking | Cal.com (behind the existing booking UI) | post-validation |

## Roadmap

- [x] Phase 0 — skeleton + Netlify deploy
- [x] Phase 1 — Discover experience (explore / Atlas / detail / shortlist)
- [x] Phase 1.5 — real AI, booking flow, share loop, practitioner applications, brand pass
- [ ] Career sheet to 15–20 quality rows (in progress — check `/api/validate-careers`)
- [ ] PostHog funnel analytics
- [ ] Supabase Google login + cross-device shortlists
- [ ] Real practitioners + Cal.com behind the booking UI
- [ ] Soft launch to a junior batch

## Getting started

```bash
git clone <this repo>
cd PSM-
npm install
npm run dev      # local dev server (UI only — /api/* needs Netlify)
npm run build    # production build (what Netlify runs)
npm run preview  # serve the production build locally
```

Environment variables (set in the Netlify dashboard, not committed): `GEMINI_API_KEY`, `CAREER_SHEET_URL`, `CAREER_SHEET_API_KEY` (optional).

## Team

| Name | Role |
|---|---|
| _add name_ | _add role_ |
| _add name_ | _add role_ |
