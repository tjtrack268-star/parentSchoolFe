-- ============================================================================
-- PARENTS SCHOOL - DATABASE SCHEMA
-- Phase 1 : Create Tables
-- ============================================================================

-- CREATE ENUMS
CREATE TYPE member_type AS ENUM ('ordinaire', 'honneur', 'bienfaiteur');
CREATE TYPE grade_name AS ENUM ('Leader', 'Leader Senior', 'Coordinateur', 'Mentor', 'Directeur');
CREATE TYPE transaction_type AS ENUM ('membership_fee', 'commission', 'bonus');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'cancelled');

-- ============================================================================
-- TABLE: profiles
-- Extends auth.users with additional profile information
-- ============================================================================
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  member_type member_type DEFAULT 'ordinaire'::member_type,
  country text NOT NULL,
  city text NOT NULL,
  sponsor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  referral_code text NOT NULL UNIQUE,
  current_grade grade_name DEFAULT 'Leader'::grade_name,
  total_points integer DEFAULT 0 CHECK (total_points >= 0),
  is_active boolean DEFAULT true,
  is_focal_point boolean DEFAULT false,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes on frequently queried columns
CREATE INDEX idx_profiles_sponsor_id ON profiles(sponsor_id);
CREATE INDEX idx_profiles_referral_code ON profiles(referral_code);
CREATE INDEX idx_profiles_member_type ON profiles(member_type);
CREATE INDEX idx_profiles_current_grade ON profiles(current_grade);
CREATE INDEX idx_profiles_email ON profiles(email);

COMMENT ON TABLE profiles IS 'User profiles extending auth.users with membership and referral information';
COMMENT ON COLUMN profiles.referral_code IS 'Unique code generated for each member to use for recruiting';
COMMENT ON COLUMN profiles.sponsor_id IS 'Reference to the sponsor (upline) of this member';

-- ============================================================================
-- TABLE: referrals
-- Sponsorship relationship tracking with generation level
-- ============================================================================
CREATE TABLE referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sponsored_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  generation_level integer NOT NULL CHECK (generation_level > 0),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT sponsor_not_self CHECK (sponsor_id != sponsored_id)
);

-- Create indexes for frequent queries
CREATE INDEX idx_referrals_sponsor_id ON referrals(sponsor_id);
CREATE INDEX idx_referrals_sponsored_id ON referrals(sponsored_id);
CREATE INDEX idx_referrals_generation_level ON referrals(generation_level);

COMMENT ON TABLE referrals IS 'MLM sponsorship relationships with generation tracking';

-- ============================================================================
-- TABLE: grades
-- Grade configuration with requirements and commission rates
-- ============================================================================
CREATE TABLE grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  required_direct_referrals integer NOT NULL CHECK (required_direct_referrals > 0),
  required_points integer NOT NULL CHECK (required_points > 0),
  benefits_amount_fcfa numeric NOT NULL CHECK (benefits_amount_fcfa > 0),
  commission_direct_percent numeric DEFAULT 0 CHECK (commission_direct_percent >= 0 AND commission_direct_percent <= 100),
  commission_team_percent numeric DEFAULT 0 CHECK (commission_team_percent >= 0 AND commission_team_percent <= 100),
  max_generation_commission integer DEFAULT 5,
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE grades IS 'Grade definitions with progression requirements and commission rates';

-- ============================================================================
-- TABLE: transactions
-- Financial transaction history (commissions, bonuses, fees)
-- ============================================================================
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount_fcfa numeric NOT NULL CHECK (amount_fcfa > 0),
  description text,
  source_referral_id uuid REFERENCES referrals(id) ON DELETE SET NULL,
  status transaction_status DEFAULT 'pending'::transaction_status,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for frequent queries
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

COMMENT ON TABLE transactions IS 'Financial transaction history for commissions, bonuses, and membership fees';

-- ============================================================================
-- TABLE: session_vouchers
-- Formation session vouchers given to members
-- ============================================================================
CREATE TABLE session_vouchers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  value_fcfa integer DEFAULT 3000 CHECK (value_fcfa > 0),
  is_used boolean DEFAULT false,
  used_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for frequent queries
CREATE INDEX idx_session_vouchers_owner_id ON session_vouchers(owner_id);
CREATE INDEX idx_session_vouchers_code ON session_vouchers(code);
CREATE INDEX idx_session_vouchers_is_used ON session_vouchers(is_used);

COMMENT ON TABLE session_vouchers IS 'Formation session vouchers distributed to members';

-- ============================================================================
-- TABLE: audit_logs (optional but recommended)
-- Track admin actions for security
-- ============================================================================
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid NOT NULL,
  changes jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================================
-- Grant permissions (will be refined in 002_rls_policies.sql)
-- ============================================================================

-- Allow all authenticated users to read their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Schema complete
-- ============================================================================
COMMENT ON SCHEMA public IS 'Parents School - Plateforme de formation à la parentalité chrétienne';
