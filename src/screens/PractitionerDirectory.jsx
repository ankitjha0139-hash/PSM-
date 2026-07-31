import { useState } from 'react'
import { practitioners } from '../data/practitioners.js'
import PractitionerCard from '../components/PractitionerCard.jsx'
import Pagination from '../components/Pagination.jsx'
import { BackIcon } from '../components/icons.jsx'

const PAGE_SIZE = 12

export default function PractitionerDirectory({ onOpenProfile, backToCareerId, onBackToCareer }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(practitioners.length / PAGE_SIZE))
  const paged = practitioners.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <main className="screen screen--scroll">
      {/* Only shown when arriving via "Talk to a real X" on a career page
          (no match, or backing out of a matched profile) — a deliberate
          tab tap never sets this, so regular visits to this tab don't get
          a stray back link that goes nowhere useful. */}
      {backToCareerId && (
        <button className="link-back" onClick={onBackToCareer} aria-label="Back to career" style={{ marginBottom: 8 }}>
          <BackIcon />
        </button>
      )}
      <h2 className="screen__title screen__title--md">Career Practitioners</h2>
      <p className="screen__sub" style={{ margin: '0 auto 16px', textAlign: 'center' }}>
        Talk to someone who's actually done it.
      </p>

      <div className="prac-grid">
        {paged.map((p) => (
          <PractitionerCard key={p.id} practitioner={p} onOpen={onOpenProfile} />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </main>
  )
}
