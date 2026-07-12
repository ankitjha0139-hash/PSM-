import { useState } from 'react'
import Mark from '../components/Mark.jsx'

// Shown once per browser tab session (sessionStorage), not on every mount —
// otherwise tapping "back" from the Role gate would replay the whole intro
// video every single time, which is wasteful and gets old fast.
const INTRO_KEY = 'introShown'

export default function Landing({ onStart, onStory }) {
  const [phase, setPhase] = useState(() =>
    sessionStorage.getItem(INTRO_KEY) ? 'cta' : 'video'
  )

  const goCta = () => {
    sessionStorage.setItem(INTRO_KEY, '1')
    setPhase('cta')
  }

  return (
    <main className="screen screen--center">
      {phase === 'video' && (
        <div className="landing-video-wrap">
          <video
            className="landing-video"
            src="/video/lighthouse-intro.mp4"
            autoPlay
            muted
            playsInline
            onEnded={goCta}
          />
          <button className="landing-skip" onClick={goCta}>
            Skip →
          </button>
        </div>
      )}

      {phase === 'cta' && (
        <div className="landing-fade-in">
          <Mark />
          <p className="landing-eyebrow">Welcome to Lighthouse.guide</p>
          <h1 className="screen__title">What could you become?</h1>
          <p className="screen__sub">
            We map every career path open to you — clearly and honestly —
            then connect you with real people who've lived it. Nobody
            figures this out alone.
          </p>
          <button className="btn btn--primary" onClick={onStart}>
            Get started →
          </button>
          <button className="link-quiet" onClick={onStory}>
            Our story →
          </button>
        </div>
      )}
    </main>
  )
}
