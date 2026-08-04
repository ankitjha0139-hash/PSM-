// Submits to Netlify Forms — the zero-setup ticket pipe. Netlify detects
// the hidden form declaration in index.html at deploy time and collects
// any POST to "/" with a matching form-name; submissions appear in the
// Netlify dashboard under Forms (email notifications configurable there).
//
// Forms only get processed on a real Netlify deploy — under `netlify dev`
// (or a network hiccup in production) this POST has no handler and just
// hangs with no response, so callers relying on this to fail fast (e.g.
// PractitionerProfile's booking confirmation) would otherwise stall
// forever. The timeout below turns that hang into a normal rejection.
const FORM_SUBMIT_TIMEOUT_MS = 8000

export async function submitNetlifyForm(formName, fields) {
  const body = new URLSearchParams({ 'form-name': formName, ...fields }).toString()
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FORM_SUBMIT_TIMEOUT_MS)
  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`Form submit failed (${res.status})`)
  } finally {
    clearTimeout(timer)
  }
}
