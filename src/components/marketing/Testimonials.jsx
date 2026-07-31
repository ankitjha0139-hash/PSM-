import { Star } from '@phosphor-icons/react'
import { useTestimonials } from '../../hooks/useTestimonials.js'

function Card({ story }) {
  return (
    <figure className="w-[340px] shrink-0 rounded-3xl border border-indigo-900/10 bg-white/70 p-6 shadow-soft sm:w-[380px]">
      <div className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={15} weight="fill" className="text-sage-500" />
        ))}
      </div>
      <blockquote className="mt-4 text-[15px] leading-relaxed text-ink">“{story.quote}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-900 text-sm font-semibold text-cream">
          {story.initials}
        </span>
        <div>
          <p className="text-sm font-semibold text-indigo-900">{story.name}</p>
          <p className="text-xs text-ink-faint">{story.tag}</p>
        </div>
      </figcaption>
      <p className="mt-4 rounded-xl bg-sage-50 px-3 py-2 text-xs font-medium text-sage-600">
        {story.from_situation} → {story.to_outcome}
      </p>
    </figure>
  )
}

export default function Testimonials() {
  const { data: stories, loading, error } = useTestimonials()

  // Marketing content, not a functional screen — if it's not there yet
  // (still loading, failed to load, or admin hasn't added any), the
  // section just doesn't render rather than showing an empty/broken strip.
  if (loading || error || !stories?.length) return null

  const loop = [...stories, ...stories]

  return (
    <section id="stories" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-indigo-900 sm:text-4xl">
            From "no idea" to a real decision
          </h2>
          <p className="mt-4 text-lg text-ink-soft">Illustrative stories — the real ones start with you.</p>
        </div>
      </div>

      <div className="group relative mt-14 overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] motion-reduce:overflow-x-auto sm:[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="animate-marquee flex w-max gap-5 px-5 group-hover:[animation-play-state:paused] motion-reduce:animate-none sm:px-8">
          {loop.map((story, i) => (
            <Card key={`${story.id}-${i}`} story={story} />
          ))}
        </div>
      </div>
    </section>
  )
}
