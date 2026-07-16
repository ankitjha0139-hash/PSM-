import { useEffect, useState } from 'react'
import { ArrowRightIcon } from '../components/icons.jsx'

// Intro sequence: the lighthouse draws in stroke-by-stroke, "Welcome to
// Lighthouse.guide" types in beside it, the two rise together from center
// screen to their resting spot, then the title/subtitle/button fade in as
// one group. Shown once per browser tab session, skipped for
// prefers-reduced-motion, and tapping anywhere jumps straight to the end.
const INTRO_KEY = 'introShown'

const WELCOME_TEXT = 'Welcome to Lighthouse.guide'
const LETTER_BASE_DELAY = 0.9
const LETTER_STEP = 0.032

// Local copy of Mark's glyph so each stroke can carry its own draw-on
// delay — Mark.jsx stays the animation-free source of truth for the icon
// used everywhere else in the app.
function LandingIcon() {
  return (
    <svg viewBox="0 0 32 32" width={40} height={40} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--navy)" />
      <g fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path className="landing-icon-draw" style={{ animationDelay: '0s' }} d="M11.5,27 L13.7,10.2 M20.5,27 L18.3,10.2 M11.5,27 L20.5,27" />
        <path className="landing-icon-draw" style={{ animationDelay: '0.12s' }} d="M12.6,20 L19.4,20 M13.1,16 L18.9,16" />
        <rect className="landing-icon-draw" style={{ animationDelay: '0.22s' }} x="13.5" y="7" width="5" height="3.2" rx="0.7" />
        <path className="landing-icon-draw" style={{ animationDelay: '0.32s' }} d="M13.2,7 L16,4.2 L18.8,7" />
        <path className="landing-icon-draw" style={{ animationDelay: '0.42s' }} d="M13,8 L9.7,7 M12.6,10 L9,10.4 M19,8 L22.3,7 M19.4,10 L23,10.4" />
      </g>
    </svg>
  )
}

function AnimatedWelcome() {
  return (
    <p className="landing-eyebrow">
      {WELCOME_TEXT.split('').map((ch, i) => (
        <span
          key={i}
          className="landing-letter"
          style={{ animationDelay: `${LETTER_BASE_DELAY + i * LETTER_STEP}s` }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </p>
  )
}

export default function Landing({ onStart }) {
  const [isStatic, setIsStatic] = useState(() =>
    Boolean(sessionStorage.getItem(INTRO_KEY)) ||
    Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  )

  useEffect(() => {
    sessionStorage.setItem(INTRO_KEY, '1')
  }, [])

  const skip = () => setIsStatic(true)

  return (
    <main className={`screen screen--center${isStatic ? ' landing--static' : ''}`} onClick={skip}>
      <div className="landing-lockup">
        <LandingIcon />
        <AnimatedWelcome />
      </div>
      <div className="landing-rest">
        <h1 className="screen__title">See the hidden paths.</h1>
        <p className="screen__sub">
          Then navigate them with people who have walked them before you.
        </p>
        <button className="btn btn--primary" onClick={onStart}>
          Get started <ArrowRightIcon />
        </button>
      </div>
    </main>
  )
}
