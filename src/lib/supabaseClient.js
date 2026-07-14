import { createClient } from '@supabase/supabase-js'

// Auth only for now (Phase 4) — career data still comes from the Google
// Sheet-backed API, shortlist/bookings still live in localStorage. This
// client's job is just identifying who's using the app.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
