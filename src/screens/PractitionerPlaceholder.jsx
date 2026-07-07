export default function PractitionerPlaceholder({ onBack }) {
  return (
    <main className="screen screen--center">
      <button className="link-back link-back--floating" onClick={onBack} aria-label="Back">
        ←
      </button>
      <h2 className="screen__title screen__title--md">Practitioner sign-up</h2>
      <p className="screen__sub">
        We're building this next — for now, if you'd like to share your
        experience with students, tell your team and they'll add you by hand.
      </p>
    </main>
  )
}
