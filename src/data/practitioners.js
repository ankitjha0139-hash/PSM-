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
    id: 'aditya-rao',
    name: 'Aditya Rao',
    photo: null,
    videoId: 'UF8uR6Z6KLc',
    role: 'Architect',
    credibility: '9 yrs · Architect @ Studio Lotus',
    matchesRole: 'Architect',
    rating: 4.8,
    sessionsCompleted: 29,
    bio: 'Cleared NATA after two attempts, so knows the exam pressure firsthand. Works on residential and institutional projects now — can talk through what studio life is really like.',
    languages: ['English', 'Hindi', 'Kannada'],
    journey: [
      { when: 'School', what: 'PCM stream, sketched buildings in the margins' },
      { when: '2013', what: 'Failed NATA on the first attempt' },
      { when: '2014', what: 'Cleared it, started the 5-year B.Arch grind' },
      { when: 'Now', what: 'Architect at Studio Lotus, 9 years in' },
    ],
    topics: ['NATA prep reality check', 'Studio workload & thesis year', 'Is architecture right for you?'],
    testimonials: [
      { name: 'Kabir, Class 11', text: 'Told me things about workload nobody else was honest about.' },
    ],
    sessionTypes: [
      { id: 'quick', label: 'Quick Chat', duration: '15 min', price: '₹349', description: 'A focused question about NATA, JEE, or the field.' },
      { id: 'deep', label: 'Deep Dive', duration: '45 min', price: '₹899', description: 'What a week in studio actually looks like, plus your specific questions.' },
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
