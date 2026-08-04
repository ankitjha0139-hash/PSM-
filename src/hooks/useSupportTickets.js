import { useCallback, useEffect, useState } from 'react'
import { submitNetlifyForm } from '../lib/netlifyForms.js'

const STORAGE_KEY = 'supportTickets'

// Tickets reach the team via Netlify Forms (dashboard -> Forms ->
// support-ticket). A local copy is kept so the user has a record on their
// device even if they close the tab.
export function useSupportTickets() {
  const [tickets, setTickets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
  }, [tickets])

  const raise = useCallback(async (message, contact) => {
    const ticket = {
      id: crypto.randomUUID(),
      message,
      contact,
      status: 'open',
      created_at: new Date().toISOString(),
    }
    // The local record is the source of truth (see the module comment) —
    // a failed/timed-out Netlify Forms notification shouldn't block that,
    // same reasoning as PractitionerProfile's booking confirmation. Track
    // whether the team was actually notified so the caller can say so
    // honestly instead of always claiming it reached them.
    let notified = true
    try {
      await submitNetlifyForm('support-ticket', { message, contact })
    } catch {
      notified = false
    }
    setTickets((prev) => [...prev, ticket])
    return { ...ticket, notified }
  }, [])

  return { tickets, raise }
}
