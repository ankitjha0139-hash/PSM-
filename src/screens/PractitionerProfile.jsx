import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, SealCheck, Star, CalendarPlus } from '@phosphor-icons/react'
import { usePractitioners } from '../hooks/usePractitioners.js'
import { getSlotDays, makeBookingId, downloadIcs } from '../lib/bookingUtils.js'
import { useUserBookings } from '../hooks/useUserBookings.js'
import { useProfile } from '../hooks/useProfile.js'
import { submitNetlifyForm } from '../lib/netlifyForms.js'
import { capture } from '../lib/analytics.js'
import BookingSteps from '../components/BookingSteps.jsx'
import Button from '../components/ui/Button.jsx'
import EmptyState from '../components/EmptyState.jsx'

// Practitioners paste a normal share URL in the admin panel (youtu.be,
// youtube.com/watch, vimeo.com, or a Google Drive share link), and this
// turns that into the iframe-embed form. Returns null for anything else
// so we never render a broken embed.
function toEmbedUrl(url) {
  if (!url) return null
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\.|^m\./, '')
    if (host === 'youtube.com') {
      if (u.pathname === '/watch') {
        const id = u.searchParams.get('v')
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
      if (u.pathname.startsWith('/embed/')) return url
      if (u.pathname.startsWith('/shorts/')) {
        const id = u.pathname.split('/')[2]
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
      return null
    }
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1)
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    if (host === 'vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean)[0]
      return id ? `https://player.vimeo.com/video/${id}` : null
    }
    if (host === 'player.vimeo.com') return url
    if (host === 'drive.google.com') {
      // Share-link forms: /file/d/<id>/view?usp=sharing, or
      // /open?id=<id> / /uc?id=<id>. The file must be shared as "Anyone
      // with the link" or the embed shows an access-denied page instead
      // of the video.
      const fileMatch = u.pathname.match(/\/file\/d\/([^/]+)/)
      const id = fileMatch ? fileMatch[1] : u.searchParams.get('id')
      return id ? `https://drive.google.com/file/d/${id}/preview` : null
    }
    return null
  } catch {
    return null
  }
}

// Full profile + the booking flow: pick a session type, pick a real
// day/time slot, leave contact details, get a confirmation with a booking
// ID and a calendar file. Booking data is real — saved to Supabase (see
// useUserBookings), gated on sign-in at the session-type tap, so My
// Sessions can show it back later.
export default function PractitionerProfile({ practitionerId, onBack, user, onSignIn }) {
  const { data: practitioners, loading: practitionersLoading } = usePractitioners()
  const practitioner = practitioners?.find((p) => p.id === practitionerId)

  const [step, setStep] = useState('profile')
  const [sessionType, setSessionType] = useState(null)
  const [dayKey, setDayKey] = useState(null)
  const [time, setTime] = useState(null)
  const [contactName, setContactName] = useState('')
  const [contact, setContact] = useState('')
  const [booking, setBooking] = useState(null)
  const [notified, setNotified] = useState(false)
  const [saving, setSaving] = useState(false)
  const [bookingError, setBookingError] = useState(false)
  const [showConfirmToast, setShowConfirmToast] = useState(false)
  const [availability, setAvailability] = useState(null)
  const { add } = useUserBookings(user)
  const { profile, save: saveProfile } = useProfile(user)

  // Real per-practitioner availability, across every user, not just this
  // one — see netlify/functions/practitioner-availability.mjs for why this
  // has to be a server call rather than a direct Supabase query (RLS on
  // the bookings table only allows a user to see their own rows). Falls
  // back to the old deterministic-hash slots (via getSlotDays's second
  // arg being undefined) until this resolves, or if it fails.
  useEffect(() => {
    if (!practitioner?.id) return
    let cancelled = false
    fetch(`/api/practitioner-availability?practitionerId=${encodeURIComponent(practitioner.id)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setAvailability(data)
      })
      .catch(() => {
        // Leave availability as null — slotDays' hash fallback still
        // renders something sensible instead of a blank slot picker.
      })
    return () => {
      cancelled = true
    }
  }, [practitioner?.id])

  useEffect(() => {
    if (!showConfirmToast) return
    const timer = setTimeout(() => setShowConfirmToast(false), 3000)
    return () => clearTimeout(timer)
  }, [showConfirmToast])

  // Google always provides a name; the profile's phone is optional and
  // only present once someone has entered it before. When both exist,
  // the contact step is skipped entirely rather than just pre-filled —
  // per instructions, a signed-in user with a complete profile shouldn't
  // be asked again.
  const knownName = user?.user_metadata?.full_name?.trim() || ''
  const knownPhone = profile?.phone?.trim() || ''
  const hasFullContactInfo = Boolean(knownName && knownPhone)

  const slotDays = useMemo(() => getSlotDays(practitioner?.id, availability), [practitioner?.id, availability])
  const selectedDay = slotDays.find((d) => d.dateKey === dayKey)

  if (practitionersLoading) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
        <p className="text-sm text-ink-soft">Loading…</p>
      </section>
    )
  }

  if (!practitioner) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
        <EmptyState title="We couldn't find that practitioner" description="They may have been removed." />
      </section>
    )
  }

  const startBooking = (st) => {
    if (!user) {
      onSignIn()
      return
    }
    // Seeded from the profile so a full-contact-info user never sees the
    // "Almost there" step at all (see hasFullContactInfo below) — and so
    // a partial-info user's known field is already filled in if they do
    // hit that step.
    setContactName(knownName)
    setContact(knownPhone)
    setSessionType(st)
    setStep('slot')
  }

  const refetchAvailability = () => {
    if (!practitioner?.id) return
    fetch(`/api/practitioner-availability?practitionerId=${encodeURIComponent(practitioner.id)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAvailability(data)
      })
      .catch(() => {})
  }

  const confirmBooking = async () => {
    if (!contactName.trim() || !contact.trim() || saving) return
    setSaving(true)
    setBookingError(false)
    const b = {
      id: makeBookingId(),
      practitionerId: practitioner.id,
      practitionerName: practitioner.name,
      sessionLabel: sessionType.label,
      duration: sessionType.duration,
      price: sessionType.price,
      dateKey,
      dateLabel: selectedDay.dateLabel,
      dayLabel: selectedDay.dayLabel,
      time,
      contactName: contactName.trim(),
      contact: contact.trim(),
      createdAt: new Date().toISOString(),
    }
    // Notify the team through the Netlify Forms pipe. The booking itself
    // never fails on this — worst case the local record exists and the
    // confirmation copy tells the user to ping support.
    let sent = false
    try {
      await submitNetlifyForm('booking', {
        bookingId: b.id,
        practitioner: b.practitionerName,
        session: `${b.sessionLabel} (${b.duration}, ${b.price})`,
        when: `${b.dayLabel}, ${b.dateLabel} at ${b.time}`,
        name: b.contactName,
        contact: b.contact,
      })
      sent = true
    } catch {
      sent = false
    }
    // Unlike the notification above, this write IS the source of truth
    // for My Sessions — a failure here blocks the confirmation screen.
    const { error } = await add(b)
    if (error) {
      setSaving(false)
      setBookingError(true)
      // Most likely cause of a failure at this point is someone else
      // grabbing the same slot first (unique_practitioner_slot in
      // supabase/bookings.sql) — refresh so the picker reflects reality
      // instead of still showing it as open.
      refetchAvailability()
      return
    }
    // Silent save, per instructions — only runs when the profile didn't
    // already have a phone number, so this is the one time we asked.
    if (!knownPhone && contact.trim()) {
      saveProfile({ phone: contact.trim() })
    }
    setBooking(b)
    setNotified(sent)
    setShowConfirmToast(true)
    setSaving(false)
    setStep('confirmed')
    capture('booking_confirmed', { practitionerId: practitioner.id, sessionLabel: sessionType.label })
  }

  if (step === 'confirmed') {
    return (
      <section className="mx-auto max-w-lg px-5 py-16 text-center sm:px-8">
        {showConfirmToast && (
          <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
            <div className="flex items-center gap-2 rounded-full bg-indigo-900 px-4 py-2.5 text-sm font-semibold text-cream shadow-lift">
              <Check size={16} weight="bold" /> Booking confirmed!
            </div>
          </div>
        )}
        <BookingSteps current="confirmed" />
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sage-50 text-sage-600">
          <Check size={26} weight="bold" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-indigo-900">Booking confirmed!</h1>

        <div className="mt-6 space-y-3 rounded-3xl border border-indigo-900/10 bg-white/60 p-6 text-left text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-ink-faint">Session</span>
            <span className="font-semibold text-ink">{booking.sessionLabel} · {booking.duration}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-ink-faint">With</span>
            <span className="font-semibold text-ink">{booking.practitionerName}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-ink-faint">When</span>
            <span className="font-semibold text-ink">{booking.dayLabel}, {booking.dateLabel} · {booking.time}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-ink-faint">Price</span>
            <span className="font-semibold text-ink">{booking.price} — pay after the call</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-ink-faint">Booking ID</span>
            <span className="font-semibold text-ink">{booking.id}</span>
          </div>
        </div>

        <p className="mt-5 text-sm text-ink-soft">
          {notified
            ? `Our team has been notified — we'll confirm your slot and share the call link on ${booking.contact}.`
            : `Saved on this device, but we couldn't notify the team just now — please ping us via Compass with your booking ID.`}
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button as="button" onClick={() => downloadIcs(booking)} variant="outline">
            <CalendarPlus size={16} weight="bold" /> Add to calendar
          </Button>
          <Button as="button" onClick={onBack} variant="primary">
            Done
          </Button>
        </div>
      </section>
    )
  }

  if (step === 'contact') {
    return (
      <section className="mx-auto max-w-lg px-5 py-14 sm:px-8">
        <button
          type="button"
          onClick={() => setStep('slot')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-900 hover:opacity-80"
        >
          <ArrowLeft size={16} weight="bold" /> Back
        </button>
        <div className="mt-6">
          <BookingSteps current="contact" />
          <h1 className="font-display text-2xl font-semibold text-indigo-900">Almost there</h1>
          <p className="mt-2 text-sm text-ink-soft">
            {sessionType.label} with {practitioner.name} · {selectedDay.dayLabel}, {selectedDay.dateLabel} · {time}
          </p>

          <div className="mt-6 space-y-3">
            <input
              placeholder="Your name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              autoFocus
              className="min-h-12 w-full rounded-2xl border border-indigo-900/15 bg-white/70 px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint focus-visible:border-indigo-500"
            />
            <input
              placeholder="WhatsApp number or email"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="min-h-12 w-full rounded-2xl border border-indigo-900/15 bg-white/70 px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint focus-visible:border-indigo-500"
            />
          </div>
          <p className="mt-3 text-xs text-ink-faint">This is where we'll confirm the slot and send the call link.</p>

          {bookingError && (
            <p className="mt-3 text-sm text-red-600">Couldn't save your booking — check your connection and try again.</p>
          )}

          <Button
            as="button"
            onClick={confirmBooking}
            variant="primary"
            disabled={!contactName.trim() || !contact.trim() || saving}
            className="mt-6"
          >
            {saving ? 'Booking…' : <>Confirm booking <ArrowRight size={16} weight="bold" /></>}
          </Button>
        </div>
      </section>
    )
  }

  if (step === 'slot') {
    return (
      <section className="mx-auto max-w-lg px-5 py-14 sm:px-8">
        <button
          type="button"
          onClick={() => setStep('profile')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-900 hover:opacity-80"
        >
          <ArrowLeft size={16} weight="bold" /> Back
        </button>
        <div className="mt-6">
          <BookingSteps current="slot" />
          <h1 className="font-display text-2xl font-semibold text-indigo-900">
            Pick a time with {practitioner.name}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            {sessionType.label} · {sessionType.duration} · {sessionType.price}
          </p>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
            {slotDays.map((d) => (
              <button
                key={d.dateKey}
                type="button"
                onClick={() => {
                  setDayKey(d.dateKey)
                  setTime(null)
                }}
                className={`flex min-w-[64px] flex-col items-center rounded-2xl border px-3 py-2.5 ${
                  dayKey === d.dateKey
                    ? 'border-indigo-900 bg-indigo-900 text-cream'
                    : 'border-indigo-900/15 bg-white/60 text-ink-soft hover:border-indigo-900/30'
                }`}
              >
                <span className="text-xs font-semibold">{d.dayLabel}</span>
                <span className="text-sm font-bold">{d.dateLabel}</span>
              </button>
            ))}
          </div>

          {selectedDay ? (
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {selectedDay.slots.map((s) => (
                <button
                  key={s.time}
                  type="button"
                  disabled={s.taken}
                  onClick={() => setTime(s.time)}
                  className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-semibold ${
                    s.taken
                      ? 'cursor-not-allowed border-indigo-900/8 bg-indigo-900/5 text-ink-faint'
                      : time === s.time
                        ? 'border-indigo-900 bg-indigo-900 text-cream'
                        : 'border-indigo-900/15 bg-white/60 text-ink hover:border-indigo-900/30'
                  }`}
                >
                  {s.time}
                  {s.taken && <span className="ml-1 text-xs">taken</span>}
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-ink-faint">Pick a day to see available times.</p>
          )}

          {bookingError && (
            <p className="mt-3 text-sm text-red-600">Couldn't save your booking — check your connection and try again.</p>
          )}

          <Button
            as="button"
            onClick={() => (hasFullContactInfo ? confirmBooking() : setStep('contact'))}
            variant="primary"
            disabled={!time || saving}
            className="mt-6"
          >
            {saving ? 'Booking…' : <>Continue <ArrowRight size={16} weight="bold" /></>}
          </Button>
        </div>
      </section>
    )
  }

  const videoEmbedUrl = toEmbedUrl(practitioner.videoUrl)
  // Guards against malformed entries (e.g. a flat array of strings typed
  // into the admin's JSON field instead of {when,what}/{name,text}
  // objects) rendering as blank cards on the live page — the admin form
  // now rejects that shape at save time, but this protects against
  // whatever's already saved, or gets in some other way later.
  const validJourney = (practitioner.journey || []).filter((j) => j?.when && j?.what)
  const validTestimonials = (practitioner.testimonials || []).filter((t) => t?.name && t?.text)

  return (
    <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-900 hover:opacity-80"
      >
        <ArrowLeft size={16} weight="bold" /> Back
      </button>

      <div className="mt-6 flex flex-col items-center text-center">
        <span className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-indigo-900 text-3xl font-semibold text-cream">
          {practitioner.photo ? (
            <img src={practitioner.photo} alt="" className="h-full w-full object-cover" />
          ) : (
            practitioner.name[0]
          )}
        </span>
        <h1 className="mt-4 flex items-center gap-1.5 font-display text-2xl font-semibold text-indigo-900">
          {practitioner.name}
          <span title="Vetted by the Lighthouse team" className="text-sage-600">
            <SealCheck size={18} weight="fill" />
          </span>
        </h1>
        <p className="mt-1 text-ink-soft">{practitioner.credibility}</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-ink-faint">
          {practitioner.sessionsCompleted > 0 ? (
            <>
              <span className="inline-flex items-center gap-1 text-indigo-900">
                <Star size={14} weight="fill" /> {practitioner.rating}
              </span>
              <span>·</span>
              <span>{practitioner.sessionsCompleted} sessions</span>
            </>
          ) : (
            <span className="rounded-full bg-sage-50 px-2.5 py-0.5 font-semibold text-sage-600">New to Lighthouse</span>
          )}
          {practitioner.languages?.length > 0 && (
            <>
              <span>·</span>
              <span>{practitioner.languages.join(' / ')}</span>
            </>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold text-indigo-900">About</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{practitioner.bio}</p>
      </div>

      {videoEmbedUrl && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold text-indigo-900">Hear from them</h2>
          <div className="mt-3 aspect-video overflow-hidden rounded-2xl border border-indigo-900/10">
            <iframe
              src={videoEmbedUrl}
              title={`${practitioner.name} introduction video`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {validJourney.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold text-indigo-900">How they got here</h2>
          <ol className="mt-3 space-y-2 border-l-2 border-indigo-900/10 pl-4">
            {validJourney.map((j, i) => (
              <li key={i}>
                <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{j.when}</span>
                <p className="text-sm text-ink">{j.what}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-8">
        <h2 className="font-display text-lg font-semibold text-indigo-900">Can help with</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {practitioner.topics.map((t) => (
            <span key={t} className="rounded-full bg-indigo-900/5 px-3 py-1.5 text-sm font-medium text-indigo-900">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-semibold text-indigo-900">Pick a session</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {practitioner.sessionTypes.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => startBooking(st)}
              className="rounded-2xl border border-indigo-900/10 bg-white/60 p-5 text-left shadow-soft hover:border-indigo-900/25 hover:shadow-lift"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-indigo-900">{st.label}</span>
                <span className="font-display text-lg font-semibold text-indigo-900">{st.price}</span>
              </div>
              <p className="mt-1.5 text-sm text-ink-soft">{st.description}</p>
              <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                {st.duration}
              </span>
            </button>
          ))}
        </div>
      </div>

      {validTestimonials.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold text-indigo-900">What people say</h2>
          <div className="mt-3 space-y-3">
            {validTestimonials.map((t, i) => (
              <div key={i} className="rounded-2xl bg-sage-50 p-4">
                <p className="text-sm italic text-ink">"{t.text}"</p>
                <span className="mt-1 block text-xs font-semibold text-sage-600">— {t.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
