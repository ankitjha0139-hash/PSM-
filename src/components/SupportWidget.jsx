import { useEffect, useRef, useState } from 'react'
import { useSupportTickets } from '../hooks/useSupportTickets.js'
import { streamChat } from '../lib/streamChat.js'
import { CloseIcon, SendIcon, CheckIcon, ArrowRightIcon } from './icons.jsx'

// Real chat now, same pattern as AtlasChat — calls
// netlify/functions/support-chat.mjs, grounded in faqs.js. "Talk to a real
// person" stays as the escape hatch for anything the FAQ data can't cover.
export default function SupportWidget({ onOpenAbout }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "Hi, I'm Compass 👋 — ask me anything about using the platform, and if I can't help, I'll connect you to a real person.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [ticketMode, setTicketMode] = useState(false)
  const [ticketMsg, setTicketMsg] = useState('')
  const [ticketContact, setTicketContact] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState(false)
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
    setSendError(false)
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

  const submitTicket = async () => {
    if (!ticketMsg.trim() || sending) return
    setSending(true)
    setSendError(false)
    try {
      await raise(ticketMsg.trim(), ticketContact.trim())
      setSubmitted(true)
    } catch {
      setSendError(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <button
        className="compass-ribbon"
        onClick={() => setOpen(true)}
        aria-label="Open Compass, the help assistant"
      >
        Compass
      </button>

      {open && (
        <div className="support-overlay" onClick={close}>
          <div className="support-panel" onClick={(e) => e.stopPropagation()}>
            <div className="support-panel__head">
              <span>Compass · Help</span>
              <button className="support-close" onClick={close} aria-label="Close">
                <CloseIcon />
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
                    <SendIcon />
                  </button>
                </form>
                <button className="support-ticket-btn" onClick={() => setTicketMode(true)}>
                  Talk to a real person <ArrowRightIcon />
                </button>
                {onOpenAbout && (
                  <button
                    className="link-quiet"
                    style={{ margin: '10px auto 0', display: 'flex', justifyContent: 'center' }}
                    onClick={() => {
                      close()
                      onOpenAbout()
                    }}
                  >
                    Who's behind this? Our story <ArrowRightIcon size={11} />
                  </button>
                )}
              </>
            )}

            {ticketMode && !submitted && (
              <div className="support-ticket-form">
                {/* Changing your mind here used to mean closing the whole
                    widget (the only "back" was the X) — a real cancel path
                    that returns to the chat instead. */}
                <button
                  type="button"
                  className="link-quiet"
                  style={{ alignSelf: 'flex-start' }}
                  onClick={() => setTicketMode(false)}
                >
                  ← Back to chat
                </button>
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
                <button className="btn btn--primary" onClick={submitTicket} disabled={sending}>
                  {sending ? 'Sending…' : 'Send'}
                </button>
                {sendError && (
                  <p className="demo-flag" style={{ color: 'var(--destructive)' }}>
                    Couldn't send just now — check your connection and try again.
                  </p>
                )}
              </div>
            )}

            {submitted && (
              <div className="support-confirm">
                <div className="support-confirm__check">
                  <CheckIcon size={20} />
                </div>
                <p>Got it — your message has reached our team. We'll get back to you.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
