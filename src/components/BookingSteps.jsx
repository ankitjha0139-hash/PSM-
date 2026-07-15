const STEPS = [
  { id: 'slot', label: 'Time' },
  { id: 'contact', label: 'Details' },
  { id: 'confirmed', label: 'Confirmed' },
]

// Shown on the linear part of the booking flow (slot -> contact ->
// confirmed) so it's clear how many steps remain — not shown on the
// practitioner's main profile screen, which is browsing, not the flow.
export default function BookingSteps({ current }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current)

  return (
    <div className="booking-steps">
      {STEPS.map((step, i) => (
        <div
          key={step.id}
          className={`booking-steps__step ${
            i < currentIndex
              ? 'booking-steps__step--done'
              : i === currentIndex
                ? 'booking-steps__step--active'
                : ''
          }`}
        >
          <span className="booking-steps__dot" />
          <span className="booking-steps__label">{step.label}</span>
        </div>
      ))}
    </div>
  )
}
