import { StarIcon, VerifiedIcon } from './icons.jsx'
import { nextAvailableLabel } from '../lib/bookingUtils.js'

// One card design for the practitioner directory — inspired by
// Topmate/Preplaced-style expert-booking cards: credibility line + rating
// + session count up front, not just a name and a price.
export default function PractitionerCard({ practitioner, onOpen }) {
  const nextSlot = nextAvailableLabel(practitioner.id)
  return (
    <div className="prac-card" onClick={() => onOpen(practitioner.id)}>
      <div className="prac-card__avatar">
        {practitioner.photo ? (
          <img className="avatar-img" src={practitioner.photo} alt={practitioner.name} />
        ) : (
          practitioner.name[0]
        )}
      </div>
      <div className="prac-card__body">
        <div className="prac-card__name">
          {practitioner.name}
          <span className="prac-card__verified" title="Vetted by the Lighthouse team">
            <VerifiedIcon size={13} />
          </span>
        </div>
        <div className="prac-card__credibility">{practitioner.credibility}</div>
        <div className="prac-card__stats">
          <span className="prac-rating">
            <StarIcon /> {practitioner.rating}
          </span>
          <span className="prac-card__dot">·</span>
          <span>{practitioner.sessionsCompleted} sessions</span>
          {nextSlot && (
            <>
              <span className="prac-card__dot">·</span>
              <span className="prac-card__next">Next: {nextSlot}</span>
            </>
          )}
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
