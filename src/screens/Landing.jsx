import Mark from '../components/Mark.jsx'
import { ArrowRightIcon } from '../components/icons.jsx'

// The lighthouse intro video is gone for now — it fought the current
// aesthetic and behaved inconsistently across desktop fullscreen and
// mobile. Welcome content shows immediately instead. A proper animated
// welcome (text transitions, "Welcome to Lighthouse.guide" -> the
// question) is the planned replacement, not this — this is the interim
// simple state.
export default function Landing({ onStart, onStory }) {
  return (
    <main className="screen screen--center">
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
          Get started <ArrowRightIcon />
        </button>
        <button className="link-quiet" onClick={onStory}>
          Our story <ArrowRightIcon size={11} />
        </button>
      </div>
    </main>
  )
}
