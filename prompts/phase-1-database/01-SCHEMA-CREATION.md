# Phase 1 - Prompt : Création du Schéma de Base de Données

## 🎯 Objectif
Créer le schéma PostgreSQL complet pour Parents School avec toutes les tables, contraintes, indexes et Row Level Security.

## 📋 Contexte à Inclure
Référencer le fichier **00-CONTEXT-GLOBAL.md**

---

## 🔧 Prompt à Utiliser pour l'IA

\`\`\`
Tu dois implémenter le schéma PostgreSQL complet pour la plateforme Parents School.

CONTEXTE : [Inclure le contenu de 00-CONTEXT-GLOBAL.md]

TÂCHE : Créer les scripts SQL pour initialiser la base de données

FICHIERS À CRÉER :
1. scripts/001_create_tables.sql
2. scripts/002_rls_policies.sql
3. scripts/003_triggers_functions.sql
4. scripts/004_seed_grades.sql

DÉTAILS D'IMPLÉMENTATION :

## SCRIPT 1 : 001_create_tables.sql

Créer les tables suivantes en PostgreSQL avec constraints appropriées :

### Table: profiles
Extends auth.users avec informations du profil
Colonnes :
- id (uuid, PRIMARY KEY, FK → auth.users.id)
- first_name (text, NOT NULL)
- last_name (text, NOT NULL)
- email (text, NOT NULL, UNIQUE)
- phone (text, NOT NULL)
- member_type (enum: 'ordinaire', 'honneur', 'bienfaiteur', DEFAULT 'ordinaire')
- country (text, NOT NULL)
- city (text, NOT NULL)
- sponsor_id (uuid, FK → profiles.id, NULLABLE)
- referral_code (text, NOT NULL, UNIQUE)
- current_grade (enum: 'Leader', 'Leader Senior', 'Coordinateur', 'Mentor', 'Directeur', DEFAULT 'Leader')
- total_points (integer, DEFAULT 0, CHECK >= 0)
- is_active (boolean, DEFAULT true)
- is_focal_point (boolean, DEFAULT false)
- is_admin (boolean, DEFAULT false)
- created_at (timestamptz, DEFAULT now())
- updated_at (timestamptz, DEFAULT now())

Indexes : sponsor_id, referral_code, member_type, current_grade

### Table: referrals
Arbre de parrainage avec tracking générationnel
Colonnes :
- id (uuid, PRIMARY KEY, DEFAULT gen_random_uuid())
- sponsor_id (uuid, NOT NULL, FK → profiles.id)
- sponsored_id (uuid, NOT NULL, FK → profiles.id, UNIQUE)
- generation_level (integer, NOT NULL, CHECK > 0)
- created_at (timestamptz, DEFAULT now())

Constraint : CHECK sponsor_id != sponsored_id

Indexes : sponsor_id, sponsored_id, generation_level

### Table: grades
Configuration des grades et commissions
Colonnes :
- id (uuid, PRIMARY KEY, DEFAULT gen_random_uuid())
- name (text, NOT NULL, UNIQUE)
- required_direct_referrals (integer, NOT NULL, CHECK > 0)
- required_points (integer, NOT NULL, CHECK > 0)
- benefits_amount_fcfa (numeric, NOT NULL, CHECK > 0)
- commission_direct_percent (numeric, DEFAULT 0, CHECK >= 0 AND <= 100)
- commission_team_percent (numeric, DEFAULT 0, CHECK >= 0 AND <= 100)
- max_generation_commission (integer, DEFAULT 5)
- created_at (timestamptz, DEFAULT now())

### Table: transactions
Historique financier (commissions, boni, frais)
Colonnes :
- id (uuid, PRIMARY KEY, DEFAULT gen_random_uuid())
- user_id (uuid, NOT NULL, FK → profiles.id)
- type (enum: 'membership_fee', 'commission', 'bonus', NOT NULL)
- amount_fcfa (numeric, NOT NULL, CHECK > 0)
- description (text)
- source_referral_id (uuid, FK → referrals.id, NULLABLE)
- status (enum: 'pending', 'completed', 'cancelled', DEFAULT 'pending')
- created_at (timestamptz, DEFAULT now())
- updated_at (timestamptz, DEFAULT now())

Indexes : user_id, type, status, created_at

### Table: session_vouchers
Bons de formation attribués aux membres
Colonnes :
- id (uuid, PRIMARY KEY, DEFAULT gen_random_uuid())
- owner_id (uuid, NOT NULL, FK → profiles.id)
- code (text, NOT NULL, UNIQUE)
- value_fcfa (integer, DEFAULT 3000, CHECK > 0)
- is_used (boolean, DEFAULT false)
- used_by (uuid, FK → profiles.id, NULLABLE)
- used_at (timestamptz, NULLABLE)
- created_at (timestamptz, DEFAULT now())

Indexes : owner_id, code, is_used

EXIGENCES :
- Ajouter ON DELETE CASCADE où approprié (e.g., referrals si sponsor supprimé)
- Créer ENUM types explicitement en début de script
- Ajouter des commentaires explicatifs pour chaque table
- Optimiser les indexes pour les requêtes fréquentes

## SCRIPT 2 : 002_rls_policies.sql

Implémenter Row Level Security sur toutes les tables sensibles :

### Policies pour 'profiles'
- Authentification requise pour toutes les opérations
- SELECT : user ne peut voir QUE son profil (id = auth.uid())
  - Sauf autres members de son arbre (condition : exists select... dans referrals)
- UPDATE : user ne peut modifier QUE son profil
- INSERT : disabled (via trigger uniquement)
- DELETE : disabled

### Policies pour 'referrals'
- SELECT : user peut voir tous ses parrainages (sponsor_id = auth.uid()) + ses parrains (sponsored_id = auth.uid())
  - Admin peut voir tous
- INSERT : via trigger uniquement
- UPDATE/DELETE : disabled

### Policies pour 'grades'
- SELECT : public (tous lecteurs)
- INSERT/UPDATE/DELETE : admin uniquement

### Policies pour 'transactions'
- SELECT : user voit ses transactions + admin voit tout
- INSERT/UPDATE/DELETE : backend uniquement

### Policies pour 'session_vouchers'
- SELECT : owner voit siens + admin voit tout
- INSERT : backend via trigger
- UPDATE : owner peut marquer comme utilisé
- DELETE : admin uniquement

EXIGENCES :
- Activer RLS sur chaque table : ALTER TABLE table_name ENABLE ROW LEVEL SECURITY
- Créer des roles postgres si nécessaire (authenticated, service_role)
- Tester chaque policy avec WHERE clauses correctes
- Documenter la logique de sécurité pour chaque table

## SCRIPT 3 : 003_triggers_functions.sql

Créer les fonctions et triggers pour automatiser la logique métier :

### Fonction : handle_new_auth_user()
Se déclenche quand un utilisateur se crée via auth.users
Actions :
1. Créer un profil dans 'profiles' avec email, id depuis auth.users
2. Générer un referral_code unique (fonction helper)

### Fonction : handle_new_referral()
Se déclenche après INSERT dans 'referrals'
Actions :
1. Ajouter 60 points au sponsor (UPDATE profiles SET total_points = total_points + 60)
2. Appeler recalculate_user_grade(sponsor_id)
3. Appeler distribute_commissions(sponsored_id, membership_fee) -- TODO: get membership_fee

### Fonction : generate_referral_code()
Retourne un code parrain unique (8 caractères alphanumériques)
Vérifier l'unicité dans profiles.referral_code

### Fonction : recalculate_user_grade(user_id uuid)
Logique :
1. SELECT COUNT(*) FROM referrals WHERE sponsor_id = user_id (direct_referrals)
2. SELECT total_points FROM profiles WHERE id = user_id
3. Comparer avec grades table : trouver le grade le plus élevé atteint
4. UPDATE profiles SET current_grade = new_grade WHERE id = user_id
5. Si grade change, créer transaction de bonus

### Fonction : distribute_commissions(new_member_id uuid, membership_fee numeric)
Logique MLM :
1. Récupérer sponsor_id du nouveau membre
2. Boucle sur 5 niveaux (generations) :
   a) Récupérer profile du parrain à ce niveau
   b) Selon le grade et génération :
      - Gen 1 (direct) + Mentor/Directeur : 10-15% membership_fee
      - Gen 2-5 + Coordinateur+ : 5% membership_fee
   c) CREATE transaction pour chaque commission
   d) UPDATE profiles SET total_points = total_points + commission_points
   e) CALL recalculate_user_grade(parrain_id)
3. Créer 1 session_voucher pour le nouveau membre

EXIGENCES :
- Utiliser PL/pgSQL
- Ajouter gestion d'erreurs (RAISE exceptions)
- Ajouter logs/commentaires pour debugging
- Transactions ACID pour les opérations multi-table

## SCRIPT 4 : 004_seed_grades.sql

Insérer les données initiales de grades :

INSERT INTO grades (name, required_direct_referrals, required_points, benefits_amount_fcfa, commission_direct_percent, commission_team_percent, max_generation_commission) VALUES
('Leader', 4, 240, 5000, 0, 0, 0),
('Leader Senior', 8, 1200, 10000, 0, 0, 0),
('Coordinateur', 18, 3000, 15000, 0, 5, 5),
('Mentor', 30, 10000, 25000, 10, 5, 5),
('Directeur', 40, 30000, 50000, 15, 5, 5);

EXIGENCES :
- Exécuter après scripts 001 et 002
- Vérifier que les insertions réussissent
- Ne pas modifier les données existantes si script réexécuté

---

REGLES DE VALIDATION :

✅ Tous les ENUMs doivent être créés explicitement
✅ RLS ENABLED sur chaque table sensible
✅ Pas de "DELETE" en cascade except where needed
✅ Commentaires SQL explicites sur chaque fonction
✅ Gestion d'erreurs appropriée dans les triggers
✅ Aucune hard-coded value dans les functions (utiliser parameters)
✅ Indexes créés pour les colonnes de join fréquentes
✅ Scripts idempotentes (DROP IF EXISTS avant CREATE)

OUTPUT ATTENDU :
4 fichiers SQL complets, prêts à exécuter directement dans Supabase SQL Editor.
Chaque fichier doit être testé et validé.
\`\`\`

---

## ✅ Checklist de Validation

- [ ] Tables créées sans erreurs
- [ ] RLS activé et policies testées
- [ ] Triggers fonctionnels avec logs
- [ ] Grades seedés correctement
- [ ] Aucune données sensibles en dur
- [ ] Indexes créés sur colonnes pertinentes
- [ ] Scripts idempotentes

## 📚 Références

- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/trigger-definition.html)
- [PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html)
