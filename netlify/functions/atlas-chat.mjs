// Atlas's real backend — runs on Netlify's servers, never in the browser,
// so GEMINI_API_KEY is never exposed to a client. Grounded in our own
// verified career data (RAG) rather than letting the model invent specifics.
import { getCareerPaths } from './lib/careerData.mjs'

async function buildSystemInstruction() {
  const careerPaths = await getCareerPaths()
  const dataSummary = careerPaths
    .map(
      (c) =>
        `- ${c.title} (${c.stream}): ${c.what_it_is} Entry pay ${c.entry_pay}. ` +
        `Requires Maths: ${c.requires_maths}. Exams: ${(c.exams || []).join(', ') || 'none'}.`
    )
    .join('\n')

  return {
    parts: [
      {
        text: `You are Atlas, a warm, honest AI career guide for Indian students exploring what to do after school.

Rules:
- Answer using the VERIFIED CAREER DATA below whenever the question is about one of these specific careers.
- If asked about a career NOT in this list, you may reason generally and give directional guidance, but clearly say you don't have verified details on it and suggest booking a call with a Career Practitioner for specifics.
- NEVER invent exact salaries, exam names, or college names that aren't in the data below.
- Keep replies short (3-5 sentences), warm, and encouraging — this is a student who may feel lost or anxious.
- If they seem to know their goal clearly, gently suggest they check that career's full detail page for the step-by-step "How do I get there" section.

VERIFIED CAREER DATA:
${dataSummary}`,
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
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`

  try {
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: await buildSystemInstruction(),
        contents: messages,
      }),
    })

    const data = await geminiRes.json()

    if (!geminiRes.ok) {
      return new Response(
        JSON.stringify({ error: data.error?.message || 'Gemini request failed' }),
        { status: geminiRes.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a reply."

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}

export const config = {
  path: '/api/atlas-chat',
}
