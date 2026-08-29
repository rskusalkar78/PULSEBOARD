/**
 * Detect whether real Supabase credentials are configured.
 * Placeholder values from .env.example fall back to local demo auth.
 */

const PLACEHOLDER_URL_MARKERS = ['your-project-ref', 'your-project-id'];
const PLACEHOLDER_KEY_MARKERS = ['your-supabase-anon-key', 'your-anon-key'];

export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!url || !key) {
    return false;
  }

  if (PLACEHOLDER_URL_MARKERS.some((marker) => url.includes(marker))) {
    return false;
  }

  if (PLACEHOLDER_KEY_MARKERS.some((marker) => key.includes(marker))) {
    return false;
  }

  // Real Supabase anon keys are long JWT strings
  if (key.length < 100) {
    return false;
  }

  try {
    new URL(url);
  } catch {
    return false;
  }

  return true;
}
