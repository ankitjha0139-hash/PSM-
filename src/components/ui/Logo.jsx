export default function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <path d="M13 2 L20 22 H6 Z" fill="var(--color-indigo-900)" />
        <path d="M13 2 L16.5 22 H13 Z" fill="var(--color-sage-500)" />
        <circle cx="13" cy="8" r="2.2" fill="var(--color-cream)" />
      </svg>
      <span className="font-display text-lg font-semibold tracking-tight text-indigo-900">
        Lighthouse<span className="text-sage-600">.guide</span>
      </span>
    </span>
  )
}
