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

## Done when

You visit your `*.netlify.app` URL (not localhost) and see this same page live.
That's Phase 0 complete — ping me and we'll move into Phase 1.
