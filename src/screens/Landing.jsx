import Mark from '../components/Mark.jsx'

export default function Landing({ onStart }) {
  return (
    <main className="screen screen--center">
      <Mark />
      <h1 className="screen__title">What could you become?</h1>
      <p className="screen__sub">
        Nobody figures this out alone. Whatever's next for you — we'll help
        you see what's possible, and talk to people who've already found
        their way.
      </p>
      <button className="btn btn--primary" onClick={onStart}>
        Get started →
      </button>
    </main>
  )
}
