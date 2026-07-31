export default function SkeletonSessionCard() {
  return (
    <div aria-hidden="true" className="animate-pulse rounded-3xl border border-indigo-900/10 bg-white/60 p-6">
      <div className="flex items-center justify-between">
        <div className="h-4 w-2/5 rounded bg-indigo-900/10" />
        <div className="h-5 w-16 rounded-full bg-indigo-900/10" />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-indigo-900/10" />
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-indigo-900/10" />
          <div className="h-3 w-32 rounded bg-indigo-900/10" />
        </div>
      </div>
      <div className="mt-4 h-3 w-1/3 rounded bg-indigo-900/10" />
    </div>
  )
}
