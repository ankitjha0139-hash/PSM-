import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { isMockUser } from '../lib/mockAuth.js'

const MOCK_BOOKINGS_KEY = 'lh:mockBookings'

// Postgres's "no such table" signal (see useProfile.js's identical check) —
// surfaced as a specific message here rather than a raw Postgres error,
// since "the booking silently didn't save" is a much worse failure mode
// to debug than "the confirmation screen shows an error" would be.
function isMissingTableError(error) {
  return error?.code === 'PGRST205' || /Could not find the table/i.test(error?.message || '')
}

// The unique_practitioner_slot constraint in supabase/bookings.sql —
// someone else booked this exact slot between this user loading
// availability and confirming.
function isDuplicateSlotError(error) {
  return error?.code === '23505'
}

// supabase-js's underlying fetch has no default timeout — the exact same
// issue netlifyForms.js had (see its comment). Without this, a slow or
// stuck connection to Supabase leaves confirmBooking's "Booking…" button
// (or My Sessions' loading state) waiting forever with no way out. Races
// the real query against a timeout that resolves to an error instead of
// rejecting, so callers can keep using the same `{ data, error }` shape.
//
// Important limitation this alone does NOT fix: racing a promise doesn't
// cancel the underlying request. On a slow-but-working connection, the
// insert in add() below can still land on the server seconds after we've
// already given up waiting for it — telling the user "timed out, try
// again" at that point would be actively wrong, not just impatient. add()
// verifies against reality before reporting failure; see the comment
// there.
const BOOKINGS_TIMEOUT_MS = 8000
const VERIFY_TIMEOUT_MS = 5000
const TIMEOUT_ERROR = { message: 'Request timed out. Check your connection and try again.', code: 'CLIENT_TIMEOUT' }
const UNKNOWN_STATUS_ERROR = {
  message: "We couldn't confirm whether your booking went through — check My Sessions in a moment before trying again.",
}

function withTimeout(queryPromise, ms = BOOKINGS_TIMEOUT_MS) {
  return Promise.race([
    queryPromise,
    new Promise((resolve) => setTimeout(() => resolve({ data: null, error: TIMEOUT_ERROR }), ms)),
  ])
}

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
    withTimeout(
      supabase.from('bookings').select('*').eq('user_id', user.id).order('date_key', { ascending: true })
    ).then(({ data, error }) => {
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
      let { error } = await withTimeout(supabase.from('bookings').insert(toRow(booking, user.id)))

      if (error?.code === 'CLIENT_TIMEOUT') {
        // The insert request itself is still out there — a timeout only
        // means we stopped waiting, not that Supabase didn't process it.
        // booking.id was generated client-side before this call, so it's
        // stable to check for regardless of which side finished first.
        const check = await withTimeout(
          supabase.from('bookings').select('id').eq('id', booking.id).maybeSingle(),
          VERIFY_TIMEOUT_MS
        )
        if (check.data) {
          error = null
        } else if (check.error?.code === 'CLIENT_TIMEOUT') {
          error = UNKNOWN_STATUS_ERROR
        }
        // else: genuinely not found — fall through with the original
        // timeout error below, safe to let the user retry.
      }

      if (!error) {
        setBookings((prev) => [...prev, booking])
        return { error: null }
      }
      if (error === UNKNOWN_STATUS_ERROR) {
        return { error }
      }
      if (isDuplicateSlotError(error)) {
        return { error: { message: 'That slot was just booked by someone else. Please pick another time.' } }
      }
      if (isMissingTableError(error)) {
        return { error: { message: 'Bookings are not set up on this Supabase project yet — run supabase/bookings.sql.' } }
      }
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
      const { error } = await withTimeout(supabase.from('bookings').delete().eq('id', id).eq('user_id', user.id))
      if (!error) setBookings((prev) => prev.filter((b) => b.id !== id))
      return { error }
    },
    [user]
  )

  return { bookings, loading, loadError, add, cancel }
}
