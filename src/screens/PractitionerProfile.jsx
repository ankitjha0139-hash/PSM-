import { useState } from 'react'
import { StarIcon, CheckIcon } from '../components/icons.jsx'

const SLOTS = ['Today, 8:00 PM', 'Tomorrow, 6:00 PM', 'Sat, 11:00 AM']

// Full profile — bio, topics, testimonials, and a choice of session types
// (not one fixed slot) — the pattern real expert-booking platforms
// (Topmate, Preplaced) use so a stranger feels worth paying to talk to.
export default function PractitionerProfile({ practitioner, onBack }) {
  const [sessionType, setSessionType] = useState(null)
  const [slot, setSlot] = useState(null)
  const [confirmed, setConfirmed] = useState(false)

  if (confirmed) {
    return (
      <main className="screen screen--center">
        <div className="prac-confirm-check">
          <CheckIcon size={26} />
        </div>
        <h2 className="screen__title screen__title--md">Booking confirmed!</h2>
        <p className="screen__sub">
          Your {sessionType.label.toLowerCase()} with {practitioner.name} is set for {slot}. A
          link will be emailed to you.
        </p>
        <p className="demo-flag">⚠ Demo only — no real booking or payment happens yet.</p>
        <button className="btn btn--ghost" onClick={onBack} style={{ marginTop: 14 }}>
          Back to Practitioners
        </button>
      </main>
    )
  }

  if (sessionType) {
    return (
      <main className="screen screen--scroll">
        <button className="link-back" onClick={() => setSessionType(null)} aria-label="Back">
          ←
        </button>
        <div className="screen__body">
          <h2 className="screen__title screen__title--md">
            Book {sessionType.label} with {practitioner.name}
          </h2>
          <p className="screen__sub">
            {sessionType.duration} · {sessionType.price}
          </p>
          <div className="chip-row">
            {SLOTS.map((s) => (
              <button
                key={s}
                className={`chip ${slot === s ? 'chip--on' : ''}`}
                onClick={() => setSlot(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <button className="btn btn--primary" onClick={() => slot && setConfirmed(true)}>
            Confirm booking
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="screen screen--scroll">
      <button className="link-back" onClick={onBack} aria-label="Back">
        ←
      </button>

      <div className="prac-profile-head">
        <div className="prac-profile-avatar">{practitioner.name[0]}</div>
        <h2 className="detail-title">{practitioner.name}</h2>
        <p className="detail-tagline">{practitioner.credibility}</p>
        <div className="prac-card__stats" style={{ justifyContent: 'center', marginTop: 6 }}>
          <span className="prac-rating">
            <StarIcon /> {practitioner.rating}
          </span>
          <span className="prac-card__dot">·</span>
          <span>{practitioner.sessionsCompleted} sessions</span>
        </div>
      </div>

      <div className="section">
        <h3 className="section__h">About</h3>
        <p className="section__text">{practitioner.bio}</p>
      </div>

      <div className="section">
        <h3 className="section__h">Can help with</h3>
        <div className="tag-row">
          {practitioner.topics.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="section">
        <h3 className="section__h">Pick a session</h3>
        <div className="session-list">
          {practitioner.sessionTypes.map((st) => (
            <button key={st.id} className="session-card" onClick={() => setSessionType(st)}>
              <div className="session-card__top">
                <span className="session-card__label">{st.label}</span>
                <span className="session-card__price">{st.price}</span>
              </div>
              <p className="session-card__desc">{st.description}</p>
              <span className="session-card__duration">{st.duration}</span>
            </button>
          ))}
        </div>
      </div>

      {practitioner.testimonials?.length > 0 && (
        <div className="section">
          <h3 className="section__h">What people say</h3>
          <div className="testimonial-list">
            {practitioner.testimonials.map((t, i) => (
              <div key={i} className="testimonial">
                <p className="testimonial__text">"{t.text}"</p>
                <span className="testimonial__name">— {t.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
