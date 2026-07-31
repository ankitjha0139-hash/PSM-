import { useMemo, useState } from 'react'
import { faqs } from '../data/faqs.js'
import { ChevronDownIcon, HelpIcon } from '../components/icons.jsx'
import EmptyState from '../components/EmptyState.jsx'

// Static — reads straight from src/data/faqs.js, the same list that
// already grounds the Compass chat widget. That widget stays the fallback
// for anything not covered here; this page is just for browsing without
// having to type a question first.
export default function Faqs() {
  const [openId, setOpenId] = useState(null)
  const [search, setSearch] = useState('')

  // keywords already exists on every entry specifically for fuzzy
  // matching (it grounds the Compass bot) — reused here instead of
  // matching on the question text alone.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return faqs
    return faqs.filter(
      (f) =>
        f.q.toLowerCase().includes(q) ||
        f.a.toLowerCase().includes(q) ||
        f.keywords?.some((k) => k.toLowerCase().includes(q))
    )
  }, [search])

  return (
    <main className="screen screen--scroll">
      <h2 className="screen__title screen__title--md">FAQs</h2>
      <p className="screen__sub" style={{ margin: '0 auto 16px', textAlign: 'center' }}>
        Common questions about the platform itself.
      </p>

      <input
        className="search-input"
        style={{ maxWidth: 560, marginInline: 'auto' }}
        placeholder="Search FAQs…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <EmptyState icon={HelpIcon} message="No FAQs match that search — try a different word." />
      ) : (
        <div className="faq-list">
          {filtered.map((f) => {
            const open = openId === f.id
            return (
              <div key={f.id} className="faq-item">
                <button
                  className="faq-item__q"
                  onClick={() => setOpenId(open ? null : f.id)}
                  aria-expanded={open}
                >
                  <span>{f.q}</span>
                  <span className={`faq-item__chevron ${open ? 'faq-item__chevron--open' : ''}`}>
                    <ChevronDownIcon />
                  </span>
                </button>
                {open && <p className="faq-item__a">{f.a}</p>}
              </div>
            )
          })}
        </div>
      )}

      <p className="screen__sub" style={{ margin: '20px auto 0', textAlign: 'center' }}>
        Still stuck? Tap Compass in the corner — it's grounded in these same answers.
      </p>
    </main>
  )
}
