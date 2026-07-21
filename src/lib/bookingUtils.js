// Booking helpers for the symbolic booking flow. Slots are generated
// deterministically (not random) so the same practitioner shows the same
// availability on every visit — random would look broken on a re-render.
// When real scheduling (Cal.com) lands, this file is what gets replaced.

const TIMES = ['11:00 AM', '4:00 PM', '6:00 PM', '8:00 PM']

// Small deterministic hash — same inputs, same "taken" slots every time.
function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Local-date key (YYYY-MM-DD). NOT toISOString(), which is UTC and would
// shift the key a day behind the visible label before 5:30 AM IST.
function localDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// Next 6 days starting tomorrow, each with time slots; roughly a third
// show as taken so availability looks lived-in rather than infinite.
export function getSlotDays(practitionerId) {
  const days = []
  for (let d = 1; d <= 6; d++) {
    const date = new Date()
    date.setDate(date.getDate() + d)
    const dateKey = localDateKey(date)
    const slots = TIMES.map((time) => ({
      time,
      taken: hash(`${practitionerId}|${dateKey}|${time}`) % 3 === 0,
    }))
    days.push({
      date,
      dateKey,
      dayLabel: d === 1 ? 'Tmrw' : DAY_NAMES[date.getDay()],
      dateLabel: `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`,
      slots,
    })
  }
  return days
}

// First open slot — the "Next available: …" hint on directory cards.
export function nextAvailableLabel(practitionerId) {
  const days = getSlotDays(practitionerId)
  for (const day of days) {
    const open = day.slots.find((s) => !s.taken)
    if (open) {
      return `${day.dayLabel === 'Tmrw' ? 'Tomorrow' : day.dayLabel} ${open.time}`
    }
  }
  return null
}

export function makeBookingId() {
  return `LH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

function parseTime(time) {
  const [hm, ampm] = time.split(' ')
  let [h, m] = hm.split(':').map(Number)
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  return [h, m]
}

function pad(n) {
  return String(n).padStart(2, '0')
}

// A real Date for a booking's slot — the source of truth for "is this
// upcoming or completed" (My Sessions) and for the .ics start time below.
// NOT string-sorting booking.time ('11:00 AM' < '4:00 PM' only sorts
// correctly by coincidence, since every AM slot happens to start with a
// lower digit than every PM one in the current TIMES list above).
export function bookingDateTime(booking) {
  const [h, m] = parseTime(booking.time)
  const date = new Date(booking.dateKey + 'T00:00:00')
  date.setHours(h, m, 0, 0)
  return date
}

function toIcsStamp(date) {
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}00`
  )
}

// A real .ics file the phone's calendar app opens — the booking may be
// symbolic for now, but the calendar entry is genuinely useful and makes
// the confirmation feel like a real product.
export function downloadIcs(booking) {
  const start = bookingDateTime(booking)
  const minutes = parseInt(booking.duration, 10) || 30
  const end = new Date(start.getTime() + minutes * 60 * 1000)

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lighthouse.guide//Booking//EN',
    'BEGIN:VEVENT',
    `UID:${booking.id}@lighthouse.guide`,
    `DTSTAMP:${toIcsStamp(new Date())}`,
    `DTSTART:${toIcsStamp(start)}`,
    `DTEND:${toIcsStamp(end)}`,
    `SUMMARY:${booking.sessionLabel} with ${booking.practitionerName}`,
    `DESCRIPTION:Lighthouse.guide booking ${booking.id}. We'll share the call link before the session.`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `lighthouse-${booking.id}.ics`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
