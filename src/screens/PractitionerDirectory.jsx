import { practitioners } from '../data/practitioners.js'
import PractitionerCard from '../components/PractitionerCard.jsx'

export default function PractitionerDirectory({ onOpenProfile }) {
  return (
    <main className="screen screen--scroll">
      <h2 className="screen__title screen__title--md">Career Practitioners</h2>
      <p className="screen__sub" style={{ margin: '0 auto 16px', textAlign: 'center' }}>
        Talk to someone who's actually done it.
      </p>
      <div className="prac-list">
        {practitioners.map((p) => (
          <PractitionerCard key={p.id} practitioner={p} onOpen={onOpenProfile} />
        ))}
      </div>
    </main>
  )
}
