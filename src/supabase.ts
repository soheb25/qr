import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  'https://qdbzjwvsdkjwhwaalfhd.supabase.co';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkYnpqd3ZzZGtqd2h3YWFsZmhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MTYxNDAsImV4cCI6MjEwNDA5MjE0MH0.9wYFWb-sB0lKnuZBO4ofMxphYvvgtc6y9--HIoJJkJg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    !supabaseUrl.includes('placeholder')
  );
};
