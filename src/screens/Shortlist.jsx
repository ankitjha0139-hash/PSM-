import { useCareerPaths } from '../hooks/useCareerPaths.js'
import CareerCard from '../components/CareerCard.jsx'

export default function Shortlist({ shortlist, onOpenDetail }) {
  const { data: careerPaths, loading, error } = useCareerPaths()
  const saved = (careerPaths || []).filter((c) => shortlist.has(c.id))

  return (
    <main className="screen screen--scroll">
      <h2 className="screen__title screen__title--md">Your shortlist</h2>
      {loading && !careerPaths && <p className="empty-state">Loading career paths…</p>}
      {error && !careerPaths && (
        <p className="empty-state">Couldn't load career data — check your connection and try again.</p>
      )}
      {!loading && !error && saved.length === 0 && (
        <p className="empty-state">Nothing shortlisted yet — tap ♥ on any career to add it here.</p>
      )}
      <div className="career-grid">
        {saved.map((c) => (
          <CareerCard
            key={c.id}
            career={c}
            shortlisted
            onToggleShortlist={shortlist.toggle}
            onOpen={onOpenDetail}
          />
        ))}
      </div>
    </main>
  )
}
