// The one card design used everywhere a career appears — Explore grid,
// Atlas's suggestions, Shortlist. Change it once here, it updates everywhere.
export default function CareerCard({ career, shortlisted, onToggleShortlist, onOpen }) {
  return (
    <div className="career-card" onClick={() => onOpen(career.id)}>
      <button
        className={`heart ${shortlisted ? 'heart--on' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          onToggleShortlist(career.id)
        }}
        aria-label="Toggle shortlist"
      >
        ♥
      </button>
      <span className={`stream-badge stream-badge--${career.stream.toLowerCase()}`}>
        {career.stream}
      </span>
      <h3 className="career-card__title">{career.title}</h3>
      <p className="career-card__meta">{career.entry_pay}</p>
      <p className="career-card__meta career-card__meta--muted">
        {career.time_bucket} · {career.fees_bucket} fees ·{' '}
        {career.requires_maths ? 'needs Maths' : 'no Maths'}
      </p>
    </div>
  )
}
