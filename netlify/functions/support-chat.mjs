// Support bot's real backend — same pattern as atlas-chat.mjs, but
// grounded in faqs.js (about the PLATFORM) instead of careerPaths.js
// (about careers). Both read the same GEMINI_API_KEY env var — it's set
// once per Netlify site, not per function.
import { faqs } from '../../src/data/faqs.js'

function buildSystemInstruction() {
  const faqSummary = faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')

  return {
    parts: [
      {
        text: `You are a friendly support assistant for a career-clarity platform for Indian students.

Rules:
- Answer ONLY using the FAQ data below — this is about how the PLATFORM works, not career advice (a different assistant, Atlas, handles that).
- If someone asks a career question (e.g. "how do I become an architect"), politely redirect them to Atlas or the Explore tab instead of answering it yourself.
- If their question isn't covered by the FAQs below, say you're not sure and suggest they tap "Talk to a real person" to raise a ticket. Don't guess at policy or pricing you don't have.
- Keep replies short (2-4 sentences) and warm.

FAQ DATA:
${faqSummary}`,
      },
    ],
  }
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'GEMINI_API_KEY is not set on this Netlify site.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 })
  }

  const messages = body.messages || []
  if (!messages.length) {
    return new Response(JSON.stringify({ error: 'messages array is required' }), { status: 400 })
  }

  const MODEL = 'gemini-2.5-flash'
  // Same streaming approach as atlas-chat.mjs — relay Gemini's stream
  // straight through instead of buffering the whole reply.
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?key=${apiKey}&alt=sse`

  try {
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: buildSystemInstruction(),
        contents: messages,
      }),
    })

    if (!geminiRes.ok) {
      const errData = await geminiRes.json().catch(() => ({}))
      return new Response(
        JSON.stringify({ error: errData.error?.message || 'Gemini request failed' }),
        { status: geminiRes.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(geminiRes.body, {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}

export const config = {
  path: '/api/support-chat',
}
