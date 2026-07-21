import { useState } from 'react'
import { faqs } from '../data/faqs.js'
import { ChevronDownIcon } from '../components/icons.jsx'

// Static — reads straight from src/data/faqs.js, the same list that
// already grounds the Compass chat widget. That widget stays the fallback
// for anything not covered here; this page is just for browsing without
// having to type a question first.
export default function Faqs() {
  const [openId, setOpenId] = useState(null)

  return (
    <main className="screen screen--scroll">
      <h2 className="screen__title screen__title--md">FAQs</h2>
      <p className="screen__sub" style={{ margin: '0 auto 16px', textAlign: 'center' }}>
        Common questions about the platform itself.
      </p>

      <div className="faq-list">
        {faqs.map((f) => {
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

      <p className="screen__sub" style={{ margin: '20px auto 0', textAlign: 'center' }}>
        Still stuck? Tap Compass in the corner — it's grounded in these same answers.
      </p>
    </main>
  )
}
