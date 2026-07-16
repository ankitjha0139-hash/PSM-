// The brand mark — one source of truth. Every screen imports this instead
// of redefining it, so swapping the icon later means editing exactly this
// file, once.
export default function Mark({ size = 34, inverted = false }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill={inverted ? 'var(--card)' : 'var(--navy)'} />
      <g
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11.5,27 L13.7,10.2 M20.5,27 L18.3,10.2 M11.5,27 L20.5,27" />
        <path d="M12.6,20 L19.4,20 M13.1,16 L18.9,16" />
        <rect x="13.5" y="7" width="5" height="3.2" rx="0.7" />
        <path d="M13.2,7 L16,4.2 L18.8,7" />
        <path d="M13,8 L9.7,7 M12.6,10 L9,10.4 M19,8 L22.3,7 M19.4,10 L23,10.4" />
      </g>
    </svg>
  )
}
