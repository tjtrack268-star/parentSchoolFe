# Phase 6 - Prompt : Administration & Reporting

## 🎯 Objectif
Créer l'interface d'administration pour gérer les membres, réseau, commissions et générer des rapports.

## 📋 Contexte à Inclure
- **00-CONTEXT-GLOBAL.md**
- **Phase 1-5** (infrastructure complète)

---

## 🔧 Prompt à Utiliser pour l'IA

\`\`\`
Tu dois créer l'interface d'administration complète pour Parents School avec gestion des membres, réseau et reporting financier.

CONTEXTE : [Inclure 00-CONTEXT-GLOBAL.md + Phase 1-5]

TÂCHE : Implémenter pages admin, composants et API

FICHIERS À CRÉER :

## PROTECTION ADMIN

### middleware.ts (mise à jour)

Ajouter protection admin :

\`\`\`typescript
if (request.nextUrl.pathname.startsWith('/admin')) {
  const user = await getUser()
  if (!user) return NextResponse.redirect(new URL('/auth/login', request.url))
  
  const supabase = createServerClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  if (!profile?.is_admin) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
}
\`\`\`

## PAGES ADMIN

### 1. app/admin/layout.tsx
Layout wrapper avec sidebar admin

Sidebar sections :
- Dashboard (icon: LayoutDashboard)
- Membres (icon: Users)
- Réseau (icon: Network)
- Transactions (icon: CreditCard)
- Bons (icon: Ticket)
- Rapports (icon: BarChart)
- Paramètres (icon: Settings)

Design : sidebar dark avec highlight couleur, sticky

### 2. app/admin/dashboard/page.tsx
Overview global

Layout : Grid 2-3 colonnes

KPIs (4 cards en haut) :
- Total membres (count)
- Membres actifs cette semaine
- Commissions versées (mois)
- Revenu total

Charts (3 sections) :
1. **Répartition par type membership** (pie chart, recharts)
   - Ordinaire : X%
   - Honneur : Y%
   - Bienfaiteur : Z%

2. **Répartition par grade** (bar chart)
   - Leader, Senior, Coordinateur, Mentor, Directeur
   - Nombre de membres par grade

3. **Croissance réseau** (line chart)
   - Membres par mois (derniers 12 mois)

4. **Top performers** (table)
   - Nom, Grade, Filleuls, Points, Commissions
   - Top 10 members

5. **Statistiques pays** (table)
   - Pays, Nombre membres, Commissions, Top performer

Table à droite : **Activités récentes**
- Nouvel utilisateur X s'inscrit
- Utilisateur Y promeut en grade Z
- Commission versée à X

API : GET /api/admin/dashboard/stats

### 3. app/admin/members/page.tsx
Gestion complète des membres

Layout : DataTable avec controls

Controls (top bar) :
- Recherche (search box)
- Filtres : Type membership, Grade, Pays, Status (actif/inactif)
- Export CSV
- Import (todo)

DataTable (shadcn DataTable) :
- Colonnes : ID (short), Nom, Email, Grade, Type, Pays, Pts, Filleuls, Status, Actions
- Sorting : tous les champs
- Pagination : 20/50/100 items
- Selection : checkbox multi-select

Actions (3-dots menu) :
- Voir profil complet
- Modifier (edit dialog)
- Attribuer points manuellement (input dialog)
- Changer grade manuellement
- Activer/Désactiver
- Supprimer (avec confirmation)
- View network tree
- Envoyer message

### 4. app/admin/members/[id]/page.tsx
Détail complet d'un membre

Layout : 3 sections

#### Section 1 : Profil (gauche 30%)
- Avatar/initials
- Nom, Email, Téléphone
- Type, Grade, Status
- Date d'inscription
- Pays, Ville
- Referral code

Buttons : Edit, Disable/Enable, Delete

#### Section 2 : Stats (droite 70%)
Grid 4 colonnes :
- Filleuls directs
- Filleuls totaux
- Points accumulés
- Commissions totales

#### Section 3 : Historique (full width)
Tabs :
1. **Referrals** - Tree + table de filleuls
2. **Transactions** - Historique commissions/bonus
3. **Activity** - Log des actions (modifications, connexions)
4. **Grades** - Historique des grades

### 5. app/admin/referrals/page.tsx
Visualisation du réseau complet

Layout : 2 panels

#### Panel gauche : Filtres + Navigation
- Recherche par nom
- Filter par grade
- Sélecteur profondeur (1-5 niveaux)
- Tri : Nom, Points, Filleuls

#### Panel droite : Arbre
- Arbre interactif d'TOUS les parrainages
- Couleur par grade
- Click → panel détails

Ou alternative : **Force graph** (nodes reliés = referrals)

API : GET /api/admin/referrals/network

### 6. app/admin/transactions/page.tsx
Gestion financière

Layout : DataTable + Controls + Charts

Controls (top) :
- Date range picker
- Filtres : Type (commission, bonus, fee), Status (pending, completed, cancelled)
- Export CSV (format comptable)
- Search by member name

DataTable :
- Colonnes : Date, Type, Membre, Montant, Statut, Actions
- Sorting
- Pagination

Actions :
- Voir détails
- Valider (si pending)
- Annuler (si possible)
- Regénérer rapport

Charts (bottom) :
- Commissions totales versées (month)
- Répartition par type

API : GET /api/admin/transactions

### 7. app/admin/vouchers/page.tsx
Gestion des bons de formation

Tabs :
1. **En attente d'utilisation** (table, grid)
   - Code, Propriétaire, Valeur, Date création
   - Actions : Revoquer, Resend, Voir détails

2. **Utilisés** (table)
   - Code, Propriétaire, Utilisé par, Date utilisation
   - Valeur

3. **Attribuer** (form)
   - Sélecteur membre
   - Nombre de bons
   - Valeur (default 3000)
   - Create button

### 8. app/admin/reports/page.tsx
Rapports & Exports

Sections :
1. **Rapport Mensuel** (PDF download)
   - Totaux membres
   - Commissions versées
   - Top performers
   - Growth metrics

2. **Rapport Comptable** (Excel export)
   - Transactions complètes
   - Commissions par grade
   - Montants par pays

3. **Rapport Réseau** (CSV)
   - Arbre complet
   - Niveaux de parrainage
   - Statistiques par branche

4. **Rapport Croissance** (charts + export)
   - Membres par mois
   - Parrainages par mois
   - Activation rate

Générateurs de rapport :
- Date range selector
- Format : PDF / CSV / Excel
- Download button

### 9. app/admin/settings/page.tsx
Paramètres de plateforme

Sections (tabs) :

#### Tab 1 : Configuration Générale
- Nom plateforme
- Logo
- Email support
- Timezone
- Langue par défaut

#### Tab 2 : Grades (Éditable)
- Table des grades avec colonnes éditable
- Modifier : required_referrals, required_points, benefits_fcfa, commission %
- Save button avec warning si modification

#### Tab 3 : Commission MLM
- Points par parrainage
- Taux commission gen 1, gen 2-5
- Montant bons formation
- Membership fee default

#### Tab 4 : Emails
- Templates emails (seeding users, password reset, etc)
- Variables disponibles
- Test send button

#### Tab 5 : Modération
- List de mots bannis
- Whitelist/Blacklist pays
- Min age requirement

---

## COMPOSANTS ADMIN

### components/admin/sidebar.tsx
Navigation admin reusable

### components/admin/stats-card.tsx
KPI card stylisée

### components/admin/members-datatable.tsx
DataTable avec filtres/search

Dépend de : shadcn DataTable

### components/admin/referral-network-tree.tsx
Arbre/Graph du réseau complet

Dépend de : react-d3-tree ou force-graph

### components/admin/transaction-filters.tsx
Filtres avancés pour transactions

### components/admin/export-button.tsx
Bouton export multi-format (CSV, Excel, PDF)

### components/admin/chart-stats.tsx
Charts réutilisable (pie, bar, line)

Dépend de : recharts

### components/admin/grade-editor.tsx
Form d'édition des grades

---

## API ROUTES ADMIN

### app/api/admin/stats/route.ts
GET - Retourne tous les KPIs

\`\`\`typescript
export async function GET(request: Request) {
  const user = await getUser()
  if (!user || !await isAdmin(user.id)) return forbidden()
  
  const supabase = createServerClient()
  
  // Total stats
  const { count: totalMembers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
  
  const { count: activeThisWeek } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .gte('updated_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  
  // Commissions this month
  const { data: monthlyCommissions } = await supabase
    .from('transactions')
    .select('amount_fcfa')
    .eq('type', 'commission')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
  
  const totalCommissions = monthlyCommissions.reduce((sum, t) => sum + t.amount_fcfa, 0)
  
  // By type
  const { data: byType } = await supabase
    .from('profiles')
    .select('member_type, count', { count: 'exact' })
    .group_by('member_type')
  
  // By grade
  const { data: byGrade } = await supabase
    .from('profiles')
    .select('current_grade, count', { count: 'exact' })
    .group_by('current_grade')
  
  return Response.json({
    totalMembers,
    activeThisWeek,
    commissionsThisMonth: totalCommissions,
    byType,
    byGrade,
  })
}
\`\`\`

### app/api/admin/members/route.ts
GET/PATCH/DELETE - Gestion membres

\`\`\`typescript
export async function GET(request: Request) {
  // List with filters
}

export async function PATCH(request: Request) {
  // Update member profile
}

export async function DELETE(request: Request) {
  // Delete member (soft delete)
}
\`\`\`

### app/api/admin/members/[id]/route.ts
GET - Détail d'un membre

### app/api/admin/members/bulk-points/route.ts
POST - Attribuer points en masse

\`\`\`typescript
export async function POST(request: Request) {
  const { memberIds, points, reason } = await request.json()
  
  // Validate
  if (!memberIds.length || points <= 0) return badRequest()
  
  // Update points for each
  for (const memberId of memberIds) {
    await supabase.rpc('add_points', { user_id: memberId, points_add: points })
  }
  
  return Response.json({ success: true, updated: memberIds.length })
}
\`\`\`

### app/api/admin/transactions/route.ts
GET - Historique complet

\`\`\`typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const type = searchParams.get('type')
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')
  
  const supabase = createServerClient()
  
  let query = supabase.from('transactions').select('*')
  
  if (startDate) query = query.gte('created_at', startDate)
  if (endDate) query = query.lte('created_at', endDate)
  if (type && type !== 'all') query = query.eq('type', type)
  if (status && status !== 'all') query = query.eq('status', status)
  
  const offset = (page - 1) * limit
  query = query.order('created_at', { ascending: false })
  query = query.range(offset, offset + limit - 1)
  
  const { data, count } = await query
  
  return Response.json({ items: data, total: count })
}
\`\`\`

### app/api/admin/export/route.ts
GET - Générer exports (CSV, PDF, Excel)

\`\`\`typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') // csv, excel, pdf
  const report = searchParams.get('report') // members, transactions, network
  
  const data = await buildReport(report)
  const formatted = formatReport(data, format)
  
  return new Response(formatted, {
    headers: {
      'Content-Type': getMimeType(format),
      'Content-Disposition': `attachment; filename="report.${format}"`,
    },
  })
}
\`\`\`

### app/api/admin/grades/route.ts
GET/PUT - Gestion des grades

\`\`\`typescript
export async function PUT(request: Request) {
  const body = await request.json()
  
  // Validate: ensure no breaking changes
  // Update grades table
  
  return Response.json({ success: true })
}
\`\`\`

### app/api/admin/referrals/network/route.ts
GET - Arbre complet

### app/api/admin/vouchers/assign/route.ts
POST - Attribuer des bons

---

## FONCTIONS SQL ADMIN

### scripts/008_admin_functions.sql

\`\`\`sql
-- Count members by various dimensions
CREATE OR REPLACE FUNCTION admin_get_members_by_type()
RETURNS TABLE(member_type varchar, count bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT profiles.member_type, COUNT(*)
  FROM profiles
  GROUP BY profiles.member_type;
END;
$$ LANGUAGE plpgsql;

-- Export transactions for report
CREATE OR REPLACE FUNCTION export_transactions_for_period(start_date timestamptz, end_date timestamptz)
RETURNS TABLE(date timestamptz, type varchar, user_name varchar, amount numeric, status varchar) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.created_at, 
    t.type, 
    CONCAT(p.first_name, ' ', p.last_name),
    t.amount_fcfa,
    t.status
  FROM transactions t
  JOIN profiles p ON t.user_id = p.id
  WHERE t.created_at BETWEEN start_date AND end_date
  ORDER BY t.created_at DESC;
END;
$$ LANGUAGE plpgsql;
\`\`\`

---

REGLES DE VALIDATION :

✅ Protection admin stricte (middleware + RLS)
✅ Tous les exports sécurisés (pas de données sensibles)
✅ Rapports générés côté serveur (performance)
✅ DataTable sortable et paginated
✅ Aucune action destructrice sans confirmation
✅ Logs d'actions admin (audit trail)
✅ Types TypeScript complets
✅ Performance acceptable même avec 100k+ members

OUTPUT ATTENDU :
- 9 pages admin complètes
- 8+ composants réutilisables
- 10+ API routes fonctionnelles
- Protection admin robuste
- Exports multi-formats
- Rapports générés correctement
- Performance optimisée
\`\`\`

---

## ✅ Checklist de Validation Admin

- [ ] Accès restreint aux admins uniquement
- [ ] Dashboard affiche bons KPIs
- [ ] DataTable membres filtrable et triable
- [ ] Export CSV/Excel fonctionne
- [ ] Rapports générés correctement
- [ ] Édition grades fonctionnelle
- [ ] Arbre réseau affiche les relations
- [ ] Transactions triées par date
- [ ] Bons de formation gérables
- [ ] Logs d'actions créés
- [ ] Aucun bug de performance
- [ ] Tests : créer rapport, exporter data

## 🔐 Audit Trail

Créer table audit_logs :
\`\`\`sql
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY,
  admin_id uuid FK,
  action varchar,
  resource_type varchar,
  resource_id uuid,
  changes jsonb,
  created_at timestamptz
);
\`\`\`

Trigger sur toutes les modifications en /admin

## 📊 Rapports Types

1. **Rapport Mensuel** : Membres, Commissions, Growth
2. **Rapport Réseau** : Arbre, Statistiques par branche
3. **Rapport Comptable** : Transactions détaillées
4. **Rapport Performance** : Top members, Velocité croissance

## 📚 Références

- [shadcn DataTable](https://shadcn-vue.com/docs/components/data-table)
- [Recharts](https://recharts.org/)
- [React D3 Tree](https://github.com/bkrem/react-d3-tree)
- [PDF Generation](https://github.com/parallax/jsPDF)
