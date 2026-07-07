# Career Clarity Platform

*(working title — name not finalised)*

A career-clarity platform that helps Indian students discover *every* path open to them — and reach credible people who've actually walked it — before they make choices they can't undo.

> PSM Project Part B · a product built to learn the product-development process.

---

## The problem

Indian students make **irreversible** career decisions — streams, subjects, entrance exams — as early as age 15, with almost no clarity. Information is scattered, contradictory, and overwhelming; most don't even know which options exist. Choices quietly close doors they never saw.

Well-off students have a network to guide them (an uncle who's an architect, a family friend who's a CA). Aspirational students from smaller towns have the same ambition — and no one to ask. **This platform gives every student that guidance.**

## What it does

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

Phased plan (each phase builds on the last):

- [x] **Phase 0** — project skeleton + Netlify deploy ✅ live at the deployed URL
- [ ] **Phase 1** — Discover experience (filter / chat / search), local data
- [ ] **Phase 2** — analytics wired (funnel events)
- [ ] **Phase 3** — career data moved to Supabase
- [ ] **Phase 4** — auth (Google login) + wishlists
- [ ] **Phase 5** — practitioner booking + media
- [ ] **Phase 6** — soft-launch, measure, iterate

## Getting started

```bash
git clone <this repo>
cd PSM-
npm install
npm run dev      # local dev server
npm run build    # production build (what Netlify runs)
```

Netlify build settings (also in `netlify.toml`): build command `npm run build`, publish directory `dist`.

## Team

| Name | Role |
|---|---|
| _add name_ | _add role_ |
| _add name_ | _add role_ |
