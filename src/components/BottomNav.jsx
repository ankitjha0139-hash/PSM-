// Persistent nav shown once someone's past onboarding — this is what makes
// the product feel like an app rather than a stack of pages.
// Real SVG icons (stroke style, from the icon design review) instead of
// emoji: consistent weight across platforms, and Atlas gets a guiding-star
// mark instead of a generic chat bubble — it's a guide, not a chatroom.

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5L13 13L8.5 15.5L11 11L15.5 8.5Z" />
    </svg>
  )
}

function GuidingStarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4c.6 2.6 1.7 3.7 4.3 4.3-2.6.6-3.7 1.7-4.3 4.3-.6-2.6-1.7-3.7-4.3-4.3C10.3 7.7 11.4 6.6 12 4Z" />
      <circle cx="17.5" cy="16.5" r="1" />
      <circle cx="7" cy="18" r="0.6" />
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4h10v16l-5-3.5L7 20V4Z" />
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 20c1-3.8 4-5.5 6.5-5.5s5.5 1.7 6.5 5.5" />
    </svg>
  )
}

const TABS = [
  { id: 'explore', Icon: CompassIcon, label: 'Explore' },
  { id: 'atlas', Icon: GuidingStarIcon, label: 'Atlas' },
  { id: 'shortlist', Icon: BookmarkIcon, label: 'Shortlist' },
  { id: 'practitioners', Icon: PersonIcon, label: 'Practitioners' },
]

export default function BottomNav({ active, onNavigate }) {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ id, Icon, label }) => (
        <button
          key={id}
          className={`bottom-nav__item ${active === id ? 'bottom-nav__item--active' : ''}`}
          onClick={() => onNavigate(id)}
        >
          <span className="bottom-nav__icon">
            <Icon />
          </span>
          <span className="bottom-nav__label">{label}</span>
        </button>
      ))}
    </nav>
  )
}
