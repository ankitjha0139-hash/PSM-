// Persistent nav shown once someone's past onboarding — this is what makes
// the product feel like an app rather than a stack of pages.
const TABS = [
  { id: 'explore', emoji: '🧭', label: 'Explore' },
  { id: 'atlas', emoji: '💬', label: 'Atlas' },
  { id: 'shortlist', emoji: '⭐', label: 'Shortlist' },
  { id: 'practitioners', emoji: '🧑‍💼', label: 'Practitioners' },
]

export default function BottomNav({ active, onNavigate }) {
  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`bottom-nav__item ${active === tab.id ? 'bottom-nav__item--active' : ''}`}
          onClick={() => onNavigate(tab.id)}
        >
          <span className="bottom-nav__emoji">{tab.emoji}</span>
          <span className="bottom-nav__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
