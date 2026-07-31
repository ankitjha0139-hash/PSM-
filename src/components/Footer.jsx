import Mark from './Mark.jsx'

// Rendered once, right after whichever main-tab screen is active (see
// App.jsx) — appears at the bottom of Explore/Atlas/Shortlist/Sessions/
// Practitioners/About/FAQs/Financing without any per-screen duplication.
// FAQs moved here from the primary nav (see TopNav.jsx's NAV_ITEMS);
// Financing is new and never had a nav slot to begin with.
export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <Mark size={22} />
        <span>Lighthouse.guide</span>
      </div>
      <div className="footer__links">
        <button className="footer__link" onClick={() => onNavigate('faqs')}>
          FAQs
        </button>
        <button className="footer__link" onClick={() => onNavigate('financing')}>
          Financing options
        </button>
      </div>
      <p className="footer__copyright">© {new Date().getFullYear()} Lighthouse.guide</p>
    </footer>
  )
}
