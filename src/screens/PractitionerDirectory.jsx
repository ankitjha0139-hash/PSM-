import { useState } from 'react'

// Dummy supply — the Wizard-of-Oz MVP approach: real booking UX, fake
// practitioners for now. Swap for real onboarded profiles in Phase 5.
const PRACTITIONERS = [
  { id: 1, name: 'Meera Nair', role: 'UX Designer @ Flipkart', rating: '4.9', price: '₹499 / 30 min' },
  { id: 2, name: 'Rohan Gupta', role: 'Software Engineer @ Google', rating: '4.8', price: '₹599 / 30 min' },
  { id: 3, name: 'CA Vikram Shah', role: 'Chartered Accountant', rating: '4.7', price: '₹499 / 30 min' },
]

const SLOTS = ['Today, 8:00 PM', 'Tomorrow, 6:00 PM', 'Sat, 11:00 AM']

export default function PractitionerDirectory() {
  const [booking, setBooking] = useState(null)
  const [slot, setSlot] = useState(null)
  const [confirmed, setConfirmed] = useState(false)

  const startBooking = (p) => {
    setBooking(p)
    setSlot(null)
    setConfirmed(false)
  }

  if (booking) {
    return (
      <main className="screen screen--scroll">
        <button className="link-back" onClick={() => setBooking(null)} aria-label="Back">
          ←
        </button>
        {!confirmed ? (
          <div className="screen__body">
            <h2 className="screen__title screen__title--md">Book {booking.name}</h2>
            <p className="screen__sub">
              {booking.role} · {booking.price}
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
        ) : (
          <div className="screen__body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 44 }}>✅</div>
            <h2 className="screen__title screen__title--md">Booking confirmed!</h2>
            <p className="screen__sub">
              Your call with {booking.name} is set for {slot}. A link will be emailed to you.
            </p>
            <p className="demo-flag">⚠ Demo only — no real booking or payment happens yet.</p>
          </div>
        )}
      </main>
    )
  }

  return (
    <main className="screen screen--scroll">
      <h2 className="screen__title screen__title--md">Career Practitioners</h2>
      <p className="screen__sub" style={{ margin: '0 0 12px' }}>
        Talk to someone who's actually done it.
      </p>
      <div className="practitioner-list">
        {PRACTITIONERS.map((p) => (
          <div key={p.id} className="practitioner-card">
            <div className="practitioner-card__avatar">{p.name[0]}</div>
            <div className="practitioner-card__info">
              <div className="practitioner-card__name">
                {p.name} <span className="star">★ {p.rating}</span>
              </div>
              <div className="practitioner-card__role">{p.role}</div>
              <div className="practitioner-card__price">{p.price}</div>
            </div>
            <button className="btn btn--sm" onClick={() => startBooking(p)}>
              Book
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
