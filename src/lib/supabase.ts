import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.SUPABASE_URL ||
    'https://oegrmqahzgwlmwnomihe.supabase.co')?.trim();

const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.SUPABASE_ANON_KEY ||
    'sb_publishable_887fRbuKNikim_DoE40-zQ_gDEjV_aP')?.trim();

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  supabaseAnonKey !== 'placeholder-anon-key';

if (!isSupabaseConfigured) {
  console.error(
    'Supabase configuration missing. Make sure .env.local contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart Vite.'
  );
}

// Safe fallback prevents the application from crashing during startup.
// IMPORTANT: Supabase requests should only be made when isSupabaseConfigured === true.
const safeSupabaseUrl =
  supabaseUrl || 'https://oegrmqahzgwlmwnomihe.supabase.co';

const safeSupabaseAnonKey =
  supabaseAnonKey || 'placeholder-anon-key';

export const supabase = createClient(
  safeSupabaseUrl,
  safeSupabaseAnonKey
);

export async function testSupabaseConnection() {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error:
        'Supabase environment variables are not configured.',
    };
  }

  const { data, error } = await supabase
    .from('vacancies')
    .select('id, title')
    .limit(1);

  if (error) {
    console.error(
      'Supabase connection failed:',
      error
    );

    return {
      success: false,
      error: error.message,
    };
  }

  console.log(
    'Supabase connection successful:',
    data
  );

  return {
    success: true,
    data,
  };
}