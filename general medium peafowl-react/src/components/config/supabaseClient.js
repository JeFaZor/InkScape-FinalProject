// src/components/config/supabaseClient.js

import { createClient } from '@supabase/supabase-js'

// הגדרה ישירה של המשתנים
const supabaseUrl = 'https://ksbkkunwdjsngzdhavwl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzYmtrdW53ZGpzbmd6ZGhhdndsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzNTc3NTEsImV4cCI6MjA0NzkzMzc1MX0.2odvHn99BYu3ReH-AkhAStvNMdGBdRCedL3miDQcTcs'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase