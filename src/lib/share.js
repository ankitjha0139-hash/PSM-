// Share a career for a second opinion — parents, seniors, that one uncle
// who's an engineer. The formatted text IS the product here: the recipient
// reads the gist inside WhatsApp without clicking anything; the link opens
// the exact career page (App.jsx reads ?career= on boot) if they want more.

// One short line + link, nothing more. The /s/<id> endpoint serves
// career-specific og tags, so the link unfurls into a card carrying the
// career's name and facts — the card sells, the site tells.
function buildShareText() {
  return 'What do you think of this path? 👇'
}

export function careerUrl(career) {
  return `${window.location.origin}/s/${encodeURIComponent(career.id)}`
}

// Native share sheet where available (all mobile browsers), WhatsApp web
// link as fallback on desktop, clipboard as the last resort.
export async function shareCareer(career) {
  const text = buildShareText()
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
