// Shared numbered pagination — Prev/Next plus first/last/current±1 with
// "…" collapsing the gaps, so a 12-page list (Explore) doesn't render 12
// raw buttons. Renders nothing for a single page — pagination controls
// are noise when there's nothing to page through.
function pageNumbers(page, totalPages) {
  const pages = new Set([1, totalPages, page, page - 1, page + 1])
  return [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const numbers = pageNumbers(page, totalPages)

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination__btn"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>

      {numbers.map((n, i) => {
        const prev = numbers[i - 1]
        const gap = prev !== undefined && n - prev > 1
        return (
          <span key={n} style={{ display: 'contents' }}>
            {gap && <span className="pagination__ellipsis">…</span>}
            <button
              className={`pagination__btn ${n === page ? 'pagination__btn--active' : ''}`}
              onClick={() => onChange(n)}
              aria-current={n === page ? 'page' : undefined}
            >
              {n}
            </button>
          </span>
        )
      })}

      <button
        className="pagination__btn"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </nav>
  )
}
