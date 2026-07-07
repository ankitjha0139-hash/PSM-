const OPTIONS = [
  { id: 'goal', emoji: '🎯', label: 'I know exactly what I want' },
  { id: 'direction', emoji: '🧭', label: "I have some direction, but I'm not sure yet" },
  { id: 'none', emoji: '💬', label: 'I have no idea — I need help figuring this out' },
]

export default function RoutingQuestion({ onAnswer, onBack }) {
  return (
    <main className="screen">
      <button className="link-back" onClick={onBack} aria-label="Back">
        ←
      </button>
      <div className="screen__body">
        <h2 className="screen__title screen__title--md">
          What best describes where you're at?
        </h2>
        <div className="choice-list">
          {OPTIONS.map((opt) => (
            <button key={opt.id} className="choice-card" onClick={() => onAnswer(opt.id)}>
              <span className="choice-card__emoji">{opt.emoji}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
