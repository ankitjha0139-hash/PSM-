import Logo from '../ui/Logo.jsx'

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Explore paths', screen: 'explore' },
      { label: 'Atlas, the AI guide', screen: 'atlas' },
      { label: 'Talk to someone real', screen: 'practitioners' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Stories', href: '#stories' },
    ],
  },
]

export default function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-indigo-900/10 bg-cream-soft">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              A career-clarity platform for Indian students — every path, laid out
              honestly, plus real people who've lived it.
            </p>
          </div>

          <div className="flex gap-16">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-indigo-900">{col.title}</h4>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) =>
                    link.screen ? (
                      <li key={link.label}>
                        <button
                          type="button"
                          onClick={() => onNavigate(link.screen)}
                          className="text-sm text-ink-soft hover:text-indigo-900"
                        >
                          {link.label}
                        </button>
                      </li>
                    ) : (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-sm text-ink-soft hover:text-indigo-900"
                        >
                          {link.label}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-indigo-900/10 pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Lighthouse.guide</p>
          <p>Built as a PSM Part B project, IIM Udaipur.</p>
        </div>
      </div>
    </footer>
  )
}
