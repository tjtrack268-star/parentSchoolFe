-- ============================================================================
-- PARENTS SCHOOL - SEED DATA FOR GRADES
-- Phase 1 : Initial Configuration
-- ============================================================================

-- ============================================================================
-- INSERT GRADE CONFIGURATIONS
-- ============================================================================

DELETE FROM grades WHERE name IN ('Leader', 'Leader Senior', 'Coordinateur', 'Mentor', 'Directeur');

INSERT INTO grades (name, required_direct_referrals, required_points, benefits_amount_fcfa, commission_direct_percent, commission_team_percent, max_generation_commission)
VALUES
  ('Leader', 4, 240, 5000, 0, 0, 0),
  ('Leader Senior', 8, 1200, 10000, 0, 0, 0),
  ('Coordinateur', 18, 3000, 15000, 0, 5, 5),
  ('Mentor', 30, 10000, 25000, 10, 5, 5),
  ('Directeur', 40, 30000, 50000, 15, 5, 5)
ON CONFLICT (name) DO UPDATE SET
  required_direct_referrals = EXCLUDED.required_direct_referrals,
  required_points = EXCLUDED.required_points,
  benefits_amount_fcfa = EXCLUDED.benefits_amount_fcfa,
  commission_direct_percent = EXCLUDED.commission_direct_percent,
  commission_team_percent = EXCLUDED.commission_team_percent;

-- ============================================================================
-- VERIFY GRADES INSERTED
-- ============================================================================

SELECT * FROM grades ORDER BY required_points;

-- ============================================================================
-- SEED DATA COMPLETE
-- ============================================================================
