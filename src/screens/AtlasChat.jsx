import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { PaperPlaneRight, Sparkle } from '@phosphor-icons/react'
import { streamChat } from '../lib/streamChat.js'
import { loadChatHistory, saveChatMessage } from '../lib/chatHistory.js'
import { useCareerPaths } from '../hooks/useCareerPaths.js'
import { capture } from '../lib/analytics.js'
import { isMockUser } from '../lib/mockAuth.js'

const STORAGE_KEY = 'lh:atlasChat'

const GREETING = {
  role: 'model',
  text: "Hi, I'm Atlas 👋 I'll be your guide on this journey — ask me anything, and let's find some clarity on the path ahead.",
}

// The model ends every reply with a hidden "FOLLOWUPS: a | b | c" line
// (see the system prompt). Split it off: before = what the student sees,
// chips = the suggested next questions.
function splitFollowups(text) {
  const m = text.split(/\n?\s*FOLLOWUPS:/)
  const chips = m[1]
    ? m[1]
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3)
    : []
  return { visible: m[0].trimEnd(), chips }
}

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Turn exact career titles in the model's text into markdown links with a
// #career: href our renderer below intercepts.
function linkifyCareers(text, careers) {
  if (!careers?.length) return text
  const sorted = [...careers].sort((a, b) => b.title.length - a.title.length)
  let out = text
  const tokens = []
  sorted.forEach((c, i) => {
    const token = String.fromCharCode(1) + i + String.fromCharCode(1)
    out = out.replace(new RegExp(escapeRegex(c.title), 'i'), () => {
      tokens[i] = c
      return token
    })
  })
  tokens.forEach((c, i) => {
    if (!c) return
    out = out.replaceAll(String.fromCharCode(1) + i + String.fromCharCode(1), `[${c.title}](#career:${c.id})`)
  })
  return out
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="Atlas is typing">
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

export default function AtlasChat({ user, authLoading, onOpenCareer, onSignIn }) {
  const { data: careers } = useCareerPaths()
  const [messages, setMessages] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const logRef = useRef(null)
  const initedForRef = useRef(undefined)

  useEffect(() => {
    if (authLoading) return
    const identityKey = user ? user.id : 'anon'
    if (initedForRef.current === identityKey) return
    initedForRef.current = identityKey

    // The demo account has no real chat_messages row to fetch (its id
    // isn't a real uuid) — treat it like anonymous: sessionStorage only.
    if (!user || isMockUser(user)) {
      let initial
      try {
        initial = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || [GREETING]
      } catch {
        initial = [GREETING]
      }
      setMessages(initial)
      setHistoryLoading(false)
      return
    }

    setHistoryLoading(true)
    loadChatHistory(user.id).then((history) => {
      setMessages(history.length ? history : [GREETING])
      setHistoryLoading(false)
    })
  }, [user, authLoading])

  useEffect(() => {
    if (user && !isMockUser(user)) return
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages, user])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const markdownComponents = {
    a: ({ href, children }) => {
      if (href?.startsWith('#career:')) {
        const id = href.slice('#career:'.length)
        return (
          <button
            type="button"
            onClick={() => onOpenCareer?.(id)}
            className="font-semibold text-indigo-900 underline decoration-sage-500 decoration-2 underline-offset-2 hover:text-sage-600"
          >
            {children}
          </button>
        )
      }
      return (
        <a href={href} target="_blank" rel="noreferrer" className="underline">
          {children}
        </a>
      )
    },
    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  }

  const send = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || loading || historyLoading) return

    const userMessage = { role: 'user', text: trimmed }
    const nextMessages = [...messages, userMessage]
    setMessages([...nextMessages, { role: 'model', text: '' }])
    setInput('')
    setLoading(true)
    if (user && !isMockUser(user)) saveChatMessage(user.id, userMessage)

    let acc = ''
    const showPartial = () => {
      const { visible } = splitFollowups(acc)
      setMessages((prev) => {
        const copy = [...prev]
        copy[copy.length - 1] = { role: 'model', text: visible }
        return copy
      })
    }

    try {
      await streamChat(
        '/api/atlas-chat',
        nextMessages.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
        (delta) => {
          acc += delta
          showPartial()
        },
        () => {
          acc = ''
          showPartial()
        }
      )
      const { visible, chips } = splitFollowups(acc)
      const modelMessage = { role: 'model', text: visible, followups: chips }
      setMessages((prev) => {
        const copy = [...prev]
        copy[copy.length - 1] = modelMessage
        return copy
      })
      if (user && !isMockUser(user)) saveChatMessage(user.id, modelMessage)
      capture('atlas_message_sent')
    } catch (err) {
      const detail = import.meta.env.DEV ? ` (${err.message})` : ''
      setMessages((prev) => {
        const copy = [...prev]
        copy[copy.length - 1] = {
          role: 'model',
          text: `Sorry, I'm having trouble connecting right now${detail}. Try again in a moment, or explore careers directly from the Explore tab.`,
        }
        return copy
      })
    } finally {
      setLoading(false)
    }
  }

  const lastIndex = messages.length - 1

  return (
    <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-900 text-cream">
          <Sparkle size={20} weight="bold" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-indigo-900">Atlas</h1>
          <p className="text-sm text-ink-faint">Your AI career guide</p>
        </div>
      </div>

      {!user && !authLoading && (
        <button
          type="button"
          onClick={onSignIn}
          className="mt-4 text-sm font-medium text-indigo-900 underline decoration-indigo-900/30 underline-offset-4 hover:decoration-indigo-900"
        >
          Sign in to keep this conversation across visits →
        </button>
      )}

      <div
        ref={logRef}
        className="mt-6 max-h-[55vh] min-h-[320px] space-y-4 overflow-y-auto rounded-3xl border border-indigo-900/10 bg-white/50 p-5"
      >
        {historyLoading ? (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-soft">
              <TypingDots />
            </div>
          </div>
        ) : (
          messages.map((m, i) => {
            const isStreamingEmpty = loading && i === lastIndex && m.role === 'model' && m.text === ''
            const isUser = m.role === 'user'
            return (
              <div key={i}>
                <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                      isUser
                        ? 'rounded-br-sm bg-indigo-900 text-cream'
                        : 'rounded-bl-sm bg-white text-ink shadow-soft'
                    }`}
                  >
                    {isStreamingEmpty ? (
                      <TypingDots />
                    ) : isUser ? (
                      m.text
                    ) : (
                      <ReactMarkdown components={markdownComponents}>
                        {linkifyCareers(m.text, careers)}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>

                {i === lastIndex && !loading && m.followups?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.followups.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => send(q)}
                        className="min-h-9 rounded-full border border-indigo-900/15 bg-white/70 px-3.5 py-1.5 text-sm font-medium text-indigo-900 hover:border-indigo-900/30"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className="mt-4 flex items-center gap-3"
      >
        <input
          type="text"
          placeholder="Ask Atlas anything…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading || historyLoading}
          className="min-h-12 w-full rounded-full border border-indigo-900/15 bg-white/70 px-5 py-3 text-[15px] text-ink placeholder:text-ink-faint focus-visible:border-indigo-500 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading || historyLoading || !input.trim()}
          aria-label="Send"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-indigo-900 text-cream transition-opacity hover:bg-indigo-800 disabled:opacity-40"
        >
          <PaperPlaneRight size={18} weight="fill" />
        </button>
      </form>
    </section>
  )
}
