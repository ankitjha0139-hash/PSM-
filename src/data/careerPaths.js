// Seed data — 3 fully-fleshed records (all schema fields) chosen for diversity
// across stream / Maths-requirement / interest / cost / speed, so the filter
// UI has something real to narrow. Swap for the Google Sheet export in Phase 3.
//
// Note on doors_closed: left empty on all 3 here. "Doors closed" applies
// naturally to STREAM/SUBJECT choices (e.g. "Commerce without Maths closes
// Economics Hons") — picking a specific career doesn't usually close other
// doors the same way. Revisit if a real example comes up while filling data.
//
// decision_timeline / next_action are phrased as "typically happens in
// [month range]" rather than exact dates on purpose — exact dates go stale
// fast (verified against 2026 cycles as of _last_verified_date below, but a
// hardcoded "register by Dec 1" would already be wrong a year from now).
// Always sanity-check against the official site before publishing updates.
//
// resources: curated external links (official + well-established third-party
// content). Third-party links (YouTube channels etc.) are well-known/stable
// picks, but URLs should still be spot-checked as live before publishing —
// same discipline as _confidence on the rest of the record.

export const careerPaths = [
  {
    id: 'architecture-barch',
    title: 'Architecture (B.Arch)',
    stream: 'Science',
    what_it_is:
      'Design buildings and spaces — a 5-year professional degree blending art, engineering and planning.',
    subjects_required: ['Maths'],
    exams: ['NATA', 'JEE Paper 2'],
    duration_years: '5 years',
    fees: '₹3–10L total (indicative)',
    entry_pay: '₹3–6 LPA (indicative)',
    colleges_route: '~470 CoA-approved colleges',
    roles: ['Architect', 'Urban planner', 'Interior designer', 'Landscape architect'],
    doors_opened: ['Architecture practice', 'Urban planning', 'Interior & landscape design'],
    doors_closed: [],
    ratings: { demand: 3, competition: 3, earning: 3, speed_to_earn: 1, cost: 3 },
    interest_tags: ['creative', 'tech'],
    requires_maths: true,
    marks_eligibility: 'Open (NATA / JEE aptitude cutoff)',
    years_to_first_income: '5 years (no paid income during B.Arch itself)',
    time_bucket: '5+ yrs',
    fees_bucket: 'Medium',
    industry_tag: ['construction', 'design'],
    linked_exams: ['NATA', 'JEE Paper 2'],
    alternatives: ['Civil Engineering', 'Interior Design', 'Urban Planning'],
    variation_level: 'Low',
    why_complex: '',
    decision_timeline:
      'NATA runs in phases — roughly April to June, then again in August. Registration for each weekly test session closes the Monday/Tuesday before it, so gaps of even a week can cost you a slot. JEE Main Paper 2 (the B.Arch paper) has two sessions, registering around Nov–Dec and Feb–Mar.',
    next_action:
      'Create your NATA login at stureg.nata-app.org as soon as Phase 1 opens (usually early spring) — weekly rolling deadlines mean it pays to register early, not last-minute.',
    honest_note:
      "Getting the B.Arch degree isn't the finish line — Indian law (the Architects Act, 1972) requires you to separately register with the Council of Architecture before you can legally call yourself an architect. Studio culture is also real: expect intense, late-night deadlines especially in thesis year, and starting pay is often lower than engineering despite the same 5-year commitment.",
    govt_job_overlap:
      'Yes — architects are regularly hired by CPWD, state PWDs, municipal corporations, and town-planning departments. The Council of Architecture\'s own site shows direct correspondence with several state governments about architect recruitment.',
    resources: [
      {
        label: 'Council of Architecture — official site',
        note: 'Registration rules, the Architects Act, and the licensed-architect directory.',
        url: 'https://www.coa.gov.in',
      },
      {
        label: 'Indian Institute of Architects (IIA)',
        note: "India's professional body for architects — founded 1917, 15,000+ members.",
        url: 'https://www.iia-india.org',
      },
    ],
    links: ['https://www.coa.gov.in', 'https://nata.in'],
    _owner: 'Dev',
    _source_link: 'https://www.coa.gov.in',
    _last_verified_date: '2026-07-07',
    _status: 'verified',
    _confidence: 'high',
  },
  {
    id: 'ux-ui-designer',
    title: 'UX / UI Designer',
    stream: 'Alternate',
    what_it_is:
      "Design how apps and websites feel and work — one of India's fastest-growing tech careers, open to any stream.",
    subjects_required: [],
    exams: ['UCEED (optional)', 'NID DAT (optional)'],
    duration_years: 'Months (bootcamp) to 4 years (B.Des)',
    fees: '₹30k–2L (indicative, bootcamp route)',
    entry_pay: '₹4–8 LPA (indicative)',
    colleges_route: 'Bootcamps (no degree needed), or NID / IIT-B / NIFT for B.Des',
    roles: ['UX Designer', 'UI Designer', 'Product Designer', 'Interaction Designer'],
    doors_opened: ['Tech/product companies', 'Design agencies', 'Freelance / remote work'],
    doors_closed: [],
    ratings: { demand: 5, competition: 3, earning: 4, speed_to_earn: 4, cost: 2 },
    interest_tags: ['creative', 'tech'],
    requires_maths: false,
    marks_eligibility: 'Any stream · no Maths needed · portfolio matters more than marks',
    years_to_first_income: 'Under 1 year via a bootcamp + portfolio',
    time_bucket: '<2 yrs',
    fees_bucket: 'Low',
    industry_tag: ['tech', 'design'],
    linked_exams: ['UCEED', 'NID DAT'],
    alternatives: ['Graphic Design', 'Product Management', 'Frontend Development'],
    variation_level: 'Low',
    why_complex: '',
    decision_timeline:
      'UCEED registration typically opens early October and closes by early November, with the exam in mid-January. NID DAT registration typically runs Oct–Dec with prelims in December. If going the bootcamp route instead, there is no fixed calendar at all — you can start any day of the year.',
    next_action:
      'Aiming for NID/IIT-B? Mark early October for UCEED/DAT registration. Going the faster bootcamp + portfolio route instead? Pick one small project (e.g. redesign an app you already use) and start it today — a portfolio matters far more here than a start date.',
    honest_note:
      "This is the one career here where a degree is genuinely optional — many working designers are self-taught via bootcamps and a strong portfolio. But that also means entry-level roles get a lot of bootcamp-graduate applicants; standing out takes real project work, not just a certificate.",
    govt_job_overlap:
      "Limited but growing — India's e-governance and Digital India efforts increasingly need UX designers (e.g. via National Informatics Centre projects), though it's far less structured than engineering or finance government hiring.",
    resources: [
      {
        label: 'UCEED official site',
        note: 'Exam pattern, sample papers, participating institutes.',
        url: 'https://www.uceed.iitb.ac.in',
      },
      // Only one resource here on purpose — we couldn't confidently verify
      // a good India-specific UX community/publication yet (uxindia.org
      // didn't resolve). Better to leave this short than guess a link.
    ],
    links: ['https://www.uceed.iitb.ac.in', 'https://admissions.nid.edu'],
    _owner: '',
    _source_link: 'https://www.uceed.iitb.ac.in',
    _last_verified_date: '2026-07-07',
    _status: 'draft',
    _confidence: 'medium',
  },
  {
    id: 'chartered-accountant',
    title: 'Chartered Accountant (CA)',
    stream: 'Commerce',
    what_it_is:
      "India's premier finance and accounting qualification — can start right after Class 12, no Maths required.",
    subjects_required: [],
    exams: ['CA Foundation', 'CA Intermediate', 'CA Final'],
    duration_years: '~4.5–5 years (incl. 3-year articleship)',
    fees: '₹2.5–4L total (indicative) — one of the cheapest professional routes',
    entry_pay: '₹7–12 LPA fresher (indicative)',
    colleges_route: 'ICAI — a single national body, no college required',
    roles: ['Auditor', 'Tax Consultant', 'Finance Manager', 'CFO (senior)'],
    doors_opened: ['Audit & tax practice', 'Corporate finance', 'Own CA practice'],
    doors_closed: [],
    ratings: { demand: 4, competition: 5, earning: 5, speed_to_earn: 3, cost: 1 },
    interest_tags: ['business'],
    requires_maths: false,
    marks_eligibility: 'Any stream (Commerce typical) · Maths optional, not required',
    years_to_first_income: 'Paid stipend starts in year 2 (articleship); full salary at ~4.5–5 years',
    time_bucket: '3–4 yrs',
    fees_bucket: 'Low',
    industry_tag: ['finance', 'business'],
    linked_exams: ['CA Foundation', 'CA Intermediate', 'CA Final'],
    alternatives: ['Company Secretary (CS)', 'Cost & Management Accountant (CMA)', 'MBA Finance'],
    variation_level: 'Low',
    why_complex: '',
    decision_timeline:
      'CA Foundation is held twice a year (currently May and September sessions), with registration typically closing around 4 months before each exam date. Don\'t wait for an exact date to appear — register the moment the prior session ends if you\'re aiming for the next one.',
    next_action:
      'Register for CA Foundation via ICAI\'s Board of Studies portal (live.icai.org/bos) as soon as Class 12 boards are done — earlier registration means more prep time for a genuinely tough first exam.',
    honest_note:
      'CA Foundation has a real reputation for a low pass percentage — plenty of capable students need more than one attempt, so a first-attempt miss isn\'t a sign you can\'t do this. Also, the 3-year articleship stipend is usually modest relative to the workload; real earning only ramps up after qualifying.',
    govt_job_overlap:
      "Yes, and it's a bigger deal than most students realise — qualified CAs are eligible for roles at RBI (Grade B), SEBI, CAG, and PSU banks, alongside the more visible private-sector and Big 4 routes.",
    resources: [
      {
        label: 'ICAI Board of Studies (BOS Live)',
        note: 'Registration, study material, and live virtual classes for CA Foundation.',
        url: 'https://boslive.icai.org',
      },
      {
        label: 'ICAI official site',
        note: 'Exam notifications and official announcements.',
        url: 'https://www.icai.org',
      },
    ],
    links: ['https://www.icai.org'],
    _owner: '',
    _source_link: 'https://boslive.icai.org',
    _last_verified_date: '2026-07-07',
    _status: 'draft',
    _confidence: 'medium',
  },
]
