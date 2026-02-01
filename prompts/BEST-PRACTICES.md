# 🏆 Meilleures Pratiques & Tips

## 🎯 Avant d'Utiliser les Prompts

### **1. Préparer votre Environnement**

\`\`\`bash
# Créer un projet Next.js 16
npx create-next-app@latest parents-school --typescript

# Installer les dépendances core
npm install @supabase/supabase-js @supabase/ssr zod recharts

# Installer shadcn/ui
npx shadcn-ui@latest init

# Vérifier les versions
npm list next react typescript
\`\`\`

### **2. Configurer Supabase**

\`\`\`bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter
supabase login

# Initialiser le projet
supabase init parents-school

# Créer un projet sur supabase.com
# Copier les credentials
\`\`\`

### **3. Préparer les Variables d'Environnement**

Créer `.env.local` :

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
\`\`\`

---

## 💡 Tips d'Utilisation des Prompts

### **Tip 1 : Copy-Paste Complet**

❌ **À Éviter** :
\`\`\`
Tu veux implémenter un client Supabase...
\`\`\`

✅ **À Faire** :
\`\`\`
[COPIER-COLLER 00-CONTEXT-GLOBAL.md EN ENTIER]

[COPIER-COLLER PHASE COMPLÈTE]
\`\`\`

**Pourquoi ?** L'IA comprend mieux avec le contexte complet.

---

### **Tip 2 : Valider Avant de Progresser**

\`\`\`
Phase 1 ✅ VALIDÉE
  └─ Phase 2 → Commencer seulement si Phase 1 OK
     └─ Phase 3 → Commencer seulement si Phase 2 OK
\`\`\`

**Checklist avant de progresser** :
- [ ] Code sans erreurs compilation
- [ ] Tests minimaux passent
- [ ] Performance acceptable
- [ ] RLS/Sécurité en place

---

### **Tip 3 : Adapter les Prompts**

Les prompts sont **templates génériques**. Adapter à votre contexte :

\`\`\`markdown
[CONTEXTE GLOBAL]
[PHASE]

ADAPTATIONS SPÉCIFIQUES :
- Stack : Vous utilisez Tailwind CSS v4 ? Précisez.
- Features : Vous avez des requirements additionnels ? Listez.
- Design : Préférence design ? Décrivez.
- Timing : Deadlines ? Mentionnez.
\`\`\`

---

### **Tip 4 : Utiliser les Phases Intermédiaires**

Entre les phases, optionnellement :

\`\`\`
Phase 3 (Dashboard) ✅
  ↓
[Amélioration Design] ← Optionnel
  ↓
Phase 4 (Career)
\`\`\`

---

### **Tip 5 : Documenter les Modifications**

Quand vous modifiez un prompt pour vos besoins :

\`\`\`
# Mon Adaptation Phase 2

Modifications de 01-AUTHENTICATION.md :
- Ajout 2FA email
- Logo custom
- Messages français
- Rate-limiting custom

Base : [CONTEXTE GLOBAL + 01-AUTHENTICATION.md]

Modifications ci-dessus...
\`\`\`

---

## 🔐 Sécurité - Points Critiques

### **1. RLS Policies**

✅ **Toujours implémenter** :
- [ ] RLS enabled sur TOUTES les tables sensibles
- [ ] Policies strictes (select, insert, update, delete)
- [ ] Tests des policies avant production

❌ **Ne JAMAIS** :
- Oublier RLS sur une table sensible
- Utiliser `enable_all_policies()` production
- Faire confiance au security du frontend seul

### **2. Validation**

✅ **Toujours valider** :
- [ ] Frontend : Zod schemas
- [ ] Backend : Zod schemas AUSSI
- [ ] Database : CHECK constraints

❌ **Ne JAMAIS** :
- Faire confiance au frontend seul
- Oublier la validation backend
- Stocker des données non validées

### **3. Secrets**

✅ **Toujours** :
- [ ] .env.local pour dev
- [ ] Variables d'env en production
- [ ] Secrets versionés hors du repo

❌ **Ne JAMAIS** :
- Hardcoder les clés API
- Commiter les .env
- Exposer le service role key au frontend

### **4. Middleware**

✅ **Toujours** :
- [ ] Protéger routes /dashboard/*
- [ ] Protéger routes /admin/*
- [ ] Refresh tokens automatiquement

---

## ⚡ Performance - Optimisations Clés

### **1. Server Components**

\`\`\`typescript
// ✅ BON
export default async function Dashboard() {
  const data = await fetchData() // Server
  return <DashboardClient data={data} />
}

// ❌ MAUVAIS
'use client'
const [data, setData] = useState()
useEffect(() => {
  fetch('/api/data').then(...)
}, [])
\`\`\`

### **2. Suspense + Loading**

\`\`\`typescript
// ✅ BON
<Suspense fallback={<Skeleton />}>
  <DataTable />
</Suspense>

// ❌ MAUVAIS
const [loading, setLoading] = useState(true)
// Pas de loading state visuel
\`\`\`

### **3. Database Indexes**

\`\`\`sql
-- ✅ Créer indexes sur colonnes fréquentes
CREATE INDEX idx_profiles_sponsor_id ON profiles(sponsor_id);
CREATE INDEX idx_referrals_sponsor_id ON referrals(sponsor_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);

-- ❌ Ne pas oublier les indexes
-- Les requêtes seront lentes !
\`\`\`

### **4. Pagination**

\`\`\`typescript
// ✅ BON
GET /api/members?page=1&limit=20

// ❌ MAUVAIS
GET /api/members // 1M+ records retournés
\`\`\`

---

## 🎨 Design - Cohérence

### **1. Utiliser le Design System**

Tous les prompts incluent un design system complet.

✅ **Utiliser** :
\`\`\`css
var(--brand-primary)
var(--brand-secondary)
var(--brand-accent)
var(--grade-mentor)
\`\`\`

❌ **Ne pas** :
\`\`\`css
#FF5733 /* Couleurs hardcoded */
rgb(255, 87, 51)
\`\`\`

### **2. Typographie Cohérente**

Inter 700 pour headings, Inter 400 pour body.

\`\`\`typescript
// ✅ BON
className="font-inter text-4xl font-bold"

// ❌ MAUVAIS
className="text-4xl" // Peut utiliser n'importe quelle font
\`\`\`

### **3. Responsive First**

\`\`\`typescript
// ✅ BON
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// ❌ MAUVAIS
className="grid grid-cols-3" // Pas responsive mobile
\`\`\`

---

## 🧪 Testing - Scenarios Clés

### **Phase 1 : BDD**

\`\`\`sql
-- Test RLS
SELECT * FROM profiles; -- Should return 0 (no permissions)

-- Test trigger
INSERT INTO referrals ...
SELECT total_points FROM profiles WHERE id = sponsor_id;
-- Should show +60 points

-- Test function
SELECT calculate_user_grade(user_id);
-- Should return correct grade
\`\`\`

### **Phase 2 : Auth**

\`\`\`bash
# Test signup avec code valide → Success
# Test signup sans code → Error
# Test login → Session créée
# Test middleware → /dashboard redirige si non-auth

# Test token refresh → Nouveau token obtenu
\`\`\`

### **Phase 3 : Dashboard**

\`\`\`bash
# Dashboard load < 1s
# Arbre affiche 5 niveaux
# Filtres retournent results corrects
# Export CSV généré correctement
\`\`\`

### **Phase 4 : Career**

\`\`\`bash
# 4 referrals → Grade devient Leader
# 8 referrals → Grade devient Leader Senior
# Commission gen 1 = 10-15%
# Commission gen 2-5 = 5%
# Bons de formation générés
\`\`\`

### **Phase 5 : Public**

\`\`\`bash
# Landing page charge < 3s
# Responsive sur mobile/tablet/desktop
# CTA buttons fonctionnent
# Forms valident correctement
# Lighthouse > 90
\`\`\`

### **Phase 6 : Admin**

\`\`\`bash
# Admin peut voir tous les membres
# Non-admin redirigé
# DataTable triable/filtrable
# Exports multi-formats
# Rapports générés
\`\`\`

---

## 🐛 Débogage Courant

### **Problème : "Permission Denied"**

\`\`\`
→ Vérifier RLS policies
  Vérifier que auth.uid() = user.id
  Tester policy directement en SQL
\`\`\`

### **Problème : Grade ne change pas**

\`\`\`
→ Vérifier trigger "on_referral_created"
  Vérifier que referral_id est correct
  Vérifier que calculate_user_grade() est appelée
  Vérifier les conditions : referrals count + points
\`\`\`

### **Problème : Commissions non versées**

\`\`\`
→ Vérifier que distribute_commissions() est appelée
  Vérifier que sponsor a grade Mentor/Directeur
  Vérifier que transactions sont créées
  Vérifier que profile.total_points updated
\`\`\`

### **Problème : Dashboard lent**

\`\`\`
→ EXPLAIN ANALYZE les queries
  Créer indexes manquants
  Implémenter pagination
  Utiliser Suspense + skeleton loaders
\`\`\`

---

## 📈 Progression Recommandée

### **Jour 1**
- [ ] Phase 1 : BDD (1-2h)
- [ ] Phase 2 : Auth (3-4h)
- [ ] **Total : 4-6h**

### **Jour 2**
- [ ] Phase 3 : Dashboard (4-5h)
- [ ] Phase 4 : Career (3-4h)
- [ ] **Total : 7-9h**

### **Jour 3**
- [ ] Phase 5 : Public (5-6h)
- [ ] Phase 6 : Admin (5-6h)
- [ ] **Total : 10-12h**

### **Jour 4**
- [ ] Tests complets
- [ ] Optimisations
- [ ] Corrections bugs
- [ ] **Total : 8h+**

**Total : ~30-40h de développement**

---

## 🌟 Checklist Finale Avant Production

- [ ] Phase 1 : Toutes les tables créées, RLS activé, triggers testés
- [ ] Phase 2 : Auth fonctionne, code parrain validé, middleware en place
- [ ] Phase 3 : Dashboard responsive, arbre affiche bien, performance OK
- [ ] Phase 4 : Grades recalculés, commissions distribuées, bons générés
- [ ] Phase 5 : Landing page SEO, responsive, Lighthouse > 90
- [ ] Phase 6 : Admin protégé, exports fonctionne, rapports corrects

---

## 🎓 Prochaines Étapes Post-Production

Après l'implémentation :

1. **Monitoring** : Surveiller les erreurs, performance
2. **Analytics** : Tracker conversions, usage
3. **Optimisations** : Caching, compression, CDN
4. **Features** : Ajouter notifications, payments, etc
5. **Scaling** : Préparer pour 10k+, 100k+ users

---

## 🚀 Ressources Additionnelles

### **Next.js**
- App Router best practices
- Server Components vs Client Components
- Route handlers vs API routes

### **Supabase**
- RLS policy patterns
- Performance tuning
- Backup strategies

### **PostgreSQL**
- Index strategies
- Query optimization
- Trigger best practices

---

**Bonne développement ! 🎉**

*Ces meilleures pratiques maximisent la qualité et la performance de votre implémentation.*
