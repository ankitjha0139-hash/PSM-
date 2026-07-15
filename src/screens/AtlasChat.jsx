import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { streamChat } from '../lib/streamChat.js'
import { loadChatHistory, saveChatMessage } from '../lib/chatHistory.js'
import { SendIcon } from '../components/icons.jsx'

// Real, streamed conversation — calls netlify/functions/atlas-chat.mjs,
// which talks to Gemini server-side (key never reaches the browser) and
// answers grounded in our own career data. Replies stream in token by
// token, render as markdown, and career names become tappable links into
// the career detail page — Atlas routes people onward instead of being a
// dead-end conversation.

const STORAGE_KEY = 'atlasChat'

// The greeting matches where they are: someone who said "no idea" gets the
// first discovery question immediately (free — no model call), instead of a
// blank "ask me anything" they don't know how to answer.
function greetingFor(profile) {
  if (profile?.journeyStage === 'none') {
    return {
      role: 'model',
      text: "Hi, I'm Atlas 👋 Starting with no idea is the most common way to start — that's exactly what I'm for. First question: which school subjects feel easiest to you, the ones you don't have to force yourself to study?",
    }
  }
  return {
    role: 'model',
    text: "Hi, I'm Atlas 👋 I'll be your guide on this journey — ask me anything, and let's find some clarity on the path ahead.",
  }
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
// #career: href our renderer below intercepts. Longest titles first, via a
// token pass, so one replacement can never corrupt another.
function linkifyCareers(text, careers) {
  if (!careers?.length) return text
  const sorted = [...careers].sort((a, b) => b.title.length - a.title.length)
  let out = text
  const tokens = []
  sorted.forEach((c, i) => {
    // control-char delimiters can never appear in model output, so a
    // token can't collide with real text or an earlier replacement.
    // No 'g' flag: only the FIRST mention of a career in a reply becomes
    // a link — repeating the same link every time reads as clutter.
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

export default function AtlasChat({
  careers = [],
  onOpenCareer,
  profile,
  user,
  authLoading,
  onSignIn,
}) {
  // Anonymous: sessionStorage, survives tab switches but not a new visit
  // (unchanged behavior). Signed in: real history from Supabase, survives
  // everything. Which one applies depends on auth, which resolves async —
  // start empty and let the identity-resolution effect below fill it in,
  // rather than guessing and risking a flash of the wrong content.
  const [messages, setMessages] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const logRef = useRef(null)
  // profile is a fresh object every App.jsx render (shortlist changes,
  // etc.) — read via ref in the identity effect below so those renders
  // don't re-trigger a history reload or reset an in-progress greeting.
  const profileRef = useRef(profile)
  profileRef.current = profile
  const initedForRef = useRef(undefined)

  useEffect(() => {
    if (authLoading) return
    const identityKey = user ? user.id : 'anon'
    if (initedForRef.current === identityKey) return
    initedForRef.current = identityKey

    if (!user) {
      let initial
      try {
        initial = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || [greetingFor(profileRef.current)]
      } catch {
        initial = [greetingFor(profileRef.current)]
      }
      setMessages(initial)
      setHistoryLoading(false)
      return
    }

    setHistoryLoading(true)
    loadChatHistory(user.id).then((history) => {
      setMessages(history.length ? history : [greetingFor(profileRef.current)])
      setHistoryLoading(false)
    })
  }, [user, authLoading])

  useEffect(() => {
    // Signed-in history lives in Supabase, not sessionStorage — don't
    // shadow-write it locally too.
    if (user) return
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
          <button className="career-link" onClick={() => onOpenCareer?.(id)}>
            {children}
          </button>
        )
      }
      return (
        <a href={href} target="_blank" rel="noreferrer">
          {children}
        </a>
      )
    },
  }

  const send = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || loading || historyLoading) return

    const userMessage = { role: 'user', text: trimmed }
    const nextMessages = [...messages, userMessage]
    // Empty placeholder bubble — shows as typing dots until the first
    // streamed chunk arrives, then fills in progressively.
    setMessages([...nextMessages, { role: 'model', text: '' }])
    setInput('')
    setLoading(true)
    // Fire-and-forget: the message is already in local state, so a slow or
    // failed write doesn't block the conversation — it just won't have
    // persisted if the user is signed in and this particular save failed.
    if (user) saveChatMessage(user.id, userMessage)

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
          // First attempt failed — reset so the retry starts clean
          // instead of appending onto a partial reply.
          acc = ''
          showPartial()
        },
        { profile }
      )
      // Stream done — split the hidden FOLLOWUPS line into chips.
      const { visible, chips } = splitFollowups(acc)
      const modelMessage = { role: 'model', text: visible, followups: chips }
      setMessages((prev) => {
        const copy = [...prev]
        copy[copy.length - 1] = modelMessage
        return copy
      })
      if (user) saveChatMessage(user.id, modelMessage)
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

  const lastIndex = messages.length - 1

  return (
    <main className="screen screen--scroll">
      <h2 className="screen__title screen__title--md">Atlas</h2>

      {!user && !authLoading && (
        <button className="link-quiet chat-signin-hint" onClick={onSignIn}>
          Sign in to keep this conversation across visits →
        </button>
      )}

      <div className="chat-log" ref={logRef}>
        {historyLoading && (
          <div className="chat-entry">
            <div className="bubble bubble--atlas">
              <span className="typing-dots-inline">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </span>
            </div>
          </div>
        )}
        {!historyLoading && messages.map((m, i) => {
          const isStreamingEmpty =
            loading && i === lastIndex && m.role === 'model' && m.text === ''
          return (
            <div key={i} className="chat-entry">
              <div className={`bubble ${m.role === 'model' ? 'bubble--atlas' : 'bubble--me'}`}>
                {isStreamingEmpty ? (
                  <span className="typing-dots-inline">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </span>
                ) : m.role === 'model' ? (
                  <ReactMarkdown components={markdownComponents}>
                    {linkifyCareers(m.text, careers)}
                  </ReactMarkdown>
                ) : (
                  m.text
                )}
              </div>
              {/* Suggested next questions — only under the latest reply,
                  only once it's finished streaming. */}
              {i === lastIndex && !loading && m.followups?.length > 0 && (
                <div className="followup-row">
                  {m.followups.map((q) => (
                    <button key={q} className="chip chip--followup" onClick={() => send(q)}>
                      {q}
                    </button>
                  ))}
                </div>
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
          disabled={loading || historyLoading}
        />
        <button
          className="chat-send"
          type="submit"
          disabled={loading || historyLoading || !input.trim()}
          aria-label="Send"
        >
          <SendIcon />
        </button>
      </form>
    </main>
  )
}
