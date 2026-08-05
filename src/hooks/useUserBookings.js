import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { isMockUser } from '../lib/mockAuth.js'

const MOCK_BOOKINGS_KEY = 'lh:mockBookings'

// Bookings, per signed-in user. Requires the bookings table + RLS in
// supabase/bookings.sql. Same load/save shape as useProfile.js.
//
// The demo account's id ('mock-test-user') isn't a real uuid, so it can't
// be written to the bookings table's uuid-typed user_id column anyway —
// add/cancel persist to sessionStorage instead (same pattern AtlasChat
// uses for mock chat history). Without this, each screen that calls this
// hook gets its own isolated useState, so a booking added on
// PractitionerProfile would never show up on MySessions — they're two
// separate hook instances with no shared store between them.

function fromRow(row) {
  return {
    id: row.id,
    practitionerId: row.practitioner_id,
    practitionerName: row.practitioner_name,
    sessionLabel: row.session_label,
    duration: row.duration,
    price: row.price,
    dateKey: row.date_key,
    dateLabel: row.date_label,
    dayLabel: row.day_label,
    time: row.time,
    contactName: row.contact_name,
    contact: row.contact,
    createdAt: row.created_at,
  }
}

function toRow(booking, userId) {
  return {
    id: booking.id,
    user_id: userId,
    practitioner_id: booking.practitionerId,
    practitioner_name: booking.practitionerName,
    session_label: booking.sessionLabel,
    duration: booking.duration,
    price: booking.price,
    date_key: booking.dateKey,
    date_label: booking.dateLabel,
    day_label: booking.dayLabel,
    time: booking.time,
    contact_name: booking.contactName,
    contact: booking.contact,
  }
}

export function useUserBookings(user) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    if (!user) {
      setBookings([])
      setLoading(false)
      setLoadError(null)
      return
    }
    if (isMockUser(user)) {
      try {
        setBookings(JSON.parse(sessionStorage.getItem(MOCK_BOOKINGS_KEY)) || [])
      } catch {
        setBookings([])
      }
      setLoading(false)
      setLoadError(null)
      return
    }
    let cancelled = false
    setLoading(true)
    supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('date_key', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        setBookings(error ? [] : data.map(fromRow))
        setLoadError(error ? error.message : null)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const add = useCallback(
    async (booking) => {
      if (isMockUser(user)) {
        let next
        setBookings((prev) => {
          next = [...prev, booking]
          return next
        })
        try {
          sessionStorage.setItem(MOCK_BOOKINGS_KEY, JSON.stringify(next))
        } catch {
          // sessionStorage unavailable — booking still shows for this
          // screen's own state, just won't carry over to another screen
        }
        return { error: null }
      }
      const { error } = await supabase.from('bookings').insert(toRow(booking, user.id))
      if (!error) setBookings((prev) => [...prev, booking])
      return { error }
    },
    [user]
  )

  const cancel = useCallback(
    async (id) => {
      if (isMockUser(user)) {
        let next
        setBookings((prev) => {
          next = prev.filter((b) => b.id !== id)
          return next
        })
        try {
          sessionStorage.setItem(MOCK_BOOKINGS_KEY, JSON.stringify(next))
        } catch {
          // ignore
        }
        return { error: null }
      }
      const { error } = await supabase.from('bookings').delete().eq('id', id).eq('user_id', user.id)
      if (!error) setBookings((prev) => prev.filter((b) => b.id !== id))
      return { error }
    },
    [user]
  )

  return { bookings, loading, loadError, add, cancel }
}
