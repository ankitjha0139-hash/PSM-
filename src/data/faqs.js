// FAQ content for the support bot — about the PLATFORM itself, not career
// content (that's Atlas's job). Grounds netlify/functions/support-chat.mjs
// so it answers from this list rather than inventing policy.
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
    a: 'Exploring careers, using Atlas.ai, and building your shortlist are all free. Booking a call with a real Career Practitioner has a small fee — that pays for their time, not for us to push you anywhere.',
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
    q: 'What is Atlas.ai?',
    a: "Atlas.ai is our AI guide — for when you're not sure what you want yet. Talk it through and it'll help you narrow down some directions.",
    keywords: ['atlas', 'atlas.ai', 'ai', 'chat', 'guide', 'bot'],
  },
  {
    id: 'accuracy',
    q: 'How accurate is the information on this platform?',
    a: "We aim to be directionally accurate on every path, and clearly mark anything that's an estimate. For the full, personalised picture, that's exactly what a Career Practitioner call is for.",
    keywords: ['accurate', 'trust', 'correct', 'reliable', 'source'],
  },
  {
    id: 'how-book-practitioner',
    q: 'How do I book a call with a Career Practitioner?',
    a: 'Open any career\'s detail page and tap "Talk to a real [role]", or go to the Practitioners tab directly, pick someone, choose a session type and time slot, and confirm.',
    keywords: ['book', 'call', 'practitioner', 'talk', 'schedule', 'appointment'],
  },
  {
    id: 'practitioner-cost',
    q: 'How much does a session with a Practitioner cost?',
    a: 'It varies by person and session length — usually somewhere between ₹300 and ₹900. Each practitioner\'s profile shows their exact pricing before you book anything.',
    keywords: ['practitioner cost', 'session price', 'how much', 'fee'],
  },
  {
    id: 'how-shortlist',
    q: 'How do I save a career to look at later?',
    a: 'Tap the ♥ on any career card or detail page — it gets added to your Shortlist, which you can find in the top navigation.',
    keywords: ['save', 'shortlist', 'heart', 'wishlist', 'bookmark'],
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
