import { useState } from 'react'
import './App.css'
import { careerPaths } from './data/careerPaths.js'
import { useShortlist } from './hooks/useShortlist.js'

import Landing from './screens/Landing.jsx'
import RoleGate from './screens/RoleGate.jsx'
import PractitionerPlaceholder from './screens/PractitionerPlaceholder.jsx'
import RoutingQuestion from './screens/RoutingQuestion.jsx'
import FilterExplore from './screens/FilterExplore.jsx'
import AtlasChat from './screens/AtlasChat.jsx'
import CareerDetail from './screens/CareerDetail.jsx'
import Shortlist from './screens/Shortlist.jsx'
import PractitionerDirectory from './screens/PractitionerDirectory.jsx'
import BottomNav from './components/BottomNav.jsx'

// Screens that show the persistent bottom nav — everything past onboarding.
const MAIN_TABS = ['explore', 'atlas', 'shortlist', 'practitioners']

function App() {
  const [screen, setScreen] = useState('landing')
  const [routingAnswer, setRoutingAnswer] = useState(null)
  const [selectedCareerId, setSelectedCareerId] = useState(null)
  const shortlist = useShortlist()

  const selectedCareer = careerPaths.find((c) => c.id === selectedCareerId)

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
          setSelectedCareerId(null)
          setScreen('practitioners')
        }}
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
        <AtlasChat shortlist={shortlist} onOpenDetail={setSelectedCareerId} />
      )}
      {screen === 'shortlist' && (
        <Shortlist shortlist={shortlist} onOpenDetail={setSelectedCareerId} />
      )}
      {screen === 'practitioners' && <PractitionerDirectory />}

      {MAIN_TABS.includes(screen) && <BottomNav active={screen} onNavigate={setScreen} />}
    </div>
  )
}

export default App
