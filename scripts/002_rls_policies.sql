-- ============================================================================
-- PARENTS SCHOOL - ROW LEVEL SECURITY POLICIES
-- Phase 1 : Security Setup
-- ============================================================================

-- ============================================================================
-- PROFILES - Row Level Security Policies
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can view members in their network tree (sponsors and downlines)
CREATE POLICY "Users can view network members"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM referrals 
      WHERE (sponsor_id = auth.uid() AND sponsored_id = id)
      OR (sponsored_id = auth.uid() AND sponsor_id = id)
    )
    OR auth.uid() = id
  );

-- Admin can view all profiles
CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin can update any profile
CREATE POLICY "Admin can update profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Prevent users from inserting directly (use trigger instead)
CREATE POLICY "Prevent direct profile insertion"
  ON profiles FOR INSERT
  WITH CHECK (false);

-- ============================================================================
-- REFERRALS - Row Level Security Policies
-- ============================================================================

-- Users can view their own referrals (as sponsor)
CREATE POLICY "Users can view own referrals as sponsor"
  ON referrals FOR SELECT
  USING (sponsor_id = auth.uid());

-- Users can view their sponsor relationship
CREATE POLICY "Users can view sponsor relationship"
  ON referrals FOR SELECT
  USING (sponsored_id = auth.uid());

-- Admin can view all referrals
CREATE POLICY "Admin can view all referrals"
  ON referrals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Prevent direct insertion (use triggers)
CREATE POLICY "Prevent direct referral insertion"
  ON referrals FOR INSERT
  WITH CHECK (false);

-- ============================================================================
-- GRADES - Row Level Security Policies
-- ============================================================================

-- All authenticated users can view grades
CREATE POLICY "Everyone can view grades"
  ON grades FOR SELECT
  USING (true);

-- Only admin can insert/update/delete grades
CREATE POLICY "Only admin can insert grades"
  ON grades FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Only admin can update grades"
  ON grades FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Only admin can delete grades"
  ON grades FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================================================
-- TRANSACTIONS - Row Level Security Policies
-- ============================================================================

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (user_id = auth.uid());

-- Admin can view all transactions
CREATE POLICY "Admin can view all transactions"
  ON transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Only backend can insert transactions
CREATE POLICY "Prevent user transaction insertion"
  ON transactions FOR INSERT
  WITH CHECK (false);

-- Only admin can update transaction status
CREATE POLICY "Admin can update transaction status"
  ON transactions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================================================
-- SESSION_VOUCHERS - Row Level Security Policies
-- ============================================================================

-- Users can view their own vouchers
CREATE POLICY "Users can view own vouchers"
  ON session_vouchers FOR SELECT
  USING (owner_id = auth.uid() OR used_by = auth.uid());

-- Admin can view all vouchers
CREATE POLICY "Admin can view all vouchers"
  ON session_vouchers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Users can mark their vouchers as used
CREATE POLICY "Users can use own vouchers"
  ON session_vouchers FOR UPDATE
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Admin can manage vouchers
CREATE POLICY "Admin can manage vouchers"
  ON session_vouchers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================================================
-- AUDIT_LOGS - Row Level Security Policies
-- ============================================================================

-- Admin can view audit logs
CREATE POLICY "Admin can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Only backend can insert audit logs
CREATE POLICY "Prevent user audit insertion"
  ON audit_logs FOR INSERT
  WITH CHECK (false);

-- ============================================================================
-- RLS SECURITY COMPLETE
-- ============================================================================
