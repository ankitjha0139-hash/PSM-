// Frontend-facing endpoint at /api/career-paths — thin wrapper around the
// shared, cached fetch in lib/careerData.mjs. Keeps CAREER_SHEET_API_KEY
// server-side; the browser never sees it.
import { getCareerPaths } from './lib/careerData.mjs'

export default async () => {
  try {
    const data = await getCareerPaths()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const config = {
  path: '/api/career-paths',
}
