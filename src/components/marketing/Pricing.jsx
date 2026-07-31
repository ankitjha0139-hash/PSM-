import { motion } from 'framer-motion'
import { Check } from '@phosphor-icons/react'
import Button from '../ui/Button.jsx'

const TIERS = [
  {
    name: 'Explore',
    price: 'Free',
    unit: 'always',
    description: 'For getting your bearings before you talk to anyone.',
    features: [
      'Browse every career path',
      'Filter, search & shortlist',
      'Ask Atlas, our AI guide',
      'Honest notes on every path',
    ],
    cta: 'Start exploring',
    target: 'explore',
    featured: false,
  },
  {
    name: 'Quick Chat',
    price: '₹349',
    unit: '15 min call',
    description: 'One focused question, answered by someone who lives it.',
    features: [
      'Everything in Explore',
      '1-on-1 with a real practitioner',
      'Ask the one thing that’s stuck',
      'Recording-free, judgment-free',
    ],
    cta: 'Book a Quick Chat',
    target: 'practitioners',
    featured: true,
  },
  {
    name: 'Deep Dive',
    price: '₹899',
    unit: '45 min call',
    description: 'The full picture, before you commit years to it.',
    features: [
      'Everything in Quick Chat',
      'A real "day in the life" walkthrough',
      'Honest odds & how to actually get there',
      'Follow-up questions welcome',
    ],
    cta: 'Book a Deep Dive',
    target: 'practitioners',
    featured: false,
  },
]

export default function Pricing({ onNavigate }) {
  return (
    <section id="sessions" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-indigo-900 sm:text-4xl">
            Talk to a real person
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            Exploring is always free. When you're ready for a second opinion, book time
            with someone who's actually done the job.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-start">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative rounded-3xl border p-8 ${
                tier.featured
                  ? 'border-transparent bg-indigo-900 text-cream shadow-lift lg:-translate-y-3'
                  : 'border-indigo-900/10 bg-white/60 text-ink shadow-soft'
              }`}
            >
              {tier.featured && (
                <>
                  <span
                    aria-hidden="true"
                    className="animate-breathe absolute -inset-px -z-10 rounded-3xl bg-[radial-gradient(circle_at_50%_0%,var(--color-sage-300),transparent_70%)] opacity-60 blur-xl"
                  />
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sage-500 px-4 py-1 text-xs font-bold uppercase tracking-wide text-indigo-950 shadow-soft">
                    Most booked
                  </span>
                </>
              )}

              <h3
                className={`font-display text-xl font-semibold ${tier.featured ? 'text-cream' : 'text-indigo-900'}`}
              >
                {tier.name}
              </h3>
              <p className={`mt-1 text-sm ${tier.featured ? 'text-cream/70' : 'text-ink-faint'}`}>
                {tier.description}
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-4xl font-semibold tracking-tight">
                  {tier.price}
                </span>
                <span className={`text-sm ${tier.featured ? 'text-cream/70' : 'text-ink-faint'}`}>
                  {tier.unit}
                </span>
              </div>

              <ul className="mt-7 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <Check
                      size={16}
                      weight="bold"
                      className={`mt-0.5 shrink-0 ${tier.featured ? 'text-sage-300' : 'text-sage-600'}`}
                    />
                    <span className={tier.featured ? 'text-cream/90' : 'text-ink-soft'}>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                as="button"
                onClick={() => onNavigate(tier.target)}
                variant={tier.featured ? 'sage' : 'outline'}
                className="mt-8 w-full"
              >
                {tier.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-ink-faint">
          Session fees pay for the practitioner's time — never for a referral.
        </p>
      </div>
    </section>
  )
}
