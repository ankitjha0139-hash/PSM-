import { CaretLeft, CaretRight } from '@phosphor-icons/react'

// Prev/Next + "Page X of Y" rather than numbered page buttons — with
// 140+ careers at PAGE_SIZE items per page that's a dozen-plus numbers to
// render, and jumping to an arbitrary page isn't a real use case here
// (search/filter narrows the list instead).
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const goTo = (next) => {
    if (next < 1 || next > totalPages) return
    onChange(next)
  }

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="grid h-11 w-11 place-items-center rounded-full border border-indigo-900/15 bg-white/60 text-indigo-900 hover:border-indigo-900/30 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <CaretLeft size={16} weight="bold" />
      </button>

      <span className="text-sm font-medium text-ink-soft">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="grid h-11 w-11 place-items-center rounded-full border border-indigo-900/15 bg-white/60 text-indigo-900 hover:border-indigo-900/30 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <CaretRight size={16} weight="bold" />
      </button>
    </nav>
  )
}
