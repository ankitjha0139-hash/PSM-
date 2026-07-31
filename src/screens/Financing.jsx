// Static info screen — general financing routes for the education itself
// (not practitioner-session pricing, which is already shown upfront on
// each practitioner's profile). Deliberately generic: this app doesn't
// have per-institution loan/scholarship data, so no invented numbers or
// rates — same honest-over-precise tone as a career's own honest_note.
export default function Financing() {
  return (
    <main className="screen screen--scroll">
      <div className="detail-head">
        <h2 className="detail-title">Financing your education</h2>
        <p className="detail-tagline">
          Fees shouldn't be the reason a path gets ruled out before you've
          even looked into it. Here's what's usually available.
        </p>
      </div>

      <div className="section">
        <h3 className="section__h">Education loans</h3>
        <p className="section__text">
          Most banks and NBFCs offer education loans covering tuition,
          hostel, books, and sometimes a laptop — usually with a
          moratorium period so repayment starts after the course ends, not
          during it. Terms (interest rate, collateral, repayment window)
          vary a lot by lender and institution, so it's worth comparing at
          least two or three before deciding.
        </p>
      </div>

      <div className="section">
        <h3 className="section__h">Government scholarships</h3>
        <p className="section__text">
          The National Scholarship Portal centralizes most central and
          state government scholarships — merit-based, need-based, and
          community-specific schemes all in one place. Many state
          governments also run their own schemes on top of this, so it's
          worth checking your specific state's education department site
          too.
        </p>
      </div>

      <div className="section">
        <h3 className="section__h">Institution scholarships</h3>
        <p className="section__text">
          Colleges and training institutes frequently run their own
          merit or need-based scholarships and fee waivers — these rarely
          show up in a general search and are usually only listed on the
          institution's own admissions page, so it's worth asking directly
          once you've shortlisted a few.
        </p>
      </div>

      <div className="section">
        <h3 className="section__h">EMI-based fee payment</h3>
        <p className="section__text">
          A growing number of institutions and third-party fee-financing
          partners let you split tuition into monthly installments instead
          of paying upfront — useful for spreading cost without taking on
          a full loan, though it's worth checking whether any interest or
          processing fee applies.
        </p>
      </div>

      <div className="callout callout--honest">
        <span className="callout__label">The honest bit</span>
        <p className="callout__body">
          We don't have real-time loan rates or scholarship deadlines for
          every institution — this page is a starting map, not financial
          advice. For anything specific to a career path you're
          considering, that's exactly what a Career Practitioner call is
          for.
        </p>
      </div>
    </main>
  )
}
