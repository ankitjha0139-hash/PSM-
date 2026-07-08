import { useEffect, useRef, useState } from 'react'

// Real conversation now — calls netlify/functions/atlas-chat.mjs, which
// talks to Gemini server-side (key never reaches the browser) and answers
// grounded in our own career data. The old fixed 2-question decision tree
// doesn't make sense anymore now that Atlas can genuinely understand
// free text — starters below are just a nudge for anyone unsure what to ask.
const STARTERS = [
  "I like creative things but I'm not sure what job that means",
  'What careers don’t need Maths?',
  'How do I become a Chartered Accountant?',
]

function SendIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12L20 4L14 20L11 13L4 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function AtlasChat() {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "Hey, I'm Atlas 👋 Let's figure this out together — ask me anything, or tap a suggestion below to start.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const logRef = useRef(null)

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const nextMessages = [...messages, { role: 'user', text: trimmed }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/atlas-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      setMessages((prev) => [...prev, { role: 'model', text: data.reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: "Sorry, I'm having trouble connecting right now. Try again in a moment, or explore careers directly from the Explore tab.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const showStarters = messages.length === 1

  return (
    <main className="screen screen--scroll">
      <h2 className="screen__title screen__title--md">Atlas</h2>

      <div className="chat-log" ref={logRef}>
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role === 'model' ? 'bubble--atlas' : 'bubble--me'}`}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="bubble bubble--atlas bubble--typing">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        )}
      </div>

      {showStarters && (
        <div className="chip-row">
          {STARTERS.map((s) => (
            <button key={s} className="chip" onClick={() => send(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        className="chat-input-row"
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
      >
        <input
          className="chat-input"
          placeholder="Ask Atlas anything…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          className="chat-send"
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send"
        >
          <SendIcon />
        </button>
      </form>
    </main>
  )
}
