-- ==============================================================================
-- SHAADIPLANNER GLOBAL POSTGRESQL SCHEMA (SUPABASE)
-- Run this script in your Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- ==============================================================================

-- 1. Create weddings table for global settings
CREATE TABLE IF NOT EXISTS weddings (
  id TEXT PRIMARY KEY DEFAULT 'bhuvesh-harsha-wedding',
  couple_title TEXT NOT NULL DEFAULT 'Bhuvesh & Harshu''s Wedding',
  groom_name TEXT NOT NULL DEFAULT 'Bhuvesh (Groom)',
  bride_name TEXT NOT NULL DEFAULT 'Harshu (Bride)',
  wedding_date TEXT NOT NULL DEFAULT '2026-11-28',
  groom_guest_count INTEGER NOT NULL DEFAULT 150,
  bride_guest_count INTEGER NOT NULL DEFAULT 400,
  total_target_budget NUMERIC NOT NULL DEFAULT 2253600,
  currency TEXT NOT NULL DEFAULT 'INR',
  event_guest_counts JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  wedding_id TEXT NOT NULL DEFAULT 'bhuvesh-harsha-wedding' REFERENCES weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  event TEXT NOT NULL,
  vendor_name TEXT DEFAULT '',
  vendor_contact_person TEXT DEFAULT '',
  vendor_phone TEXT DEFAULT '',
  internal_lead_person TEXT DEFAULT '',
  internal_lead_phone TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  estimated_cost NUMERIC NOT NULL DEFAULT 0,
  actual_cost NUMERIC NOT NULL DEFAULT 0,
  paid_amount NUMERIC NOT NULL DEFAULT 0,
  split_type TEXT NOT NULL DEFAULT 'EQUAL_50_50',
  custom_groom_percent NUMERIC DEFAULT 50,
  payer_category TEXT DEFAULT 'COUPLE',
  paid_by TEXT DEFAULT 'UNPAID',
  status TEXT DEFAULT 'Estimated',
  notes TEXT DEFAULT '',
  due_date TEXT DEFAULT '',
  is_per_plate_calculation BOOLEAN DEFAULT FALSE,
  rate_per_guest_or_plate NUMERIC DEFAULT 0,
  override_guest_count BOOLEAN DEFAULT FALSE,
  event_groom_guests INTEGER,
  event_bride_guests INTEGER,
  subtasks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create ceremony schedules table
CREATE TABLE IF NOT EXISTS ceremony_schedules (
  id TEXT PRIMARY KEY,
  wedding_id TEXT NOT NULL DEFAULT 'bhuvesh-harsha-wedding' REFERENCES weddings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  venue TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '💍',
  image TEXT NOT NULL,
  description TEXT DEFAULT '',
  tag_color TEXT DEFAULT '',
  guest_count INTEGER DEFAULT 200,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create shagun records table
CREATE TABLE IF NOT EXISTS family_shaguns (
  id TEXT PRIMARY KEY,
  wedding_id TEXT NOT NULL DEFAULT 'bhuvesh-harsha-wedding' REFERENCES weddings(id) ON DELETE CASCADE,
  recipient_name TEXT NOT NULL,
  relation TEXT NOT NULL,
  shagun_group TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  calculation_formula TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Planned',
  side TEXT NOT NULL DEFAULT 'GROOM',
  notes TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create guest groups table
CREATE TABLE IF NOT EXISTS guest_groups (
  id TEXT PRIMARY KEY,
  wedding_id TEXT NOT NULL DEFAULT 'bhuvesh-harsha-wedding' REFERENCES weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  side TEXT NOT NULL DEFAULT 'GROOM',
  count INTEGER NOT NULL DEFAULT 0,
  estimated_per_plate NUMERIC,
  contact_person TEXT DEFAULT '',
  contact_phone TEXT DEFAULT '',
  is_anonymous_numbers BOOLEAN DEFAULT FALSE,
  notes TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create vendor directory table
CREATE TABLE IF NOT EXISTS vendor_directory (
  id TEXT PRIMARY KEY,
  wedding_id TEXT NOT NULL DEFAULT 'bhuvesh-harsha-wedding' REFERENCES weddings(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  vendor_business_name TEXT NOT NULL,
  contact_person TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  alternate_phone TEXT DEFAULT '',
  location_city TEXT DEFAULT '',
  internal_responsible_person TEXT DEFAULT '',
  service_description TEXT DEFAULT '',
  status TEXT DEFAULT 'Shortlisted',
  total_agreed_amount NUMERIC DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) but allow public access for your family with wedding_id
ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ceremony_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_shaguns ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_directory ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read & write for wedding participants
CREATE POLICY "Public Read Wedding" ON weddings FOR SELECT USING (true);
CREATE POLICY "Public Write Wedding" ON weddings FOR ALL USING (true);

CREATE POLICY "Public Read Expenses" ON expenses FOR SELECT USING (true);
CREATE POLICY "Public Write Expenses" ON expenses FOR ALL USING (true);

CREATE POLICY "Public Read Schedule" ON ceremony_schedules FOR SELECT USING (true);
CREATE POLICY "Public Write Schedule" ON ceremony_schedules FOR ALL USING (true);

CREATE POLICY "Public Read Shagun" ON family_shaguns FOR SELECT USING (true);
CREATE POLICY "Public Write Shagun" ON family_shaguns FOR ALL USING (true);

CREATE POLICY "Public Read Groups" ON guest_groups FOR SELECT USING (true);
CREATE POLICY "Public Write Groups" ON guest_groups FOR ALL USING (true);

CREATE POLICY "Public Read Vendors" ON vendor_directory FOR SELECT USING (true);
CREATE POLICY "Public Write Vendors" ON vendor_directory FOR ALL USING (true);

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE weddings;
ALTER PUBLICATION supabase_realtime ADD TABLE expenses;
ALTER PUBLICATION supabase_realtime ADD TABLE ceremony_schedules;
ALTER PUBLICATION supabase_realtime ADD TABLE family_shaguns;
ALTER PUBLICATION supabase_realtime ADD TABLE guest_groups;
ALTER PUBLICATION supabase_realtime ADD TABLE vendor_directory;
