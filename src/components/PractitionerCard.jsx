import { Star, SealCheck } from '@phosphor-icons/react'
import { nextAvailableLabel } from '../lib/bookingUtils.js'

export default function PractitionerCard({ practitioner, onOpen }) {
  const nextSlot = nextAvailableLabel(practitioner.id)

  return (
    <button
      type="button"
      onClick={() => onOpen(practitioner.id)}
      className="group flex h-full flex-col rounded-3xl border border-indigo-900/10 bg-white/60 p-6 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-indigo-900 text-xl font-semibold text-cream">
        {practitioner.photo ? (
          <img src={practitioner.photo} alt="" className="h-full w-full object-cover" />
        ) : (
          practitioner.name[0]
        )}
      </span>

      <div className="mt-4 flex items-center gap-1.5">
        <h3 className="font-display text-lg font-semibold text-indigo-900">{practitioner.name}</h3>
        <span title="Vetted by the Lighthouse team" className="text-sage-600">
          <SealCheck size={16} weight="fill" />
        </span>
      </div>
      <p className="mt-1 text-sm text-ink-soft">{practitioner.credibility}</p>

      <div className="mt-3 flex items-center gap-2 text-xs font-medium text-ink-faint">
        {practitioner.sessionsCompleted > 0 ? (
          <>
            <span className="inline-flex items-center gap-1 text-indigo-900">
              <Star size={13} weight="fill" /> {practitioner.rating}
            </span>
            <span>·</span>
            <span>{practitioner.sessionsCompleted} sessions</span>
          </>
        ) : (
          <span className="rounded-full bg-sage-50 px-2 py-0.5 font-semibold text-sage-600">New</span>
        )}
      </div>

      {nextSlot && <p className="mt-2 text-xs text-ink-faint">Next available: {nextSlot}</p>}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {practitioner.topics.slice(0, 2).map((t) => (
          <span key={t} className="rounded-full bg-indigo-900/5 px-2.5 py-1 text-xs font-medium text-indigo-900">
            {t}
          </span>
        ))}
      </div>

      <span className="mt-auto pt-5 text-sm font-semibold text-indigo-900">
        From {practitioner.sessionTypes[0].price}
      </span>
    </button>
  )
}
