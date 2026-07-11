// Reads a streamed chat reply from one of our Netlify functions
// (atlas-chat, support-chat) and calls onDelta with each incremental text
// chunk as it arrives — this is what gives the real "typing" effect,
// shared by AtlasChat and SupportWidget instead of duplicated in both.

async function attemptStream(endpoint, messages, onDelta, extra) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, ...extra }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Request failed (${res.status})`)
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

// Network blips, Netlify cold starts, and occasional rate-limit brushes
// are normal when calling an external API — one quiet automatic retry
// recovers from most of them before the user ever sees an error.
// onRetry lets the caller reset its own accumulated text first, so a
// retry doesn't glue a partial first attempt onto the second one.
export async function streamChat(endpoint, messages, onDelta, onRetry, extra) {
  try {
    await attemptStream(endpoint, messages, onDelta, extra)
  } catch (err) {
    console.error('streamChat: first attempt failed, retrying once —', err)
    onRetry?.()
    await new Promise((r) => setTimeout(r, 900))
    await attemptStream(endpoint, messages, onDelta, extra)
  }
}
