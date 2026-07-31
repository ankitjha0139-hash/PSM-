import { useEffect, useMemo, useRef, useState } from 'react'
import { MagnifyingGlass, Compass, WarningCircle } from '@phosphor-icons/react'
import { useCareerPaths } from '../hooks/useCareerPaths.js'
import CareerCard from '../components/CareerCard.jsx'
import SkeletonCareerCard from '../components/SkeletonCareerCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Pagination from '../components/Pagination.jsx'

const STREAMS = ['All', 'Science', 'Commerce', 'Arts', 'Vocational', 'Alternate', 'Govt']
const PAGE_SIZE = 12

export default function FilterExplore({ onOpenCareer, shortlist }) {
  const { data, loading, error } = useCareerPaths()
  const [query, setQuery] = useState('')
  const [stream, setStream] = useState('All')
  const [page, setPage] = useState(1)
  const resultsRef = useRef(null)

  const filtered = useMemo(() => {
    if (!data) return []
    const q = query.trim().toLowerCase()
    return data.filter((c) => {
      const matchesStream = stream === 'All' || c.stream === stream
      const matchesQuery =
        !q || c.title?.toLowerCase().includes(q) || c.what_it_is?.toLowerCase().includes(q)
      return matchesStream && matchesQuery
    })
  }, [data, query, stream])

  // A new search/filter invalidates whatever page you were on — back to
  // page 1 rather than showing an empty page 4 of a 2-page result.
  useEffect(() => {
    setPage(1)
  }, [query, stream])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const goToPage = (next) => {
    setPage(next)
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-indigo-900 sm:text-4xl">
          Explore every path
        </h1>
        <p className="mt-3 text-lg text-ink-soft">
          Filter and search — see what each career really means before you narrow down.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search careers</span>
          <MagnifyingGlass
            size={18}
            weight="bold"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name — e.g. architecture, market research"
            className="min-h-11 w-full rounded-full border border-indigo-900/15 bg-white/70 py-3 pl-11 pr-4 text-[15px] text-ink placeholder:text-ink-faint focus-visible:border-indigo-500"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by stream">
        {STREAMS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStream(s)}
            aria-pressed={stream === s}
            className={`min-h-9 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              stream === s
                ? 'border-indigo-900 bg-indigo-900 text-cream'
                : 'border-indigo-900/15 bg-white/60 text-ink-soft hover:border-indigo-900/30'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div ref={resultsRef} className="mt-10 scroll-mt-24">
        {error && (
          <EmptyState
            icon={WarningCircle}
            title="Couldn't load careers right now"
            description={
              import.meta.env.DEV
                ? `${error.message} — is \`netlify dev\` running (functions need it, plain \`vite\` won't serve /api)?`
                : "Something went wrong on our end. Try refreshing in a moment."
            }
          />
        )}

        {!error && loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCareerCard key={i} />
            ))}
          </div>
        )}

        {!error && !loading && filtered.length === 0 && (
          <EmptyState
            icon={Compass}
            title="No careers match that"
            description="Try a different search term or switch the stream filter back to All."
          />
        )}

        {!error && !loading && filtered.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {paged.map((career) => (
                <CareerCard
                  key={career.id}
                  career={career}
                  onOpen={onOpenCareer}
                  shortlisted={shortlist.has(career.id)}
                  onToggleShortlist={shortlist.toggle}
                />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
          </>
        )}
      </div>
    </section>
  )
}
