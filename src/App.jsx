import { useState } from 'react'
import './App.css'
import { practitioners } from './data/practitioners.js'
import { useShortlist } from './hooks/useShortlist.js'
import { useCareerPaths } from './hooks/useCareerPaths.js'

import Landing from './screens/Landing.jsx'
import RoleGate from './screens/RoleGate.jsx'
import PractitionerPlaceholder from './screens/PractitionerPlaceholder.jsx'
import RoutingQuestion from './screens/RoutingQuestion.jsx'
import FilterExplore from './screens/FilterExplore.jsx'
import AtlasChat from './screens/AtlasChat.jsx'
import CareerDetail from './screens/CareerDetail.jsx'
import Shortlist from './screens/Shortlist.jsx'
import PractitionerDirectory from './screens/PractitionerDirectory.jsx'
import PractitionerProfile from './screens/PractitionerProfile.jsx'
import BottomNav from './components/BottomNav.jsx'
import SupportWidget from './components/SupportWidget.jsx'

// Screens that show the persistent bottom nav — everything past onboarding.
const MAIN_TABS = ['explore', 'atlas', 'shortlist', 'practitioners']

function App() {
  const [screen, setScreen] = useState('landing')
  const [routingAnswer, setRoutingAnswer] = useState(null)
  const [selectedCareerId, setSelectedCareerId] = useState(null)
  const [selectedPractitionerId, setSelectedPractitionerId] = useState(null)
  const shortlist = useShortlist()
  const { data: careerPaths } = useCareerPaths()

  const selectedCareer = (careerPaths || []).find((c) => c.id === selectedCareerId)
  const selectedPractitioner = practitioners.find((p) => p.id === selectedPractitionerId)

  // --- Onboarding sequence ---
  if (screen === 'landing') {
    return <Landing onStart={() => setScreen('roleGate')} />
  }

  if (screen === 'roleGate') {
    return (
      <RoleGate
        onBack={() => setScreen('landing')}
        onSelect={(role) =>
          setScreen(role === 'practitioner' ? 'practitionerPlaceholder' : 'routingQuestion')
        }
      />
    )
  }

  if (screen === 'practitionerPlaceholder') {
    return <PractitionerPlaceholder onBack={() => setScreen('roleGate')} />
  }

  if (screen === 'routingQuestion') {
    return (
      <RoutingQuestion
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
        onToggleShortlist={shortlist.toggle}
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
      />
    )
  }

  // --- Main app, with persistent bottom nav ---
  return (
    <div className="app-shell">
      {screen === 'explore' && (
        <FilterExplore
          shortlist={shortlist}
          onOpenDetail={setSelectedCareerId}
          initialFocus={routingAnswer === 'goal' ? 'search' : 'filter'}
        />
      )}
      {screen === 'atlas' && (
        <AtlasChat
          careers={careerPaths || []}
          onOpenCareer={setSelectedCareerId}
          profile={{
            journeyStage: routingAnswer,
            shortlisted: (careerPaths || [])
              .filter((c) => shortlist.has(c.id))
              .map((c) => c.title),
          }}
        />
      )}
      {screen === 'shortlist' && (
        <Shortlist shortlist={shortlist} onOpenDetail={setSelectedCareerId} />
      )}
      {screen === 'practitioners' && (
        <PractitionerDirectory onOpenProfile={setSelectedPractitionerId} />
      )}

      {MAIN_TABS.includes(screen) && <BottomNav active={screen} onNavigate={setScreen} />}
      <SupportWidget />
    </div>
  )
}

export default App
