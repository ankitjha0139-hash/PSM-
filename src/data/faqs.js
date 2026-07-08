// FAQ content for the support widget. Keyword-matched for now (see
// useFaqSearch.js) — swappable for real LLM/RAG matching later without
// changing how screens consume this data.
export const faqs = [
  {
    id: 'what-is-atlas',
    q: 'What is Atlas?',
    a: "Atlas is our AI guide — for when you're not sure what you want yet. Talk it through and it'll help you narrow down some directions.",
    keywords: ['atlas', 'ai', 'chat', 'guide', 'bot'],
  },
  {
    id: 'is-it-free',
    q: 'Is this free to use?',
    a: 'Exploring careers, using Atlas, and building your shortlist are all free. Booking a call with a real Career Practitioner has a small fee — that pays for their time, not for us to push you anywhere.',
    keywords: ['free', 'cost', 'price', 'pay', 'money', 'charge'],
  },
  {
    id: 'how-book-practitioner',
    q: 'How do I book a call with a Career Practitioner?',
    a: 'Open any career\'s detail page and tap "Talk to a real [role]", or go to the Practitioners tab directly, pick someone, choose a time slot, and confirm.',
    keywords: ['book', 'call', 'practitioner', 'talk', 'schedule', 'appointment'],
  },
  {
    id: 'how-shortlist',
    q: 'How do I save a career to look at later?',
    a: 'Tap the ♥ on any career card or detail page — it gets added to your Shortlist, which you can find in the bottom navigation.',
    keywords: ['save', 'shortlist', 'heart', 'wishlist', 'bookmark'],
  },
  {
    id: 'data-usage',
    q: 'How is my information used?',
    a: "We use it to show you relevant paths and, if you book a call, to give the practitioner context beforehand so you don't have to repeat yourself. We don't sell your data.",
    keywords: ['data', 'privacy', 'information', 'safe', 'share'],
  },
  {
    id: 'accuracy',
    q: 'How accurate is the information on this platform?',
    a: "We aim to be directionally accurate on every path, and clearly mark anything that's an estimate. For the full, personalised picture, that's exactly what a Career Practitioner call is for.",
    keywords: ['accurate', 'trust', 'correct', 'reliable', 'source'],
  },
]
