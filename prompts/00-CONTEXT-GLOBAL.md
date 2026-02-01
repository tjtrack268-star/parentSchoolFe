# Parents School - Contexte Global

**À utiliser comme contexte de base pour tous les autres prompts**

## 🎯 Contexte du Projet

Tu es un développeur senior spécialisé en **Next.js 16, React 19, TypeScript et Supabase**.

Parents School est une plateforme internationale de formation à la parentalité chrétienne avec :
- **Système de membership** : ordinaire, honneur, bienfaiteur
- **Parrainage multiniveau (MLM)** avec code obligatoire
- **Système de grades automatique** : Leader → Leader Senior → Coordinateur → Mentor → Directeur
- **Calcul automatique des commissions** multi-niveaux
- **Arbre généalogique** de parrainage en temps réel
- **Dashboard membre** personnalisé avec statistiques
- **Interface publique** moderne et inspirante

## 🛠 Stack Technique

| Composant | Technologie |
|-----------|-------------|
| **Framework Frontend** | Next.js 16 (App Router) |
| **Base de données** | Supabase (PostgreSQL) |
| **Authentification** | Supabase Auth |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **Language** | TypeScript (strict mode) |
| **API** | REST via Supabase + API routes Next.js |

## ✅ Règles d'Implémentation Obligatoires

1. **Row Level Security (RLS)** : TOUJOURS activer sur les tables sensibles
2. **Scripts SQL** : Créer dans `/scripts` avec numérotation (001_, 002_, etc.)
3. **Server Components** : Privilégier les Server Components plutôt que Client Components
4. **Validation** : Utiliser **Zod** pour toute validation frontend/backend
5. **Patterns Supabase** : Suivre les exemples officiels Supabase
6. **Clients Supabase** :
   - `lib/supabase/client.ts` : Client navigateur (createClient côté client)
   - `lib/supabase/server.ts` : Client serveur (createServerClient)
   - `lib/supabase/proxy.ts` : Middleware pour session
7. **Design** : Sobre, chaleureux, inspirant (valeurs chrétiennes)

## 📊 Types Core (lib/types.ts)

\`\`\`typescript
export type MemberType = 'ordinaire' | 'honneur' | 'bienfaiteur'
export type GradeName = 'Leader' | 'Leader Senior' | 'Coordinateur' | 'Mentor' | 'Directeur'
export type TransactionType = 'membership_fee' | 'commission' | 'bonus'
export type TransactionStatus = 'pending' | 'completed' | 'cancelled'

export interface Profile {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  member_type: MemberType
  country: string
  city: string
  sponsor_id: string | null
  referral_code: string
  current_grade: GradeName
  total_points: number
  is_active: boolean
  is_focal_point: boolean
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Referral {
  id: string
  sponsor_id: string
  sponsored_id: string
  generation_level: number
  created_at: string
}

export interface Grade {
  id: string
  name: GradeName
  required_direct_referrals: number
  required_points: number
  benefits_amount_fcfa: number
  commission_direct_percent: number
  commission_team_percent: number
  max_generation_commission: number
}
\`\`\`

## 🎨 Design System

### Couleurs (OKLch)
\`\`\`css
--color-brand-primary: oklch(0.65 0.15 220)   /* Bleu spirituel */
--color-brand-secondary: oklch(0.70 0.12 140) /* Vert croissance */
--color-brand-accent: oklch(0.75 0.10 60)     /* Or bénédiction */
\`\`\`

### Grades - Couleurs Associées
- **Leader** : Vert 
- **Leader Senior** : Bleu ciel
- **Coordinateur** : Bleu foncé
- **Mentor** : Violet
- **Directeur** : Or

### Typographie
- **Headings** : Inter 700
- **Body** : Inter 400

## 🔐 Principes de Sécurité

1. **Authentification** : Supabase Auth uniquement
2. **RLS** : Chaque table sensible a des policies RLS strictes
3. **CORS** : Configuré dans Supabase
4. **Secrets** : Variables d'environnement uniquement
5. **Validation** : Zod front + backend

## 📁 Structure de Fichiers

\`\`\`
/app
  /auth
    /sign-up
    /login
    /sign-up-success
    /error
  /dashboard
    /network
    /referrals
    /commissions
    /vouchers
    /profile
  /admin
  /api
/lib
  /supabase
    client.ts
    server.ts
    proxy.ts
  types.ts
  constants.ts
/scripts
  001_create_tables.sql
  002_rls_policies.sql
  003_triggers_functions.sql
  004_seed_grades.sql
/components
  /ui
  /dashboard
  /admin
  /landing
  /layout
\`\`\`

## 🚀 6 Phases de Développement

1. **Phase 1** : Architecture & Base de données (tables, RLS, triggers)
2. **Phase 2** : Authentification & Membership (signup, login, middleware)
3. **Phase 3** : Dashboard Membre & Réseau (stats, arbre, referrals)
4. **Phase 4** : Moteur de Carrière & Commissions (grades, calculs MLM)
5. **Phase 5** : Interface Publique & Marketing (landing page)
6. **Phase 6** : Administration & Reporting (admin dashboard, exports)

## 📋 Données Test Initiales

**Grades** (à seeder dans `grades` table) :
- Leader : 4 parrainages, 240 pts, 5000 FCFA
- Leader Senior : 8 parrainages, 1200 pts, 10000 FCFA
- Coordinateur : 18 parrainages, 3000 pts, 15000 FCFA
- Mentor : 30 parrainages, 10000 pts, 25000 FCFA (10% commission directe)
- Directeur : 40 parrainages, 30000 pts, 50000 FCFA (15% commission directe)

## ✨ Valeurs du Projet

- **Authenticité** : Données vraies et transparentes
- **Bénédiction** : Système juste et équitable
- **Croissance** : Progression claire et motivante
- **Communauté** : Entraide entre membres
- **Excellence** : Qualité du contenu et service
