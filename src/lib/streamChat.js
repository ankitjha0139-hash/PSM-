// Reads a streamed chat reply from one of our Netlify functions
// (atlas-chat, support-chat) and calls onDelta with each incremental text
// chunk as it arrives — this is what gives the real "typing" effect,
// shared by AtlasChat and SupportWidget instead of duplicated in both.
export async function streamChat(endpoint, messages, onDelta) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Request failed')
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    const lines = buffer.split('\n')
    buffer = lines.pop() // last line may be incomplete — keep it for next read

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const jsonStr = trimmed.slice(5).trim()
      if (!jsonStr) continue
      try {
        const parsed = JSON.parse(jsonStr)
        const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) onDelta(text)
      } catch {
        // an incomplete JSON fragment split across reads — safe to skip
      }
    }
  }
}
