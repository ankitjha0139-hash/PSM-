import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'supportTickets'

// Tickets persisted locally for now — Wizard-of-Oz, same as practitioner
// booking. A "ticket" is just a saved record; Phase 3/5 swaps this for a
// real Supabase table + email/WhatsApp notification without screens
// needing to change (same pattern as useShortlist).
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

  const raise = useCallback((message, contact) => {
    const ticket = {
      id: crypto.randomUUID(),
      message,
      contact,
      status: 'open',
      created_at: new Date().toISOString(),
    }
    setTickets((prev) => [...prev, ticket])
    return ticket
  }, [])

  return { tickets, raise }
}
