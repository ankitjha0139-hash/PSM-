// Real onboarded practitioners — "Talk to a real X" on a career detail
// page links here by matchesRole. All dummy/Wizard-of-Oz entries have been
// replaced; see the team's onboarding sheet for the source data per person.
// photo: paste a URL (or /images/... path) and it replaces the initials
// avatar everywhere. videoId: unused — the intro-video feature was
// removed since we're not recording one per practitioner; left on these
// records only because deleting the field isn't necessary.
export const practitioners = [
  {
    id: 'lokesh-pakhale',
    name: 'Lokesh Pakhale',
    photo: '/images/practitioners/lokesh-pakhale.jpg',
    videoId: 'UF8uR6Z6KLc',
    role: 'Architect',
    credibility: 'Architect & Co-founder · Far Sides of Design, Nagpur',
    matchesRole: 'Architect',
    // First real onboarded practitioner (was dummy "Aditya Rao") — no
    // sessions/reviews yet, so no rating to show. PractitionerCard and
    // PractitionerProfile fall back to a "New" badge instead of a fake
    // star rating when sessionsCompleted is 0 — see those components.
    rating: null,
    sessionsCompleted: 0,
    bio: "Had a 'best out of waste' streak as a kid, which turned into an Architecture degree from Priyadarshini Institute of Architecture and Design Studies (PIADS), Nagpur by 22. Now co-runs Far Sides of Design, where low-cost sustainable builds (like a CSEB mud-block house in Nagpur) sit alongside more experimental concept work. Open to talking through whether architecture is right for you, or what it takes to start your own firm.",
    languages: ['English', 'Hindi', 'Marathi'],
    journey: [
      { when: 'School', what: 'CBSE through 10th and 12th; always the kid turning scrap into something useful' },
      { when: 'By 22', what: 'Architecture degree from PIADS, Nagpur' },
      { when: 'Now', what: 'Co-founder, Far Sides of Design — Nagpur' },
    ],
    topics: ['Is architecture right for you?', 'Starting your own architecture firm', 'Sustainable & low-cost construction (CSEB/mud block)'],
    testimonials: [],
    // PLACEHOLDER PRICING — carried over from the dummy entry this replaced.
    // Confirm Lokesh's actual rates and swap these in.
    sessionTypes: [
      { id: 'quick', label: 'Quick Chat', duration: '15 min', price: '₹349', description: 'A focused question about architecture as a career or starting a firm.' },
      { id: 'deep', label: 'Deep Dive', duration: '45 min', price: '₹899', description: 'Full picture: studio life, sustainable design practice, and your specific questions.' },
    ],
  },
  {
    id: 'sakshi-bishnoi',
    name: 'Sakshi Bishnoi',
    photo: null,
    videoId: null,
    role: 'Market Research',
    credibility: 'Associate Project Lead, Market Research · Escalent',
    // Primary role of the Philosophy (BA) career — her actual degree path,
    // and the page whose visitors most need her "arts degree → corporate
    // career" proof. (History (BA) shares that primary role, so its CTA
    // also lands on her — acceptable overlap for now.)
    matchesRole: 'Research Assistant',
    rating: null,
    sessionsCompleted: 0,
    bio: 'Took the commerce stream in school, then a BA and MA in Philosophy — and turned that into a corporate research career. Now an Associate Project Lead in market research at Escalent, supporting the corporate development team of a leading global technology company: tracking emerging high-growth domains and screening prospective acquisition targets that feed the client’s M&A strategy. Living proof that an arts degree can land squarely in the business world.',
    languages: ['English', 'Hindi'],
    journey: [
      { when: '2015', what: 'Finished school — commerce stream' },
      { when: '2018', what: 'BA in Philosophy' },
      { when: '2020', what: 'MA in Philosophy' },
      { when: '2022–23', what: 'Research Associate at Modulus' },
      { when: 'Now', what: 'Associate Project Lead at Escalent, since 2023' },
    ],
    topics: ['Commerce stream choices', 'Philosophy degree → corporate career', 'Breaking into market research'],
    testimonials: [],
    sessionTypes: [
      { id: 'quick', label: 'Quick Chat', duration: '30 min', price: '₹499', description: 'Your questions about commerce, an arts degree, or market research — answered directly.' },
    ],
  },
  {
    id: 'purnamrita-das',
    name: 'Dr. Purnamrita Das',
    photo: null,
    videoId: null,
    role: 'Doctor',
    credibility: 'MBBS, Practitioner',
    matchesRole: 'Doctor',
    rating: null,
    sessionsCompleted: 0,
    // Sheet's Bio and Journey fields for her were left as the template
    // placeholder text (not actually filled in) — this is deliberately
    // short rather than invented. Ask her for the real 3-5 sentences +
    // timeline and swap this in.
    bio: 'MBBS-qualified medical practitioner. Full bio coming soon — ask her about the medicine path (biology, physics, chemistry) from someone who lived it.',
    languages: ['English', 'Hindi', 'Bengali'],
    journey: [],
    topics: ['Science', 'Biology', 'Physics', 'Chemistry'],
    testimonials: [],
    sessionTypes: [
      { id: 'quick', label: 'Quick Chat', duration: '30 min', price: '₹499', description: 'One or two specific questions about medicine or the MBBS path.' },
      { id: 'deep', label: 'Deep Dive', duration: '1 hr', price: '₹699', description: 'Full picture of the path into medicine and what practice is really like.' },
    ],
  },
  {
    id: 'jibin-jose',
    name: 'Jibin Jose',
    photo: null,
    videoId: null,
    role: 'Commerce Educator',
    credibility: 'Asst. Professor, Kannur University',
    // Maps to Bachelor of Education (B.Ed) rather than B.Com — he holds a
    // real B.Ed and his day job IS teaching, so "School Teacher" is the
    // closer literal match; his commerce-subject expertise comes through
    // in the topics instead. B.Com's "Talk to a real X" won't reach him.
    matchesRole: 'School Teacher',
    rating: null,
    sessionsCompleted: 0,
    bio: 'Commerce professor with 10 years of teaching experience across government and private colleges — undergraduate and postgraduate. Can speak honestly to what a B.Com actually leads to, what studying for a B.Ed involves, and what teaching commerce as a career looks like day to day.',
    languages: ['English', 'Malayalam'],
    journey: [
      { when: '2009', what: 'Finished school — commerce stream' },
      { when: '2012', what: 'B.Com' },
      { when: '2014', what: 'M.Com' },
      { when: '2015', what: 'B.Ed' },
      { when: 'Now', what: 'Assistant Professor, Kannur University — 10 years teaching' },
    ],
    topics: ['Choosing a B.Com', 'Path to becoming a teacher (B.Ed)', 'Life as a commerce lecturer'],
    testimonials: [],
    sessionTypes: [
      { id: 'quick', label: 'Quick Chat', duration: '30 min', price: '₹499', description: 'Your questions about commerce or teaching, answered directly.' },
    ],
  },
]
