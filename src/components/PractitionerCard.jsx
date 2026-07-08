import { StarIcon } from './icons.jsx'

// One card design for the practitioner directory — inspired by
// Topmate/Preplaced-style expert-booking cards: credibility line + rating
// + session count up front, not just a name and a price.
export default function PractitionerCard({ practitioner, onOpen }) {
  return (
    <div className="prac-card" onClick={() => onOpen(practitioner.id)}>
      <div className="prac-card__avatar">{practitioner.name[0]}</div>
      <div className="prac-card__body">
        <div className="prac-card__name">{practitioner.name}</div>
        <div className="prac-card__credibility">{practitioner.credibility}</div>
        <div className="prac-card__stats">
          <span className="prac-rating">
            <StarIcon /> {practitioner.rating}
          </span>
          <span className="prac-card__dot">·</span>
          <span>{practitioner.sessionsCompleted} sessions</span>
        </div>
        <div className="prac-card__topics">
          {practitioner.topics.slice(0, 2).map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="prac-card__price">From {practitioner.sessionTypes[0].price}</div>
    </div>
  )
}
