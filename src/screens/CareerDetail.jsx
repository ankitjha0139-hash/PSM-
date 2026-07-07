import { useState } from 'react'

// Turns the schema fields into a step-by-step "how to get there" — this is
// what serves the "I know exactly what I want" case, folded into the detail
// page instead of a separate roadmap screen (see App.jsx comment). Lives
// inside a collapsible section (see below) so it doesn't dominate the page.
function buildSteps(career) {
  const steps = [
    {
      title: 'Right now',
      body: career.requires_maths
        ? "Keep Maths — it's required for this path."
        : career.subjects_required?.length
          ? `Focus on: ${career.subjects_required.join(', ')}`
          : 'No specific subjects required — any stream works.',
    },
  ]
  if (career.exams?.length) {
    steps.push({
      title: 'Clear the gate',
      body: `Exam(s): ${career.exams.join(', ')}${
        career.decision_timeline ? ` — ${career.decision_timeline}` : ''
      }`,
    })
  }
  steps.push({ title: 'Study / train', body: `${career.duration_years} · ${career.colleges_route}` })
  steps.push({
    title: 'First job',
    body: `${career.roles?.[0] || 'Entry role'} · ${career.entry_pay}`,
  })
  return steps
}

export default function CareerDetail({
  career,
  shortlisted,
  onToggleShortlist,
  onBack,
  onTalkToPractitioner,
}) {
  const [howOpen, setHowOpen] = useState(false)
  if (!career) return null
  const steps = buildSteps(career)
  const primaryRole = career.roles?.[0] || career.title

  return (
    <main className="screen screen--scroll">
      <button className="link-back" onClick={onBack} aria-label="Back">
        ←
      </button>

      <div className="detail-head">
        <span className={`stream-badge stream-badge--${career.stream.toLowerCase()}`}>
          {career.stream}
        </span>
        <h2 className="detail-title">{career.title}</h2>
        <p className="detail-tagline">{career.what_it_is}</p>
      </div>

      <div className="metric-grid">
        <div className="metric">
          <span className="metric__k">Entry pay</span>
          <span className="metric__v">{career.entry_pay}</span>
        </div>
        <div className="metric">
          <span className="metric__k">Fees</span>
          <span className="metric__v">{career.fees}</span>
        </div>
        <div className="metric">
          <span className="metric__k">Duration</span>
          <span className="metric__v">{career.duration_years}</span>
        </div>
        <div className="metric">
          {/* Short bucketed value here, not the full years_to_first_income
              sentence — that long text was overflowing this small tile on
              mobile. The full sentence still shows inside the "What do I
              do" accordion below. */}
          <span className="metric__k">Time to earn</span>
          <span className="metric__v">{career.time_bucket}</span>
        </div>
      </div>

      {/* Collapsed by default — this used to be an always-open callout +
          a full roadmap, which felt "too much in the face" and visually
          disproportionate next to the compact sections below it. */}
      <div className="section">
        <button className="accordion-trigger" onClick={() => setHowOpen((v) => !v)}>
          <span>👉 What do I do to become {/^[aeiou]/i.test(primaryRole) ? 'an' : 'a'} {primaryRole}?</span>
          <span className={`accordion-chevron ${howOpen ? 'accordion-chevron--open' : ''}`}>▾</span>
        </button>
        {howOpen && (
          <div className="accordion-body">
            {career.next_action && <p className="accordion-lead">{career.next_action}</p>}
            <ol className="roadmap">
              {steps.map((s, i) => (
                <li key={i} className="roadmap__step">
                  <span className="roadmap__num">{i + 1}</span>
                  <div>
                    <div className="roadmap__title">{s.title}</div>
                    <div className="roadmap__body">{s.body}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <div className="section">
        <h3 className="section__h">Roles you could get</h3>
        <div className="tag-row">
          {career.roles.map((r) => (
            <span key={r} className="tag">
              {r}
            </span>
          ))}
        </div>
      </div>

      {career.doors_opened?.length > 0 && (
        <div className="section">
          <h3 className="section__h">Doors this opens</h3>
          <div className="tag-row">
            {career.doors_opened.map((d) => (
              <span key={d} className="tag tag--open">
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {career.honest_note && (
        <div className="callout callout--honest">
          <span className="callout__label">🎯 The honest bit</span>
          <p className="callout__body">{career.honest_note}</p>
        </div>
      )}

      {career.govt_job_overlap && (
        <div className="section">
          <h3 className="section__h">Government job route</h3>
          <p className="section__text">{career.govt_job_overlap}</p>
        </div>
      )}

      {career.resources?.length > 0 && (
        <div className="section">
          <h3 className="section__h">Learn more</h3>
          <div className="resource-list">
            {career.resources.map((r) => (
              <a key={r.url} className="resource-item" href={r.url} target="_blank" rel="noreferrer">
                <span className="resource-item__label">{r.label} ↗</span>
                <span className="resource-item__note">{r.note}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="detail-actions">
        <button className="btn btn--primary" onClick={onTalkToPractitioner}>
          Talk to a real {primaryRole} →
        </button>
        <button
          className={`btn btn--ghost ${shortlisted ? 'btn--ghost-on' : ''}`}
          onClick={() => onToggleShortlist(career.id)}
        >
          {shortlisted ? '♥ Shortlisted' : '♡ Add to shortlist'}
        </button>
      </div>
    </main>
  )
}
