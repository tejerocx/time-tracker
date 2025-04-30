import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dmtoeidaykviouwvmhfa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtdG9laWRheWt2aW91d3ZtaGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MDMxNTQsImV4cCI6MjA2MTA3OTE1NH0.7uIisvl9PJQs6OtKGbwzBLKbEkbnDw77TrUlIt-cNS4'

export const supabase = createClient(supabaseUrl, supabaseKey)