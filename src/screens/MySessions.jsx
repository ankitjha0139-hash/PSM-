import { useState } from 'react'
import { CalendarPlus, Clock, WarningCircle, UserCircle } from '@phosphor-icons/react'
import { usePractitioners } from '../hooks/usePractitioners.js'
import { useUserBookings } from '../hooks/useUserBookings.js'
import { bookingDateTime, downloadIcs } from '../lib/bookingUtils.js'
import EmptyState from '../components/EmptyState.jsx'
import SkeletonSessionCard from '../components/SkeletonSessionCard.jsx'
import Button from '../components/ui/Button.jsx'

const FILTERS = ['All', 'Upcoming', 'Completed']

const EMPTY_COPY = {
  All: 'No sessions yet — browse practitioners to book one.',
  Upcoming: 'No upcoming sessions.',
  Completed: 'No completed sessions yet.',
}

// Bookings live in Supabase (see useUserBookings) — this is the only
// screen that can answer "what are MY sessions", so it owns its own
// sign-in gate rather than assuming the caller already checked.
export default function MySessions({ user, onSignIn }) {
  const { bookings, loading, loadError, cancel } = useUserBookings(user)
  const { data: practitioners } = usePractitioners()
  const [filter, setFilter] = useState('All')
  const [openId, setOpenId] = useState(null)

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
        <EmptyState
          icon={UserCircle}
          title="Sign in to see your sessions"
          description="Bookings are tied to your account so they're there whichever device you check from."
          action={
            <Button as="button" onClick={onSignIn} variant="primary">
              Continue with Google
            </Button>
          }
        />
      </section>
    )
  }

  const now = new Date()
  const sorted = [...bookings].sort((a, b) => bookingDateTime(a) - bookingDateTime(b))
  const filtered = sorted.filter((b) => {
    const upcoming = bookingDateTime(b) >= now
    if (filter === 'Upcoming') return upcoming
    if (filter === 'Completed') return !upcoming
    return true
  })

  return (
    <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-indigo-900">My Sessions</h1>

      <div className="mt-6 flex gap-2" role="group" aria-label="Filter sessions">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => {
              setFilter(f)
              setOpenId(null)
            }}
            aria-pressed={filter === f}
            className={`min-h-9 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              filter === f
                ? 'border-indigo-900 bg-indigo-900 text-cream'
                : 'border-indigo-900/15 bg-white/60 text-ink-soft hover:border-indigo-900/30'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => <SkeletonSessionCard key={i} />)}

        {!loading && loadError && (
          <EmptyState icon={WarningCircle} title="Couldn't load your sessions" description={loadError} />
        )}

        {!loading && !loadError && filtered.length === 0 && (
          <EmptyState icon={Clock} title="Nothing here yet" description={EMPTY_COPY[filter]} />
        )}

        {!loading &&
          !loadError &&
          filtered.map((b) => {
            const upcoming = bookingDateTime(b) >= now
            const practitioner = practitioners?.find((p) => p.id === b.practitionerId)
            const open = openId === b.id

            return (
              <div key={b.id} className="rounded-3xl border border-indigo-900/10 bg-white/60 p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-base font-semibold text-indigo-900">
                    {b.sessionLabel} with {b.practitionerName}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      upcoming ? 'bg-sage-50 text-sage-600' : 'bg-indigo-900/5 text-ink-faint'
                    }`}
                  >
                    {upcoming ? 'Upcoming' : 'Completed'}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-indigo-900 text-sm font-semibold text-cream">
                    {practitioner?.photo ? (
                      <img src={practitioner.photo} alt="" className="h-full w-full object-cover" />
                    ) : (
                      (practitioner?.name || b.practitionerName)[0]
                    )}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Coach</p>
                    <p className="text-sm font-semibold text-indigo-900">{practitioner?.name || b.practitionerName}</p>
                    {practitioner?.credibility && <p className="text-xs text-ink-soft">{practitioner.credibility}</p>}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-indigo-900/8 pt-4">
                  <span className="text-sm text-ink-faint">
                    {b.dayLabel}, {b.dateLabel} · {b.time}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : b.id)}
                    className="text-sm font-semibold text-indigo-900 hover:opacity-80"
                  >
                    {open ? 'Hide details' : 'View session'}
                  </button>
                </div>

                {open && (
                  <div className="mt-4 space-y-3 border-t border-indigo-900/8 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-ink-faint">Price</span>
                      <span className="font-semibold text-ink">{b.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-ink-faint">Booking ID</span>
                      <span className="font-semibold text-ink">{b.id}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button as="button" onClick={() => downloadIcs(b)} variant="outline" className="!min-h-9 !py-2 text-sm">
                        <CalendarPlus size={15} weight="bold" /> Add to calendar
                      </Button>
                      {upcoming && (
                        <Button
                          as="button"
                          onClick={() => cancel(b.id)}
                          variant="outline"
                          className="!min-h-9 !py-2 text-sm !border-red-200 !text-red-600 hover:!bg-red-50"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </section>
  )
}
