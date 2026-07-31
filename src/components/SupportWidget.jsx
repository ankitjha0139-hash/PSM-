import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Compass as CompassIcon, X, PaperPlaneRight, ArrowRight, Check } from '@phosphor-icons/react'
import { useSupportTickets } from '../hooks/useSupportTickets.js'
import { streamChat } from '../lib/streamChat.js'

const GREETING = {
  role: 'model',
  text: "Hi, I'm Compass 👋 — ask me anything about using the platform, and if I can't help, I'll connect you to a real person.",
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="Compass is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-900/40"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </span>
  )
}

export default function SupportWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([GREETING])
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
  const reduceMotion = useReducedMotion()

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
    } catch (err) {
      const detail = import.meta.env.DEV ? ` (${err.message})` : ''
      setMessages((prev) => {
        const copy = [...prev]
        copy[copy.length - 1] = {
          role: 'model',
          text: `Sorry, I'm having trouble right now${detail} — try "Talk to a real person" below.`,
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
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open Compass, the help assistant"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-indigo-900 px-4 py-3 text-sm font-semibold text-cream shadow-lift hover:bg-indigo-800"
      >
        <CompassIcon size={18} weight="fill" /> Compass
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-indigo-950/30 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Compass, the help assistant"
              className="fixed bottom-0 right-0 flex h-[85vh] w-full flex-col rounded-t-3xl border border-indigo-900/10 bg-cream p-5 shadow-lift sm:bottom-5 sm:right-5 sm:h-[520px] sm:w-96 sm:rounded-3xl"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-display text-lg font-semibold text-indigo-900">
                  <CompassIcon size={18} weight="fill" /> Compass
                </span>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-indigo-900/5"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {!ticketMode && !submitted && (
                <>
                  <div ref={logRef} className="mt-4 flex-1 space-y-3 overflow-y-auto">
                    {messages.map((m, i) => {
                      const isStreamingEmpty = loading && i === messages.length - 1 && m.role === 'model' && m.text === ''
                      const isUser = m.role === 'user'
                      return (
                        <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                              isUser ? 'rounded-br-sm bg-indigo-900 text-cream' : 'rounded-bl-sm bg-white text-ink shadow-soft'
                            }`}
                          >
                            {isStreamingEmpty ? <TypingDots /> : m.text}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      send(input)
                    }}
                    className="mt-3 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Ask a question…"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={loading}
                      className="min-h-11 w-full rounded-full border border-indigo-900/15 bg-white/70 px-4 py-2 text-sm text-ink placeholder:text-ink-faint focus-visible:border-indigo-500 disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={loading || !input.trim()}
                      aria-label="Send"
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-indigo-900 text-cream disabled:opacity-40"
                    >
                      <PaperPlaneRight size={16} weight="fill" />
                    </button>
                  </form>

                  <button
                    type="button"
                    onClick={() => setTicketMode(true)}
                    className="mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold text-indigo-900 hover:opacity-80"
                  >
                    Talk to a real person <ArrowRight size={14} weight="bold" />
                  </button>
                </>
              )}

              {ticketMode && !submitted && (
                <div className="mt-4 flex flex-1 flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => setTicketMode(false)}
                    className="self-start text-sm font-medium text-ink-soft hover:text-indigo-900"
                  >
                    ← Back to chat
                  </button>
                  <textarea
                    rows={3}
                    placeholder="What do you need help with?"
                    value={ticketMsg}
                    onChange={(e) => setTicketMsg(e.target.value)}
                    className="min-h-24 w-full rounded-2xl border border-indigo-900/15 bg-white/70 px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus-visible:border-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Email or phone (optional)"
                    value={ticketContact}
                    onChange={(e) => setTicketContact(e.target.value)}
                    className="min-h-11 w-full rounded-full border border-indigo-900/15 bg-white/70 px-4 py-2 text-sm text-ink placeholder:text-ink-faint focus-visible:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={submitTicket}
                    disabled={sending || !ticketMsg.trim()}
                    className="min-h-11 rounded-full bg-indigo-900 px-5 py-2.5 text-sm font-semibold text-cream disabled:opacity-50"
                  >
                    {sending ? 'Sending…' : 'Send'}
                  </button>
                  {sendError && (
                    <p className="text-sm text-red-600">Couldn't send just now — check your connection and try again.</p>
                  )}
                </div>
              )}

              {submitted && (
                <div className="mt-8 flex flex-1 flex-col items-center justify-center text-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-sage-50 text-sage-600">
                    <Check size={22} weight="bold" />
                  </span>
                  <p className="mt-4 text-sm text-ink-soft">
                    Got it — your message has reached our team. We'll get back to you.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
