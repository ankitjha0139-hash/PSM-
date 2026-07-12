// Share a career for a second opinion — parents, seniors, that one uncle
// who's an engineer. The formatted text IS the product here: the recipient
// reads the gist inside WhatsApp without clicking anything; the link opens
// the exact career page (App.jsx reads ?career= on boot) if they want more.

// Short on purpose: a teaser, not the whole page. The link unfurls into a
// titled card (og tags) and the site is where they read the rest — a wall
// of text in WhatsApp gets skimmed and never clicked.
function buildShareText(career) {
  return [
    `*${career.title}* — what do you think of this path?`,
    `${career.duration_years} · ${career.fees} · starts at ${career.entry_pay}`,
    `The full picture, honest bits included 👇`,
  ].join('\n')
}

export function careerUrl(career) {
  return `${window.location.origin}/?career=${encodeURIComponent(career.id)}`
}

// Native share sheet where available (all mobile browsers), WhatsApp web
// link as fallback on desktop, clipboard as the last resort.
export async function shareCareer(career) {
  const text = buildShareText(career)
  const url = careerUrl(career)

  if (navigator.share) {
    try {
      await navigator.share({ title: career.title, text, url })
      return 'shared'
    } catch (err) {
      // user closed the sheet — not an error, and don't fall through
      if (err.name === 'AbortError') return 'cancelled'
    }
  }

  const wa = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`
  const win = window.open(wa, '_blank', 'noopener')
  if (win) return 'whatsapp'

  await navigator.clipboard.writeText(`${text}\n${url}`)
  return 'copied'
}
