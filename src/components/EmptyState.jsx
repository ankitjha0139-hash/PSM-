// Shared "nothing here yet" block — an icon in a soft circle plus a
// message, used wherever a list/grid has genuinely nothing to show (as
// opposed to a transient loading/error line, which stays plain text).
export default function EmptyState({ icon: Icon, message }) {
  return (
    <div className="empty-state-block">
      <span className="empty-state-block__icon">
        <Icon size={22} />
      </span>
      <p className="empty-state-block__text">{message}</p>
    </div>
  )
}
