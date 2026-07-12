// Same three-way fork for everyone — what changes by role is the voice.
// A parent isn't "figuring out what I want", they're helping a child; the
// copy should say so or the product feels like it wasn't built for them.
const STUDENT_OPTIONS = [
  { id: 'goal', emoji: '🎯', label: 'I know exactly what I want' },
  { id: 'direction', emoji: '🧭', label: "I have some direction, but I'm not sure yet" },
  { id: 'none', emoji: '💬', label: 'I have no idea — I need help figuring this out' },
]

const PARENT_OPTIONS = [
  { id: 'goal', emoji: '🎯', label: 'My child has a goal — I want to check it makes sense' },
  { id: 'direction', emoji: '🧭', label: "We're weighing a few options as a family" },
  { id: 'none', emoji: '💬', label: "We're starting from zero — show us what's out there" },
]

export default function RoutingQuestion({ role, onAnswer, onBack }) {
  const isParent = role === 'parent'
  const options = isParent ? PARENT_OPTIONS : STUDENT_OPTIONS

  return (
    <main className="screen">
      <button className="link-back" onClick={onBack} aria-label="Back">
        ←
      </button>
      <div className="screen__body">
        <h2 className="screen__title screen__title--md">
          {isParent ? 'Where is your family at?' : "What best describes where you're at?"}
        </h2>
        <div className="choice-list">
          {options.map((opt) => (
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
