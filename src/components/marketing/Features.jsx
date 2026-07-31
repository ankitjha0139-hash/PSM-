import { motion } from 'framer-motion'
import { Compass, Sparkle, BookOpenText, UsersThree } from '@phosphor-icons/react'

const STREAMS = ['Science', 'Commerce', 'Arts', 'Vocational', 'Govt']

const cardMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
}

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-indigo-900 sm:text-4xl">
            Everything you need to decide, not just more to read
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            Four ways in — pick whichever fits how you think.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {/* A — Explore every path (tall, 2x2) */}
          <motion.div
            {...cardMotion}
            transition={{ duration: 0.5 }}
            className="group relative overflow-hidden rounded-3xl border border-indigo-900/10 bg-white/60 p-8 shadow-soft transition-shadow hover:shadow-lift sm:col-span-2 lg:col-span-2 lg:row-span-2"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-900 text-cream">
              <Compass size={24} weight="bold" />
            </span>
            <h3 className="mt-6 font-display text-xl font-semibold text-indigo-900">
              Explore every path
            </h3>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink-soft">
              Filter and search 140+ career paths by stream, interest, or subjects you're
              already good at. See what each one really means before you narrow down.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {STREAMS.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-indigo-900/15 bg-cream px-3 py-1.5 text-xs font-semibold text-indigo-900 transition-colors group-hover:border-sage-400 group-hover:bg-sage-50"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          {/* B — Atlas AI guide */}
          <motion.div
            {...cardMotion}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-3xl border border-indigo-900/10 bg-white/60 p-7 shadow-soft transition-shadow hover:shadow-lift"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sage-500 text-indigo-950">
              <Sparkle size={20} weight="bold" />
            </span>
            <h3 className="mt-5 font-display text-lg font-semibold text-indigo-900">
              Atlas, your AI guide
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Not sure what you want yet? Talk it through — grounded in verified data, not
              guesses.
            </p>
          </motion.div>

          {/* C — Honest career pages */}
          <motion.div
            {...cardMotion}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="rounded-3xl border border-indigo-900/10 bg-white/60 p-7 shadow-soft transition-shadow hover:shadow-lift"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-100 text-indigo-900">
              <BookOpenText size={20} weight="bold" />
            </span>
            <h3 className="mt-5 font-display text-lg font-semibold text-indigo-900">
              Honest career pages
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Fees, exams, entry pay, and the "honest note" — the downside nobody else
              mentions.
            </p>
          </motion.div>

          {/* D — Real practitioner sessions (wide) */}
          <motion.div
            {...cardMotion}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="rounded-3xl border border-indigo-900/10 bg-white/60 p-7 shadow-soft transition-shadow hover:shadow-lift sm:col-span-2 lg:col-span-2"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-900 text-cream">
              <UsersThree size={20} weight="bold" />
            </span>
            <h3 className="mt-5 font-display text-lg font-semibold text-indigo-900">
              Real practitioner sessions
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
              Book a paid 1-on-1 with someone who actually does the job — a real "day in
              the life," not a generic counsellor.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
