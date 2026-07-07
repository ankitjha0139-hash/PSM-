import { useState } from 'react'
import { careerPaths } from '../data/careerPaths.js'
import CareerCard from '../components/CareerCard.jsx'

// SCRIPTED FOR NOW — a small decision tree, not a live call to Gemini.
// Wiring the real LLM needs a serverless function so the API key never
// sits in browser code; that's a separate, later piece of work. This
// screen exists so the hand-off and conversational feel are real to test
// before that backend exists.
const STEPS = [
  {
    id: 'interest',
    atlas: "Hey, I'm Atlas 👋 Let's figure this out together — no pressure. What kind of things do you enjoy?",
    options: [
      { id: 'creative', label: 'Creative things' },
      { id: 'tech', label: 'Tech & building things' },
      { id: 'business', label: 'Business & numbers' },
    ],
  },
  {
    id: 'maths',
    atlas: 'Got it. Quick one — does Maths make you nervous?',
    options: [
      { id: 'yes', label: "Yes, I'd rather avoid it" },
      { id: 'no', label: "No, I'm fine with it" },
    ],
  },
]

export default function AtlasChat({ shortlist, onOpenDetail }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [messages, setMessages] = useState([{ from: 'atlas', text: STEPS[0].atlas }])

  const done = step >= STEPS.length

  const results = done
    ? careerPaths.filter((c) => {
        if (answers.interest && !c.interest_tags.includes(answers.interest)) return false
        if (answers.maths === 'yes' && c.requires_maths) return false
        return true
      })
    : []

  const pick = (optionId, label) => {
    setMessages((prev) => [...prev, { from: 'me', text: label }])
    setAnswers((prev) => ({ ...prev, [STEPS[step].id]: optionId }))

    const next = step + 1
    if (next < STEPS.length) {
      setMessages((prev) => [...prev, { from: 'atlas', text: STEPS[next].atlas }])
    } else {
      setMessages((prev) => [...prev, { from: 'atlas', text: "Here's what I found for you 👇" }])
    }
    setStep(next)
  }

  return (
    <main className="screen screen--scroll">
      <h2 className="screen__title screen__title--md">Atlas</h2>

      <div className="chat-log">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.from === 'atlas' ? 'bubble--atlas' : 'bubble--me'}`}>
            {m.text}
          </div>
        ))}
      </div>

      {!done && (
        <div className="chip-row">
          {STEPS[step].options.map((opt) => (
            <button key={opt.id} className="chip" onClick={() => pick(opt.id, opt.label)}>
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {done && (
        <div className="career-grid">
          {results.map((c) => (
            <CareerCard
              key={c.id}
              career={c}
              shortlisted={shortlist.has(c.id)}
              onToggleShortlist={shortlist.toggle}
              onOpen={onOpenDetail}
            />
          ))}
          {results.length === 0 && (
            <p className="empty-state">Nothing matched exactly — try Explore instead.</p>
          )}
        </div>
      )}
    </main>
  )
}
