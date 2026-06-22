-- HaulitNG Database Schema for Supabase
-- Run this in Supabase SQL Editor after creating a project

-- Bookings
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  quote_amount INTEGER DEFAULT 0,
  deposit_amount INTEGER DEFAULT 0,
  final_amount INTEGER DEFAULT 0,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service_type TEXT NOT NULL,
  pickup TEXT DEFAULT '',
  destination TEXT DEFAULT '',
  equipment TEXT DEFAULT '',
  weight TEXT DEFAULT '',
  scheduled_date TEXT DEFAULT '',
  message TEXT DEFAULT '',
  tracking_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  booking_ref TEXT REFERENCES bookings(reference),
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'final')),
  status TEXT NOT NULL DEFAULT 'pending',
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

-- Payment balances
CREATE TABLE balances (
  id SERIAL PRIMARY KEY,
  booking_ref TEXT REFERENCES bookings(reference) UNIQUE,
  total_amount INTEGER DEFAULT 0,
  deposit_amount INTEGER DEFAULT 0,
  final_amount INTEGER DEFAULT 0,
  deposit_paid INTEGER DEFAULT 0,
  final_paid INTEGER DEFAULT 0,
  balance_owed INTEGER DEFAULT 0,
  due_on_delivery BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'quoted',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat conversations
CREATE TABLE conversations (
  session_id TEXT PRIMARY KEY,
  name TEXT DEFAULT 'Visitor',
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment inquiries
CREATE TABLE inquiries (
  id TEXT PRIMARY KEY,
  equipment_id TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT DEFAULT '',
  interest TEXT DEFAULT 'buy',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings realtime (for live tracking updates)
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- Indexes
CREATE INDEX idx_bookings_reference ON bookings(reference);
CREATE INDEX idx_payments_booking_ref ON payments(booking_ref);
CREATE INDEX idx_conversations_session_id ON conversations(session_id);
