// Minimal CSV parser for the "Sync from Sheet" admin feature — handles
// quoted fields (commas/newlines/escaped "" inside a cell), which a naive
// split(',') would break on. No external dependency for something this
// small (same reasoning as the hand-rolled slugify() in the admin-*
// functions).
export function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  let i = 0

  const pushField = () => {
    row.push(field)
    field = ''
  }
  const pushRow = () => {
    pushField()
    rows.push(row)
    row = []
  }

  while (i < text.length) {
    const char = text[i]
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        inQuotes = false
        i++
        continue
      }
      field += char
      i++
      continue
    }
    if (char === '"') {
      inQuotes = true
      i++
      continue
    }
    if (char === ',') {
      pushField()
      i++
      continue
    }
    if (char === '\r') {
      i++
      continue
    }
    if (char === '\n') {
      pushRow()
      i++
      continue
    }
    field += char
    i++
  }
  if (field !== '' || row.length > 0) pushRow()

  const [header, ...body] = rows
  if (!header) return []
  return body
    .filter((r) => r.some((cell) => cell.trim() !== ''))
    .map((r) => Object.fromEntries(header.map((key, idx) => [key.trim(), (r[idx] ?? '').trim()])))
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function fetchSheetRecords(sheetUrl) {
  const response = await fetch(sheetUrl)
  if (!response.ok) {
    throw new Error(`Sheet fetch failed: ${response.status} ${response.statusText}`)
  }
  const text = await response.text()
  return parseCsv(text)
}

export { slugify }
