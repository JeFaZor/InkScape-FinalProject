// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anonymous Key is missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: window.localStorage
  }
})

// הוסף בדיקה בסיסית כדי לוודא שהקליינט נוצר רק פעם אחת
console.log('Supabase client created', {
  client: !!supabase,
  auth: !!supabase.auth
});