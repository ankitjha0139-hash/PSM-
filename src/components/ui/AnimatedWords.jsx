import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

// Rotating word inside a headline, e.g. "Find your next [step]". Pauses
// entirely under prefers-reduced-motion — swaps the word instantly on an
// interval instead of animating, so no motion plays but the copy still
// rotates for anyone reading it aloud via screen reader (aria-live).
export default function AnimatedWords({ words, interval = 2200, className = '' }) {
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval)
    return () => clearInterval(id)
  }, [words.length, interval])

  return (
    <span className={`relative inline-grid ${className}`} aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -14 }}
          transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="col-start-1 row-start-1 text-sage-600"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
      {/* Reserves the widest word's width so the layout never shifts. */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {words.reduce((a, b) => (a.length > b.length ? a : b))}
      </span>
    </span>
  )
}
