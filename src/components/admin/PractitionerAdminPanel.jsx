import { useEffect, useState } from 'react'
import { Plus, PencilSimple, Trash, X, ArrowsClockwise } from '@phosphor-icons/react'
import { adminFetch } from '../../lib/adminApi.js'
import Button from '../ui/Button.jsx'

const inputClass =
  'min-h-11 w-full rounded-2xl border border-indigo-900/15 bg-white/70 px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-faint focus-visible:border-indigo-500'
const labelClass = 'text-xs font-semibold uppercase tracking-wide text-ink-faint'

const emptyForm = {
  name: '',
  photo: '',
  video_url: '',
  role: '',
  credibility: '',
  matches_role: '',
  rating: '',
  sessions_completed: '0',
  bio: '',
  languages: '',
  topics: '',
  journey: '[]',
  session_types: '[]',
  testimonials: '[]',
}

function toFormValues(row) {
  if (!row) return emptyForm
  return {
    name: row.name || '',
    photo: row.photo || '',
    video_url: row.video_url || '',
    role: row.role || '',
    credibility: row.credibility || '',
    matches_role: row.matches_role || '',
    rating: row.rating ?? '',
    sessions_completed: String(row.sessions_completed ?? 0),
    bio: row.bio || '',
    languages: (row.languages || []).join(', '),
    topics: (row.topics || []).join(', '),
    journey: JSON.stringify(row.journey || [], null, 2),
    session_types: JSON.stringify(row.session_types || [], null, 2),
    testimonials: JSON.stringify(row.testimonials || [], null, 2),
  }
}

// requiredKeys catches the shape mismatch that plain Array.isArray() lets
// through — e.g. typing ["Sarthak", "Very good sessions!"] for Testimonials
// (a flat array of strings) instead of [{"name": "Sarthak", "text": "Very
// good sessions!"}]. Both are valid JSON arrays, but only the second one
// has the fields PractitionerProfile.jsx actually reads — the first just
// renders as silent empty quotes on the live page with no error anywhere.
function parseJsonField(value, label, requiredKeys) {
  let parsed
  try {
    parsed = JSON.parse(value)
  } catch (err) {
    return { value: null, error: `${label}: ${err.message}` }
  }
  if (!Array.isArray(parsed)) {
    return { value: null, error: `${label}: must be a JSON array` }
  }
  for (const [i, entry] of parsed.entries()) {
    if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
      return {
        value: null,
        error: `${label}: entry ${i + 1} must be an object with ${requiredKeys.join(', ')} — got ${JSON.stringify(entry)}`,
      }
    }
    const missing = requiredKeys.filter((k) => !(k in entry))
    if (missing.length) {
      return { value: null, error: `${label}: entry ${i + 1} is missing ${missing.join(', ')}` }
    }
  }
  return { value: parsed, error: null }
}

export default function PractitionerAdminPanel({ onAuthError }) {
  const [items, setItems] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [editing, setEditing] = useState(null) // null = list view, 'new' = create, or an id
  const [form, setForm] = useState(emptyForm)
  const [saveError, setSaveError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState(null)

  const load = () => {
    setLoadError(null)
    adminFetch('/api/admin/practitioners')
      .then(setItems)
      .catch((err) => {
        setLoadError(err.message)
        if (err.message.includes('Session expired')) onAuthError()
      })
  }

  useEffect(load, [])

  const syncFromSheet = async () => {
    setSyncing(true)
    setSyncResult(null)
    try {
      const result = await adminFetch('/api/admin/sync-practitioners', { method: 'POST' })
      setSyncResult(result)
      load()
    } catch (err) {
      if (err.message.includes('Session expired')) onAuthError()
      else setSyncResult({ error: err.message })
    } finally {
      setSyncing(false)
    }
  }

  const startCreate = () => {
    setForm(emptyForm)
    setSaveError(null)
    setEditing('new')
  }

  const startEdit = (row) => {
    setForm(toFormValues(row))
    setSaveError(null)
    setEditing(row.id)
  }

  const remove = async (id) => {
    if (!confirm('Delete this practitioner? This cannot be undone.')) return
    try {
      await adminFetch(`/api/admin/practitioners?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      load()
    } catch (err) {
      if (err.message.includes('Session expired')) onAuthError()
      else alert(err.message)
    }
  }

  const save = async () => {
    setSaveError(null)
    const journey = parseJsonField(form.journey, 'Journey', ['when', 'what'])
    const sessionTypes = parseJsonField(form.session_types, 'Session types', [
      'id',
      'label',
      'duration',
      'price',
      'description',
    ])
    const testimonials = parseJsonField(form.testimonials, 'Testimonials', ['name', 'text'])
    const jsonError = journey.error || sessionTypes.error || testimonials.error
    if (jsonError) {
      setSaveError(jsonError)
      return
    }
    if (!form.name.trim() || !form.credibility.trim() || !form.matches_role.trim() || !form.bio.trim()) {
      setSaveError('Name, credibility, matches-role, and bio are required.')
      return
    }

    const payload = {
      name: form.name.trim(),
      photo: form.photo.trim() || null,
      video_url: form.video_url.trim() || null,
      role: form.role.trim(),
      credibility: form.credibility.trim(),
      matches_role: form.matches_role.trim(),
      rating: form.rating === '' ? null : Number(form.rating),
      sessions_completed: Number(form.sessions_completed) || 0,
      bio: form.bio.trim(),
      languages: form.languages.split(',').map((s) => s.trim()).filter(Boolean),
      topics: form.topics.split(',').map((s) => s.trim()).filter(Boolean),
      journey: journey.value,
      session_types: sessionTypes.value,
      testimonials: testimonials.value,
    }

    setSaving(true)
    try {
      if (editing === 'new') {
        await adminFetch('/api/admin/practitioners', { method: 'POST', body: JSON.stringify(payload) })
      } else {
        await adminFetch(`/api/admin/practitioners?id=${encodeURIComponent(editing)}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      }
      setEditing(null)
      load()
    } catch (err) {
      if (err.message.includes('Session expired')) onAuthError()
      else setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (editing) {
    return (
      <div className="rounded-3xl border border-indigo-900/10 bg-white/60 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-indigo-900">
            {editing === 'new' ? 'New practitioner' : 'Edit practitioner'}
          </h3>
          <button type="button" onClick={() => setEditing(null)} className="text-ink-soft hover:text-indigo-900">
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className={labelClass}>Name</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Role (e.g. Architect)</span>
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputClass} />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className={labelClass}>Credibility line</span>
            <input
              value={form.credibility}
              onChange={(e) => setForm({ ...form, credibility: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Matches role (career "Talk to a real X" link)</span>
            <input
              value={form.matches_role}
              onChange={(e) => setForm({ ...form, matches_role: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Photo URL (optional)</span>
            <input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} className={inputClass} />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Video link — YouTube/Vimeo (optional)</span>
            <input
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Rating (leave blank if none yet)</span>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Sessions completed</span>
            <input
              type="number"
              min="0"
              value={form.sessions_completed}
              onChange={(e) => setForm({ ...form, sessions_completed: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className={labelClass}>Bio</span>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Languages (comma-separated)</span>
            <input
              value={form.languages}
              onChange={(e) => setForm({ ...form, languages: e.target.value })}
              placeholder="English, Hindi"
              className={inputClass}
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Topics (comma-separated)</span>
            <input
              value={form.topics}
              onChange={(e) => setForm({ ...form, topics: e.target.value })}
              placeholder="Choosing a stream, Starting a firm"
              className={inputClass}
            />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className={labelClass}>Journey (JSON array of {'{ when, what }'})</span>
            <textarea
              rows={4}
              value={form.journey}
              onChange={(e) => setForm({ ...form, journey: e.target.value })}
              className={`${inputClass} font-mono text-xs`}
            />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className={labelClass}>
              Session types (JSON array of {'{ id, label, duration, price, description }'})
            </span>
            <textarea
              rows={5}
              value={form.session_types}
              onChange={(e) => setForm({ ...form, session_types: e.target.value })}
              className={`${inputClass} font-mono text-xs`}
            />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className={labelClass}>Testimonials (JSON array of {'{ name, text }'})</span>
            <textarea
              rows={3}
              value={form.testimonials}
              onChange={(e) => setForm({ ...form, testimonials: e.target.value })}
              className={`${inputClass} font-mono text-xs`}
            />
          </label>
        </div>

        {saveError && <p className="mt-4 text-sm text-red-600">{saveError}</p>}

        <div className="mt-6 flex gap-3">
          <Button as="button" onClick={save} variant="primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
          <Button as="button" onClick={() => setEditing(null)} variant="outline" disabled={saving}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-lg font-semibold text-indigo-900">Practitioners</h3>
        <div className="flex gap-2">
          <Button
            as="button"
            onClick={syncFromSheet}
            variant="outline"
            disabled={syncing}
            className="!min-h-9 !py-2 text-sm"
          >
            <ArrowsClockwise size={15} weight="bold" className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing…' : 'Sync from Sheet'}
          </Button>
          <Button as="button" onClick={startCreate} variant="primary" className="!min-h-9 !py-2 text-sm">
            <Plus size={15} weight="bold" /> Add
          </Button>
        </div>
      </div>

      {syncResult && (
        <div className="mt-4 rounded-2xl border border-indigo-900/10 bg-white/60 p-4 text-sm">
          {syncResult.error ? (
            <p className="text-red-600">{syncResult.error}</p>
          ) : (
            <>
              <p className="text-ink">
                Synced {syncResult.synced} of {syncResult.total} row{syncResult.total === 1 ? '' : 's'}.
              </p>
              {syncResult.errors.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-red-600">
                  {syncResult.errors.map((e, i) => (
                    <li key={i}>
                      Row {e.row}{e.id ? ` (${e.id})` : ''}: {e.error}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      )}

      {loadError && <p className="mt-4 text-sm text-red-600">{loadError}</p>}
      {!loadError && !items && <p className="mt-4 text-sm text-ink-soft">Loading…</p>}

      {items && (
        <div className="mt-4 space-y-2">
          {items.length === 0 && <p className="text-sm text-ink-faint">No practitioners yet.</p>}
          {items.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-indigo-900/10 bg-white/60 p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-indigo-900">{p.name}</p>
                <p className="truncate text-sm text-ink-faint">{p.credibility}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(p)}
                  aria-label={`Edit ${p.name}`}
                  className="grid h-9 w-9 place-items-center rounded-full text-indigo-900 hover:bg-indigo-900/5"
                >
                  <PencilSimple size={16} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  aria-label={`Delete ${p.name}`}
                  className="grid h-9 w-9 place-items-center rounded-full text-red-600 hover:bg-red-50"
                >
                  <Trash size={16} weight="bold" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
