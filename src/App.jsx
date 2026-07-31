import { useEffect, useState } from 'react'
import TopNav from './components/TopNav.jsx'
import SignInModal from './components/SignInModal.jsx'
import SupportWidget from './components/SupportWidget.jsx'
import Home from './screens/Home.jsx'
import FilterExplore from './screens/FilterExplore.jsx'
import CareerDetail from './screens/CareerDetail.jsx'
import AtlasChat from './screens/AtlasChat.jsx'
import PractitionerDirectory from './screens/PractitionerDirectory.jsx'
import PractitionerProfile from './screens/PractitionerProfile.jsx'
import MySessions from './screens/MySessions.jsx'
import Profile from './screens/Profile.jsx'
import Admin from './screens/Admin.jsx'
import { useAuth } from './hooks/useAuth.js'
import { usePractitioners } from './hooks/usePractitioners.js'
import { useShortlist } from './hooks/useShortlist.js'

const SCREEN_KEY = 'lh:screen'
const CAREER_KEY = 'lh:careerId'
const PRACTITIONER_KEY = 'lh:practitionerId'

// /admin is a direct-URL-only tool (not a nav item — see Admin.jsx),
// checked ahead of the usual sessionStorage-restored screen so bookmarking
// or linking straight to it always works, even mid-session.
function readInitialScreen() {
  try {
    if (window.location.pathname.startsWith('/admin')) return 'admin'
    return sessionStorage.getItem(SCREEN_KEY) || 'home'
  } catch {
    return 'home'
  }
}

function readInitial(key) {
  try {
    return sessionStorage.getItem(key) || null
  } catch {
    return null
  }
}

export default function App() {
  const [screen, setScreen] = useState(readInitialScreen)
  const [careerId, setCareerId] = useState(() => readInitial(CAREER_KEY))
  const [practitionerId, setPractitionerId] = useState(() => readInitial(PRACTITIONER_KEY))
  const [signInOpen, setSignInOpen] = useState(false)
  const { user, loading: authLoading, signInWithGoogle, signInWithUsername, signOut } = useAuth()
  const { data: practitioners } = usePractitioners()
  const shortlist = useShortlist()

  useEffect(() => {
    try {
      sessionStorage.setItem(SCREEN_KEY, screen)
      if (careerId) sessionStorage.setItem(CAREER_KEY, careerId)
      if (practitionerId) sessionStorage.setItem(PRACTITIONER_KEY, practitionerId)
    } catch {
      // sessionStorage unavailable (private mode etc.) — navigation still
      // works within the session, it just won't survive a reload.
    }
  }, [screen, careerId, practitionerId])

  const navigate = (next) => {
    setScreen(next)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const openCareer = (id) => {
    setCareerId(id)
    navigate('careerDetail')
  }

  const openPractitioner = (id) => {
    setPractitionerId(id)
    navigate('practitionerProfile')
  }

  // From a career page's "Talk to a real X" — jump straight to a
  // practitioner whose matchesRole fits, instead of making them find one
  // themselves in the directory. No match (or no role given): directory.
  const talkToPractitioner = (role) => {
    const match = role && practitioners?.find((p) => p.matchesRole === role)
    if (match) openPractitioner(match.id)
    else navigate('practitioners')
  }

  const handleSignIn = () => {
    setSignInOpen(false)
    signInWithGoogle()
  }

  if (screen === 'admin') {
    return (
      <div className="min-h-dvh bg-cream text-ink">
        <Admin />
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-cream text-ink">
      <TopNav
        screen={screen}
        onNavigate={navigate}
        user={user}
        onSignIn={() => setSignInOpen(true)}
        onSignOut={signOut}
      />
      <main>
        {screen === 'home' && <Home onNavigate={navigate} />}
        {screen === 'explore' && <FilterExplore onOpenCareer={openCareer} shortlist={shortlist} />}
        {screen === 'careerDetail' && (
          <CareerDetail
            careerId={careerId}
            onBack={() => navigate('explore')}
            onTalkToPractitioner={talkToPractitioner}
            shortlist={shortlist}
          />
        )}
        {screen === 'atlas' && (
          <AtlasChat
            user={user}
            authLoading={authLoading}
            onOpenCareer={openCareer}
            onSignIn={() => setSignInOpen(true)}
          />
        )}
        {screen === 'practitioners' && <PractitionerDirectory onOpenProfile={openPractitioner} />}
        {screen === 'practitionerProfile' && (
          <PractitionerProfile
            practitionerId={practitionerId}
            onBack={() => navigate('practitioners')}
            user={user}
            onSignIn={() => setSignInOpen(true)}
          />
        )}
        {screen === 'mySessions' && <MySessions user={user} onSignIn={() => setSignInOpen(true)} />}
        {screen === 'profile' && <Profile user={user} onSignIn={() => setSignInOpen(true)} />}
      </main>

      <SignInModal
        open={signInOpen}
        onSignIn={handleSignIn}
        onClose={() => setSignInOpen(false)}
        onSignInWithUsername={signInWithUsername}
      />

      <SupportWidget />
    </div>
  )
}
