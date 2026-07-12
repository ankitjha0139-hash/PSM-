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
  if (profile.role === 'parent') {
    lines.push(
      'You are talking to a PARENT, not a student. Lead with evidence: costs, time to first income, stability, and government-job overlap. Treat their caution as reasonable, never dismissive — the anxiety behind their questions is usually "is this safe for my child?". Say "your child", not "you". Suggest questions the family can discuss together.'
    )
  }
  const stageText = {
    goal: 'They said they know exactly what they want.',
    direction: "They said they have some direction but aren't sure yet.",
    none: `They said they have NO IDEA what they want. Run a guided discovery before recommending anything:
- Ask ONE short question at a time (never two in one message), across up to 4 turns: (1) which subjects feel easiest or most enjoyable, (2) whether the family can support long study or earning early matters, (3) what the family hopes for, (4) one thing they'd hate in a job.
- Keep each question to 1-2 sentences, simple words a 16-year-old uses. Acknowledge their previous answer in a few words before the next question.
- After the questions (or sooner if their answers make it obvious), recommend exactly 3 careers with a one-line reason each tied to what THEY said, then ask which one they'd like to explore.
- If they resist the questions and just ask something direct, drop the script and answer them.`,
  }
  if (stageText[profile.journeyStage]) lines.push(stageText[profile.journeyStage])
  if (profile.shortlisted?.length) {
    lines.push(`They have shortlisted: ${profile.shortlisted.join(', ')}. Reference these when relevant.`)
  }
  if (!lines.length) return ''
  return `\nABOUT THIS VISITOR:\n${lines.join('\n')}\n`
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
- Answer using the VERIFIED CAREER DATA below whenever the question is about one of these specific careers. For these, do NOT use web search — our data wins.
- If asked about a career NOT in this list, use Google Search to find current, India-relevant facts (exams, typical fees, entry pay, duration). Start that answer with "From the web (not yet verified by our team):" and still suggest confirming specifics with a Career Practitioner.
- If search results conflict with the VERIFIED CAREER DATA, the verified data wins — never contradict it.
- NEVER invent exact salaries, exam names, or college names — they must come from the data below or from search results.
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
        // Google Search grounding: lets Gemini pull current web facts for
        // careers our sheet doesn't cover yet. The system prompt forces
        // web-sourced answers to be labelled and keeps sheet data as the
        // source of truth when both exist.
        tools: [{ google_search: {} }],
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
