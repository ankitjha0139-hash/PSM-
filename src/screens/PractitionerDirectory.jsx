import { WarningCircle } from '@phosphor-icons/react'
import { usePractitioners } from '../hooks/usePractitioners.js'
import PractitionerCard from '../components/PractitionerCard.jsx'
import SkeletonCareerCard from '../components/SkeletonCareerCard.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function PractitionerDirectory({ onOpenProfile }) {
  const { data: practitioners, loading, error } = usePractitioners()

  return (
    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-indigo-900 sm:text-4xl">
          Talk to a real person
        </h1>
        <p className="mt-3 text-lg text-ink-soft">
          Not a generic counsellor — someone who's actually done the job.
        </p>
      </div>

      <div className="mt-10">
        {error && (
          <EmptyState
            icon={WarningCircle}
            title="Couldn't load practitioners right now"
            description={import.meta.env.DEV ? error.message : 'Something went wrong on our end. Try refreshing in a moment.'}
          />
        )}

        {!error && loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCareerCard key={i} />
            ))}
          </div>
        )}

        {!error && !loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {practitioners.map((p) => (
              <PractitionerCard key={p.id} practitioner={p} onOpen={onOpenProfile} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
