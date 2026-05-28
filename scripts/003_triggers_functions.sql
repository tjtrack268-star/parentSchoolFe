-- ============================================================================
-- PARENTS SCHOOL - DATABASE FUNCTIONS & TRIGGERS
-- Phase 1 : Business Logic Automation
-- ============================================================================

-- ============================================================================
-- FUNCTION: generate_referral_code()
-- Generates a unique 8-character alphanumeric referral code
-- ============================================================================
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS varchar AS $$
DECLARE
  code varchar;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate random 8-character alphanumeric code
    code := (SELECT array_to_string(ARRAY(
      SELECT substring('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' FROM (random() * 36)::integer + 1 FOR 1)
      FROM generate_series(1, 8)
    ), ''));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM profiles WHERE referral_code = code) INTO code_exists;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_referral_code() IS 'Generates unique 8-char alphanumeric referral codes';

-- ============================================================================
-- FUNCTION: handle_new_auth_user()
-- Trigger function: creates profile when new user signs up
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
  generated_code varchar;
BEGIN
  -- Generate unique referral code
  generated_code := generate_referral_code();
  
  -- Create profile with data from auth user metadata
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    phone,
    country,
    city,
    member_type,
    referral_code
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'country', ''),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    CAST(COALESCE(NEW.raw_user_meta_data->>'member_type', 'ordinaire') AS member_type),
    generated_code
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create profile after new auth user
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();

COMMENT ON FUNCTION handle_new_auth_user() IS 'Automatically creates profile when new user registers';

-- ============================================================================
-- FUNCTION: calculate_user_grade(user_id uuid)
-- Calculates and updates user grade based on referrals and points
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_user_grade(user_id uuid)
RETURNS varchar AS $$
DECLARE
  direct_refs INTEGER;
  user_points INTEGER;
  new_grade VARCHAR;
  current_grade_record grades%ROWTYPE;
  grade_record grades%ROWTYPE;
BEGIN
  -- Get user stats
  SELECT COUNT(*)::INTEGER INTO direct_refs 
  FROM referrals 
  WHERE sponsor_id = user_id;
  
  SELECT total_points INTO user_points 
  FROM profiles 
  WHERE id = user_id;
  
  -- Get current grade
  SELECT * INTO current_grade_record FROM grades 
  WHERE name = (SELECT current_grade FROM profiles WHERE id = user_id);
  
  -- Find highest achievable grade (from highest to lowest)
  FOR grade_record IN 
    SELECT * FROM grades ORDER BY required_points DESC
  LOOP
    IF direct_refs >= grade_record.required_direct_referrals 
       AND user_points >= grade_record.required_points THEN
      new_grade := grade_record.name;
      EXIT;
    END IF;
  END LOOP;
  
  -- If no grade found, set to Leader
  IF new_grade IS NULL THEN
    new_grade := 'Leader';
  END IF;
  
  -- Update if grade changed
  IF new_grade != current_grade_record.name THEN
    UPDATE profiles 
    SET current_grade = new_grade::grade_name,
        updated_at = now()
    WHERE id = user_id;
    
    -- Create bonus transaction for grade promotion
    INSERT INTO transactions (user_id, type, amount_fcfa, description, status)
    VALUES (
      user_id, 
      'bonus'::transaction_type, 
      (SELECT benefits_amount_fcfa FROM grades WHERE name = new_grade::grade_name), 
      'Bonus grade promotion: ' || new_grade, 
      'completed'::transaction_status
    );
  END IF;
  
  RETURN new_grade;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION calculate_user_grade(uuid) IS 'Calculates and updates user grade based on referrals and points';

-- ============================================================================
-- FUNCTION: count_all_referrals_recursive(user_id uuid)
-- Counts all direct and indirect referrals (all generations)
-- ============================================================================
CREATE OR REPLACE FUNCTION count_all_referrals_recursive(user_id uuid)
RETURNS TABLE(total_count INTEGER, max_generation INTEGER) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE referral_tree AS (
    -- Base case: direct referrals
    SELECT id, sponsor_id, 1::integer as level
    FROM referrals
    WHERE sponsor_id = user_id
    
    UNION ALL
    
    -- Recursive case: referrals of referrals
    SELECT r.id, r.sponsor_id, rt.level + 1
    FROM referrals r
    INNER JOIN referral_tree rt ON r.sponsor_id = rt.id
    WHERE rt.level < 5  -- Limit to 5 generations
  )
  SELECT COUNT(*)::INTEGER, COALESCE(MAX(level), 0)::INTEGER 
  FROM referral_tree;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION count_all_referrals_recursive(uuid) IS 'Counts all referrals recursively across all generations';

-- ============================================================================
-- FUNCTION: distribute_commissions(new_member_id uuid, membership_fee numeric)
-- Distributes MLM commissions up the sponsorship chain
-- ============================================================================
CREATE OR REPLACE FUNCTION distribute_commissions(
  new_member_id uuid,
  membership_fee numeric DEFAULT 5000
)
RETURNS void AS $$
DECLARE
  current_sponsor uuid;
  generation INTEGER := 1;
  sponsor_grade VARCHAR;
  commission_amount numeric;
  referral_record referrals%ROWTYPE;
BEGIN
  -- Get sponsor of new member
  SELECT * INTO referral_record 
  FROM referrals 
  WHERE sponsored_id = new_member_id;
  
  IF referral_record.id IS NULL THEN
    RETURN;  -- No sponsor, no commissions
  END IF;
  
  current_sponsor := referral_record.sponsor_id;
  
  -- Loop through up to 5 generations
  WHILE generation <= 5 AND current_sponsor IS NOT NULL LOOP
    SELECT current_grade INTO sponsor_grade 
    FROM profiles 
    WHERE id = current_sponsor;
    
    -- Calculate commission based on generation and grade
    IF generation = 1 THEN
      -- Direct sponsor commission
      CASE sponsor_grade
        WHEN 'Coordinateur' THEN commission_amount := membership_fee * 0.10;
        WHEN 'Mentor' THEN commission_amount := membership_fee * 0.10;
        WHEN 'Directeur' THEN commission_amount := membership_fee * 0.15;
        ELSE commission_amount := 0;
      END CASE;
    ELSE
      -- Team commission (generation 2 to 5)
      CASE sponsor_grade
        WHEN 'Leader Senior' THEN commission_amount := membership_fee * 0.05;
        WHEN 'Coordinateur' THEN commission_amount := membership_fee * 0.05;
        WHEN 'Mentor' THEN commission_amount := membership_fee * 0.05;
        WHEN 'Directeur' THEN commission_amount := membership_fee * 0.075;
        ELSE commission_amount := 0;
      END CASE;
    END IF;
    
    -- Record transaction if commission > 0
    IF commission_amount > 0 THEN
      INSERT INTO transactions (user_id, type, amount_fcfa, source_referral_id, description, status)
      VALUES (
        current_sponsor, 
        'commission'::transaction_type, 
        commission_amount, 
        referral_record.id,
        'Commission from generation ' || generation,
        'completed'::transaction_status
      );
      
      -- Update sponsor points (commission divided by 100 = points)
      UPDATE profiles 
      SET total_points = total_points + (commission_amount::INTEGER / 100)
      WHERE id = current_sponsor;
      
      -- Recalculate sponsor grade
      PERFORM calculate_user_grade(current_sponsor);
    END IF;
    
    -- Move to next level (get sponsor's sponsor)
    SELECT sponsor_id INTO current_sponsor 
    FROM profiles 
    WHERE id = current_sponsor;
    
    generation := generation + 1;
  END LOOP;
  
  -- Create session voucher for new member
  INSERT INTO session_vouchers (owner_id, code, value_fcfa, is_used)
  VALUES (new_member_id, generate_referral_code(), 3000, FALSE);
  
EXCEPTION WHEN others THEN
  RAISE WARNING 'Error in distribute_commissions: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION distribute_commissions(uuid, numeric) IS 'Distributes MLM commissions to upline members';

-- ============================================================================
-- FUNCTION: handle_new_referral()
-- Trigger function: processes new referral (points, grade, commissions)
-- ============================================================================
CREATE OR REPLACE FUNCTION handle_new_referral()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Add 60 points to sponsor
  UPDATE profiles 
  SET total_points = total_points + 60
  WHERE id = NEW.sponsor_id;
  
  -- 2. Recalculate sponsor grade
  PERFORM calculate_user_grade(NEW.sponsor_id);
  
  -- 3. Distribute commissions
  PERFORM distribute_commissions(NEW.sponsored_id, 5000);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Process new referral
CREATE OR REPLACE TRIGGER on_referral_created
  AFTER INSERT ON referrals
  FOR EACH ROW EXECUTE FUNCTION handle_new_referral();

COMMENT ON FUNCTION handle_new_referral() IS 'Processes new referral: adds points, updates grades, distributes commissions';

-- ============================================================================
-- FUNCTION: update_profile_timestamp()
-- Trigger function: updates updated_at timestamp on profile changes
-- ============================================================================
CREATE OR REPLACE FUNCTION update_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update timestamp on profile update
CREATE OR REPLACE TRIGGER on_profile_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_timestamp();

-- ============================================================================
-- FUNCTION: build_referral_tree_json(user_id uuid, max_depth integer)
-- Builds referral tree as JSON for visualization
-- ============================================================================
CREATE OR REPLACE FUNCTION build_referral_tree_json(
  user_id uuid, 
  max_depth INTEGER DEFAULT 5
)
RETURNS jsonb AS $$
WITH RECURSIVE tree AS (
  -- Base case: the user themselves
  SELECT 
    p.id, 
    p.first_name, 
    p.last_name, 
    p.current_grade, 
    p.total_points,
    1::integer as depth,
    ARRAY[p.id] as path
  FROM profiles p
  WHERE p.id = user_id
  
  UNION ALL
  
  -- Recursive: all sponsored members
  SELECT 
    p.id, 
    p.first_name, 
    p.last_name, 
    p.current_grade, 
    p.total_points,
    t.depth + 1,
    t.path || p.id
  FROM profiles p
  INNER JOIN referrals r ON p.id = r.sponsored_id
  INNER JOIN tree t ON r.sponsor_id = t.id
  WHERE t.depth < max_depth AND NOT p.id = ANY(t.path)
)
SELECT jsonb_build_object(
  'id', id::text,
  'name', first_name || ' ' || last_name,
  'grade', current_grade::text,
  'points', total_points,
  'children', COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', id::text,
        'name', first_name || ' ' || last_name,
        'grade', current_grade::text,
        'points', total_points
      ) ORDER BY last_name
    ) FILTER (WHERE depth > 1),
    '[]'::jsonb
  )
) FROM tree WHERE depth = 1;
$$ LANGUAGE sql;

COMMENT ON FUNCTION build_referral_tree_json(uuid, integer) IS 'Builds referral tree structure as JSON';

-- ============================================================================
-- DATABASE FUNCTIONS & TRIGGERS COMPLETE
-- ============================================================================
