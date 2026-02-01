# Phase 4 - Prompt : Moteur de Carrière & Commissions MLM

## 🎯 Objectif
Implémenter la logique automatique de calcul des grades, distribution des commissions multi-niveaux et attribution des bons de formation.

## 📋 Contexte à Inclure
- **00-CONTEXT-GLOBAL.md**
- **Phase 1, 2 & 3**

---

## 🔧 Prompt à Utiliser pour l'IA

\`\`\`
Tu dois implémenter le moteur de carrière automatique avec calcul des grades et distribution des commissions MLM pour Parents School.

CONTEXTE : [Inclure 00-CONTEXT-GLOBAL.md + Phase 1 à 3]

TÂCHE : Créer les fonctions SQL, triggers et API pour la logique carrière

FICHIERS À CRÉER :

## SCRIPTS SQL AVANCÉS

### scripts/005_career_functions.sql

Créer 4 fonctions PostgreSQL critiques :

#### 1. Fonction : calculate_user_grade(user_id uuid)

Logique :
1. SELECT COUNT(*) as direct_referrals FROM referrals WHERE sponsor_id = user_id
2. SELECT total_points FROM profiles WHERE id = user_id
3. SELECT * FROM grades ORDER BY required_points DESC
4. Boucler les grades, trouver le premier atteint :
   - Comparé : direct_referrals >= required_direct_referrals AND total_points >= required_points
5. Si grade atteint > current_grade :
   a) UPDATE profiles SET current_grade = new_grade WHERE id = user_id
   b) Créer transaction de BONUS : amount = grade.benefits_amount_fcfa
   c) Si grade change, trigger des emails de félicitations
6. RETURN new_grade

PSEUDO-CODE :
\`\`\`sql
CREATE OR REPLACE FUNCTION calculate_user_grade(user_id uuid)
RETURNS varchar AS $$
DECLARE
  direct_refs INTEGER;
  user_points INTEGER;
  new_grade VARCHAR;
  grade_record grades%ROWTYPE;
  current_grade_record grades%ROWTYPE;
BEGIN
  -- Get user stats
  SELECT COUNT(*) INTO direct_refs FROM referrals WHERE sponsor_id = user_id;
  SELECT total_points INTO user_points FROM profiles WHERE id = user_id;
  
  -- Find current grade
  SELECT * INTO current_grade_record FROM grades 
  WHERE name = (SELECT current_grade FROM profiles WHERE id = user_id);
  
  -- Find highest achievable grade
  FOR grade_record IN 
    SELECT * FROM grades ORDER BY required_points DESC
  LOOP
    IF direct_refs >= grade_record.required_direct_referrals 
       AND user_points >= grade_record.required_points THEN
      new_grade := grade_record.name;
      EXIT;
    END IF;
  END LOOP;
  
  -- Update if grade changed
  IF new_grade != current_grade_record.name THEN
    UPDATE profiles SET current_grade = new_grade WHERE id = user_id;
    
    -- Create bonus transaction
    INSERT INTO transactions (user_id, type, amount_fcfa, description, status)
    VALUES (user_id, 'bonus', (SELECT benefits_amount_fcfa FROM grades WHERE name = new_grade), 
            'Bonus grade promotion: ' || new_grade, 'completed');
  END IF;
  
  RETURN new_grade;
END;
$$ LANGUAGE plpgsql;
\`\`\`

#### 2. Fonction : distribute_commissions(new_member_id uuid, membership_fee numeric DEFAULT 5000)

Logique MLM sur 5 générations :

1. Récupérer sponsor_id du nouveau membre
2. Initialiser : generation = 1, current_sponsor = sponsor_id
3. Boucle WHILE generation <= 5 AND current_sponsor IS NOT NULL :
   a) Récupérer profil du sponsor à ce niveau
   b) Récupérer le grade du sponsor
   c) Calculer la commission selon :
      - Generation 1 (direct sponsor) :
        * Si grade = 'Mentor' : commission = membership_fee * 10%
        * Si grade = 'Directeur' : commission = membership_fee * 15%
        * Sinon : commission = 0
      - Generation 2-5 :
        * Si grade IN ('Coordinateur', 'Mentor', 'Directeur') : commission = membership_fee * 5%
        * Sinon : commission = 0
   d) Si commission > 0 :
      - INSERT INTO transactions (user_id=sponsor_id, type='commission', amount_fcfa=commission, source_referral_id=referral_id, status='completed')
      - UPDATE profiles SET total_points = total_points + (commission / 100) WHERE id = sponsor_id
      - CALL calculate_user_grade(sponsor_id) pour recalcul
   e) current_sponsor := (SELECT sponsor_id FROM profiles WHERE id = current_sponsor)
   f) generation := generation + 1

4. Après distribution des commissions :
   a) Générer 1 session_voucher pour le nouveau membre
      - code = generateCode() (8 chars unique)
      - value_fcfa = 3000
      - owner_id = new_member_id

PSEUDO-CODE :
\`\`\`sql
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
  SELECT * INTO referral_record FROM referrals WHERE sponsored_id = new_member_id;
  current_sponsor := referral_record.sponsor_id;
  
  -- Loop through 5 generations
  WHILE generation <= 5 AND current_sponsor IS NOT NULL LOOP
    SELECT current_grade INTO sponsor_grade FROM profiles WHERE id = current_sponsor;
    
    -- Calculate commission based on generation and grade
    IF generation = 1 THEN
      CASE sponsor_grade
        WHEN 'Mentor' THEN commission_amount := membership_fee * 0.10;
        WHEN 'Directeur' THEN commission_amount := membership_fee * 0.15;
        ELSE commission_amount := 0;
      END CASE;
    ELSE -- Generation 2-5
      IF sponsor_grade IN ('Coordinateur', 'Mentor', 'Directeur') THEN
        commission_amount := membership_fee * 0.05;
      ELSE
        commission_amount := 0;
      END IF;
    END IF;
    
    -- Record transaction if commission > 0
    IF commission_amount > 0 THEN
      INSERT INTO transactions (user_id, type, amount_fcfa, source_referral_id, status)
      VALUES (current_sponsor, 'commission', commission_amount, referral_record.id, 'completed');
      
      -- Update sponsor points (commission as points)
      UPDATE profiles SET total_points = total_points + (commission_amount::INTEGER / 100)
      WHERE id = current_sponsor;
      
      -- Recalculate sponsor grade
      PERFORM calculate_user_grade(current_sponsor);
    END IF;
    
    -- Move to next level
    SELECT sponsor_id INTO current_sponsor FROM profiles WHERE id = current_sponsor;
    generation := generation + 1;
  END LOOP;
  
  -- Create session voucher for new member
  INSERT INTO session_vouchers (owner_id, code, value_fcfa, is_used)
  VALUES (new_member_id, generate_referral_code(), 3000, FALSE);
  
END;
$$ LANGUAGE plpgsql;
\`\`\`

#### 3. Fonction : generate_referral_code()

Génère un code parrain unique de 8 caractères

\`\`\`sql
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS varchar AS $$
DECLARE
  code varchar;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate random 8-char alphanumeric code
    code := (SELECT array_to_string(ARRAY(
      SELECT substring('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' FROM (random() * 36 + 1)::integer FOR 1)
      FROM generate_series(1, 8)
    ), ''));
    
    -- Check if exists
    SELECT EXISTS(SELECT 1 FROM profiles WHERE referral_code = code) INTO code_exists;
    
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;
\`\`\`

#### 4. Fonction : count_all_referrals_recursive(user_id uuid)

Compte tous les filleuls de tous les niveaux

\`\`\`sql
CREATE OR REPLACE FUNCTION count_all_referrals_recursive(user_id uuid)
RETURNS TABLE(count INTEGER, generations_count INTEGER) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE referral_tree AS (
    SELECT id, sponsor_id, 1 as level
    FROM referrals
    WHERE sponsor_id = user_id
    
    UNION ALL
    
    SELECT r.id, r.sponsor_id, rt.level + 1
    FROM referrals r
    INNER JOIN referral_tree rt ON r.sponsor_id = rt.id
    WHERE rt.level < 5
  )
  SELECT COUNT(*)::INTEGER, MAX(level)::INTEGER FROM referral_tree;
END;
$$ LANGUAGE plpgsql;
\`\`\`

### scripts/006_mlm_triggers.sql

Créer les triggers qui déclenche la logique MLM :

#### Trigger 1 : on_referral_created
Se déclenche après INSERT dans referrals

\`\`\`sql
CREATE OR REPLACE FUNCTION on_referral_created_fn()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Add 60 points to sponsor
  UPDATE profiles SET total_points = total_points + 60
  WHERE id = NEW.sponsor_id;
  
  -- 2. Recalculate sponsor grade
  PERFORM calculate_user_grade(NEW.sponsor_id);
  
  -- 3. Distribute commissions
  PERFORM distribute_commissions(NEW.sponsored_id, 5000);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_referral_created
AFTER INSERT ON referrals
FOR EACH ROW
EXECUTE FUNCTION on_referral_created_fn();
\`\`\`

#### Trigger 2 : on_profile_updated
Se déclenche après UPDATE de profiles pour logger changes

\`\`\`sql
CREATE OR REPLACE FUNCTION on_profile_updated_fn()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_updated
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION on_profile_updated_fn();
\`\`\`

### scripts/007_recursive_tree_builder.sql

Créer fonction pour construire l'arbre en JSON :

\`\`\`sql
CREATE OR REPLACE FUNCTION build_referral_tree_json(user_id uuid, max_depth INTEGER DEFAULT 5)
RETURNS jsonb AS $$
WITH RECURSIVE tree AS (
  -- Base case : le user lui-même
  SELECT 
    id, 
    first_name, 
    last_name, 
    current_grade, 
    total_points, 
    sponsor_id,
    1 as depth,
    ARRAY[id] as path
  FROM profiles
  WHERE id = user_id
  
  UNION ALL
  
  -- Récursif : tous les filleuls
  SELECT 
    p.id, 
    p.first_name, 
    p.last_name, 
    p.current_grade, 
    p.total_points, 
    p.sponsor_id,
    t.depth + 1,
    t.path || p.id
  FROM profiles p
  INNER JOIN referrals r ON p.id = r.sponsored_id
  INNER JOIN tree t ON r.sponsor_id = t.id
  WHERE t.depth < max_depth AND NOT p.id = ANY(t.path)
)
SELECT jsonb_build_object(
  'id', id,
  'name', first_name || ' ' || last_name,
  'grade', current_grade,
  'points', total_points,
  'children', COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', id,
      'name', first_name || ' ' || last_name,
      'grade', current_grade,
      'points', total_points
    ) FILTER (WHERE depth > 1)
  ), '[]'::jsonb)
) FROM tree;
$$ LANGUAGE sql;
\`\`\`

## CONSTANTES (lib/constants.ts)

\`\`\`typescript
export const GRADES = {
  LEADER: {
    name: 'Leader' as const,
    requiredReferrals: 4,
    requiredPoints: 240,
    benefitsFcfa: 5000,
    commissionDirect: 0,
    commissionTeam: 0,
  },
  LEADER_SENIOR: {
    name: 'Leader Senior' as const,
    requiredReferrals: 8,
    requiredPoints: 1200,
    benefitsFcfa: 10000,
    commissionDirect: 0,
    commissionTeam: 0,
  },
  COORDINATEUR: {
    name: 'Coordinateur' as const,
    requiredReferrals: 18,
    requiredPoints: 3000,
    benefitsFcfa: 15000,
    commissionDirect: 0,
    commissionTeam: 5,
  },
  MENTOR: {
    name: 'Mentor' as const,
    requiredReferrals: 30,
    requiredPoints: 10000,
    benefitsFcfa: 25000,
    commissionDirect: 10,
    commissionTeam: 5,
  },
  DIRECTEUR: {
    name: 'Directeur' as const,
    requiredReferrals: 40,
    requiredPoints: 30000,
    benefitsFcfa: 50000,
    commissionDirect: 15,
    commissionTeam: 5,
  },
} as const

export const MLM_CONFIG = {
  POINTS_PER_REFERRAL: 60,
  MEMBERSHIP_FEE_FCFA: 5000,
  SESSION_VOUCHER_VALUE_FCFA: 3000,
  MAX_GENERATION_COMMISSION: 5,
  COMMISSION_RATES: {
    DIRECT_MENTOR: 0.10,
    DIRECT_DIRECTEUR: 0.15,
    TEAM_LEVEL_2_5: 0.05,
  },
} as const

export const GRADE_COLORS = {
  'Leader': 'hsl(140, 70%, 50%)',
  'Leader Senior': 'hsl(200, 80%, 50%)',
  'Coordinateur': 'hsl(220, 90%, 50%)',
  'Mentor': 'hsl(270, 80%, 50%)',
  'Directeur': 'hsl(45, 95%, 50%)',
} as const
\`\`\`

## API ROUTES

### app/api/admin/recalculate-grades/route.ts
POST - Recalculer les grades pour tous les utilisateurs (admin only)

\`\`\`typescript
export async function POST(request: Request) {
  const user = await getUser()
  if (!user) return unauthorized()
  
  // Check if admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  if (!profile?.is_admin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  // Get all users
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
  
  // Recalculate each
  for (const p of profiles) {
    await supabase.rpc('calculate_user_grade', { user_id: p.id })
  }
  
  return Response.json({ success: true, processed: profiles.length })
}
\`\`\`

### app/api/admin/process-commissions/route.ts
POST - Traiter les commissions en attente

### app/api/grades/current/route.ts
GET - Infos du grade actuel + progression

\`\`\`typescript
export async function GET(request: Request) {
  const user = await getUser()
  if (!user) return unauthorized()
  
  const supabase = createServerClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  const { data: currentGradeData } = await supabase
    .from('grades')
    .select('*')
    .eq('name', profile.current_grade)
    .single()
  
  const { data: nextGradeData } = await supabase
    .from('grades')
    .select('*')
    .order('required_points', { ascending: true })
    .gt('required_points', profile.total_points)
    .limit(1)
    .single()
  
  const { data: referralCount } = await supabase
    .rpc('count_all_referrals_recursive', { user_id: user.id })
  
  return Response.json({
    currentGrade: currentGradeData,
    nextGrade: nextGradeData || null,
    stats: {
      totalPoints: profile.total_points,
      directReferrals: referralCount[0].count,
      missingPoints: nextGradeData ? nextGradeData.required_points - profile.total_points : 0,
      missingReferrals: nextGradeData ? nextGradeData.required_direct_referrals - referralCount[0].count : 0,
    },
  })
}
\`\`\`

---

REGLES DE VALIDATION :

✅ Toutes les fonctions SQL testées et validées
✅ Triggers déclenches à bon moment
✅ Transactions ACID pour opérations multi-table
✅ Performance : indexes sur sponsor_id, user_id
✅ Gestion d'erreurs robuste
✅ Commissions distribuées correctement (multi-génération)
✅ Grades recalculés automatiquement
✅ Points et bons attribués correctement

OUTPUT ATTENDU :
- Scripts SQL complets et testés
- Constantes TypeScript définies
- API routes admin fonctionnelles
- Logique MLM 100% automatisée
- Performance optimisée (< 1s par opération)
\`\`\`

---

## ✅ Checklist de Validation

- [ ] Fonctions SQL créées et testées
- [ ] Triggers déclenches correctement
- [ ] Grades recalculés automatiquement après parrainage
- [ ] Commissions distribuées sur 5 générations
- [ ] Points attribués correctement
- [ ] Bons de formation générés pour nouveaux membres
- [ ] Aucune faille dans la logique MLM
- [ ] Performance acceptable (< 1s par insertion referral)
- [ ] Constantes TypeScript utilisées partout
- [ ] Tests : créer 10 utilisateurs, vérifier grades et commissions

## 📊 Test Scenario

\`\`\`
1. Créer sponsor (grade Leader) avec 4 filleuls
2. Chaque filleul parraina 4 autres (gen 2)
3. Chaque gen 2 parraina 4 autres (gen 3)
4. Vérifier :
   - Sponsor → grade au moins Directeur
   - Gen 2 sponsors → au moins Leader Senior
   - Commissions versées : Gen 1 = 10-15%, Gen 2-5 = 5%
   - Points accumulés correctement
\`\`\`

## 📚 Références

- [PostgreSQL Recursive CTEs](https://www.postgresql.org/docs/current/queries-with.html)
- [PostgreSQL JSON Functions](https://www.postgresql.org/docs/current/functions-json.html)
- [Triggers Best Practices](https://wiki.postgresql.org/wiki/Introduction_to_Triggers)
