import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { List, X } from '@phosphor-icons/react'
import Logo from './ui/Logo.jsx'
import AccountButton from './AccountButton.jsx'

const TABS = [
  { id: 'explore', label: 'Explore' },
  { id: 'atlas', label: 'Atlas' },
  { id: 'practitioners', label: 'Talk to someone' },
]

export default function TopNav({ screen, onNavigate, user, onSignIn, onSignOut }) {
  const [open, setOpen] = useState(false)
  const activeTab = TABS.find((t) => t.id === screen) ? screen : null

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const go = (id) => {
    onNavigate(id)
    setOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-indigo-900/10 bg-cream/85 backdrop-blur-lg">
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8"
        >
          <button type="button" onClick={() => go('home')} aria-label="Lighthouse.guide home">
            <Logo />
          </button>

          <div className="hidden items-center gap-7 lg:flex">
            <ul className="flex items-center gap-7">
              {TABS.map((tab) => (
                <li key={tab.id}>
                  <button
                    type="button"
                    onClick={() => go(tab.id)}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                    className={`text-[15px] font-medium transition-colors ${
                      activeTab === tab.id ? 'text-indigo-900' : 'text-ink-soft hover:text-indigo-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
            <AccountButton
              user={user}
              onSignIn={onSignIn}
              onSignOut={onSignOut}
              onOpenProfile={() => go('profile')}
              onOpenSessions={() => go('mySessions')}
            />
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="grid h-11 w-11 place-items-center rounded-full text-indigo-900 hover:bg-indigo-900/5 lg:hidden"
          >
            <List size={24} weight="bold" />
          </button>
        </nav>
      </header>

      {/* Rendered as a sibling of <header>, not inside it — the header's
          backdrop-blur-lg establishes a CSS containing block for `fixed`
          descendants (same as transform/filter would), which used to trap
          this "fixed inset-0" overlay inside the header's own ~64px-tall
          box instead of the viewport. Its content then overflowed that
          box with no background behind it, painting on top of whatever
          page content came next. */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-indigo-950/40 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col gap-8 bg-cream px-6 py-6 shadow-lift"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-11 w-11 place-items-center rounded-full text-indigo-900 hover:bg-indigo-900/5"
                >
                  <X size={24} weight="bold" />
                </button>
              </div>

              <ul className="flex flex-col gap-1">
                {TABS.map((tab) => (
                  <li key={tab.id}>
                    <button
                      type="button"
                      onClick={() => go(tab.id)}
                      className={`block w-full rounded-xl px-3 py-3 text-left text-lg font-medium ${
                        activeTab === tab.id ? 'bg-indigo-900/5 text-indigo-900' : 'text-ink hover:bg-indigo-900/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-auto border-t border-indigo-900/10 pt-4">
                <AccountButton
                  user={user}
                  onSignIn={onSignIn}
                  onSignOut={onSignOut}
                  onOpenProfile={() => go('profile')}
                  onOpenSessions={() => go('mySessions')}
                  compact
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
