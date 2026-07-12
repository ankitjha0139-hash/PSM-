import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'bookings'

// Bookings, persisted to localStorage — same pattern as useShortlist.
// Symbolic for now (nothing reaches a server); the ticket pipe / Cal.com
// phases swap the storage layer without the screens changing.
export function useBookings() {
  const [bookings, setBookings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
  }, [bookings])

  const add = useCallback((booking) => {
    setBookings((prev) => [...prev, booking])
  }, [])

  const cancel = useCallback((id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id))
  }, [])

  return { bookings, add, cancel }
}
