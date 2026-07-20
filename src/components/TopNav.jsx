import Mark from './Mark.jsx'
import AccountButton from './AccountButton.jsx'
import { DirectionIcon, ChatIcon, HeartIcon, BriefcaseIcon } from './icons.jsx'

// Full-width dark bar (sui.io-style), shown at desktop widths only —
// below 768px it's hidden entirely (including "About") in favor of a
// WhatsApp-style bottom tab bar, since four text links plus the wordmark
// and account slot never fit in one row on a phone.
const TABS = [
  { id: 'explore', label: 'Explore', icon: DirectionIcon },
  { id: 'atlas', label: 'Atlas.ai', icon: ChatIcon },
  { id: 'shortlist', label: 'Shortlist', icon: HeartIcon },
  { id: 'practitioners', label: 'Practitioners', icon: BriefcaseIcon },
]

export default function TopNav({ active, onNavigate, onAbout, user, onSignIn, onSignOut, onOpenProfile }) {
  return (
    <>
      <nav className="top-nav">
        <div className="top-nav__bar">
          <button className="top-nav__brand" onClick={() => onNavigate('explore')}>
            <Mark inverted size={26} />
            <span className="top-nav__wordmark">Lighthouse.guide</span>
          </button>

          <div className="top-nav__links">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`top-nav__link ${active === tab.id ? 'top-nav__link--active' : ''}`}
                onClick={() => onNavigate(tab.id)}
              >
                {tab.label}
              </button>
            ))}
            <button className="top-nav__link" onClick={onAbout}>
              About
            </button>
          </div>

          <div className="top-nav__right">
            <AccountButton
              variant="embedded"
              user={user}
              onSignIn={onSignIn}
              onSignOut={onSignOut}
              onOpenProfile={onOpenProfile}
            />
          </div>
        </div>
      </nav>

      {/* WhatsApp-style bottom tab bar — mobile only (see .bottom-tab-bar's
          768px breakpoint); the account slot on mobile is the standalone
          floating AccountButton rendered by App.jsx instead, since it isn't
          tied to this bar's layout. */}
      <nav className="bottom-tab-bar">
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              className={`bottom-tab-bar__item ${active === tab.id ? 'bottom-tab-bar__item--active' : ''}`}
              onClick={() => onNavigate(tab.id)}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
