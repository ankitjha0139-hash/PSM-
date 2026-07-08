// Shared by netlify/functions/career-paths.mjs and netlify/functions/atlas-chat.mjs.
// Each function bundle gets its own copy of this module's state (Netlify
// Functions don't share memory across separate functions), so the cache
// below is per-function, not global — acceptable since both independently
// stay reasonably fresh.

const CACHE_TTL_MS = 20 * 60 * 1000 // 20 minutes

let cache = { data: null, fetchedAt: 0 }
let inFlight = null

async function fetchCareerPaths() {
  const sheetUrl = process.env.CAREER_SHEET_URL
  const apiKey = process.env.CAREER_SHEET_API_KEY
  if (!sheetUrl) throw new Error('CAREER_SHEET_URL is not set on this Netlify site.')

  const url = new URL(sheetUrl)
  if (apiKey) url.searchParams.set('key', apiKey)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Career sheet fetch failed: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  if (!Array.isArray(data)) {
    throw new Error(data && data.error ? `Career sheet API error: ${data.error}` : 'Expected an array from the career sheet API.')
  }
  return data
}

export async function getCareerPaths() {
  const isFresh = cache.data && Date.now() - cache.fetchedAt < CACHE_TTL_MS
  if (isFresh) return cache.data

  if (!inFlight) {
    inFlight = fetchCareerPaths()
      .then((data) => {
        cache = { data, fetchedAt: Date.now() }
        return data
      })
      .catch((err) => {
        if (cache.data) {
          console.error('Career sheet refresh failed, serving stale cache:', err)
          return cache.data
        }
        throw err
      })
      .finally(() => {
        inFlight = null
      })
  }

  return inFlight
}
