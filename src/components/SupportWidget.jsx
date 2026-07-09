import { useEffect, useRef, useState } from 'react'
import { useSupportTickets } from '../hooks/useSupportTickets.js'
import { streamChat } from '../lib/streamChat.js'

// Real chat now, same pattern as AtlasChat — calls
// netlify/functions/support-chat.mjs, grounded in faqs.js. "Talk to a real
// person" stays as the escape hatch for anything the FAQ data can't cover.
export default function SupportWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hi! Ask me anything about using the platform.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [ticketMode, setTicketMode] = useState(false)
  const [ticketMsg, setTicketMsg] = useState('')
  const [ticketContact, setTicketContact] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const logRef = useRef(null)
  const { raise } = useSupportTickets()

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const close = () => {
    setOpen(false)
    setTicketMode(false)
    setSubmitted(false)
    setTicketMsg('')
  }

  const send = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const nextMessages = [...messages, { role: 'user', text: trimmed }]
    // Empty placeholder bubble — shows as typing dots until the first
    // streamed chunk arrives, then fills in progressively.
    setMessages([...nextMessages, { role: 'model', text: '' }])
    setInput('')
    setLoading(true)

    try {
      let acc = ''
      await streamChat(
        '/api/support-chat',
        nextMessages.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
        (delta) => {
          acc += delta
          setMessages((prev) => {
            const copy = [...prev]
            copy[copy.length - 1] = { role: 'model', text: acc }
            return copy
          })
        },
        () => {
          acc = ''
          setMessages((prev) => {
            const copy = [...prev]
            copy[copy.length - 1] = { role: 'model', text: '' }
            return copy
          })
        }
      )
    } catch {
      setMessages((prev) => {
        const copy = [...prev]
        copy[copy.length - 1] = {
          role: 'model',
          text: "Sorry, I'm having trouble right now — try 'Talk to a real person' below.",
        }
        return copy
      })
    } finally {
      setLoading(false)
    }
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
                <div className="support-chat-log" ref={logRef}>
                  {messages.map((m, i) => {
                    const isStreamingEmpty =
                      loading && i === messages.length - 1 && m.role === 'model' && m.text === ''
                    return (
                      <div
                        key={i}
                        className={`bubble ${m.role === 'model' ? 'bubble--atlas' : 'bubble--me'}`}
                      >
                        {isStreamingEmpty ? (
                          <span className="typing-dots-inline">
                            <span className="typing-dot" />
                            <span className="typing-dot" />
                            <span className="typing-dot" />
                          </span>
                        ) : (
                          m.text
                        )}
                      </div>
                    )
                  })}
                </div>
                <form
                  className="chat-input-row"
                  style={{ maxWidth: 'none', margin: '10px 0 0' }}
                  onSubmit={(e) => {
                    e.preventDefault()
                    send(input)
                  }}
                >
                  <input
                    className="chat-input"
                    placeholder="Ask a question…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    autoFocus
                  />
                  <button className="chat-send" type="submit" disabled={loading || !input.trim()}>
                    →
                  </button>
                </form>
                <button className="support-ticket-btn" onClick={() => setTicketMode(true)}>
                  Talk to a real person →
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
