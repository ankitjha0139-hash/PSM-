import { practitioners } from '../data/practitioners.js'
import PractitionerCard from '../components/PractitionerCard.jsx'
import { useBookings } from '../hooks/useBookings.js'
import { downloadIcs } from '../lib/bookingUtils.js'
import { CalendarIcon, BackIcon } from '../components/icons.jsx'

export default function PractitionerDirectory({ onOpenProfile, backToCareerId, onBackToCareer }) {
  const { bookings, cancel } = useBookings()

  return (
    <main className="screen screen--scroll">
      {/* Only shown when arriving via "Talk to a real X" on a career page
          (no match, or backing out of a matched profile) — a deliberate
          tab tap never sets this, so regular visits to this tab don't get
          a stray back link that goes nowhere useful. */}
      {backToCareerId && (
        <button className="link-back" onClick={onBackToCareer} aria-label="Back to career" style={{ marginBottom: 8 }}>
          <BackIcon />
        </button>
      )}
      <h2 className="screen__title screen__title--md">Career Practitioners</h2>
      <p className="screen__sub" style={{ margin: '0 auto 16px', textAlign: 'center' }}>
        Talk to someone who's actually done it.
      </p>

      {bookings.length > 0 && (
        <div className="section">
          <h3 className="section__h">My bookings</h3>
          <div className="booking-list">
            {bookings.map((b) => (
              <div key={b.id} className="booking-card">
                <div className="booking-card__body">
                  <div className="booking-card__title">
                    {b.sessionLabel} with {b.practitionerName}
                  </div>
                  <div className="booking-card__meta">
                    {b.dayLabel}, {b.dateLabel} · {b.time} · {b.id}
                  </div>
                </div>
                <div className="booking-card__actions">
                  <button
                    className="booking-card__btn"
                    title="Add to calendar"
                    onClick={() => downloadIcs(b)}
                  >
                    <CalendarIcon />
                  </button>
                  <button
                    className="booking-card__btn booking-card__btn--cancel"
                    onClick={() => cancel(b.id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="prac-list">
        {practitioners.map((p) => (
          <PractitionerCard key={p.id} practitioner={p} onOpen={onOpenProfile} />
        ))}
      </div>
    </main>
  )
}
