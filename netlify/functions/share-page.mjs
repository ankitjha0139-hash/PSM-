// Career-specific share links: /s/<careerId>. Exists because the app is a
// single page — every plain link unfurls with the same generic card in
// WhatsApp. This endpoint serves per-career og tags (so the card shows THE
// career's name and pitch) and immediately redirects humans into the app.
// The share message can then be just a link — the card does the selling.
import { getCareerPaths } from './lib/careerData.mjs'

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export default async (req) => {
  const id = decodeURIComponent(new URL(req.url).pathname.split('/').pop() || '')
  let career = null
  try {
    const careers = await getCareerPaths()
    career = careers.find((c) => c.id === id) || null
  } catch {
    // sheet unreachable — still redirect, just with generic tags
  }

  const target = career ? `/?career=${encodeURIComponent(career.id)}` : '/'
  const title = career ? `${career.title} — Lighthouse.guide` : 'Lighthouse.guide'
  const desc = career
    ? `${career.duration_years} · ${career.fees} · starts at ${career.entry_pay}. ${career.what_it_is}`.slice(0, 200)
    : 'Every career path open to you — costs, honest odds, and real people who have lived it.'

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>${esc(title)}</title>
<meta property="og:type" content="website">
<meta property="og:site_name" content="Lighthouse.guide">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="https://lighthouseguide.netlify.app/s/${esc(id)}">
<meta name="twitter:card" content="summary">
<meta name="description" content="${esc(desc)}">
<meta http-equiv="refresh" content="0;url=${esc(target)}">
<script>location.replace(${JSON.stringify(target)})</script>
</head><body>Taking you to Lighthouse.guide…</body></html>`

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
  })
}

export const config = {
  path: '/s/:id',
}
