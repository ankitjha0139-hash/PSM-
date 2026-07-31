import { useEffect, useState } from 'react'
import { Plus, PencilSimple, Trash, X } from '@phosphor-icons/react'
import { adminFetch } from '../../lib/adminApi.js'
import Button from '../ui/Button.jsx'

const inputClass =
  'min-h-11 w-full rounded-2xl border border-indigo-900/15 bg-white/70 px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-faint focus-visible:border-indigo-500'
const labelClass = 'text-xs font-semibold uppercase tracking-wide text-ink-faint'

const emptyForm = { initials: '', name: '', tag: '', quote: '', from_situation: '', to_outcome: '', display_order: '0' }

function toFormValues(row) {
  if (!row) return emptyForm
  return {
    initials: row.initials || '',
    name: row.name || '',
    tag: row.tag || '',
    quote: row.quote || '',
    from_situation: row.from_situation || '',
    to_outcome: row.to_outcome || '',
    display_order: String(row.display_order ?? 0),
  }
}

export default function TestimonialAdminPanel({ onAuthError }) {
  const [items, setItems] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saveError, setSaveError] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoadError(null)
    adminFetch('/api/admin/testimonials')
      .then(setItems)
      .catch((err) => {
        setLoadError(err.message)
        if (err.message.includes('Session expired')) onAuthError()
      })
  }

  useEffect(load, [])

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
    if (!confirm('Delete this testimonial?')) return
    try {
      await adminFetch(`/api/admin/testimonials?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      load()
    } catch (err) {
      if (err.message.includes('Session expired')) onAuthError()
      else alert(err.message)
    }
  }

  const save = async () => {
    setSaveError(null)
    if (!form.name.trim() || !form.quote.trim()) {
      setSaveError('Name and quote are required.')
      return
    }
    const payload = {
      initials: form.initials.trim() || form.name.trim()[0].toUpperCase(),
      name: form.name.trim(),
      tag: form.tag.trim(),
      quote: form.quote.trim(),
      from_situation: form.from_situation.trim(),
      to_outcome: form.to_outcome.trim(),
      display_order: Number(form.display_order) || 0,
    }
    setSaving(true)
    try {
      if (editing === 'new') {
        await adminFetch('/api/admin/testimonials', { method: 'POST', body: JSON.stringify(payload) })
      } else {
        await adminFetch(`/api/admin/testimonials?id=${encodeURIComponent(editing)}`, {
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
            {editing === 'new' ? 'New testimonial' : 'Edit testimonial'}
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
            <span className={labelClass}>Initials (for the avatar)</span>
            <input
              value={form.initials}
              onChange={(e) => setForm({ ...form, initials: e.target.value })}
              placeholder="Auto from name if left blank"
              className={inputClass}
            />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className={labelClass}>Tag (e.g. "Class 12, Nagpur")</span>
            <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className={inputClass} />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className={labelClass}>Quote</span>
            <textarea rows={3} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} className={inputClass} />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>From (situation before)</span>
            <input
              value={form.from_situation}
              onChange={(e) => setForm({ ...form, from_situation: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>To (outcome)</span>
            <input
              value={form.to_outcome}
              onChange={(e) => setForm({ ...form, to_outcome: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="space-y-1.5">
            <span className={labelClass}>Display order</span>
            <input
              type="number"
              value={form.display_order}
              onChange={(e) => setForm({ ...form, display_order: e.target.value })}
              className={inputClass}
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
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-indigo-900">Testimonials</h3>
        <Button as="button" onClick={startCreate} variant="primary" className="!min-h-9 !py-2 text-sm">
          <Plus size={15} weight="bold" /> Add
        </Button>
      </div>

      {loadError && <p className="mt-4 text-sm text-red-600">{loadError}</p>}
      {!loadError && !items && <p className="mt-4 text-sm text-ink-soft">Loading…</p>}

      {items && (
        <div className="mt-4 space-y-2">
          {items.length === 0 && <p className="text-sm text-ink-faint">No testimonials yet.</p>}
          {items.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-indigo-900/10 bg-white/60 p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-indigo-900">{t.name} · {t.tag}</p>
                <p className="truncate text-sm text-ink-faint">"{t.quote}"</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(t)}
                  aria-label={`Edit ${t.name}`}
                  className="grid h-9 w-9 place-items-center rounded-full text-indigo-900 hover:bg-indigo-900/5"
                >
                  <PencilSimple size={16} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(t.id)}
                  aria-label={`Delete ${t.name}`}
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
