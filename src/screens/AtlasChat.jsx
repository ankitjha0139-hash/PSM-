import { useEffect, useRef, useState } from 'react'
import { streamChat } from '../lib/streamChat.js'

// Real, streamed conversation — calls netlify/functions/atlas-chat.mjs,
// which talks to Gemini server-side (key never reaches the browser) and
// answers grounded in our own career data. Replies stream in token by
// token (a real "typing" effect) rather than appearing all at once.

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
      text: "Hi, I'm Atlas 👋 I'll be your guide on this journey — ask me anything, and let's find some clarity on the path ahead.",
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
    // Empty placeholder bubble — shows as typing dots until the first
    // streamed chunk arrives, then fills in progressively.
    setMessages([...nextMessages, { role: 'model', text: '' }])
    setInput('')
    setLoading(true)

    try {
      let acc = ''
      await streamChat(
        '/api/atlas-chat',
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
          // First attempt failed — reset so the retry starts clean
          // instead of appending onto a partial reply.
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
          text: "Sorry, I'm having trouble connecting right now. Try again in a moment, or explore careers directly from the Explore tab.",
        }
        return copy
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="screen screen--scroll">
      <h2 className="screen__title screen__title--md">Atlas</h2>

      <div className="chat-log" ref={logRef}>
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
