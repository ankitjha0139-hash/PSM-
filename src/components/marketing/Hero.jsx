import { motion } from 'framer-motion'
import { CaretRight, ChatCircleDots } from '@phosphor-icons/react'
import Button from '../ui/Button.jsx'
import AnimatedWords from '../ui/AnimatedWords.jsx'
import TrajectoryGraphic from '../ui/TrajectoryGraphic.jsx'
import GlowOrb from '../ui/GlowOrb.jsx'

export default function Hero({ onNavigate }) {
  return (
    <section className="relative overflow-hidden pt-20 pb-20 sm:pt-28 sm:pb-28">
      <GlowOrb tone="indigo" className="-left-32 top-10 h-96 w-96 opacity-70" animate="drift" />
      <GlowOrb tone="sage" className="right-0 top-64 h-72 w-72 opacity-70" animate="breathe" />

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-900/15 bg-white/60 px-4 py-1.5 text-sm font-medium text-indigo-900 backdrop-blur-sm">
            For students in Class 10–12, and the parents deciding with them
          </span>

          <h1 className="mt-6 font-display text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-indigo-900 sm:text-6xl">
            Find your next{' '}
            <AnimatedWords words={['step', 'direction', 'honest answer']} />
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            Every career path open to you — costs, exams, honest odds, and the doors it
            opens or closes — plus real people who've actually lived it, before you make
            a choice you can't take back.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button as="button" onClick={() => onNavigate('explore')} variant="primary">
              Explore careers, free <CaretRight size={16} weight="bold" />
            </Button>
            <Button as="button" onClick={() => onNavigate('atlas')} variant="ghost">
              <ChatCircleDots size={18} weight="fill" /> Ask Atlas, our AI guide
            </Button>
          </div>

          <p className="mt-8 text-sm font-medium text-ink-faint">
            Neutral by design — we're paid for the conversation, not for referrals.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <TrajectoryGraphic />
        </motion.div>
      </div>
    </section>
  )
}
