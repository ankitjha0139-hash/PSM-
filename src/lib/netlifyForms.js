// Submits to Netlify Forms — the zero-setup ticket pipe. Netlify detects
// the hidden form declarations in index.html at deploy time and collects
// any POST to "/" with a matching form-name; submissions appear in the
// Netlify dashboard under Forms (email notifications configurable there).
export async function submitNetlifyForm(formName, fields) {
  const body = new URLSearchParams({ 'form-name': formName, ...fields }).toString()
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) throw new Error(`Form submit failed (${res.status})`)
}
