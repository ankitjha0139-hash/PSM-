import { useEffect, useState } from 'react'
import './App.css'
import { practitioners } from './data/practitioners.js'
import { useShortlist } from './hooks/useShortlist.js'
import { useCareerPaths } from './hooks/useCareerPaths.js'
import { useAuth } from './hooks/useAuth.js'

import Landing from './screens/Landing.jsx'
import AboutStory from './screens/AboutStory.jsx'
import RoleGate from './screens/RoleGate.jsx'
import PractitionerPlaceholder from './screens/PractitionerPlaceholder.jsx'
import RoutingQuestion from './screens/RoutingQuestion.jsx'
import FilterExplore from './screens/FilterExplore.jsx'
import AtlasChat from './screens/AtlasChat.jsx'
import CareerDetail from './screens/CareerDetail.jsx'
import Shortlist from './screens/Shortlist.jsx'
import PractitionerDirectory from './screens/PractitionerDirectory.jsx'
import PractitionerProfile from './screens/PractitionerProfile.jsx'
import TopNav from './components/TopNav.jsx'
import SupportWidget from './components/SupportWidget.jsx'
import AccountButton from './components/AccountButton.jsx'
import SignInModal from './components/SignInModal.jsx'

// Screens that show the persistent top nav — everything past onboarding.
const MAIN_TABS = ['explore', 'atlas', 'shortlist', 'practitioners']

// Shared links (see src/lib/share.js) carry ?career=<id> — someone opening
// one lands straight on that career's page, skipping onboarding.
const sharedCareerId = new URLSearchParams(window.location.search).get('career')

// Where you are survives a refresh (screens are state, not URLs — without
// this, F5 dumped everyone back on the landing video). A shared link wins
// over the saved spot; a fresh tab starts clean.
const NAV_KEY = 'appNav'
function savedNav() {
  try {
    return JSON.parse(sessionStorage.getItem(NAV_KEY)) || {}
  } catch {
    return {}
  }
}

function App() {
  const nav = sharedCareerId ? { screen: 'explore', selectedCareerId: sharedCareerId } : savedNav()
  const [screen, setScreen] = useState(nav.screen || 'landing')
  const [role, setRole] = useState(nav.role || null)
  const [routingAnswer, setRoutingAnswer] = useState(nav.routingAnswer || null)
  const [selectedCareerId, setSelectedCareerId] = useState(nav.selectedCareerId || null)
  const [selectedPractitionerId, setSelectedPractitionerId] = useState(
    nav.selectedPractitionerId || null
  )
  const [aboutFrom, setAboutFrom] = useState(null)

  useEffect(() => {
    sessionStorage.setItem(
      NAV_KEY,
      JSON.stringify({ screen, role, routingAnswer, selectedCareerId, selectedPractitionerId })
    )
  }, [screen, role, routingAnswer, selectedCareerId, selectedPractitionerId])
  const shortlist = useShortlist()
  const { data: careerPaths } = useCareerPaths()
  const auth = useAuth()
  // null | 'shortlist' | 'booking' | 'account' — which sign-in prompt (if
  // any) is open. Sign-in is optional everywhere except the moment someone
  // tries to shortlist or start a booking; see requireAuth below.
  const [signInReason, setSignInReason] = useState(null)

  // Gate for anything that needs an identity: run the action if already
  // signed in, otherwise open the sign-in modal instead. OAuth takes the
  // whole tab away and back, so there's no "resume the action after
  // login" here — the visitor just retries once they're signed in.
  const requireAuth = (reason, action) => {
    if (auth.user) {
      action()
    } else {
      setSignInReason(reason)
    }
  }

  const handleToggleShortlist = (id) => requireAuth('shortlist', () => shortlist.toggle(id))

  const selectedCareer = (careerPaths || []).find((c) => c.id === selectedCareerId)
  const selectedPractitioner = practitioners.find((p) => p.id === selectedPractitionerId)

  // A career id can outlive its data — restored from a refresh/old
  // session, or a shared link for a career that's since been removed from
  // the sheet. CareerDetail is a full-screen takeover with no nav of its
  // own, so if the id doesn't resolve once data HAS loaded, that's a dead
  // end: no back button, nothing to tap. Recover to Explore instead of
  // trusting the id forever.
  useEffect(() => {
    if (selectedCareerId && careerPaths && !selectedCareer) {
      setSelectedCareerId(null)
    }
  }, [selectedCareerId, careerPaths, selectedCareer])

  // Same trap, same fix: a stale practitioner id (practitioners.js is
  // static, so this only happens from corrupted/old sessionStorage, but
  // the dead-end is just as real if it does).
  useEffect(() => {
    if (selectedPractitionerId && !selectedPractitioner) {
      setSelectedPractitionerId(null)
    }
  }, [selectedPractitionerId, selectedPractitioner])

  // "Our story" is reachable from the landing screen and the help panel;
  // back returns wherever the reader came from.
  const openAbout = () => {
    setAboutFrom(screen)
    setScreen('about')
  }

  // Everything below picks the current screen's JSX; the sign-in modal is
  // rendered once at the very end regardless of which branch fires, since
  // requireAuth can be triggered from full-screen takeovers (CareerDetail,
  // PractitionerProfile) that live outside the main tab-shell below — it
  // used to live inside that shell only, so triggering it from those
  // takeovers set the state but never rendered anything until you
  // navigated back into a tab screen.
  function renderScreen() {
    if (screen === 'about') {
      return <AboutStory onBack={() => setScreen(aboutFrom || 'landing')} />
    }

    // --- Onboarding sequence ---
    if (screen === 'landing') {
      return <Landing onStart={() => setScreen('roleGate')} onStory={openAbout} />
    }

    if (screen === 'roleGate') {
      return (
        <RoleGate
          onBack={() => setScreen('landing')}
          onSelect={(picked) => {
            setRole(picked)
            setScreen(picked === 'practitioner' ? 'practitionerPlaceholder' : 'routingQuestion')
          }}
        />
      )
    }

    if (screen === 'practitionerPlaceholder') {
      return <PractitionerPlaceholder onBack={() => setScreen('roleGate')} />
    }

    if (screen === 'routingQuestion') {
      return (
        <RoutingQuestion
          role={role}
          onBack={() => setScreen('roleGate')}
          onAnswer={(answer) => {
            setRoutingAnswer(answer)
            // "goal" and "direction" both land on Explore — same filter
            // engine, just search-focused vs chip-focused. "none" goes to
            // Atlas. See FilterExplore for how initialFocus is used.
            setScreen(answer === 'none' ? 'atlas' : 'explore')
          }}
        />
      )
    }

    // --- Detail is a full-screen takeover, reachable from any main tab ---
    if (selectedCareerId) {
      return (
        <CareerDetail
          career={selectedCareer}
          shortlisted={shortlist.has(selectedCareerId)}
          onToggleShortlist={handleToggleShortlist}
          onBack={() => setSelectedCareerId(null)}
          onTalkToPractitioner={() => {
            // If a practitioner matches this career's primary role, jump
            // straight to their profile instead of a generic list — the
            // whole point of the CTA is "talk to a real X", so land them
            // on that specific person.
            const primaryRole = selectedCareer?.roles?.[0]
            const match = practitioners.find((p) => p.matchesRole === primaryRole)
            setSelectedCareerId(null)
            if (match) {
              setSelectedPractitionerId(match.id)
            }
            setScreen('practitioners')
          }}
        />
      )
    }

    // --- Practitioner profile is also a full-screen takeover ---
    if (selectedPractitionerId) {
      return (
        <PractitionerProfile
          practitioner={selectedPractitioner}
          onBack={() => setSelectedPractitionerId(null)}
          onRequireAuth={(action) => requireAuth('booking', action)}
        />
      )
    }

    // Same shortlist state, but with an auth-gated toggle — screens keep
    // calling shortlist.toggle exactly like before, they just get the
    // gated version instead of the raw one.
    const gatedShortlist = { ...shortlist, toggle: handleToggleShortlist }

    // --- Main app, with persistent bottom nav ---
    return (
      <div className="app-shell">
        {screen === 'explore' && (
          <FilterExplore
            shortlist={gatedShortlist}
            onOpenDetail={setSelectedCareerId}
            initialFocus={routingAnswer === 'goal' ? 'search' : 'filter'}
          />
        )}
        {screen === 'atlas' && (
          <AtlasChat
            careers={careerPaths || []}
            onOpenCareer={setSelectedCareerId}
            user={auth.user}
            authLoading={auth.loading}
            onSignIn={() => setSignInReason('chat-history')}
            profile={{
              role,
              journeyStage: routingAnswer,
              shortlisted: (careerPaths || [])
                .filter((c) => shortlist.has(c.id))
                .map((c) => c.title),
            }}
          />
        )}
        {screen === 'shortlist' && (
          <Shortlist shortlist={gatedShortlist} onOpenDetail={setSelectedCareerId} />
        )}
        {screen === 'practitioners' && (
          <PractitionerDirectory onOpenProfile={setSelectedPractitionerId} />
        )}

        {MAIN_TABS.includes(screen) && (
          <TopNav
            active={screen}
            onNavigate={setScreen}
            onAbout={openAbout}
            user={auth.user}
            onSignIn={() => setSignInReason('account')}
            onSignOut={auth.signOut}
          />
        )}
        <SupportWidget onOpenAbout={openAbout} />
      </div>
    )
  }

  return (
    <>
      {renderScreen()}
      {/* Standalone floating account chip — every screen except the landing
          splash (own top-right "Skip" button during the intro video would
          overlap) and the main-tab shell with no takeover active (TopNav
          carries the account slot there instead, so this would
          double-render). `screen` doesn't change while CareerDetail/
          PractitionerProfile are open (only selectedCareerId/
          selectedPractitionerId do), so those takeovers must be checked
          explicitly here too, or this chip would wrongly disappear right
          when sign-in gating on shortlist/booking matters most. */}
      {screen !== 'landing' &&
        (!MAIN_TABS.includes(screen) || selectedCareerId || selectedPractitionerId) && (
        <AccountButton
          user={auth.user}
          onSignIn={() => setSignInReason('account')}
          onSignOut={auth.signOut}
        />
      )}
      {signInReason && (
        <SignInModal
          reason={signInReason}
          onSignIn={auth.signInWithGoogle}
          onClose={() => setSignInReason(null)}
        />
      )}
    </>
  )
}

export default App
