import { useState } from 'react'
import Mark from './Mark.jsx'
import AccountButton from './AccountButton.jsx'
import { DirectionIcon, ChatIcon, HeartIcon, ClockIcon, BriefcaseIcon, HelpIcon, MenuIcon } from './icons.jsx'

// Single source of truth for every nav destination. mobileBar: true items
// get a direct icon in the mobile bottom bar; the rest live behind the
// "More" sheet (5th bar slot) so the bar doesn't try to cram 7 icons into
// thumb-width — desktop has no such constraint and just shows all of them
// as a plain text-link row, unchanged from before.
const NAV_ITEMS = [
  { id: 'explore', label: 'Explore', icon: DirectionIcon, mobileBar: true },
  { id: 'atlas', label: 'Atlas.ai', icon: ChatIcon, mobileBar: true },
  { id: 'shortlist', label: 'Shortlist', icon: HeartIcon, mobileBar: true },
  { id: 'sessions', label: 'My Sessions', icon: ClockIcon, mobileBar: true },
  { id: 'practitioners', label: 'Practitioners', icon: BriefcaseIcon, mobileBar: false },
  { id: 'faqs', label: 'FAQs', icon: HelpIcon, mobileBar: false },
]

const BAR_ITEMS = NAV_ITEMS.filter((t) => t.mobileBar)
const MORE_ITEMS = NAV_ITEMS.filter((t) => !t.mobileBar)

export default function TopNav({ active, onNavigate, onAbout, user, onSignIn, onSignOut, onOpenProfile }) {
  const [moreOpen, setMoreOpen] = useState(false)
  // "About Us" isn't a `screen` value like the rest (see App.jsx's openAbout
  // special-casing), so it can't be matched via `active` — the caller's
  // onAbout is only ever invoked, never compared against.
  const moreActive = MORE_ITEMS.some((t) => t.id === active)

  const go = (id) => {
    setMoreOpen(false)
    onNavigate(id)
  }

  const goAbout = () => {
    setMoreOpen(false)
    onAbout()
  }

  return (
    <>
      <nav className="top-nav">
        <div className="top-nav__bar">
          <button className="top-nav__brand" onClick={() => onNavigate('explore')}>
            <Mark inverted size={26} />
            <span className="top-nav__wordmark">Lighthouse.guide</span>
          </button>

          <div className="top-nav__links">
            {NAV_ITEMS.map((tab) => (
              <button
                key={tab.id}
                className={`top-nav__link ${active === tab.id ? 'top-nav__link--active' : ''}`}
                onClick={() => onNavigate(tab.id)}
              >
                {tab.label}
              </button>
            ))}
            <button className="top-nav__link" onClick={onAbout}>
              About Us
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
        {BAR_ITEMS.map((tab) => {
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
        <button
          className={`bottom-tab-bar__item ${moreOpen || moreActive ? 'bottom-tab-bar__item--active' : ''}`}
          onClick={() => setMoreOpen(true)}
        >
          <MenuIcon size={20} />
          <span>More</span>
        </button>
      </nav>

      {moreOpen && (
        <div className="support-overlay nav-more-overlay" onClick={() => setMoreOpen(false)}>
          <div className="support-panel nav-more-panel" onClick={(e) => e.stopPropagation()}>
            <div className="support-panel__head">
              <span>More</span>
            </div>
            <div className="nav-more-list">
              {MORE_ITEMS.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    className={`nav-more-item ${active === tab.id ? 'nav-more-item--active' : ''}`}
                    onClick={() => go(tab.id)}
                  >
                    <Icon size={19} />
                    {tab.label}
                  </button>
                )
              })}
              <button className="nav-more-item" onClick={goAbout}>
                About Us
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
