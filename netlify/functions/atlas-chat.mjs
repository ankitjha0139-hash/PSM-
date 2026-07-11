// Atlas's real backend — runs on Netlify's servers, never in the browser,
// so GEMINI_API_KEY is never exposed to a client. Grounded in our own
// verified career data (RAG) rather than letting the model invent specifics.
import { getCareerPaths } from './lib/careerData.mjs'

// profile comes from the browser: what the student told us at onboarding
// ("I know what I want" / "some direction" / "no idea") plus what they've
// shortlisted so far — so Atlas starts from THEIR situation, not a blank.
function describeProfile(profile) {
  if (!profile) return ''
  const lines = []
  const stageText = {
    goal: 'They said they know exactly what they want.',
    direction: "They said they have some direction but aren't sure yet.",
    none: 'They said they have no idea and need help figuring it out — be extra gentle and exploratory.',
  }
  if (stageText[profile.journeyStage]) lines.push(stageText[profile.journeyStage])
  if (profile.shortlisted?.length) {
    lines.push(`They have shortlisted: ${profile.shortlisted.join(', ')}. Reference these when relevant.`)
  }
  if (!lines.length) return ''
  return `\nABOUT THIS STUDENT:\n${lines.join('\n')}\n`
}

async function buildSystemInstruction(profile) {
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
- When you name a career from the verified list, use its exact title as written there — the app turns exact titles into tappable links to that career's page.
- You may use light markdown: **bold** for emphasis and short bullet lists. No headings, no tables.
- If asked about the PLATFORM itself (pricing, bookings, accounts, bugs), don't answer — point them to the help button in the corner, which is for exactly that.
- Off-topic requests (homework, jokes, anything not career-related): decline in one friendly sentence and steer back to careers.
${describeProfile(profile)}
After your reply, on a new final line, write exactly:
FOLLOWUPS: question 1 | question 2 | question 3
— three short follow-up questions (max 8 words each) the student would naturally ask next, written in the student's voice. This line is parsed by the app and never shown to the student.

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
  // streamGenerateContent + alt=sse: Gemini sends the reply as it's
  // generated, not all at once. We relay that stream straight through to
  // the browser (see src/lib/streamChat.js) instead of buffering the
  // whole reply here — that's what gives the real "typing" effect.
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?key=${apiKey}&alt=sse`

  try {
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: await buildSystemInstruction(body.profile),
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

    // Relay Gemini's event stream directly — no buffering, no waiting for
    // the full reply before anything reaches the browser.
    return new Response(geminiRes.body, {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}

export const config = {
  path: '/api/atlas-chat',
}
