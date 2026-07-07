import { careerPaths } from '../data/careerPaths.js'
import CareerCard from '../components/CareerCard.jsx'

export default function Shortlist({ shortlist, onOpenDetail }) {
  const saved = careerPaths.filter((c) => shortlist.has(c.id))

  return (
    <main className="screen screen--scroll">
      <h2 className="screen__title screen__title--md">Your shortlist</h2>
      {saved.length === 0 && (
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
