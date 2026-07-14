import { useState } from 'react'
import { CheckIcon, BackIcon, ArrowRightIcon } from '../components/icons.jsx'
import { submitNetlifyForm } from '../lib/netlifyForms.js'

// The practitioner-side entry — a real application flow now, not a
// placeholder. Applications go through the Netlify Forms pipe (dashboard
// -> Forms -> practitioner-application); we vet on a call and add accepted
// people to the directory by hand. No practitioner dashboard until volume
// justifies one — the team IS the dashboard at this stage.

const PERKS = [
  { title: 'Get paid for your time', body: 'You set your session prices — students book 15–45 min calls.' },
  { title: 'Talk about what you’ve lived', body: 'No prep, no slides. Your honest experience is the product.' },
  { title: 'Stay low-commitment', body: 'You choose your slots. A few calls a month is plenty.' },
]

export default function PractitionerPlaceholder({ onBack }) {
  const [step, setStep] = useState('pitch') // pitch → form → done
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [topics, setTopics] = useState('')
  const [contact, setContact] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState(false)

  const canSubmit = name.trim() && role.trim() && contact.trim() && !sending

  const submit = async () => {
    if (!canSubmit) return
    setSending(true)
    setSendError(false)
    try {
      await submitNetlifyForm('practitioner-application', {
        name: name.trim(),
        role: role.trim(),
        topics: topics.trim(),
        contact: contact.trim(),
      })
      setStep('done')
    } catch {
      setSendError(true)
    } finally {
      setSending(false)
    }
  }

  if (step === 'done') {
    return (
      <main className="screen screen--center">
        <div className="prac-confirm-check">
          <CheckIcon size={26} />
        </div>
        <h2 className="screen__title screen__title--md">Application received!</h2>
        <p className="screen__sub">
          Thanks, {name.trim().split(' ')[0]} — our team will reach out on {contact.trim()} for a
          short intro call. That's the whole process: one honest conversation.
        </p>
        <button className="btn btn--primary" onClick={onBack}>
          Done
        </button>
      </main>
    )
  }

  if (step === 'form') {
    return (
      <main className="screen screen--scroll">
        <button className="link-back" onClick={() => setStep('pitch')} aria-label="Back">
          <BackIcon />
        </button>
        <div className="screen__body">
          <h2 className="screen__title screen__title--md">Tell us about you</h2>
          <input
            className="search-input"
            style={{ margin: 0 }}
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <input
            className="search-input"
            style={{ margin: 0 }}
            placeholder="Current role & company (e.g. CA, partner at a firm)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <textarea
            className="support-textarea"
            rows={3}
            placeholder="What can you talk honestly about? (exams you cleared or failed, what the work is really like, pay…)"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
          />
          <input
            className="search-input"
            style={{ margin: 0 }}
            placeholder="WhatsApp number or email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <button className="btn btn--primary" disabled={!canSubmit} onClick={submit}>
            {sending ? 'Sending…' : <>Apply <ArrowRightIcon /></>}
          </button>
          {sendError && (
            <p className="booking-note" style={{ color: 'var(--destructive)' }}>
              Couldn't send just now — check your connection and try again.
            </p>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="screen">
      <button className="link-back" onClick={onBack} aria-label="Back">
        <BackIcon />
      </button>
      <div className="screen__body">
        <h2 className="screen__title screen__title--md">
          You've walked a path. Light it for someone else.
        </h2>
        <p className="screen__sub" style={{ margin: 0 }}>
          Students don't need another lecture — they need twenty honest minutes
          with someone who's actually done the job.
        </p>
        <div className="choice-list">
          {PERKS.map((p) => (
            <div key={p.title} className="perk-card">
              <span className="perk-card__title">{p.title}</span>
              <span className="perk-card__body">{p.body}</span>
            </div>
          ))}
        </div>
        <button className="btn btn--primary" onClick={() => setStep('form')}>
          Apply to join <ArrowRightIcon />
        </button>
      </div>
    </main>
  )
}
