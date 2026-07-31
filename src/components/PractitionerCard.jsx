import { StarIcon, VerifiedIcon } from './icons.jsx'
import { nextAvailableLabel } from '../lib/bookingUtils.js'

// Grid card — vertical stack (photo/name/credibility/stats/topics/price),
// same shape as CareerCard so the Practitioners grid reads consistently
// with Explore's. .prac-card__avatar (44px, circular) stays untouched for
// MySessions' inline coach row — this uses a separate, larger
// .prac-card__photo instead.
export default function PractitionerCard({ practitioner, onOpen }) {
  const nextSlot = nextAvailableLabel(practitioner.id)
  return (
    <div className="prac-card" onClick={() => onOpen(practitioner.id)}>
      <div className="prac-card__photo">
        {practitioner.photo ? (
          <img className="avatar-img" src={practitioner.photo} alt={practitioner.name} />
        ) : (
          practitioner.name[0]
        )}
      </div>
      <div className="prac-card__name">
        {practitioner.name}
        <span className="prac-card__verified" title="Vetted by the Lighthouse team">
          <VerifiedIcon size={13} />
        </span>
      </div>
      <div className="prac-card__credibility">{practitioner.credibility}</div>
      <div className="prac-card__stats">
        {practitioner.sessionsCompleted > 0 ? (
          <>
            <span className="prac-rating">
              <StarIcon /> {practitioner.rating}
            </span>
            <span className="prac-card__dot">·</span>
            <span>{practitioner.sessionsCompleted} sessions</span>
          </>
        ) : (
          <span className="prac-rating">New</span>
        )}
      </div>
      {nextSlot && <div className="prac-card__next">Next: {nextSlot}</div>}
      <div className="prac-card__topics">
        {practitioner.topics.slice(0, 2).map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
      <div className="prac-card__price">From {practitioner.sessionTypes[0].price}</div>
    </div>
  )
}
