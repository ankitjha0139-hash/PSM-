import Mark from '../components/Mark.jsx'
import { BackIcon } from '../components/icons.jsx'

// Our story — one founder's account of why Lighthouse exists, told in first
// person because that's how it actually happened; the team behind it is
// listed at the end rather than named mid-story.
export default function AboutStory({ onBack }) {
  return (
    <main className="screen screen--scroll">
      <button className="link-back" onClick={onBack} aria-label="Back">
        <BackIcon />
      </button>

      <div className="about-head">
        <Mark size={40} />
        <h2 className="detail-title">Why we built this</h2>
      </div>

      <div className="section">
        <p className="section__text">
          As a kid, I never had a "thing." I loved mathematics, literature,
          history — all at once, with no clear direction. So I did what most
          confused kids do: I picked engineering, because my parents said it had
          "good job opportunities" and everything else sounded like a risk
          nobody wanted to take. I didn't like engineering. I went into a
          corporate IT job after that, and I didn't like that either.
        </p>
      </div>

      <div className="section">
        <p className="section__text">
          Then I came to business school, and somewhere between marketing
          frameworks, psychology, and economics, something clicked. I remember
          thinking: I wish I'd known this career existed when I was fifteen.
          Nobody had ever laid it out for me as an option. I hadn't lacked
          interest or ability — I'd lacked information, at the age when it
          would have actually mattered.
        </p>
      </div>

      <div className="section">
        <p className="section__text">
          That story isn't unique. The specifics change — for someone it's an
          uncle who happened to be an architect, for someone else it's a stream
          chosen because "that's what toppers do." But underneath, so many of
          us carry the same quiet sentence: if only I'd known about this
          earlier. That sentence is what we're building against.
        </p>
      </div>

      <div className="section">
        <p className="section__text">
          We want a fifteen-year-old today to have what we didn't — every path
          laid out honestly: the fees, the odds, the parts nobody advertises —
          and real people who've lived those paths, one conversation away. No
          commissions, no steering, no sugar-coating. Just the truth about
          what's out there, early enough for it to matter.
        </p>
      </div>

      <div className="section">
        <p className="section__text">
          We call it Lighthouse. Our real objective isn't growth or revenue —
          it's simpler than that. We want to minimize the number of people who,
          a few years from now, are still saying if only I knew.
        </p>
      </div>

      <div className="callout callout--honest">
        <span className="callout__label">Built by</span>
        <p className="callout__body">
          That's my story — but turning it into something real took all of us:
          Devashish Jose, Polaki Dinesh, Ankit Kumar Jha, Akhil Jose, Jesika
          Maroti, Debadrita Das, and Sourav Sonowal, MBA students at IIM
          Udaipur, building this in public. Some corners are still rough; if
          something's broken or confusing, tell us through the help button —
          we read everything.
        </p>
      </div>

      <div className="section">
        <p className="section__text">
          Want to reach us directly instead? Email{' '}
          <a href="mailto:devashish.jose.2025@iimu.ac.in">
            devashish.jose.2025@iimu.ac.in
          </a>
          .
        </p>
      </div>
    </main>
  )
}
