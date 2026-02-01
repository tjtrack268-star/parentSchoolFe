# 📚 Guide d'Utilisation - Prompts Parents School

## 🎯 Objectif de ce Guide

Ce document explique comment utiliser les prompts générés pour implémenter la plateforme Parents School avec une IA. Chaque prompt est optimisé pour :
- **Clarté maximale** des exigences
- **Détails techniques** complets
- **Pas à pas** structuré
- **Validation** incluse
- **Références** fournies

---

## 📁 Structure des Fichiers

\`\`\`
prompts/
├── 00-CONTEXT-GLOBAL.md              ← À INCLURE TOUJOURS
├── phase-1-database/
│   └── 01-SCHEMA-CREATION.md
├── phase-2-auth/
│   └── 01-AUTHENTICATION.md
├── phase-3-dashboard/
│   └── 01-DASHBOARD-MEMBER.md
├── phase-4-career/
│   └── 01-CAREER-ENGINE.md
├── phase-5-public/
│   └── 01-PUBLIC-INTERFACE.md
├── phase-6-admin/
│   └── 01-ADMINISTRATION.md
└── 99-GUIDE-UTILISATION.md (ce fichier)
\`\`\`

---

## 🚀 Comment Utiliser les Prompts

### **Étape 1 : Toujours Commencer par le Contexte Global**

Avant de lancer ANY prompt, fournissez à l'IA :

\`\`\`
Référence : 00-CONTEXT-GLOBAL.md

"Je vais te donner un contexte global et des phases de développement pour Parents School. 
Tu dois l'inclure dans TOUS tes prompts suivants."
\`\`\`

### **Étape 2 : Exécuter les Phases Séquentiellement**

Les phases doivent être exécutées dans l'ordre :

\`\`\`
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
\`\`\`

**Raison** : Chaque phase dépend de la précédente (DB → Auth → Dashboard, etc.)

### **Étape 3 : Adapter le Prompt à votre IA**

Le template générique pour chaque prompt est :

\`\`\`markdown
Tu es un développeur senior spécialisé en Next.js 16, React 19, TypeScript et Supabase.

[Inclure le contenu de 00-CONTEXT-GLOBAL.md]

[Inclure le contenu du prompt de la phase]

EXIGENCES ADDITIONNELLES :
- [Vos spécifications custom si applicable]
\`\`\`

---

## 📋 Guide Phase par Phase

### **PHASE 1 : Architecture & Base de Données**

**Fichier** : `phase-1-database/01-SCHEMA-CREATION.md`

**Objectif** : Créer le schéma PostgreSQL complet

**Prompt à Copier-Coller** :
\`\`\`
Tu dois implémenter le schéma PostgreSQL complet pour la plateforme Parents School.

[CONTEXTE GLOBAL COMPLET]

[CONTENU DE 01-SCHEMA-CREATION.md]
\`\`\`

**Livrables Attendus** :
1. `scripts/001_create_tables.sql`
2. `scripts/002_rls_policies.sql`
3. `scripts/003_triggers_functions.sql`
4. `scripts/004_seed_grades.sql`

**Validation** :
- [ ] Exécutez les scripts dans Supabase SQL Editor
- [ ] Vérifiez que 5 tables sont créées (profiles, referrals, grades, transactions, session_vouchers)
- [ ] Testez les RLS policies avec un utilisateur non-admin
- [ ] Vérifiez que les triggers se déclenchent

**Temps Estimé** : 1-2h

---

### **PHASE 2 : Authentification & Membership**

**Fichier** : `phase-2-auth/01-AUTHENTICATION.md`

**Objectif** : Créer système d'authentification avec code parrain obligatoire

**Prompt à Copier-Coller** :
\`\`\`
Tu dois implémenter l'authentification Supabase pour Parents School avec un processus d'inscription validant un code parrain obligatoire.

[CONTEXTE GLOBAL COMPLET]

[CONTENU DE 01-AUTHENTICATION.md]
\`\`\`

**Livrables Attendus** :
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/proxy.ts`
- `middleware.ts`
- `lib/types.ts`
- `lib/validations/auth.ts`
- Pages auth (signup, login, success, error)
- API routes pour authentification

**Validation** :
- [ ] S'inscrire avec un code parrain valide → succès
- [ ] S'inscrire avec code parrain invalide → erreur
- [ ] Profil créé automatiquement après signup
- [ ] Dashboard protégé (redirect login si non-auth)
- [ ] Middleware refresh tokens automatiquement

**Temps Estimé** : 3-4h

---

### **PHASE 3 : Dashboard Membre & Réseau**

**Fichier** : `phase-3-dashboard/01-DASHBOARD-MEMBER.md`

**Objectif** : Créer dashboard personnel avec visualisation réseau

**Prompt à Copier-Coller** :
\`\`\`
Tu dois créer le dashboard membre personnalisé de Parents School avec visualisation de l'arbre généalogique et statistiques de parrainage.

[CONTEXTE GLOBAL COMPLET]

[CONTENU DE 01-DASHBOARD-MEMBER.md]
\`\`\`

**Livrables Attendus** :
- 6 pages dashboard (overview, network, referrals, commissions, vouchers, profile)
- 6+ composants réutilisables
- 6+ API routes
- Arbre généalogique interactif

**Validation** :
- [ ] Dashboard affiche les bonnes stats
- [ ] Arbre affiche jusqu'à 5 générations
- [ ] Filtres/recherche sur listes
- [ ] Export CSV fonctionne
- [ ] Performance acceptable

**Temps Estimé** : 4-5h

---

### **PHASE 4 : Moteur de Carrière & Commissions**

**Fichier** : `phase-4-career/01-CAREER-ENGINE.md`

**Objectif** : Implémenter calcul automatique des grades et distribution MLM

**Prompt à Copier-Coller** :
\`\`\`
Tu dois implémenter le moteur de carrière automatique avec calcul des grades et distribution des commissions MLM pour Parents School.

[CONTEXTE GLOBAL COMPLET]

[CONTENU DE 01-CAREER-ENGINE.md]
\`\`\`

**Livrables Attendus** :
- `scripts/005_career_functions.sql`
- `scripts/006_mlm_triggers.sql`
- `scripts/007_recursive_tree_builder.sql`
- `lib/constants.ts` (grades, MLM config)
- API routes pour admin

**Validation** :
- [ ] Créer 4 utilisateurs parrainés → vérifier grade Leader
- [ ] Vérifier distribution commissions sur 5 générations
- [ ] Points accumulés correctement
- [ ] Grades recalculés automatiquement
- [ ] Bons de formation générés

**Temps Estimé** : 3-4h

---

### **PHASE 5 : Interface Publique & Marketing**

**Fichier** : `phase-5-public/01-PUBLIC-INTERFACE.md`

**Objectif** : Landing page attractive et pages d'information

**Prompt à Copier-Coller** :
\`\`\`
Tu dois créer l'interface publique (landing page) de Parents School avec design sobre, chaleureux et inspirant.

[CONTEXTE GLOBAL COMPLET]

[CONTENU DE 01-PUBLIC-INTERFACE.md]
\`\`\`

**Livrables Attendus** :
- Landing page avec 8 sections
- 8 pages publiques (about, activities, membership, grades, countries, testimonials, contact)
- 8+ composants réutilisables
- Design system complète
- SEO optimisé

**Validation** :
- [ ] Landing page responsive
- [ ] CTA clairs et fonctionnels
- [ ] Formulaire contact valide
- [ ] Lighthouse score > 90
- [ ] Pas d'erreurs console

**Temps Estimé** : 5-6h

---

### **PHASE 6 : Administration & Reporting**

**Fichier** : `phase-6-admin/01-ADMINISTRATION.md`

**Objectif** : Interface admin pour gestion globale et reporting

**Prompt à Copier-Coller** :
\`\`\`
Tu dois créer l'interface d'administration complète pour Parents School avec gestion des membres, réseau et reporting financier.

[CONTEXTE GLOBAL COMPLET]

[CONTENU DE 01-ADMINISTRATION.md]
\`\`\`

**Livrables Attendus** :
- 9 pages admin (dashboard, members, referrals, transactions, vouchers, reports, settings, etc)
- 8+ composants
- 10+ API routes
- Exports multi-formats

**Validation** :
- [ ] Accès restreint aux admins
- [ ] DataTable filtrable/triable
- [ ] Exports CSV/Excel fonctionnels
- [ ] Rapports générés
- [ ] Performance > 90

**Temps Estimé** : 5-6h

---

## 🎯 Template de Requête Universal

Pour chaque phase, utilisez ce template :

\`\`\`markdown
Tu es un développeur senior spécialisé en Next.js 16, React 19, TypeScript et Supabase.

👉 CONTEXTE À INCLURE :

[COPIER-COLLER COMPLET : 00-CONTEXT-GLOBAL.md]

👉 TÂCHE PHASE [N] :

[COPIER-COLLER COMPLET : phase-X/01-DESCRIPTION.md]

👉 ADDITIONAL NOTES :
- [Vos notes spécifiques]
- [Préférences design ou tech]
- [Contraintes environnement]

AVANT DE COMMENCER, CONFIRME QUE TU AS BIEN COMPRIS :
1. Le contexte global Parents School
2. Les 6 phases et leurs dépendances
3. La phase actuelle que tu dois implémenter
4. Les livrables attendus
\`\`\`

---

## ✅ Checklist de Déploiement

### **Avant de Mettre en Production**

- [ ] **Phase 1** : Schéma complet, RLS testé, triggers fonctionnels
- [ ] **Phase 2** : Auth fonctionne, middleware en place, code parrain validé
- [ ] **Phase 3** : Dashboard responsive, arbre affiche correctement
- [ ] **Phase 4** : Grades recalculés, commissions distribuées correctement
- [ ] **Phase 5** : Landing page SEO friendly, responsive
- [ ] **Phase 6** : Admin protégé, exports fonctionne

### **Tests de Régression**

\`\`\`bash
# Scenario 1 : Nouveau utilisateur
1. S'inscrire avec code parrain valide
2. Vérifier profil créé
3. Vérifier referral créé
4. Vérifier code parrain généré

# Scenario 2 : Carrière
1. Créer 40+ utilisateurs en chaîne
2. Vérifier grade Directeur atteint
3. Vérifier commissions distribuées
4. Vérifier points accumulés

# Scenario 3 : Admin
1. Exporter liste membres
2. Créer rapport mensuel
3. Visualiser arbre réseau
4. Modifier paramètres grades

# Scenario 4 : Performance
1. 100+ membres simultanés
2. Dashboard charge < 1s
3. Export < 5s
4. Arbre visible smooth
\`\`\`

---

## 🔧 Conseils d'Optimisation

### **Performance**

1. **Indexes SQL** : Vérifiez que les indexes sont créés sur :
   - `profiles.sponsor_id`
   - `profiles.referral_code`
   - `referrals.sponsor_id`
   - `transactions.user_id`

2. **Caching** : Utilisez Supabase client-side cache pour :
   - Profils (30s)
   - Grades (1h)
   - Transactions (5m)

3. **Pagination** : Toujours paginer listes > 20 items

### **Sécurité**

1. **RLS** : Vérifier que TOUTES les tables ont RLS enabled
2. **Validation** : Zod côté client ET serveur
3. **Secrets** : Jamais de clés en dur, toujours .env

### **UX/Design**

1. **Loading States** : Toujours afficher skeleton loaders
2. **Error Handling** : Messages d'erreur clairs et localisés
3. **Mobile First** : Tester sur mobile (80% utilisateurs)

---

## 🐛 Dépannage Courant

### **Problème** : RLS policy rejection

**Solution** :
1. Vérifier que l'utilisateur est authentifié
2. Vérifier que `auth.uid()` retourne l'ID correct
3. Tester la policy directement en SQL

### **Problème** : Grade ne se met à jour pas

**Solution** :
1. Vérifier que le trigger `on_referral_created` se déclenche
2. Vérifier que `calculate_user_grade()` retourne le bon grade
3. Vérifier les conditions : referrals + points

### **Problème** : Commissions non versées

**Solution** :
1. Vérifier que `distribute_commissions()` est appelée
2. Vérifier que sponsor a le bon grade (Mentor/Directeur pour gen 1)
3. Vérifier que transactions sont créées

### **Problème** : Performance lente

**Solution** :
1. Analyser les queries avec EXPLAIN ANALYZE
2. Vérifier les indexes
3. Implémenter pagination
4. Utiliser Suspense + Server Components

---

## 📞 Support & Ressources

### **Documentation Officielle**

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 Features](https://react.dev/blog/2024/12/19/react-19)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### **Exemples Supabase**

- [Auth Examples](https://github.com/supabase/examples)
- [Row Level Security Patterns](https://supabase.com/docs/guides/auth/row-level-security)
- [Multi-Tenant Design](https://supabase.com/docs/guides/database/design-patterns)

### **Design System**

- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Color Palettes](https://color.review/)

---

## 🎨 Personnalisation

Les prompts sont **templates génériques** - vous pouvez les adapter :

### **Couleurs**
Modifier les variables OKLch dans le contexte global

### **Texte & Contenu**
Remplacer "Parents School" par votre nom
Adapter les missions et valeurs

### **Functional Requirements**
Ajouter des exigences spécifiques dans la section "ADDITIONAL NOTES"

### **Architecture**
Si vous préférez une autre stack, adapter les prompts

---

## 📈 Timeline Estimée

| Phase | Durée | Dépendances |
|-------|-------|------------|
| 1. BDD | 1-2h | - |
| 2. Auth | 3-4h | Phase 1 |
| 3. Dashboard | 4-5h | Phase 1, 2 |
| 4. Carrière | 3-4h | Phase 1, 2 |
| 5. Public | 5-6h | - |
| 6. Admin | 5-6h | Phase 1-4 |
| **TOTAL** | **21-27h** | **Au complet** |

**Temps réel** : +30-50% selon expérience et complexité

---

## ✨ Next Steps

1. **Préparez votre environnement** :
   \`\`\`bash
   npm install -g supabase-cli
   supabase init
   \`\`\`

2. **Créez un projet Supabase** :
   - Allez sur [supabase.com](https://supabase.com)
   - Créez un nouveau projet

3. **Lancez le prompt Phase 1** :
   - Copyez le contenu de `00-CONTEXT-GLOBAL.md`
   - Copyez le contenu de `phase-1-database/01-SCHEMA-CREATION.md`
   - Collez dans votre IA préférée

4. **Validez chaque phase** avant de passer à la suivante

---

**Bonne chance pour l'implémentation de Parents School ! 🎉**
