import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uvhhaewuzrfhwhxxghzv.supabase.co';

// During `next build` static pre-rendering, env vars may be empty.
// Supabase's createClient throws if the key is an empty string,
// so we provide a placeholder. API calls only happen client-side at runtime
// where the real key from .env.local is available.
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key-for-build';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
