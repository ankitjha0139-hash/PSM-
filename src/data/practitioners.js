// Dummy practitioner supply — Wizard-of-Oz, matching our 3 seed careers so
// "Talk to a real X" from a career detail page can link to someone
// specific. Swap for real onboarded profiles in Phase 5.
// photo: paste a URL (or /images/... path) and it replaces the initials
// avatar everywhere. videoId: the YouTube id of the practitioner's 5-6 min
// intro — currently a SAMPLE video (Steve Jobs' Stanford address) on all
// three so the embed is visible end-to-end; swap per practitioner as real
// intros get recorded.
export const practitioners = [
  {
    id: 'meera-nair',
    name: 'Meera Nair',
    photo: null,
    videoId: 'UF8uR6Z6KLc',
    role: 'UX Designer',
    credibility: '6 yrs · UX Designer @ Flipkart · ex-Swiggy',
    matchesRole: 'UX Designer',
    rating: 4.9,
    sessionsCompleted: 41,
    bio: 'Started in graphic design, moved into UX after a bootcamp and a lot of self-taught portfolio work. Happy to talk through whether the degree route or bootcamp route makes more sense for you.',
    languages: ['English', 'Hindi', 'Malayalam'],
    journey: [
      { when: 'School', what: 'Loved art, was told design "isn\'t a real career"' },
      { when: '2017', what: 'Graphic design degree — first proof it pays' },
      { when: '2019', what: 'UX bootcamp + 40 portfolio rejections before the first yes' },
      { when: 'Now', what: 'UX Designer at Flipkart, ex-Swiggy' },
    ],
    topics: ['Portfolio review', 'Bootcamp vs degree', 'Breaking into UX with no design background'],
    testimonials: [
      { name: 'Ananya, Class 12', text: 'Gave me a clear, honest plan — not just "follow your passion" advice.' },
      { name: 'Rohit, parent', text: 'Helped my daughter understand what the job actually pays and involves.' },
    ],
    sessionTypes: [
      { id: 'quick', label: 'Quick Chat', duration: '15 min', price: '₹299', description: 'One or two specific questions answered directly.' },
      { id: 'deep', label: 'Deep Dive', duration: '40 min', price: '₹799', description: 'Full walkthrough of the path, your options, and a portfolio look if you have one.' },
    ],
  },
  {
    id: 'lokesh-pakhale',
    name: 'Lokesh Pakhale',
    photo: null,
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
    id: 'vikram-shah',
    name: 'CA Vikram Shah',
    photo: null,
    videoId: 'UF8uR6Z6KLc',
    role: 'Chartered Accountant',
    credibility: '12 yrs · Partner at a mid-size CA firm',
    matchesRole: 'Chartered Accountant',
    rating: 4.7,
    sessionsCompleted: 54,
    bio: 'Cleared CA on the second attempt at Foundation — happy to talk honestly about the exam difficulty and what articleship really pays and demands.',
    languages: ['English', 'Hindi', 'Gujarati'],
    journey: [
      { when: 'School', what: 'Commerce with Maths, family expected engineering' },
      { when: '2011', what: 'Failed CA Foundation on the first try' },
      { when: '2012–16', what: 'Cleared all levels; articleship at ₹8k/month' },
      { when: 'Now', what: 'Partner at a mid-size CA firm' },
    ],
    topics: ['CA Foundation prep', 'Articleship reality (pay & hours)', 'CA vs CS vs CMA'],
    testimonials: [
      { name: 'Priya, Class 12', text: 'Finally someone who told me the real pass rates instead of sugar-coating it.' },
      { name: 'Suresh, parent', text: 'Very clear about the government-job route via RBI/SEBI, which we never knew existed.' },
    ],
    sessionTypes: [
      { id: 'quick', label: 'Quick Chat', duration: '15 min', price: '₹299', description: 'One specific question about CA or the exams.' },
      { id: 'deep', label: 'Deep Dive', duration: '40 min', price: '₹749', description: 'Full picture: exams, articleship, and where a CA career can actually go.' },
    ],
  },
]
