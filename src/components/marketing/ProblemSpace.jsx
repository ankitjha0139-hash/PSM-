import { motion } from 'framer-motion'
import { WarningCircle, Compass } from '@phosphor-icons/react'

const TRAP = [
  'Streams, subjects, and entrance exams get decided as early as age 15 — with almost no clarity',
  'Information is scattered across a dozen sites, contradictory, and overwhelming',
  'If you don’t already know someone in the field, there’s no one honest to ask',
]

const PATH = [
  'Every path laid out honestly — including the downside nobody else mentions',
  'One place to explore, compare, and shortlist — not twelve open tabs',
  'A real conversation with someone who actually does the job, before you commit',
]

export default function ProblemSpace() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl font-semibold tracking-tight text-indigo-900 sm:text-4xl">
            Well-off families have an uncle who's an architect. Everyone deserves that.
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            Aspirational students — especially outside the big cities — have the same
            ambition, and no one to ask. That gap is what we exist to close.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-indigo-900/10 bg-white/60 p-8"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-900/8 text-indigo-900">
                <WarningCircle size={22} weight="bold" />
              </span>
              <h3 className="font-display text-xl font-semibold text-indigo-900">The old way</h3>
            </div>
            <ul className="mt-6 space-y-4">
              {TRAP.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-ink-soft">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-900/30" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-sage-300/40 bg-sage-50 p-8 shadow-soft"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sage-500/15 text-sage-600">
                <Compass size={22} weight="bold" />
              </span>
              <h3 className="font-display text-xl font-semibold text-indigo-900">The Lighthouse way</h3>
            </div>
            <ul className="mt-6 space-y-4">
              {PATH.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-ink">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-500" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
