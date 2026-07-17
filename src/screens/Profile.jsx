import { useEffect, useState } from 'react'
import { BackIcon, ArrowRightIcon, TargetIcon } from '../components/icons.jsx'
import { useProfile } from '../hooks/useProfile.js'
import { INTEREST_CATEGORIES } from '../data/interestCategories.js'
import EmptyState from '../components/EmptyState.jsx'

const EDUCATION_LEVELS = ['Class 9–10', 'Class 11–12', 'Undergraduate', 'Postgraduate / Working']
const COURSE_LEVELS = ["Diploma", "Bachelor's", "Master's", 'Not sure yet']
// Same tier language as career.fees_bucket, so "budget" reads consistently
// with the rest of the app instead of inventing a new scale.
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

// Has anything actually been saved yet? Drives view mode's empty state vs.
// the dashboard layout on a brand new profile.
function hasAnyDetail(profile) {
  if (!profile) return false
  return Object.keys(emptyFields).some((key) => {
    const raw = fromProfile(profile)[key]
    return Array.isArray(raw) ? raw.length > 0 : raw !== '' && raw !== null
  })
}

// Reachable only from the signed-in account dropdown (see AccountButton.jsx)
// — optional and never auto-opened, so it can't get in the way of the
// normal browsing flow. Data capture only for now: nothing else in the app
// reads these fields yet (see supabase/profiles.sql for the table + RLS
// this depends on).
export default function Profile({ user, onBack }) {
  const { profile, loading, loadError, save } = useProfile(user)
  const [mode, setMode] = useState('view')
  const [tab, setTab] = useState('about')
  const [form, setForm] = useState(emptyFields)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    setForm(fromProfile(profile))
  }, [profile])

  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }))

  const toggleInterest = (cat) =>
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(cat)
        ? prev.interests.filter((c) => c !== cat)
        : [...prev.interests, cat],
    }))

  const startEdit = () => {
    setForm(fromProfile(profile))
    setMode('edit')
  }

  const exitEdit = () => {
    setMode('view')
    setTab('about')
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
    if (error) {
      setSaveError(error.message)
    } else {
      exitEdit()
    }
  }

  const name = user.user_metadata?.full_name || user.email
  const avatarUrl = user.user_metadata?.avatar_url
  const showDashboard = !loading && !loadError && (mode === 'edit' || hasAnyDetail(profile))

  // Avatar/name/email — used only for the loading/empty branches, which
  // stay full-width (no left/right split makes sense with nothing to show).
  const headerBlock = (showEdit) => (
    <div className="profile-header">
      <div className="prac-profile-avatar profile-header__avatar">
        {avatarUrl ? <img className="avatar-img" src={avatarUrl} alt={name} /> : (name || '?')[0].toUpperCase()}
      </div>
      <div className="profile-header__body">
        <h2 className="profile-header__name">{name}</h2>
        <p className="profile-header__email">{user.email}</p>
      </div>
      {showEdit && (
        <button className="btn btn--ghost btn--sm profile-header__edit" onClick={startEdit}>
          Edit
        </button>
      )}
    </div>
  )

  return (
    <main className="screen screen--scroll">
      <button className="link-back" onClick={onBack} aria-label="Back">
        <BackIcon />
      </button>

      {loading ? (
        <>
          {headerBlock(false)}
          <p className="empty-state">Loading your profile…</p>
        </>
      ) : loadError ? (
        <>
          {headerBlock(false)}
          <p className="empty-state">Couldn't load your profile — {loadError}</p>
        </>
      ) : !showDashboard ? (
        <>
          {headerBlock(false)}
          <EmptyState
            icon={TargetIcon}
            message="You haven't added your details yet — a few basics help us point you toward the right careers."
          />
          <div className="detail-actions">
            <button className="btn btn--primary" onClick={startEdit}>
              Add your details <ArrowRightIcon />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="profile-dashboard">
            {/* ===== Left column: photo, academic details, interests ===== */}
            <div className="profile-col profile-col--left">
              <div className="profile-photo">
                {avatarUrl ? (
                  <img className="profile-photo__img" src={avatarUrl} alt={name} />
                ) : (
                  <span className="profile-photo__initial">{(name || '?')[0].toUpperCase()}</span>
                )}
              </div>

              {mode === 'view' ? (
                <>
                  <div className="profile-list">
                    <h3 className="section__h">Academic details</h3>
                    <div className="profile-list__row">
                      <span>Education level</span>
                      <b>{form.educationLevel || '—'}</b>
                    </div>
                    <div className="profile-list__row">
                      <span>Comfortable with Maths</span>
                      <b>{form.comfortableWithMaths === null ? '—' : form.comfortableWithMaths ? 'Yes' : 'No'}</b>
                    </div>
                    <div className="profile-list__row">
                      <span>Marks / percentage</span>
                      <b>{form.marksPercentage !== '' ? `${form.marksPercentage}%` : '—'}</b>
                    </div>
                    <div className="profile-list__row">
                      <span>Preferred course level</span>
                      <b>{form.courseLevel || '—'}</b>
                    </div>
                  </div>

                  <div className="profile-list">
                    <h3 className="section__h">Interests</h3>
                    {form.interests.length > 0 ? (
                      form.interests.map((cat) => (
                        <p key={cat} className="profile-list__plain">
                          {cat}
                        </p>
                      ))
                    ) : (
                      <p className="profile-card__empty">No interests picked yet.</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="section">
                    <h3 className="section__h">Education level</h3>
                    <div className="chip-row">
                      {EDUCATION_LEVELS.map((level) => (
                        <button
                          key={level}
                          className={`chip ${form.educationLevel === level ? 'chip--on' : ''}`}
                          onClick={() => set('educationLevel')(level)}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="section">
                    <h3 className="section__h">Comfortable with Maths?</h3>
                    <div className="chip-row">
                      <button
                        className={`chip ${form.comfortableWithMaths === true ? 'chip--on' : ''}`}
                        onClick={() => set('comfortableWithMaths')(true)}
                      >
                        Yes
                      </button>
                      <button
                        className={`chip ${form.comfortableWithMaths === false ? 'chip--on' : ''}`}
                        onClick={() => set('comfortableWithMaths')(false)}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div className="section">
                    <h3 className="section__h">Marks / percentage</h3>
                    <input
                      className="search-input"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Most recent %"
                      value={form.marksPercentage}
                      onChange={(e) => set('marksPercentage')(e.target.value)}
                    />
                  </div>

                  <div className="section">
                    <h3 className="section__h">Preferred course level</h3>
                    <div className="chip-row">
                      {COURSE_LEVELS.map((level) => (
                        <button
                          key={level}
                          className={`chip ${form.courseLevel === level ? 'chip--on' : ''}`}
                          onClick={() => set('courseLevel')(level)}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="section">
                    <h3 className="section__h">What draws you in?</h3>
                    <div className="chip-row">
                      {INTEREST_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          className={`chip ${form.interests.includes(cat) ? 'chip--on' : ''}`}
                          onClick={() => toggleInterest(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ===== Right column: name row + tabs (view) / remaining fields (edit) ===== */}
            <div className="profile-col profile-col--right">
              <div className="profile-name-row">
                <div>
                  <h2 className="profile-header__name">{name}</h2>
                  <p className="profile-header__email">{user.email}</p>
                </div>
                {mode === 'view' && (
                  <button className="btn btn--ghost btn--sm" onClick={startEdit}>
                    Edit
                  </button>
                )}
              </div>

              {mode === 'view' ? (
                <>
                  <div className="profile-tabs">
                    <button
                      className={`profile-tab ${tab === 'about' ? 'profile-tab--active' : ''}`}
                      onClick={() => setTab('about')}
                    >
                      About
                    </button>
                    <button
                      className={`profile-tab ${tab === 'preferences' ? 'profile-tab--active' : ''}`}
                      onClick={() => setTab('preferences')}
                    >
                      Preferences
                    </button>
                  </div>

                  {tab === 'about' ? (
                    <div className="profile-card">
                      <h3 className="section__h">Contact information</h3>
                      <div className="profile-card__row">
                        <span>Email</span>
                        <b>{user.email}</b>
                      </div>
                      <div className="profile-card__row">
                        <span>Phone</span>
                        <b>{form.phone || '—'}</b>
                      </div>
                      <div className="profile-card__row">
                        <span>Address</span>
                        <b>{form.address || '—'}</b>
                      </div>
                      <h3 className="section__h profile-card__subhead">Basic information</h3>
                      <div className="profile-card__row">
                        <span>Birthday</span>
                        <b>{form.birthday || '—'}</b>
                      </div>
                      <div className="profile-card__row">
                        <span>Gender</span>
                        <b>{form.gender || '—'}</b>
                      </div>
                    </div>
                  ) : (
                    <div className="profile-card">
                      <h3 className="section__h">Career goal</h3>
                      <p className="profile-card__goal">{form.careerGoal || '—'}</p>
                      <h3 className="section__h profile-card__subhead">Study preferences</h3>
                      <div className="profile-card__row">
                        <span>Preferred location</span>
                        <b>{form.location || '—'}</b>
                      </div>
                      <div className="profile-card__row">
                        <span>Budget</span>
                        <b>{form.budget || '—'}</b>
                      </div>
                      <div className="profile-card__row">
                        <span>Entrance exams</span>
                        <b>{form.entranceExams || '—'}</b>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="section">
                    <h3 className="section__h">Phone</h3>
                    <input
                      className="search-input"
                      placeholder="Phone number"
                      value={form.phone}
                      onChange={(e) => set('phone')(e.target.value)}
                    />
                  </div>

                  <div className="section">
                    <h3 className="section__h">Address</h3>
                    <input
                      className="search-input"
                      placeholder="City, state"
                      value={form.address}
                      onChange={(e) => set('address')(e.target.value)}
                    />
                  </div>

                  <div className="section">
                    <h3 className="section__h">Birthday</h3>
                    <input
                      className="search-input"
                      type="date"
                      value={form.birthday}
                      onChange={(e) => set('birthday')(e.target.value)}
                    />
                  </div>

                  <div className="section">
                    <h3 className="section__h">Gender</h3>
                    <div className="chip-row">
                      {GENDER_OPTIONS.map((g) => (
                        <button
                          key={g}
                          className={`chip ${form.gender === g ? 'chip--on' : ''}`}
                          onClick={() => set('gender')(g)}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="section">
                    <h3 className="section__h">Career goal</h3>
                    <textarea
                      className="search-input search-input--area"
                      placeholder="What are you hoping to figure out or work towards?"
                      value={form.careerGoal}
                      onChange={(e) => set('careerGoal')(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="section">
                    <h3 className="section__h">Preferred study location</h3>
                    <input
                      className="search-input"
                      placeholder="e.g. Mumbai, anywhere in India, abroad"
                      value={form.location}
                      onChange={(e) => set('location')(e.target.value)}
                    />
                  </div>

                  <div className="section">
                    <h3 className="section__h">Budget</h3>
                    <div className="chip-row">
                      {BUDGET_TIERS.map((tier) => (
                        <button
                          key={tier}
                          className={`chip ${form.budget === tier ? 'chip--on' : ''}`}
                          onClick={() => set('budget')(tier)}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="section">
                    <h3 className="section__h">Entrance exams taken or planning</h3>
                    <input
                      className="search-input"
                      placeholder="e.g. JEE, NEET, CLAT"
                      value={form.entranceExams}
                      onChange={(e) => set('entranceExams')(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {mode === 'edit' && saveError && <p className="empty-state">Couldn't save — {saveError}</p>}

          {mode === 'edit' && (
            <div className="detail-actions">
              <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : <>Save profile <ArrowRightIcon /></>}
              </button>
              {hasAnyDetail(profile) && (
                <button className="btn btn--ghost" onClick={exitEdit} disabled={saving}>
                  Cancel
                </button>
              )}
            </div>
          )}
        </>
      )}
    </main>
  )
}
