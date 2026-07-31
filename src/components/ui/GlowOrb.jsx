// Soft radial-gradient blur blob — the "organic background blur" signal
// from the brief. Purely decorative: aria-hidden, and its only motion
// (breathe/drift) is skipped automatically when prefers-reduced-motion
// is set (see the global animation-duration override in index.css).
export default function GlowOrb({ className = '', tone = 'indigo', animate = 'breathe' }) {
  const tones = {
    indigo: 'from-indigo-300/50 via-indigo-500/20 to-transparent',
    sage: 'from-sage-200/70 via-sage-300/30 to-transparent',
  }
  const motion = animate === 'drift' ? 'animate-drift' : 'animate-breathe'

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full bg-[radial-gradient(circle,var(--tw-gradient-stops))] blur-3xl ${tones[tone]} ${motion} ${className}`}
    />
  )
}
