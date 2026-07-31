export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-indigo-900/15 px-6 py-16 text-center">
      {Icon && (
        <span className="grid h-12 w-12 place-items-center rounded-full bg-indigo-900/8 text-indigo-900">
          <Icon size={22} weight="bold" />
        </span>
      )}
      <h3 className="mt-4 font-display text-lg font-semibold text-indigo-900">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
