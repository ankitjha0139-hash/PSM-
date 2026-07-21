import { useState } from 'react'
import { practitioners } from '../data/practitioners.js'
import { useUserBookings } from '../hooks/useUserBookings.js'
import { bookingDateTime, downloadIcs } from '../lib/bookingUtils.js'
import { CalendarIcon, ClockIcon } from '../components/icons.jsx'
import EmptyState from '../components/EmptyState.jsx'

const FILTERS = ['All', 'Upcoming', 'Completed']

const EMPTY_COPY = {
  All: "No sessions yet — browse Practitioners to book one.",
  Upcoming: 'No upcoming sessions.',
  Completed: "No completed sessions yet.",
}

// Sign-in gated at the nav level (see App.jsx's onNavigate) — this screen
// assumes `user` is already present. Bookings live in Supabase now (see
// useUserBookings), not the old device-only localStorage, so this is the
// first screen that can actually answer "what are MY sessions".
export default function MySessions({ user }) {
  const { bookings, loading, loadError, cancel } = useUserBookings(user)
  const [filter, setFilter] = useState('All')
  const [openId, setOpenId] = useState(null)

  const now = new Date()
  const sorted = [...bookings].sort((a, b) => bookingDateTime(a) - bookingDateTime(b))
  const filtered = sorted.filter((b) => {
    const upcoming = bookingDateTime(b) >= now
    if (filter === 'Upcoming') return upcoming
    if (filter === 'Completed') return !upcoming
    return true
  })

  return (
    <main className="screen screen--scroll">
      <h2 className="screen__title screen__title--md">My Sessions</h2>

      <div className="profile-tabs">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`profile-tab ${filter === f ? 'profile-tab--active' : ''}`}
            onClick={() => {
              setFilter(f)
              setOpenId(null)
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && <p className="empty-state">Loading your sessions…</p>}
      {loadError && !loading && (
        <p className="empty-state">Couldn't load your sessions — {loadError}</p>
      )}

      {!loading && !loadError && filtered.length === 0 && (
        <EmptyState icon={ClockIcon} message={EMPTY_COPY[filter]} />
      )}

      <div className="session-list">
        {filtered.map((b) => {
          const upcoming = bookingDateTime(b) >= now
          const practitioner = practitioners.find((p) => p.id === b.practitionerId)
          const open = openId === b.id

          return (
            <div key={b.id} className="session-card">
              <div className="session-card__head">
                <h3 className="session-card__title">
                  {b.sessionLabel} with {b.practitionerName}
                </h3>
                <span className={`session-status ${upcoming ? 'session-status--upcoming' : 'session-status--completed'}`}>
                  {upcoming ? 'Upcoming' : 'Completed'}
                </span>
              </div>

              <div className="session-card__coach">
                <div className="prac-card__avatar">
                  {practitioner?.photo ? (
                    <img className="avatar-img" src={practitioner.photo} alt={practitioner.name} />
                  ) : (
                    (practitioner?.name || b.practitionerName)[0]
                  )}
                </div>
                <div>
                  <p className="session-card__coach-label">Coach</p>
                  <p className="prac-card__name">{practitioner?.name || b.practitionerName}</p>
                  {practitioner?.credibility && (
                    <p className="prac-card__credibility">{practitioner.credibility}</p>
                  )}
                </div>
              </div>

              <div className="session-card__footer">
                <span className="booking-card__meta">
                  {b.dayLabel}, {b.dateLabel} · {b.time}
                </span>
                <button className="btn btn--ghost btn--sm" onClick={() => setOpenId(open ? null : b.id)}>
                  View Session
                </button>
              </div>

              {open && (
                <div className="session-card__detail">
                  <div className="booking-summary__row">
                    <span>Price</span>
                    <b>{b.price}</b>
                  </div>
                  <div className="booking-summary__row">
                    <span>Booking ID</span>
                    <b>{b.id}</b>
                  </div>
                  <div className="session-card__actions">
                    <button className="btn btn--ghost btn--sm" onClick={() => downloadIcs(b)}>
                      <CalendarIcon /> Add to calendar
                    </button>
                    {upcoming && (
                      <button
                        className="btn btn--ghost btn--sm session-card__cancel"
                        onClick={() => cancel(b.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
