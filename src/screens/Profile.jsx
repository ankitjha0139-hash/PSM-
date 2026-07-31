import { useEffect, useState } from 'react'
import { PencilSimple, WarningCircle, UserCircle } from '@phosphor-icons/react'
import { useProfile } from '../hooks/useProfile.js'
import { INTEREST_CATEGORIES } from '../data/interestCategories.js'
import EmptyState from '../components/EmptyState.jsx'
import Button from '../components/ui/Button.jsx'

const EDUCATION_LEVELS = ['Class 9–10', 'Class 11–12', 'Undergraduate', 'Postgraduate / Working']
const COURSE_LEVELS = ["Diploma", "Bachelor's", "Master's", 'Not sure yet']
const BUDGET_TIERS = ['Very Low', 'Low', 'Medium', 'High', 'Very High']
const GENDER_OPTIONS = ['Male', 'Female', 'Prefer not to say']

const emptyFields = {
  educationLevel: '',
  comfortableWithMaths: null,
  interests: [],
  careerGoal: '',
  courseLevel: '',
  marksPercentage: '',
  location: '',
  budget: '',
  entranceExams: '',
  phone: '',
  address: '',
  birthday: '',
  gender: '',
}

function fromProfile(profile) {
  if (!profile) return emptyFields
  return {
    educationLevel: profile.education_level || '',
    comfortableWithMaths: profile.comfortable_with_maths ?? null,
    interests: profile.interests || [],
    careerGoal: profile.career_goal || '',
    courseLevel: profile.preferred_course_level || '',
    marksPercentage: profile.marks_percentage ?? '',
    location: profile.preferred_location || '',
    budget: profile.budget || '',
    entranceExams: profile.entrance_exams || '',
    phone: profile.phone || '',
    address: profile.address || '',
    birthday: profile.birthday || '',
    gender: profile.gender || '',
  }
}

function hasAnyDetail(profile) {
  if (!profile) return false
  const form = fromProfile(profile)
  return Object.keys(emptyFields).some((key) => {
    const raw = form[key]
    return Array.isArray(raw) ? raw.length > 0 : raw !== '' && raw !== null
  })
}

function Field({ label, children }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</h3>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function Chips({ options, value, onChange, multi = false }) {
  const isOn = (opt) => (multi ? value.includes(opt) : value === opt)
  const toggle = (opt) => {
    if (multi) onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt])
    else onChange(opt)
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          aria-pressed={isOn(opt)}
          className={`min-h-9 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
            isOn(opt)
              ? 'border-indigo-900 bg-indigo-900 text-cream'
              : 'border-indigo-900/15 bg-white/60 text-ink-soft hover:border-indigo-900/30'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

const inputClass =
  'min-h-11 w-full rounded-2xl border border-indigo-900/15 bg-white/70 px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-faint focus-visible:border-indigo-500'

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-indigo-900/8 py-3 text-sm last:border-0">
      <span className="text-ink-faint">{label}</span>
      <span className="font-medium text-ink">{value || '—'}</span>
    </div>
  )
}

export default function Profile({ user, onSignIn }) {
  const { profile, loading, loadError, save } = useProfile(user)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(emptyFields)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    setForm(fromProfile(profile))
  }, [profile])

  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }))

  const startEdit = () => {
    setForm(fromProfile(profile))
    setSaveError(null)
    setEditing(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    const { error } = await save({
      education_level: form.educationLevel || null,
      comfortable_with_maths: form.comfortableWithMaths,
      interests: form.interests,
      career_goal: form.careerGoal.trim() || null,
      preferred_course_level: form.courseLevel || null,
      marks_percentage: form.marksPercentage === '' ? null : Number(form.marksPercentage),
      preferred_location: form.location.trim() || null,
      budget: form.budget || null,
      entrance_exams: form.entranceExams.trim() || null,
      phone: form.phone.trim() || null,
      address: form.address.trim() || null,
      birthday: form.birthday || null,
      gender: form.gender || null,
    })
    setSaving(false)
    if (error) setSaveError(error.message)
    else setEditing(false)
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
        <EmptyState
          icon={UserCircle}
          title="Sign in to build your profile"
          description="A few basics help point you toward the right careers, and keep your details synced across devices."
          action={
            <Button as="button" onClick={onSignIn} variant="primary">
              Continue with Google
            </Button>
          }
        />
      </section>
    )
  }

  const name = user.user_metadata?.full_name || user.email
  const avatarUrl = user.user_metadata?.avatar_url
  const showDashboard = !loading && !loadError && (editing || hasAnyDetail(profile))

  return (
    <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <div className="flex items-center gap-4">
        <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-indigo-900 text-xl font-semibold text-cream">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            (name || '?')[0].toUpperCase()
          )}
        </span>
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold text-indigo-900">{name}</h1>
          <p className="truncate text-sm text-ink-faint">{user.email}</p>
        </div>
        {!editing && showDashboard && (
          <Button as="button" onClick={startEdit} variant="outline" className="ml-auto">
            <PencilSimple size={15} weight="bold" /> Edit
          </Button>
        )}
      </div>

      {loading && <p className="mt-10 text-sm text-ink-soft">Loading your profile…</p>}

      {!loading && loadError && (
        <div className="mt-10">
          <EmptyState icon={WarningCircle} title="Couldn't load your profile" description={loadError} />
        </div>
      )}

      {!loading && !loadError && !showDashboard && (
        <div className="mt-10">
          <EmptyState
            icon={UserCircle}
            title="You haven't added your details yet"
            description="A few basics help us point you toward the right careers."
            action={
              <Button as="button" onClick={startEdit} variant="primary">
                Add your details
              </Button>
            }
          />
        </div>
      )}

      {!loading && !loadError && showDashboard && !editing && (
        <div className="mt-10 space-y-6">
          <div className="rounded-3xl border border-indigo-900/10 bg-white/60 p-6">
            <h2 className="font-display text-lg font-semibold text-indigo-900">Academic details</h2>
            <div className="mt-3">
              <Row label="Education level" value={form.educationLevel} />
              <Row
                label="Comfortable with Maths"
                value={form.comfortableWithMaths === null ? '' : form.comfortableWithMaths ? 'Yes' : 'No'}
              />
              <Row label="Marks / percentage" value={form.marksPercentage !== '' ? `${form.marksPercentage}%` : ''} />
              <Row label="Preferred course level" value={form.courseLevel} />
            </div>
          </div>

          <div className="rounded-3xl border border-indigo-900/10 bg-white/60 p-6">
            <h2 className="font-display text-lg font-semibold text-indigo-900">Interests</h2>
            <div className="mt-3">
              {form.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {form.interests.map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full bg-sage-50 px-3 py-1.5 text-xs font-semibold text-sage-600"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-faint">No interests picked yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-indigo-900/10 bg-white/60 p-6">
            <h2 className="font-display text-lg font-semibold text-indigo-900">Contact & preferences</h2>
            <div className="mt-3">
              <Row label="Phone" value={form.phone} />
              <Row label="Address" value={form.address} />
              <Row label="Birthday" value={form.birthday} />
              <Row label="Gender" value={form.gender} />
              <Row label="Preferred location" value={form.location} />
              <Row label="Budget" value={form.budget} />
              <Row label="Entrance exams" value={form.entranceExams} />
            </div>
          </div>

          {form.careerGoal && (
            <div className="rounded-3xl border border-sage-300/40 bg-sage-50 p-6">
              <h2 className="font-display text-lg font-semibold text-indigo-900">Career goal</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink">{form.careerGoal}</p>
            </div>
          )}
        </div>
      )}

      {!loading && !loadError && editing && (
        <div className="mt-10 space-y-6">
          <div className="rounded-3xl border border-indigo-900/10 bg-white/60 p-6 space-y-6">
            <Field label="Education level">
              <Chips options={EDUCATION_LEVELS} value={form.educationLevel} onChange={set('educationLevel')} />
            </Field>
            <Field label="Comfortable with Maths?">
              <Chips
                options={['Yes', 'No']}
                value={form.comfortableWithMaths === null ? '' : form.comfortableWithMaths ? 'Yes' : 'No'}
                onChange={(v) => set('comfortableWithMaths')(v === 'Yes')}
              />
            </Field>
            <Field label="Marks / percentage">
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Most recent %"
                value={form.marksPercentage}
                onChange={(e) => set('marksPercentage')(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Preferred course level">
              <Chips options={COURSE_LEVELS} value={form.courseLevel} onChange={set('courseLevel')} />
            </Field>
            <Field label="What draws you in?">
              <Chips options={INTEREST_CATEGORIES} value={form.interests} onChange={set('interests')} multi />
            </Field>
          </div>

          <div className="rounded-3xl border border-indigo-900/10 bg-white/60 p-6 space-y-6">
            <Field label="Phone">
              <input value={form.phone} onChange={(e) => set('phone')(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Address">
              <input
                placeholder="City, state"
                value={form.address}
                onChange={(e) => set('address')(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Birthday">
              <input
                type="date"
                value={form.birthday}
                onChange={(e) => set('birthday')(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Gender">
              <Chips options={GENDER_OPTIONS} value={form.gender} onChange={set('gender')} />
            </Field>
            <Field label="Preferred study location">
              <input
                placeholder="e.g. Mumbai, anywhere in India, abroad"
                value={form.location}
                onChange={(e) => set('location')(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Budget">
              <Chips options={BUDGET_TIERS} value={form.budget} onChange={set('budget')} />
            </Field>
            <Field label="Entrance exams taken or planning">
              <input
                placeholder="e.g. JEE, NEET, CLAT"
                value={form.entranceExams}
                onChange={(e) => set('entranceExams')(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Career goal">
              <textarea
                rows={4}
                placeholder="What are you hoping to figure out or work towards?"
                value={form.careerGoal}
                onChange={(e) => set('careerGoal')(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          {saveError && <p className="text-sm text-red-600">Couldn't save — {saveError}</p>}

          <div className="flex flex-wrap gap-3">
            <Button as="button" onClick={handleSave} variant="primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save profile'}
            </Button>
            {hasAnyDetail(profile) && (
              <Button as="button" onClick={() => setEditing(false)} variant="outline" disabled={saving}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
