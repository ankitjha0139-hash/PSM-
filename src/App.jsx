function App() {
  return (
    <main className="skeleton">
      <div className="mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="28" height="28">
          <rect width="32" height="32" rx="8" fill="#1B2A4A" />
          <path
            d="M9 21 L16 9 L23 21"
            stroke="#F2C572"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p className="eyebrow">Phase 0 &middot; Skeleton</p>
      <h1>Career Clarity Platform</h1>
      <p className="sub">
        This page exists to prove one thing: a push to <code>main</code> shows
        up here, live, without anyone touching the Netlify dashboard by hand.
      </p>

      <div className="status">
        <span className="dot" aria-hidden="true" />
        Deploy pipeline connected
      </div>

      <p className="footnote">
        Next up: the real Explore flow replaces this page in Phase 1.
      </p>

      <p className="footnote">
        🟢 Live-deploy test #2 — repo is now public, multi-contributor builds
        should work. If you can read this, the pipeline is confirmed working.
      </p>
    </main>
  );
}

export default App;
