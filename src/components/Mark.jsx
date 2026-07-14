// The brand mark — one source of truth. Every screen imports this instead
// of redefining it, so swapping the icon later means editing exactly this
// file, once.
export default function Mark({ size = 34, inverted = false }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill={inverted ? 'var(--card)' : 'var(--navy)'} />
      <path
        d="M9 21 L16 9 L23 21"
        stroke="var(--accent)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
