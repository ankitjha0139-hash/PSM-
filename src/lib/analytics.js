import posthog from 'posthog-js'

// Guarded, not assumed-present: VITE_POSTHOG_KEY isn't set locally (see
// .env.example), so init() and capture() below are safe no-ops in dev
// instead of posthog-js throwing/warning on every page load. Also means
// local testing never sends events to production analytics.
let ready = false

export function initAnalytics() {
  const key = import.meta.env.VITE_POSTHOG_KEY
  const host = import.meta.env.VITE_POSTHOG_HOST
  if (!key || !host) return

  posthog.init(key, {
    api_host: host,
    capture_pageview: true,
    // Names/photos aren't sent as event properties anywhere below — this
    // just stops posthog-js autocapturing the DOM around inputs, which
    // could otherwise pick up bio text or contact fields incidentally.
    autocapture: false,
  })
  ready = true
}

export function capture(event, properties) {
  if (!ready) return
  posthog.capture(event, properties)
}
