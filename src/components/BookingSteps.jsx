const STEPS = [
  { id: 'slot', label: 'Time' },
  { id: 'contact', label: 'Details' },
  { id: 'confirmed', label: 'Confirmed' },
]

// Shown on the linear part of the booking flow (slot -> contact ->
// confirmed) so it's clear how many steps remain.
export default function BookingSteps({ current }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current)

  return (
    <div className="mb-8 flex items-center gap-2">
      {STEPS.map((step, i) => {
        const done = i < currentIndex
        const active = i === currentIndex
        return (
          <div key={step.id} className="flex items-center gap-2">
            {i > 0 && <span className={`h-px w-8 ${done || active ? 'bg-indigo-900/40' : 'bg-indigo-900/10'}`} />}
            <div className="flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${
                  done ? 'bg-sage-500' : active ? 'bg-indigo-900' : 'bg-indigo-900/15'
                }`}
              />
              <span className={`text-xs font-semibold ${active ? 'text-indigo-900' : 'text-ink-faint'}`}>
                {step.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
