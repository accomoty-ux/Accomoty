import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Null when env vars are missing, so the app still runs before Supabase
 * is wired up. AuthContext falls back to a local demo session in that case.
 */
export const supabase = url && key ? createClient(url, key) : null;

export const isSupabaseConfigured = () => Boolean(supabase);
