import { ArrowRight, Heart } from '@phosphor-icons/react'

export default function CareerCard({ career, shortlisted, onToggleShortlist, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(career.id)}
      className="group relative flex h-full flex-col rounded-3xl border border-indigo-900/10 bg-white/60 p-6 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      {onToggleShortlist && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation()
            onToggleShortlist(career.id)
          }}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return
            e.preventDefault()
            e.stopPropagation()
            onToggleShortlist(career.id)
          }}
          aria-label={shortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
          aria-pressed={shortlisted}
          className="absolute right-3 top-3 grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-white/70 text-indigo-900 hover:bg-white"
        >
          <Heart size={18} weight={shortlisted ? 'fill' : 'regular'} className={shortlisted ? 'text-sage-600' : ''} />
        </span>
      )}

      <span className="inline-flex w-fit items-center rounded-full bg-sage-50 px-3 py-1 text-xs font-semibold text-sage-600">
        {career.stream}
      </span>

      <h3 className="mt-4 font-display text-lg font-semibold text-indigo-900">{career.title}</h3>

      {career.what_it_is && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">{career.what_it_is}</p>
      )}

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-faint">
        {career.duration_years && <span>{career.duration_years}</span>}
        {career.entry_pay && <span>Starts at {career.entry_pay}</span>}
      </div>

      <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-indigo-900">
        See the full picture
        <ArrowRight size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  )
}
