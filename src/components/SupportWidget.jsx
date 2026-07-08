import { useMemo, useState } from 'react'
import { faqs } from '../data/faqs.js'
import { useSupportTickets } from '../hooks/useSupportTickets.js'

// Simple keyword scoring — no LLM needed for v1. Swappable later for real
// matching without changing how this component is used.
function searchFaqs(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return faqs
    .map((f) => {
      let score = 0
      if (f.q.toLowerCase().includes(q)) score += 3
      f.keywords.forEach((k) => {
        if (q.includes(k) || k.includes(q)) score += 2
      })
      return { ...f, score }
    })
    .filter((f) => f.score > 0)
    .sort((a, b) => b.score - a.score)
}

export default function SupportWidget() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [ticketMode, setTicketMode] = useState(false)
  const [ticketMsg, setTicketMsg] = useState('')
  const [ticketContact, setTicketContact] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { raise } = useSupportTickets()

  const results = useMemo(() => searchFaqs(query), [query])

  const close = () => {
    setOpen(false)
    setTicketMode(false)
    setSubmitted(false)
    setQuery('')
    setTicketMsg('')
  }

  const submitTicket = () => {
    if (!ticketMsg.trim()) return
    raise(ticketMsg.trim(), ticketContact.trim())
    setSubmitted(true)
  }

  return (
    <>
      <button className="support-fab" onClick={() => setOpen(true)} aria-label="Get help">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.5997 3.41827 15.1054 4.15224 16.4114L3 21L7.58862 19.8478C8.89464 20.5817 10.4003 21 12 21Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 9.5C9.5 8.4 10.4 7.5 11.7 7.5C12.9 7.5 13.9 8.3 13.9 9.3C13.9 10.9 12 10.7 12 12.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="12" cy="15.3" r="0.9" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <div className="support-overlay" onClick={close}>
          <div className="support-panel" onClick={(e) => e.stopPropagation()}>
            <div className="support-panel__head">
              <span>How can we help?</span>
              <button className="support-close" onClick={close} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6L18 18M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {!ticketMode && !submitted && (
              <>
                <input
                  className="support-search"
                  placeholder="Type a question…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                <div className="support-results">
                  {results.map((f) => (
                    <div key={f.id} className="support-faq">
                      <div className="support-faq__q">{f.q}</div>
                      <div className="support-faq__a">{f.a}</div>
                    </div>
                  ))}
                  {query.trim() && results.length === 0 && (
                    <p className="support-empty">No matching answer yet.</p>
                  )}
                </div>
                <button className="support-ticket-btn" onClick={() => setTicketMode(true)}>
                  Didn't find your answer? Ask a real person →
                </button>
              </>
            )}

            {ticketMode && !submitted && (
              <div className="support-ticket-form">
                <textarea
                  className="support-textarea"
                  placeholder="What do you need help with?"
                  value={ticketMsg}
                  onChange={(e) => setTicketMsg(e.target.value)}
                  rows={3}
                  autoFocus
                />
                <input
                  className="support-search"
                  placeholder="Email or phone (optional)"
                  value={ticketContact}
                  onChange={(e) => setTicketContact(e.target.value)}
                />
                <button className="btn btn--primary" onClick={submitTicket}>
                  Send
                </button>
              </div>
            )}

            {submitted && (
              <div className="support-confirm">
                <div className="support-confirm__check">✓</div>
                <p>Got it — someone from our team will get back to you.</p>
                <p className="demo-flag">
                  ⚠ Demo only: this is saved locally for now, not yet sent anywhere real.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
