-- RepurposeFlow Initial Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extended from Supabase auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  brand_voice TEXT, -- User's brand voice description
  example_posts JSONB DEFAULT '[]', -- Array of example posts for tone calibration
  credits INTEGER DEFAULT 3, -- Free tier: 3 repurposes/month
  plan TEXT DEFAULT 'free', -- 'free' | 'creator' | 'pro'
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Repurposed content history
CREATE TABLE repurposes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  source_title TEXT,
  source_content TEXT, -- Extracted blog content (truncated)
  outputs JSONB NOT NULL, -- All generated outputs
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE repurposes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles 
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update own profile" ON profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Repurposes policies
CREATE POLICY "Users can view own repurposes" ON repurposes 
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own repurposes" ON repurposes 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can delete own repurposes" ON repurposes 
  FOR DELETE USING (auth.uid() = user_id);

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, credits, plan)
  VALUES (NEW.id, NEW.email, 3, 'free');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to reset credits monthly (run as cron job in Supabase)
CREATE OR REPLACE FUNCTION reset_monthly_credits()
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET credits = CASE 
    WHEN plan = 'free' THEN 3
    WHEN plan = 'creator' THEN 30
    WHEN plan = 'pro' THEN 9999
    ELSE 3
  END,
  updated_at = NOW()
  WHERE plan IN ('free', 'creator', 'pro');
END;
$$ LANGUAGE plpgsql;
