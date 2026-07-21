// Placeholder matching session-card's own shape (title/coach/footer),
// shown in .session-list while useUserBookings() is still loading — same
// pattern as SkeletonCareerCard, so My Sessions doesn't fall back to plain
// "Loading…" text the way Explore/Shortlist don't either.
export default function SkeletonSessionCard() {
  return (
    <div className="session-card skeleton-card" aria-hidden="true">
      <span className="skeleton-line skeleton-line--title" />
      <div className="session-card__coach">
        <span className="skeleton-avatar" />
        <div className="skeleton-card">
          <span className="skeleton-line skeleton-line--meta-short" />
          <span className="skeleton-line skeleton-line--meta" />
        </div>
      </div>
    </div>
  )
}
