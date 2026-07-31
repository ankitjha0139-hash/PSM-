// FAQ content for the support bot (Compass) — about the PLATFORM itself,
// not career content (that's Atlas's job). Grounds
// netlify/functions/support-chat.mjs so it answers from this list rather
// than inventing policy.
export const faqs = [
  {
    id: 'what-is-platform',
    q: 'What is this platform?',
    a: 'A career-clarity platform for Indian students. We help you see every path open to you and talk to real people who\'ve actually done the job — before you commit years to a choice.',
    keywords: ['what is this', 'platform', 'about', 'purpose'],
  },
  {
    id: 'is-it-free',
    q: 'Is this free to use?',
    a: 'Exploring careers and using Atlas, our AI guide, are both free — no sign-in needed. Booking a call with a real Career Practitioner has a small fee — that pays for their time, not for us to push you anywhere.',
    keywords: ['free', 'cost', 'price', 'pay', 'money', 'charge'],
  },
  {
    id: 'who-is-it-for',
    q: 'Who is this platform for?',
    a: 'Mainly students in Class 10–12 figuring out streams, subjects, or what comes after school — and their parents, who are often making this decision together with them.',
    keywords: ['who', 'students', 'parents', 'audience', 'age'],
  },
  {
    id: 'what-is-atlas',
    q: 'What is Atlas?',
    a: "Atlas is our AI guide — for when you're not sure what you want yet. Talk it through and it'll help you narrow down some directions, grounded in our real career data.",
    keywords: ['atlas', 'ai', 'chat', 'guide', 'bot'],
  },
  {
    id: 'accuracy',
    q: 'How accurate is the information on this platform?',
    a: "We aim to be directionally accurate on every path, and clearly mark anything that's an estimate or sourced from the web. For the full, personalised picture, that's exactly what a Career Practitioner call is for.",
    keywords: ['accurate', 'trust', 'correct', 'reliable', 'source'],
  },
  {
    id: 'sign-in',
    q: 'Do I need to sign in?',
    a: "No — exploring careers and talking to Atlas both work without an account. Signing in with Google just lets you build a profile and keeps your details around across visits.",
    keywords: ['sign in', 'account', 'login', 'google', 'need to'],
  },
  {
    id: 'how-book-practitioner',
    q: 'How do I book a call with a Career Practitioner?',
    a: 'Open any career\'s detail page and tap "Talk to a real [role]", or go to the "Talk to someone" tab directly, pick someone, choose a session type, and confirm.',
    keywords: ['book', 'call', 'practitioner', 'talk', 'schedule', 'appointment'],
  },
  {
    id: 'practitioner-cost',
    q: 'How much does a session with a Practitioner cost?',
    a: 'It varies by person and session length — a Quick Chat is around ₹349 for 15 minutes, a Deep Dive around ₹899 for 45 minutes. Each practitioner\'s profile shows exact pricing before you book.',
    keywords: ['practitioner cost', 'session price', 'how much', 'fee', 'pricing'],
  },
  {
    id: 'data-usage',
    q: 'How is my information used?',
    a: "We use it to show you relevant paths and, if you book a call, to give the practitioner context beforehand so you don't have to repeat yourself. We don't sell your data.",
    keywords: ['data', 'privacy', 'information', 'safe', 'share'],
  },
  {
    id: 'reach-human',
    q: 'How do I reach a real person if I need more help?',
    a: 'Use this chat and tap "Talk to a real person" any time — it opens a quick form and our team will get back to you.',
    keywords: ['human', 'real person', 'contact', 'help', 'support'],
  },
]
