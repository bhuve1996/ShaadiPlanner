import { createClient } from '@supabase/supabase-js';

// Dedicated single project configuration for Bhuvesh & Harsha wedding
const DEFAULT_SUPABASE_URL = 'https://lybzsaufcagpaihmxfpf.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_NXm-5Lwvt90b_QVVw1UP6w_aaNkqltV';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Create unified Supabase client for all browsers and devices
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => true;

