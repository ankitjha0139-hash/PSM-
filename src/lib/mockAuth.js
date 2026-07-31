// A single hardcoded demo account — signs straight into a filled-in
// profile with no Supabase call at all, so the app is always demoable
// regardless of whether the real database is configured. Not a general
// registration system: only this one username/password combo works.
export const MOCK_CREDENTIALS = { username: 'test', password: 'test@123' }

export const MOCK_USER = {
  id: 'mock-test-user',
  email: 'test',
  isMock: true,
  user_metadata: { full_name: 'Test User', avatar_url: null },
}

export function isMockUser(user) {
  return !!user?.isMock
}

export const MOCK_PROFILE = {
  education_level: 'Class 11–12',
  comfortable_with_maths: true,
  interests: ['Tech & Engineering', 'Business & Numbers'],
  career_goal: 'Figuring out whether product management or UX design is a better fit — I like building things but also like talking to people.',
  preferred_course_level: "Bachelor's",
  marks_percentage: 88,
  preferred_location: 'Mumbai',
  budget: 'Medium',
  entrance_exams: 'JEE, CUET',
  phone: '+91 98765 43210',
  address: 'Mumbai, Maharashtra',
  birthday: '2008-05-14',
  gender: 'Prefer not to say',
}
