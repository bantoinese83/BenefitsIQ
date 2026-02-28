-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('platform_admin', 'employer_admin', 'employer_user', 'broker_advisor')),
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create benefits_data table
CREATE TABLE IF NOT EXISTS benefits_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  plan_name TEXT NOT NULL,
  plan_type TEXT NOT NULL,
  employee_count INTEGER NOT NULL,
  employer_premium NUMERIC NOT NULL,
  employee_premium NUMERIC NOT NULL,
  deductible NUMERIC NOT NULL,
  out_of_pocket_max NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefits_data ENABLE ROW LEVEL SECURITY;

-- Policies for organizations
CREATE POLICY "Users can see their own organization"
  ON organizations
  FOR SELECT
  USING (id IN (SELECT organization_id FROM profiles WHERE profiles.id = auth.uid()));

-- Policies for profiles
CREATE POLICY "Users can see their own profile"
  ON profiles
  FOR SELECT
  USING (id = auth.uid());

-- Policies for benefits_data
CREATE POLICY "Users can see their organization's benefits data"
  ON benefits_data
  FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Admins can insert/update benefits data"
  ON benefits_data
  FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('platform_admin', 'employer_admin')
    )
  );
