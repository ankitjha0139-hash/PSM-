import { useEffect, useMemo, useRef, useState } from 'react'
import { useCareerPaths } from '../hooks/useCareerPaths.js'
import CareerCard from '../components/CareerCard.jsx'
import SkeletonCareerCard from '../components/SkeletonCareerCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { TargetIcon } from '../components/icons.jsx'

const INTEREST_LABELS = { creative: 'Creative', tech: 'Tech', business: 'Business' }

// initialFocus lets the routing question hint at intent: "goal" answers
// focus the search box, "direction" answers leave the chips as the start —
// same screen either way, since both are really the same filter engine.
export default function FilterExplore({ shortlist, onOpenDetail, initialFocus }) {
  const { data: careerPaths, loading, error } = useCareerPaths()
  const [search, setSearch] = useState('')
  const [interests, setInterests] = useState([])
  const [avoidMaths, setAvoidMaths] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    if (initialFocus === 'search') searchRef.current?.focus()
  }, [initialFocus])

  const toggleInterest = (tag) =>
    setInterests((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))

  // Pulled from the data, not hardcoded — a new interest_tag in the sheet
  // shows up here automatically, no code change needed.
  const allInterests = useMemo(
    () => [...new Set((careerPaths || []).flatMap((c) => c.interest_tags))],
    [careerPaths]
  )

  const results = useMemo(() => {
    const q = search.trim().toLowerCase()
    return (careerPaths || []).filter((c) => {
      if (q && !c.title.toLowerCase().includes(q)) return false
      if (interests.length && !c.interest_tags.some((t) => interests.includes(t))) return false
      if (avoidMaths && c.requires_maths) return false
      return true
    })
  }, [careerPaths, search, interests, avoidMaths])

  if (loading && !careerPaths) {
    return (
      <main className="screen screen--scroll">
        <h2 className="screen__title screen__title--md">Explore paths</h2>
        <div className="career-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCareerCard key={i} />
          ))}
        </div>
      </main>
    )
  }

  if (error && !careerPaths) {
    return (
      <main className="screen screen--scroll">
        <h2 className="screen__title screen__title--md">Explore paths</h2>
        <p className="empty-state">Couldn't load career data — check your connection and try again.</p>
      </main>
    )
  }

  return (
    <main className="screen screen--scroll">
      <div className="explore-header">
        <h2 className="screen__title screen__title--md">Explore paths</h2>
        <input
          ref={searchRef}
          className="search-input"
          placeholder="Search a career (e.g. designer, CA)…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="chip-row">
          {allInterests.map((tag) => (
            <button
              key={tag}
              className={`chip ${interests.includes(tag) ? 'chip--on' : ''}`}
              onClick={() => toggleInterest(tag)}
            >
              {INTEREST_LABELS[tag] || tag}
            </button>
          ))}
          <button
            className={`chip ${avoidMaths ? 'chip--on' : ''}`}
            onClick={() => setAvoidMaths((v) => !v)}
          >
            Avoid Maths
          </button>
        </div>
        <p className="result-count">
          {results.length} path{results.length === 1 ? '' : 's'} fit this
        </p>
      </div>

      <div className="career-grid">
        {results.map((c) => (
          <CareerCard
            key={c.id}
            career={c}
            shortlisted={shortlist.has(c.id)}
            onToggleShortlist={shortlist.toggle}
            onOpen={onOpenDetail}
          />
        ))}
        {results.length === 0 && (
          <EmptyState icon={TargetIcon} message="No paths match — try loosening a filter." />
        )}
      </div>
    </main>
  )
}
