import { motion, useReducedMotion } from 'framer-motion'
import GlowOrb from './GlowOrb.jsx'

const PATHS = [
  'M40,300 C120,260 160,180 260,150 C340,126 380,90 420,40',
  'M40,300 C110,300 170,260 240,240 C330,214 380,170 430,150',
  'M40,300 C100,330 150,340 220,320 C310,296 370,300 430,270',
]

const NODES = [
  { cx: 420, cy: 40, r: 7, tone: 'var(--color-sage-500)', delay: 0 },
  { cx: 430, cy: 150, r: 6, tone: 'var(--color-indigo-500)', delay: 0.6 },
  { cx: 430, cy: 270, r: 6, tone: 'var(--color-sage-500)', delay: 1.1 },
  { cx: 260, cy: 150, r: 5, tone: 'var(--color-indigo-300)', delay: 0.3 },
  { cx: 40, cy: 300, r: 9, tone: 'var(--color-indigo-900)', delay: 0 },
]

// Abstract "career trajectories" — branching paths from one starting
// point, fanning out to different destinations. Purely illustrative;
// mirrors the hero copy without claiming to represent real data.
export default function TrajectoryGraphic() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <GlowOrb tone="sage" className="-right-10 -top-10 h-56 w-56" animate="breathe" />
      <GlowOrb tone="indigo" className="-bottom-16 -left-10 h-64 w-64" animate="drift" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-[32px] border border-indigo-900/10 bg-white/50 p-6 shadow-lift backdrop-blur-md"
      >
        <svg viewBox="0 0 470 340" fill="none" className="h-full w-full" role="img" aria-label="Illustration of branching career paths">
          {PATHS.map((d, i) => (
            <motion.path
              key={d}
              d={d}
              stroke="var(--color-indigo-900)"
              strokeOpacity={0.16 + i * 0.05}
              strokeWidth={2}
              strokeLinecap="round"
              initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, delay: 0.2 + i * 0.15, ease: 'easeOut' }}
            />
          ))}
          {NODES.map((n) => (
            <motion.circle
              key={`${n.cx}-${n.cy}`}
              cx={n.cx}
              cy={n.cy}
              r={n.r}
              fill={n.tone}
              initial={{ opacity: 0, scale: 0 }}
              animate={
                reduceMotion
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 1, scale: 1, y: [0, -6, 0] }
              }
              transition={{
                scale: { duration: 0.4, delay: 0.9 + n.delay },
                opacity: { duration: 0.4, delay: 0.9 + n.delay },
                y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: n.delay },
              }}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  )
}
