// Placeholder matching CareerCard's own shape (badge/title/meta lines),
// shown in .career-grid while useCareerPaths() is still loading, instead
// of a blank text line popping into real cards with no transition.
export default function SkeletonCareerCard() {
  return (
    <div className="career-card skeleton-card" aria-hidden="true">
      <span className="skeleton-line skeleton-line--badge" />
      <span className="skeleton-line skeleton-line--title" />
      <span className="skeleton-line skeleton-line--meta" />
      <span className="skeleton-line skeleton-line--meta-short" />
    </div>
  )
}
