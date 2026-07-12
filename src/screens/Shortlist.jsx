import { useState } from 'react'
import { useCareerPaths } from '../hooks/useCareerPaths.js'
import CareerCard from '../components/CareerCard.jsx'

// Comparing is the whole point of shortlisting — with 2+ saved careers a
// side-by-side table shows the decision-driving facts in one glance
// (values only, no prose — people are choosing here, not reading).
const COMPARE_ROWS = [
  { label: 'Duration', get: (c) => c.duration_years },
  { label: 'Fees', get: (c) => c.fees },
  { label: 'Entry pay', get: (c) => c.entry_pay },
  { label: 'Earning from', get: (c) => c.time_bucket },
  { label: 'Maths needed', get: (c) => (c.requires_maths ? 'Yes' : 'No') },
  { label: 'Exams', get: (c) => (c.exams?.length ? c.exams.join(', ') : 'None') },
  { label: 'Govt route', get: (c) => (c.govt_job_overlap ? 'Yes' : '—') },
]

export default function Shortlist({ shortlist, onOpenDetail }) {
  const { data: careerPaths, loading, error } = useCareerPaths()
  const [comparing, setComparing] = useState(false)
  const saved = (careerPaths || []).filter((c) => shortlist.has(c.id))

  return (
    <main className="screen screen--scroll">
      <h2 className="screen__title screen__title--md">Your shortlist</h2>
      {loading && !careerPaths && <p className="empty-state">Loading career paths…</p>}
      {error && !careerPaths && (
        <p className="empty-state">Couldn't load career data — check your connection and try again.</p>
      )}
      {!loading && !error && saved.length === 0 && (
        <p className="empty-state">Nothing shortlisted yet — tap ♥ on any career to add it here.</p>
      )}

      {saved.length >= 2 && (
        <div className="compare-toggle-row">
          <button
            className={`chip ${comparing ? 'chip--on' : ''}`}
            onClick={() => setComparing((v) => !v)}
          >
            {comparing ? 'Hide comparison' : `Compare all ${saved.length} ⇆`}
          </button>
        </div>
      )}

      {comparing && saved.length >= 2 && (
        <div className="compare-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th></th>
                {saved.map((c) => (
                  <th key={c.id}>
                    <button className="compare-title" onClick={() => onOpenDetail(c.id)}>
                      {c.title}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.label}>
                  <td className="compare-label">{row.label}</td>
                  {saved.map((c) => (
                    <td key={c.id}>{row.get(c) || '—'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="career-grid">
        {saved.map((c) => (
          <CareerCard
            key={c.id}
            career={c}
            shortlisted
            onToggleShortlist={shortlist.toggle}
            onOpen={onOpenDetail}
          />
        ))}
      </div>
    </main>
  )
}
