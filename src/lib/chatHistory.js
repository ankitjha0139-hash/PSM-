import { supabase } from './supabaseClient.js'

// Atlas chat history, for signed-in users only — anonymous visitors keep
// the existing sessionStorage-only behavior in AtlasChat.jsx untouched.
// Requires the chat_messages table + RLS policies (see repo notes /
// whoever ran the shortlists table SQL for the matching pattern).

export async function loadChatHistory(userId) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('role, text, followups')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('loadChatHistory failed:', error)
    return []
  }
  return data.map((row) => ({
    role: row.role,
    text: row.text,
    followups: row.followups || undefined,
  }))
}

export async function saveChatMessage(userId, message) {
  const { error } = await supabase.from('chat_messages').insert({
    user_id: userId,
    role: message.role,
    text: message.text,
    followups: message.followups || null,
  })
  if (error) {
    // Non-fatal: the message still shows in the UI (sessionStorage-backed
    // state already has it), it just won't persist across visits this time.
    console.error('saveChatMessage failed:', error)
  }
}
