// Data quality gate for the career sheet — open /api/validate-careers in a
// browser right after editing the sheet and it reports every problem row.
// Exists because bad rows poison Atlas directly (the F1-Mechanic incident:
// one careless row had Atlas giving architecture-exam advice for a
// motorsport career). Fetches the sheet FRESH every time — no cache —
// because "did my edit work?" is the whole point of this page.

const KNOWN_STREAMS = ['Science', 'Commerce', 'Arts', 'Vocational', 'Alternate', 'Govt']

const REQUIRED_TEXT = [
  'id',
  'title',
  'stream',
  'what_it_is',
  'entry_pay',
  'fees',
  'duration_years',
  'colleges_route',
  'time_bucket',
  'next_action',
  'honest_note',
]

async function fetchFresh() {
  const sheetUrl = process.env.CAREER_SHEET_URL
  const apiKey = process.env.CAREER_SHEET_API_KEY
  if (!sheetUrl) throw new Error('CAREER_SHEET_URL is not set on this Netlify site.')
  const url = new URL(sheetUrl)
  if (apiKey) url.searchParams.set('key', apiKey)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`)
  const data = await res.json()
  if (!Array.isArray(data)) throw new Error('Sheet API did not return an array')
  return data
}

async function checkLink(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 4000)
  try {
    let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal })
    // Some sites reject HEAD — a server that answers at all is reachable.
    if (res.status === 405 || res.status === 403) return { ok: true }
    if (!res.ok) {
      res = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal })
      if (!res.ok) return { ok: false, note: `HTTP ${res.status}` }
    }
    return { ok: true }
  } catch {
    return { ok: false, note: 'unreachable / timed out' }
  } finally {
    clearTimeout(timer)
  }
}

function validate(careers) {
  const rows = []
  const seenIds = new Map()
  const seenTitles = new Map()
  const seenTexts = new Map() // copy-paste detector: what_it_is / honest_note reuse

  careers.forEach((c, idx) => {
    const label = c.title || c.id || `row ${idx + 1}`
    const errors = []
    const warns = []

    for (const field of REQUIRED_TEXT) {
      const v = c[field]
      if (v === undefined || v === null || String(v).trim() === '') {
        ;(field === 'honest_note' ? warns : errors).push(`missing \`${field}\``)
      }
    }

    if (c.stream && !KNOWN_STREAMS.includes(c.stream)) {
      errors.push(`unknown stream "${c.stream}" (expected: ${KNOWN_STREAMS.join(', ')})`)
    }
    if (!Array.isArray(c.roles) || c.roles.length === 0) {
      errors.push('`roles` must be a non-empty list (the booking CTA uses roles[0])')
    }
    if (typeof c.requires_maths !== 'boolean') {
      warns.push('`requires_maths` missing or not true/false')
    }
    if (c.honest_note && String(c.honest_note).trim().length < 25) {
      warns.push('`honest_note` is very short — this is our differentiator, give it substance')
    }
    if (c.id && /[^a-z0-9-]/.test(String(c.id))) {
      warns.push(`id "${c.id}" should be a lowercase slug (letters, numbers, hyphens)`)
    }

    if (Array.isArray(c.resources)) {
      c.resources.forEach((r, ri) => {
        if (!r || !r.label || !r.url) {
          errors.push(`resource ${ri + 1} missing label or url`)
        } else if (!/^https?:\/\//.test(r.url)) {
          errors.push(`resource "${r.label}" has invalid url: ${r.url}`)
        }
      })
    }

    if (c.id) {
      if (seenIds.has(c.id)) errors.push(`duplicate id — also used by "${seenIds.get(c.id)}"`)
      else seenIds.set(c.id, label)
    }
    if (c.title) {
      const t = c.title.toLowerCase().trim()
      if (seenTitles.has(t)) errors.push(`duplicate title — also row "${seenTitles.get(t)}"`)
      else seenTitles.set(t, label)
    }
    for (const field of ['what_it_is', 'honest_note']) {
      const v = c[field] && String(c[field]).trim().toLowerCase()
      if (v && v.length > 30) {
        const key = `${field}:${v}`
        if (seenTexts.has(key)) {
          errors.push(`\`${field}\` is copy-pasted from "${seenTexts.get(key)}" — F1-Mechanic alert`)
        } else {
          seenTexts.set(key, label)
        }
      }
    }

    rows.push({ label, errors, warns, resources: Array.isArray(c.resources) ? c.resources : [] })
  })

  return rows
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function renderHtml(rows, linkResults, careersCount) {
  const totalErrors = rows.reduce((n, r) => n + r.errors.length, 0)
  const totalWarns = rows.reduce((n, r) => n + r.warns.length, 0)
  const badLinks = linkResults.filter((l) => !l.ok)

  const rowHtml = rows
    .map((r) => {
      const items = [
        ...r.errors.map((e) => `<li class="err">✖ ${esc(e)}</li>`),
        ...r.warns.map((w) => `<li class="warn">▲ ${esc(w)}</li>`),
        ...badLinks
          .filter((l) => l.career === r.label)
          .map((l) => `<li class="err">✖ broken link "${esc(l.label)}": ${esc(l.note)}</li>`),
      ]
      const ok = items.length === 0
      return `<section class="${ok ? 'ok' : 'bad'}">
        <h2>${ok ? '✔' : '✖'} ${esc(r.label)}</h2>
        ${ok ? '<p class="fine">Looks good.</p>' : `<ul>${items.join('')}</ul>`}
      </section>`
    })
    .join('')

  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Career sheet check</title>
<style>
  body{font-family:system-ui,sans-serif;background:#f4f7fa;color:#1b2333;margin:0;padding:24px;max-width:720px;margin-inline:auto}
  h1{font-size:22px;margin:0 0 4px}
  .sub{color:#5b6478;font-size:14px;margin:0 0 20px}
  .summary{display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap}
  .pill{border-radius:999px;padding:6px 14px;font-size:13px;font-weight:600}
  .pill.err{background:#fde8ec;color:#b3455c}
  .pill.warn{background:#fff4e0;color:#a9781c}
  .pill.good{background:#e7f7ee;color:#1a7a44}
  section{background:#fff;border:1px solid #e4e8f0;border-radius:12px;padding:14px 16px;margin-bottom:10px}
  section.bad{border-left:4px solid #b3455c}
  section.ok{border-left:4px solid #1a7a44}
  h2{font-size:15px;margin:0 0 6px}
  ul{margin:0;padding-left:18px}
  li{font-size:13.5px;line-height:1.6}
  li.err{color:#b3455c}
  li.warn{color:#a9781c}
  .fine{color:#5b6478;font-size:13px;margin:0}
</style></head><body>
<h1>Career sheet check</h1>
<p class="sub">${careersCount} careers · fetched fresh just now · reload after editing the sheet</p>
<div class="summary">
  <span class="pill ${totalErrors + badLinks.length ? 'err' : 'good'}">${totalErrors + badLinks.length} errors</span>
  <span class="pill ${totalWarns ? 'warn' : 'good'}">${totalWarns} warnings</span>
  <span class="pill good">target: 15–20 careers</span>
</div>
${rowHtml}
</body></html>`
}

export default async () => {
  try {
    const careers = await fetchFresh()
    const rows = validate(careers)

    // Best-effort link reachability, capped so we stay inside the
    // function's 10s budget.
    const links = []
    for (const c of careers) {
      for (const r of c.resources || []) {
        if (r?.url && /^https?:\/\//.test(r.url)) {
          links.push({ career: c.title || c.id, label: r.label || r.url, url: r.url })
        }
      }
    }
    const capped = links.slice(0, 25)
    const results = await Promise.all(
      capped.map(async (l) => ({ ...l, ...(await checkLink(l.url)) }))
    )

    return new Response(renderHtml(rows, results, careers.length), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    return new Response(`<h1>Sheet check failed</h1><p>${esc(String(err))}</p>`, {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
}

export const config = {
  path: '/api/validate-careers',
}
