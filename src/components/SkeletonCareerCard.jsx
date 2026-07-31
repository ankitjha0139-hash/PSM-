export default function SkeletonCareerCard() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full animate-pulse flex-col rounded-3xl border border-indigo-900/10 bg-white/60 p-6"
    >
      <div className="h-5 w-20 rounded-full bg-indigo-900/10" />
      <div className="mt-4 h-5 w-3/4 rounded bg-indigo-900/10" />
      <div className="mt-3 h-4 w-full rounded bg-indigo-900/10" />
      <div className="mt-1.5 h-4 w-2/3 rounded bg-indigo-900/10" />
      <div className="mt-5 h-3 w-1/2 rounded bg-indigo-900/10" />
      <div className="mt-auto h-4 w-2/5 rounded bg-indigo-900/10 pt-5" />
    </div>
  )
}
