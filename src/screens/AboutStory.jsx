import Mark from '../components/Mark.jsx'

// Our story — placeholder copy in the team's voice; rewrite freely, the
// layout doesn't care. Names/photos section gets added when the team
// confirms who appears.
export default function AboutStory({ onBack }) {
  return (
    <main className="screen screen--scroll">
      <button className="link-back" onClick={onBack} aria-label="Back">
        ←
      </button>

      <div className="about-head">
        <Mark size={40} />
        <h2 className="detail-title">Why we built this</h2>
      </div>

      <div className="section">
        <p className="section__text">
          We're a team of MBA students, and not long ago we were exactly who this
          product is for — teenagers making irreversible decisions with almost no
          real information.
        </p>
      </div>

      <div className="section">
        <p className="section__text">
          Some of us got lucky: an uncle who was an architect, a neighbour who
          could explain what CA articleship actually pays. Others picked streams
          because "that's what toppers do" and found out years later what doors
          had quietly closed. The difference between those two stories was never
          talent. It was access to one honest conversation at the right time.
        </p>
      </div>

      <div className="section">
        <p className="section__text">
          So that's what we're building: every path laid out honestly — the fees,
          the odds, the parts nobody advertises — and real people who've lived
          those paths, one call away. No coaching-institute commissions, no
          sugar-coating. We get paid for the conversation, not for steering you
          anywhere.
        </p>
      </div>

      <div className="callout callout--honest">
        <span className="callout__label">🌱 Where we are</span>
        <p className="callout__body">
          This is early — a real product being built in public by students, for
          students. Some corners are still rough. If something's broken or
          confusing, tell us through the help button; we read everything.
        </p>
      </div>
    </main>
  )
}
