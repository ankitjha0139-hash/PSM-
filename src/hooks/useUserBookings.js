import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

// Bookings, per signed-in user — replaces the old localStorage-only
// useBookings (device-scoped, no account link, couldn't answer "what are
// MY sessions"). Same load/save shape as useProfile.js. Requires the
// bookings table + RLS in supabase/bookings.sql.

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
      const { error } = await supabase.from('bookings').insert(toRow(booking, user.id))
      if (!error) setBookings((prev) => [...prev, booking])
      return { error }
    },
    [user]
  )

  const cancel = useCallback(
    async (id) => {
      const { error } = await supabase.from('bookings').delete().eq('id', id).eq('user_id', user.id)
      if (!error) setBookings((prev) => prev.filter((b) => b.id !== id))
      return { error }
    },
    [user]
  )

  return { bookings, loading, loadError, add, cancel }
}
