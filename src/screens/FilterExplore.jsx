import { useEffect, useMemo, useRef, useState } from 'react'
import { useCareerPaths } from '../hooks/useCareerPaths.js'
import CareerCard from '../components/CareerCard.jsx'

// Raw interest_tags in the sheet have grown into the dozens as more careers
// get added — too many to show flat. This groups them into a small set of
// categories: tap a category to open its tag drawer, tap tags inside to
// filter. A tag not listed here (a genuinely new one added to the sheet)
// falls into "Other" automatically instead of disappearing.
const TAG_CATEGORY = {
  science: 'Science & Research', biology: 'Science & Research', research: 'Science & Research',
  nature: 'Science & Research', analytical: 'Science & Research',
  fieldwork: 'Science & Research', investigation: 'Science & Research', maths: 'Science & Research',

  tech: 'Tech & Engineering', engineering: 'Tech & Engineering', gaming: 'Tech & Engineering',
  space: 'Tech & Engineering', aviation: 'Tech & Engineering', vehicles: 'Tech & Engineering',
  material: 'Tech & Engineering', industrial: 'Tech & Engineering', manufacturing: 'Tech & Engineering',
  processes: 'Tech & Engineering', flight: 'Tech & Engineering', safety: 'Tech & Engineering',

  creative: 'Creative & Design', design: 'Creative & Design', visual: 'Creative & Design',
  storytelling: 'Creative & Design', media: 'Creative & Design', writing: 'Creative & Design',
  music: 'Creative & Design', fashion: 'Creative & Design', performance: 'Creative & Design',
  reading: 'Creative & Design',

  business: 'Business & Numbers', numbers: 'Business & Numbers', markets: 'Business & Numbers',
  economics: 'Business & Numbers', finance: 'Business & Numbers', trade: 'Business & Numbers',
  sales: 'Business & Numbers', analysis: 'Business & Numbers', property: 'Business & Numbers',
  operations: 'Business & Numbers', logistics: 'Business & Numbers', organisation: 'Business & Numbers',

  people: 'People & Care', helping: 'People & Care', healthcare: 'People & Care',
  teaching: 'People & Care', social: 'People & Care', children: 'People & Care',
  coaching: 'People & Care', health: 'People & Care', 'traditional medicine': 'People & Care',
  fitness: 'People & Care', sports: 'People & Care', physical: 'People & Care',

  leadership: 'Leadership & Society', governance: 'Leadership & Society', law: 'Leadership & Society',
  justice: 'Leadership & Society', 'public service': 'Leadership & Society', society: 'Leadership & Society',
  history: 'Leadership & Society', humanities: 'Leadership & Society', communication: 'Leadership & Society',
  culture: 'Leadership & Society', global: 'Leadership & Society', service: 'Leadership & Society',
  independent: 'Leadership & Society', stability: 'Leadership & Society', generalist: 'Leadership & Society',

  agriculture: 'Nature & Lifestyle', sustainability: 'Nature & Lifestyle', fisheries: 'Nature & Lifestyle',
  forestry: 'Nature & Lifestyle', rural: 'Nature & Lifestyle', animals: 'Nature & Lifestyle',
  travel: 'Nature & Lifestyle', hospitality: 'Nature & Lifestyle', events: 'Nature & Lifestyle',
  food: 'Nature & Lifestyle',
}

const CATEGORY_ORDER = [
  'Science & Research',
  'Tech & Engineering',
  'Creative & Design',
  'Business & Numbers',
  'People & Care',
  'Leadership & Society',
  'Nature & Lifestyle',
  'Other',
]

const categoryOf = (tag) => TAG_CATEGORY[tag] || 'Other'

// Tags that cut across every category (a trait, not a subject) confuse more
// than they help as a filter chip — e.g. "logic" surfaces both Chartered
// Accountancy and Philosophy under whichever bucket it's placed in. Dropped
// from the drawer; careers carrying only a dropped tag are still findable
// via their other tags or search.
const DROPPED_TAGS = new Set(['logic'])

// initialFocus lets the routing question hint at intent: "goal" answers
// focus the search box, "direction" answers leave the chips as the start —
// same screen either way, since both are really the same filter engine.
export default function FilterExplore({ shortlist, onOpenDetail, initialFocus }) {
  const { data: careerPaths, loading, error } = useCareerPaths()
  const [search, setSearch] = useState('')
  const [interests, setInterests] = useState([])
  const [openCategory, setOpenCategory] = useState(null)
  const [avoidMaths, setAvoidMaths] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    if (initialFocus === 'search') searchRef.current?.focus()
  }, [initialFocus])

  const toggleInterest = (tag) =>
    setInterests((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))

  const toggleCategory = (name) =>
    setOpenCategory((prev) => (prev === name ? null : name))

  // Pulled from the data, not hardcoded — a new interest_tag in the sheet
  // shows up here (under "Other" until categorized), no code change needed
  // for the filter to keep working.
  const allInterests = useMemo(
    () => [...new Set((careerPaths || []).flatMap((c) => c.interest_tags))],
    [careerPaths]
  )

  const categories = useMemo(() => {
    const byCategory = new Map()
    for (const tag of allInterests) {
      if (DROPPED_TAGS.has(tag)) continue
      const cat = categoryOf(tag)
      if (!byCategory.has(cat)) byCategory.set(cat, [])
      byCategory.get(cat).push(tag)
    }
    return CATEGORY_ORDER.filter((name) => byCategory.has(name)).map((name) => ({
      name,
      tags: byCategory.get(name).sort(),
    }))
  }, [allInterests])

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
        <p className="empty-state">Loading career paths…</p>
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

  const openTags = categories.find((c) => c.name === openCategory)?.tags || []

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

        <p className="filter-label">What draws you in?</p>
        <div className="chip-row">
          {categories.map(({ name, tags }) => {
            const activeCount = tags.filter((t) => interests.includes(t)).length
            return (
              <button
                key={name}
                className={`chip chip--category ${openCategory === name ? 'chip--open' : ''} ${activeCount ? 'chip--on' : ''}`}
                onClick={() => toggleCategory(name)}
              >
                {name}
                {activeCount > 0 && <span className="chip__count">{activeCount}</span>}
              </button>
            )
          })}
          <button
            className={`chip ${avoidMaths ? 'chip--on' : ''}`}
            onClick={() => setAvoidMaths((v) => !v)}
          >
            Avoid Maths
          </button>
        </div>

        {openCategory && (
          <div className="filter-drawer">
            <p className="filter-drawer__hint">Narrow it further within {openCategory.toLowerCase()} — optional</p>
            <div className="chip-row">
              {openTags.map((tag) => (
                <button
                  key={tag}
                  className={`chip chip--sub ${interests.includes(tag) ? 'chip--on' : ''}`}
                  onClick={() => toggleInterest(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

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
          <p className="empty-state">No paths match — try loosening a filter.</p>
        )}
      </div>
    </main>
  )
}
