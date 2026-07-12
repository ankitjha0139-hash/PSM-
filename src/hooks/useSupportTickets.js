import { useCallback, useEffect, useState } from 'react'
import { submitNetlifyForm } from '../lib/netlifyForms.js'

const STORAGE_KEY = 'supportTickets'

// Tickets now actually reach the team: sent through Netlify Forms
// (dashboard -> Forms -> support-ticket). A local copy is still kept so
// the user has a record on their device even if they close the tab.
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
    await submitNetlifyForm('support-ticket', { message, contact })
    setTickets((prev) => [...prev, ticket])
    return ticket
  }, [])

  return { tickets, raise }
}
