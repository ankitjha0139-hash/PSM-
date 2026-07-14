import { BackIcon, GraduationCapIcon, FamilyIcon, BriefcaseIcon } from '../components/icons.jsx'

// The three roles a visitor can identify as. `roles` is data, not JSX repeated
// three times — adding a fourth role later means adding one object here, not
// copy-pasting a card.
const ROLES = [
  { id: 'student', icon: GraduationCapIcon, label: "I'm a Student" },
  { id: 'parent', icon: FamilyIcon, label: "I'm a Parent" },
  { id: 'practitioner', icon: BriefcaseIcon, label: "I'm a Career Practitioner" },
]

export default function RoleGate({ onSelect, onBack }) {
  return (
    <main className="screen">
      <button className="link-back" onClick={onBack} aria-label="Back">
        <BackIcon />
      </button>
      <div className="screen__body">
        <h2 className="screen__title screen__title--md">Who's here?</h2>
        <div className="choice-list">
          {ROLES.map((role) => (
            <button
              key={role.id}
              className="choice-card"
              onClick={() => onSelect(role.id)}
            >
              <span className="choice-card__emoji">
                <role.icon />
              </span>
              {role.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
