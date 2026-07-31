import { ArrowLeft, WarningCircle, Link as LinkIcon, Heart } from '@phosphor-icons/react'
import { useCareerPaths } from '../hooks/useCareerPaths.js'
import Button from '../components/ui/Button.jsx'
import EmptyState from '../components/EmptyState.jsx'
import SkeletonCareerCard from '../components/SkeletonCareerCard.jsx'

const FACTS = [
  ['duration_years', 'Duration'],
  ['entry_pay', 'Entry pay'],
  ['fees', 'Typical fees'],
  ['time_bucket', 'Time to first income'],
]

export default function CareerDetail({ careerId, onBack, onTalkToPractitioner, shortlist }) {
  const { data, loading, error } = useCareerPaths()
  const career = data?.find((c) => c.id === careerId)

  return (
    <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-900 hover:opacity-80"
      >
        <ArrowLeft size={16} weight="bold" /> Back to Explore
      </button>

      {error && (
        <div className="mt-10">
          <EmptyState icon={WarningCircle} title="Couldn't load this career" description={error.message} />
        </div>
      )}

      {!error && loading && (
        <div className="mt-10">
          <SkeletonCareerCard />
        </div>
      )}

      {!error && !loading && !career && (
        <div className="mt-10">
          <EmptyState
            icon={WarningCircle}
            title="We couldn't find that career"
            description="It may have been renamed or removed from the sheet."
          />
        </div>
      )}

      {career && (
        <article className="mt-8">
          <div className="flex items-start justify-between gap-4">
            <span className="inline-flex items-center rounded-full bg-sage-50 px-3 py-1 text-xs font-semibold text-sage-600">
              {career.stream}
            </span>
            <button
              type="button"
              onClick={() => shortlist.toggle(career.id)}
              aria-pressed={shortlist.has(career.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                shortlist.has(career.id)
                  ? 'border-sage-300 bg-sage-50 text-sage-600'
                  : 'border-indigo-900/15 bg-white/60 text-ink-soft hover:border-indigo-900/30'
              }`}
            >
              <Heart size={15} weight={shortlist.has(career.id) ? 'fill' : 'regular'} />
              {shortlist.has(career.id) ? 'Shortlisted' : 'Add to shortlist'}
            </button>
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-indigo-900 sm:text-4xl">
            {career.title}
          </h1>
          {career.what_it_is && (
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">{career.what_it_is}</p>
          )}

          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {FACTS.filter(([key]) => career[key]).map(([key, label]) => (
              <div key={key} className="rounded-2xl border border-indigo-900/10 bg-white/60 p-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</dt>
                <dd className="mt-1 text-sm font-semibold text-indigo-900">{career[key]}</dd>
              </div>
            ))}
          </dl>

          {career.honest_note && (
            <div className="mt-8 rounded-3xl border border-sage-300/40 bg-sage-50 p-6">
              <h2 className="font-display text-lg font-semibold text-indigo-900">The honest bit</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink">{career.honest_note}</p>
            </div>
          )}

          {career.colleges_route && (
            <div className="mt-8">
              <h2 className="font-display text-lg font-semibold text-indigo-900">How you'd get there</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{career.colleges_route}</p>
            </div>
          )}

          {Array.isArray(career.resources) && career.resources.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-lg font-semibold text-indigo-900">Go deeper</h2>
              <ul className="mt-3 space-y-2">
                {career.resources.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-indigo-900 underline decoration-indigo-900/30 underline-offset-4 hover:decoration-indigo-900"
                    >
                      <LinkIcon size={14} weight="bold" /> {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10 rounded-3xl border border-indigo-900/10 bg-white/60 p-6">
            <h2 className="font-display text-lg font-semibold text-indigo-900">
              Want the real "day in the life"?
            </h2>
            <p className="mt-2 text-[15px] text-ink-soft">
              Talk to someone who actually does this job — not a generic counsellor.
            </p>
            <Button
              variant="primary"
              as="button"
              onClick={() => onTalkToPractitioner(career.roles?.[0])}
              className="mt-5"
            >
              Talk to a real {career.roles?.[0] || career.title}
            </Button>
          </div>
        </article>
      )}
    </section>
  )
}
