import { useMemo, useState } from 'react'
import { StarIcon, CheckIcon, VerifiedIcon, CalendarIcon, BackIcon, ArrowRightIcon } from '../components/icons.jsx'
import { getSlotDays, makeBookingId, downloadIcs } from '../lib/bookingUtils.js'
import { useBookings } from '../hooks/useBookings.js'
import { submitNetlifyForm } from '../lib/netlifyForms.js'

// Full profile + the booking flow: pick a session type, pick a real
// day/time slot, leave contact details, get a confirmation with a booking
// ID and a calendar file. Symbolic for now — nothing reaches a server —
// but the flow is the exact shape Cal.com slots into later.
export default function PractitionerProfile({ practitioner, onBack, onRequireAuth }) {
  // step: 'profile' → 'slot' → 'contact' → 'confirmed'
  const [step, setStep] = useState('profile')
  const [sessionType, setSessionType] = useState(null)
  const [dayKey, setDayKey] = useState(null)
  const [time, setTime] = useState(null)
  const [contactName, setContactName] = useState('')
  const [contact, setContact] = useState('')
  const [booking, setBooking] = useState(null)
  const [notified, setNotified] = useState(false)
  const [saving, setSaving] = useState(false)
  const { add } = useBookings()

  const slotDays = useMemo(() => getSlotDays(practitioner?.id), [practitioner?.id])
  const selectedDay = slotDays.find((d) => d.dateKey === dayKey)

  if (!practitioner) return null

  const confirmBooking = async () => {
    if (!contactName.trim() || !contact.trim() || saving) return
    setSaving(true)
    const b = {
      id: makeBookingId(),
      practitionerId: practitioner.id,
      practitionerName: practitioner.name,
      sessionLabel: sessionType.label,
      duration: sessionType.duration,
      price: sessionType.price,
      dateKey,
      dateLabel: selectedDay.dateLabel,
      dayLabel: selectedDay.dayLabel,
      time,
      contactName: contactName.trim(),
      contact: contact.trim(),
      createdAt: new Date().toISOString(),
    }
    // Notify the team through the Netlify Forms pipe. The booking itself
    // never fails — worst case the local record exists and the
    // confirmation copy tells the user to ping support.
    let sent = false
    try {
      await submitNetlifyForm('booking', {
        bookingId: b.id,
        practitioner: b.practitionerName,
        session: `${b.sessionLabel} (${b.duration}, ${b.price})`,
        when: `${b.dayLabel}, ${b.dateLabel} at ${b.time}`,
        name: b.contactName,
        contact: b.contact,
      })
      sent = true
    } catch {
      sent = false
    }
    add(b)
    setBooking(b)
    setNotified(sent)
    setSaving(false)
    setStep('confirmed')
  }

  if (step === 'confirmed') {
    return (
      <main className="screen screen--center">
        <div className="prac-confirm-check">
          <CheckIcon size={26} />
        </div>
        <h2 className="screen__title screen__title--md">Booking confirmed!</h2>
        <div className="booking-summary">
          <div className="booking-summary__row">
            <span>Session</span>
            <b>{booking.sessionLabel} · {booking.duration}</b>
          </div>
          <div className="booking-summary__row">
            <span>With</span>
            <b>{booking.practitionerName}</b>
          </div>
          <div className="booking-summary__row">
            <span>When</span>
            <b>{booking.dayLabel}, {booking.dateLabel} · {booking.time}</b>
          </div>
          <div className="booking-summary__row">
            <span>Price</span>
            <b>{booking.price} — pay after the call</b>
          </div>
          <div className="booking-summary__row">
            <span>Booking ID</span>
            <b>{booking.id}</b>
          </div>
        </div>
        <p className="screen__sub">
          {notified
            ? `Our team has been notified — we'll confirm your slot and share the call link on ${booking.contact}.`
            : `Saved on this device, but we couldn't notify the team just now — please ping us via the help button with your booking ID.`}
        </p>
        <button className="btn btn--ghost" onClick={() => downloadIcs(booking)}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <CalendarIcon /> Add to calendar
          </span>
        </button>
        <button className="btn btn--primary" onClick={onBack}>
          Done
        </button>
      </main>
    )
  }

  if (step === 'contact') {
    return (
      <main className="screen screen--scroll">
        <button className="link-back" onClick={() => setStep('slot')} aria-label="Back">
          <BackIcon />
        </button>
        <div className="screen__body">
          <h2 className="screen__title screen__title--md">Almost there</h2>
          <p className="screen__sub">
            {sessionType.label} with {practitioner.name} · {selectedDay.dayLabel},{' '}
            {selectedDay.dateLabel} · {time}
          </p>
          <input
            className="search-input"
            style={{ margin: 0 }}
            placeholder="Your name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            autoFocus
          />
          <input
            className="search-input"
            style={{ margin: 0 }}
            placeholder="WhatsApp number or email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <p className="booking-note">
            This is where we'll confirm the slot and send the call link.
          </p>
          <button
            className="btn btn--primary"
            disabled={!contactName.trim() || !contact.trim() || saving}
            onClick={confirmBooking}
          >
            {saving ? 'Booking…' : <>Confirm booking <ArrowRightIcon /></>}
          </button>
        </div>
      </main>
    )
  }

  if (step === 'slot') {
    return (
      <main className="screen screen--scroll">
        <button className="link-back" onClick={() => setStep('profile')} aria-label="Back">
          <BackIcon />
        </button>
        <div className="screen__body">
          <h2 className="screen__title screen__title--md">
            Pick a time with {practitioner.name}
          </h2>
          <p className="screen__sub">
            {sessionType.label} · {sessionType.duration} · {sessionType.price}
          </p>

          <div className="day-strip">
            {slotDays.map((d) => (
              <button
                key={d.dateKey}
                className={`day-pill ${dayKey === d.dateKey ? 'day-pill--on' : ''}`}
                onClick={() => {
                  setDayKey(d.dateKey)
                  setTime(null)
                }}
              >
                <span className="day-pill__day">{d.dayLabel}</span>
                <span className="day-pill__date">{d.dateLabel}</span>
              </button>
            ))}
          </div>

          {selectedDay ? (
            <div className="slot-grid">
              {selectedDay.slots.map((s) => (
                <button
                  key={s.time}
                  className={`slot ${time === s.time ? 'slot--on' : ''}`}
                  disabled={s.taken}
                  onClick={() => setTime(s.time)}
                >
                  {s.time}
                  {s.taken && <span className="slot__taken">taken</span>}
                </button>
              ))}
            </div>
          ) : (
            <p className="booking-note">Pick a day to see available times.</p>
          )}

          <button
            className="btn btn--primary"
            disabled={!time}
            onClick={() => setStep('contact')}
          >
            Continue <ArrowRightIcon />
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="screen screen--scroll">
      <button className="link-back" onClick={onBack} aria-label="Back">
        <BackIcon />
      </button>

      <div className="prac-profile-head">
        <div className="prac-profile-avatar">
          {practitioner.photo ? (
            <img className="avatar-img" src={practitioner.photo} alt={practitioner.name} />
          ) : (
            practitioner.name[0]
          )}
        </div>
        <h2 className="detail-title">
          {practitioner.name}
          <span className="verified-badge" title="Vetted by the Lighthouse team">
            <VerifiedIcon /> Verified
          </span>
        </h2>
        <p className="detail-tagline">{practitioner.credibility}</p>
        <div className="prac-card__stats" style={{ justifyContent: 'center', marginTop: 6 }}>
          <span className="prac-rating">
            <StarIcon /> {practitioner.rating}
          </span>
          <span className="prac-card__dot">·</span>
          <span>{practitioner.sessionsCompleted} sessions</span>
          {practitioner.languages?.length > 0 && (
            <>
              <span className="prac-card__dot">·</span>
              <span>{practitioner.languages.join(' / ')}</span>
            </>
          )}
        </div>
      </div>

      <div className="section">
        <h3 className="section__h">About</h3>
        <p className="section__text">{practitioner.bio}</p>
      </div>

      {practitioner.videoId && (
        <div className="section">
          <h3 className="section__h">Meet {practitioner.name.split(' ')[0]}</h3>
          <div className="video-wrap">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${practitioner.videoId}`}
              title={`Intro video — ${practitioner.name}`}
              loading="lazy"
              allow="accelerometer; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
          {/* Drop this note once real per-practitioner intros replace the
              sample videoId in practitioners.js */}
          <p className="booking-note" style={{ marginTop: 8 }}>
            Sample video — each practitioner's own 5-minute intro is coming.
          </p>
        </div>
      )}

      {practitioner.journey?.length > 0 && (
        <div className="section">
          <h3 className="section__h">How they got here</h3>
          <ol className="journey">
            {practitioner.journey.map((j, i) => (
              <li key={i} className="journey__step">
                <span className="journey__when">{j.when}</span>
                <span className="journey__what">{j.what}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

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
            <button
              key={st.id}
              className="session-card"
              onClick={() =>
                onRequireAuth(() => {
                  setSessionType(st)
                  setStep('slot')
                })
              }
            >
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
