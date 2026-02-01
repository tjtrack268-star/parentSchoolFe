# Phase 3 - Prompt : Dashboard Membre & Réseau

## 🎯 Objectif
Créer le dashboard personnel des membres avec visualisation de l'arbre de parrainage, statistiques et gestion des referrals.

## 📋 Contexte à Inclure
- **00-CONTEXT-GLOBAL.md**
- **Phase 1 & 2** (database + auth)

---

## 🔧 Prompt à Utiliser pour l'IA

\`\`\`
Tu dois créer le dashboard membre personnalisé de Parents School avec visualisation de l'arbre généalogique et statistiques de parrainage.

CONTEXTE : [Inclure 00-CONTEXT-GLOBAL.md + Phase 1 & 2]

TÂCHE : Implémenter pages dashboard, API routes et composants

FICHIERS À CRÉER :

## PAGES DASHBOARD

### 1. app/dashboard/page.tsx
Dashboard overview avec KPIs

Layout :
- Sidebar (persistant) avec menu de navigation
- Main content area avec grid responsive
- Header avec username + logout button

Sections :
1. **StatsCards** (4 colonnes, 1 ligne)
   - Filleuls directs
   - Filleuls totaux (all generations)
   - Points accumulés
   - Grade actuel

2. **GradeProgressCard** (1 colonne, 2 lignes)
   - Affichage du grade actuel
   - Badge coloré selon grade
   - Prochain grade
   - Barre de progression (% vers prochain grade)
   - Manquent X parrainages et Y points

3. **RecentCommissions** (2 colonnes, 2 lignes)
   - Dernières commissions reçues (top 5)
   - Montant, type, date
   - Link "Voir l'historique complet"

4. **ReferralLinkCard** (1 colonne, 1 ligne)
   - Affichage du code parrain
   - Lien de parrainage avec protocole d'app
   - QR code pour mobile
   - Copy button (avec toast confirmation)

DONNEES :
API call : GET /api/dashboard/stats
Retourne : { directReferrals, totalReferrals, totalPoints, currentGrade, nextGrade, progressPercent, recentCommissions }

## 2. app/dashboard/network/page.tsx
Arbre généalogique interactif

Layout :
- Titre "Votre Réseau de Parrainage"
- Filtres : Show depth (1-5 levels), Filter by grade
- Arbre interactif (50vw width)
- Détails du nœud sélectionné (50vw width, panel droit)

Composant TreeChart :
- Utiliser recharts TreeMap ou react-d3-tree pour structure hiérarchique
- Nœuds colorés par grade (voir design system)
- Hover : affiche nom + titre
- Click : affiche panel détails à droite

Panel Détails (conditionalnel) :
- Photo (placeholder initials)
- Nom complet + grade
- Email, téléphone
- Pays/Ville
- Date d'inscription
- Nombre filleuls directs
- Total points
- Action : "Voir profil complet"

API : GET /api/referrals/tree?maxDepth=5
Retourne : arbre JSON { id, name, grade, children: [...] }

## 3. app/dashboard/referrals/page.tsx
Liste complète des filleuls

Layout :
- Table avec colonnes : Nom, Email, Grade, Country, Pts, Filleuls Directs, Date
- Filtres : Search, Grade, Country
- Sorting : Nom, Points, Date
- Pagination : 20 items/page
- Export CSV button

Actions par ligne :
- View profil
- Send message (placeholder)
- View their referrals

API : GET /api/referrals/direct?page=1&limit=20&sort=name&filter_grade=all&filter_country=''
Retourne : { items: [...], total, hasMore }

## 4. app/dashboard/commissions/page.tsx
Historique des commissions

Layout :
- Summary cards (top) : Total reçu, Moyenne, Pending, Completed
- Filtres : Date range, Type (commission/bonus), Status (pending/completed)
- Table : Date, Type, Montant, Source, Status, Actions
- Charts : Line chart montants par mois (recharts)

Actions :
- Export CSV
- Filter + Search
- View transaction details

API : GET /api/commissions/history?startDate=&endDate=&type=&status=&page=1
Retourne : { items, total, summary: { totalReceived, avgCommission, pending, completed } }

## 5. app/dashboard/vouchers/page.tsx
Gestion des bons de formation

Layout :
- Cards : Total bons, Utilisés, Disponibles, Valeur totale
- 2 sections en onglets :
  - Mes bons disponibles (grid de cards)
  - Historique bons utilisés (table)

Carte Bon :
- Code affiché
- Statut (utilisé/disponible)
- Valeur FCFA
- Date d'expiration (nullable)
- Button : Copy code / Use voucher / View details

Utilisation :
- Si disponible, button "Utiliser ce bon"
- Dialog de confirmation
- Génération de session formation

API :
- GET /api/vouchers/my-vouchers
- POST /api/vouchers/:id/use

## 6. app/dashboard/profile/page.tsx
Profil éditable de l'utilisateur

Layout :
- Avatar/initials
- Formulaire editable (inline edit mode)
- Save/Cancel buttons

Champs :
- First name, Last name (editable)
- Email (read-only)
- Phone (editable)
- Country (editable, select)
- City (editable)
- Member type (read-only, badge)
- Referral code (read-only, copyable)

Logique :
1. GET /api/profile pour charger les données
2. Mode edit : form input fields
3. Mode read : display text
4. POST /api/profile pour save
5. Validation Zod côté client ET serveur

Sections additionnelles :
- Change password (separate)
- Delete account (with warning)
- 2FA settings (if applicable)

## COMPOSANTS

### components/dashboard/layout.tsx
Layout wrapper avec sidebar

Export :
- DashboardLayout component
- Sidebar avec menu items
- Main content area responsive

### components/dashboard/stats-cards.tsx
Cards KPIs

Props : { directReferrals, totalReferrals, totalPoints, currentGrade }

### components/dashboard/referral-tree.tsx
Arbre interactif avec react-d3-tree ou recharts

Props : { treeData, onNodeSelect, maxDepth }

### components/dashboard/grade-progress.tsx
Barre de progression vers prochain grade

Props : { currentGrade, nextGrade, progressPercent, missingReferrals, missingPoints }

### components/dashboard/commission-history-table.tsx
Table d'historique avec filtres

Props : { transactions, onFilterChange }

### components/dashboard/referral-link-generator.tsx
Affichage du code parrain + QR

Props : { referralCode, userId }

## API ROUTES

### app/api/dashboard/stats/route.ts
GET - Retourne tous les KPIs du dashboard

\`\`\`typescript
export async function GET(request: Request) {
  const user = await getUser()
  if (!user) return unauthorized()
  
  const supabase = createServerClient()
  
  // 1. Obtenir profil
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  // 2. Compter filleuls directs
  const { count: directCount } = await supabase
    .from('referrals')
    .select('id', { count: 'exact' })
    .eq('sponsor_id', user.id)
  
  // 3. Compter tous les filleuls (recursive)
  const { data: totalReferrals } = await supabase
    .rpc('count_all_referrals', { user_id: user.id })
  
  // 4. Obtenir grade prochain
  const { data: grades } = await supabase
    .from('grades')
    .select('*')
    .order('required_points', { ascending: true })
  
  const nextGrade = grades.find(g => g.required_points > profile.total_points)
  
  // 5. Calculer progression
  const currentGradeData = grades.find(g => g.name === profile.current_grade)
  const progressPercent = nextGrade ? 
    ((profile.total_points - currentGradeData.required_points) / 
    (nextGrade.required_points - currentGradeData.required_points)) * 100 : 100
  
  // 6. Obtenir commissions récentes
  const { data: recentCommissions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .eq('type', 'commission')
    .order('created_at', { ascending: false })
    .limit(5)
  
  return Response.json({
    directReferrals: directCount,
    totalReferrals: totalReferrals[0].count,
    totalPoints: profile.total_points,
    currentGrade: profile.current_grade,
    nextGrade: nextGrade?.name || null,
    progressPercent: Math.min(100, progressPercent),
    recentCommissions,
  })
}
\`\`\`

### app/api/referrals/tree/route.ts
GET - Retourne arbre généalogique

Query : maxDepth (default 5)

\`\`\`typescript
export async function GET(request: Request) {
  const user = await getUser()
  if (!user) return unauthorized()
  
  const { searchParams } = new URL(request.url)
  const maxDepth = parseInt(searchParams.get('maxDepth') || '5')
  
  const supabase = createServerClient()
  
  // Utiliser fonction SQL recursive pour construire l'arbre
  const { data } = await supabase
    .rpc('build_referral_tree', { user_id: user.id, max_depth: maxDepth })
  
  return Response.json({ tree: data })
}
\`\`\`

### app/api/referrals/direct/route.ts
GET - Retourne liste filleuls directs

Query : page, limit, sort, filter_grade, filter_country, search

\`\`\`typescript
export async function GET(request: Request) {
  const user = await getUser()
  if (!user) return unauthorized()
  
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = (page - 1) * limit
  
  const supabase = createServerClient()
  
  let query = supabase
    .from('referrals')
    .select('sponsored_id')
    .eq('sponsor_id', user.id)
  
  const { data: referrals } = await query
  
  const sponsoredIds = referrals.map(r => r.sponsored_id)
  
  let profileQuery = supabase
    .from('profiles')
    .select('*')
    .in('id', sponsoredIds)
  
  // Apply filters
  const grade = searchParams.get('filter_grade')
  if (grade && grade !== 'all') {
    profileQuery = profileQuery.eq('current_grade', grade)
  }
  
  const country = searchParams.get('filter_country')
  if (country) {
    profileQuery = profileQuery.eq('country', country)
  }
  
  const search = searchParams.get('search')
  if (search) {
    profileQuery = profileQuery.or(
      \`first_name.ilike.%\${search}%,last_name.ilike.%\${search}%\`
    )
  }
  
  profileQuery = profileQuery.order(searchParams.get('sort') || 'first_name')
  profileQuery = profileQuery.range(offset, offset + limit - 1)
  
  const { data: profiles, count } = await profileQuery
  
  return Response.json({
    items: profiles,
    total: count,
    hasMore: offset + limit < count,
  })
}
\`\`\`

### app/api/commissions/history/route.ts
GET - Historique des commissions

### app/api/vouchers/my-vouchers/route.ts
GET - Mes bons de formation

### app/api/profile/route.ts
GET/POST - Profil utilisateur

---

REGLES DE VALIDATION :

✅ Toutes les API routes protégées (getUser() check)
✅ RLS policies appliquées (user ne voit que ses données)
✅ Suspense + loading.tsx pour async operations
✅ Server Components par défaut
✅ Client Components = interactivity only (tree, forms)
✅ Charts avec recharts
✅ Filtres et search côté serveur
✅ Pagination sur les listes
✅ Export CSV généré côté serveur

OUTPUT ATTENDU :
- 6 pages dashboard complètes
- 6+ composants réutilisables
- 6+ API routes fonctionnelles
- Tous les types TypeScript corrects
- Arbre généalogique interactif
- Performance optimisée (Suspense, caching)
\`\`\`

---

## ✅ Checklist de Validation

- [ ] Dashboard affiche les bonnes stats
- [ ] Arbre généalogique s'affiche correctement (5 niveaux)
- [ ] Filtres et recherche fonctionnent
- [ ] Pagination correcte sur listes
- [ ] Export CSV fonctionne
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Loading states visuels
- [ ] Erreurs affichées proprement
- [ ] Performance acceptable (< 1s load)
- [ ] Tests d'accès : user A ne voit pas data de user B

## 📊 Fonctions SQL Requises

\`\`\`sql
-- Pour compter tous les filleuls (recursive)
CREATE OR REPLACE FUNCTION count_all_referrals(user_id uuid)
RETURNS TABLE(count integer) AS $$
BEGIN
  -- Récursive CTE for all generations
END;

-- Pour construire l'arbre JSON
CREATE OR REPLACE FUNCTION build_referral_tree(user_id uuid, max_depth integer)
RETURNS json AS $$
BEGIN
  -- Build tree structure
END;
\`\`\`

## 📚 Références

- [Recharts Documentation](https://recharts.org/)
- [React D3 Tree](https://github.com/bkrem/react-d3-tree)
- [Next.js Suspense](https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#using-suspense-optional)
