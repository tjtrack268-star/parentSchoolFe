# Phase 2 - Prompt : Authentification & Membership

## 🎯 Objectif
Implémenter l'authentification Supabase avec inscription obligeant un code parrain et création automatique du profil.

## 📋 Contexte à Inclure
- **00-CONTEXT-GLOBAL.md**
- **Phase 1 database schema** (déjà créé)

---

## 🔧 Prompt à Utiliser pour l'IA

\`\`\`
Tu dois implémenter l'authentification Supabase pour Parents School avec un processus d'inscription validant un code parrain obligatoire.

CONTEXTE : [Inclure 00-CONTEXT-GLOBAL.md + schéma Phase 1]

TÂCHE : Créer les clients Supabase, middleware et pages d'authentification

FICHIERS À CRÉER :

## 1. lib/supabase/client.ts
Client Supabase côté navigateur pour les opérations frontend

Export une fonction createClient() qui :
- Initialise un client Supabase avec createBrowserClient
- URL : process.env.NEXT_PUBLIC_SUPABASE_URL
- Key : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
- Options : { auth: { persistSession: true } }
- Exporte également un type Session depuis @supabase/supabase-js

EXIGENCES :
- Gestion errors appropriée (try/catch)
- Export default du client
- No hardcoded values

## 2. lib/supabase/server.ts
Client Supabase côté serveur pour les Server Components et API routes

Export une fonction createClient() qui :
- Initialise un client Supabase avec createServerClient (NOT createClient)
- URL : process.env.NEXT_PUBLIC_SUPABASE_URL
- Key : process.env.SUPABASE_SERVICE_ROLE_KEY (admin access)
- Options avancées pour gestion des cookies côté serveur
- Import depuis @supabase/ssr

EXIGENCES :
- Client avec privileges admin (service_role)
- Gestion cookies appropriée
- Export default

## 3. lib/supabase/proxy.ts
Middleware pour gérer les sessions Supabase

Export une fonction qui :
- Obtient la session de l'utilisateur authentifié
- Refresh auto des tokens expirés
- Retourne { user, session } ou { user: null, session: null }
- Utilise le client serveur avec gestion cookies

PATTERN :
\`\`\`typescript
export async function getSession() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
\`\`\`

## 4. middleware.ts (racine du projet)
Middleware d'application pour protéger les routes

Logique :
1. Vérifier si l'utilisateur est authentifié
2. Si accès à /dashboard/* ET non authentifié → rediriger vers /auth/login
3. Si accès à /auth/* ET authentifié → rediriger vers /dashboard
4. Refresh auto des tokens (updateSession)
5. Laisser les autres routes publiques

ROUTES À PROTÉGER :
- /dashboard/* → auth required
- /admin/* → auth required + is_admin check

ROUTES PUBLIQUES :
- /
- /about
- /activities
- /membership
- /grades
- /auth/*
- /api/public/*

PATTERN :
\`\`\`typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Auto-refresh tokens
  let response = NextResponse.next({ request })
  const supabase = createServerClient(...)
  const { data: { session } } = await supabase.auth.getSession()
  
  // Route protection logic
  if (pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
\`\`\`

## 5. lib/types.ts
Types TypeScript pour l'authentification

\`\`\`typescript
export type MemberType = 'ordinaire' | 'honneur' | 'bienfaiteur'
export type GradeName = 'Leader' | 'Leader Senior' | 'Coordinateur' | 'Mentor' | 'Directeur'

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

export interface AuthError {
  code?: string
  message: string
}
\`\`\`

## 6. lib/validations/auth.ts
Schémas de validation Zod

\`\`\`typescript
import { z } from 'zod'

export const signUpSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Min 8 caractères').regex(/[A-Z]/, 'Une majuscule').regex(/[0-9]/, 'Un chiffre'),
  password_confirm: z.string(),
  first_name: z.string().min(2, 'Min 2 caractères'),
  last_name: z.string().min(2, 'Min 2 caractères'),
  phone: z.string().regex(/^[0-9+\-\s()]+$/, 'Format téléphone invalide'),
  country: z.string().min(2),
  city: z.string().min(2),
  referral_code: z.string().min(1, 'Code parrain obligatoire'),
  member_type: z.enum(['ordinaire', 'honneur', 'bienfaiteur']),
}).refine(
  (data) => data.password === data.password_confirm,
  { message: 'Les mots de passe ne correspondent pas', path: ['password_confirm'] }
)

export type SignUpInput = z.infer<typeof signUpSchema>

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Mot de passe requis'),
})

export type LoginInput = z.infer<typeof loginSchema>
\`\`\`

## 7. app/auth/sign-up/page.tsx
Page d'inscription avec formulaire complet

Layout :
- Hero/header avec titre "Rejoindre Parents School"
- Formulaire 2-colonnes sur desktop
- Tous les champs requis (voir Schema)
- Validation en temps réel (afficher erreurs)
- Button "S'inscrire" loading state
- Lien "Se connecter" en bas

Logique :
1. Valider le formulaire avec Zod
2. Vérifier que le referral_code existe :
   - API call : GET /api/referrals/verify-code?code=XXX
   - Afficher erreur si code inexistant
3. Appeler action serveur signUp() :
   a) supabase.auth.signUp({ email, password, options: { data: { first_name, last_name, ... } } })
   b) Vérifier que le profil a été créé automatiquement via trigger
   c) Créer le referral record
   d) Générer le referral_code pour le nouveau membre
   e) Redirection selon emailConfirmationRequired
4. Si succès → redirect /auth/sign-up-success
5. Si erreur → afficher message error

EXIGENCES :
- Form en React avec useActionState
- Loading states visuels
- Messages d'erreur clairs
- Password strength indicator
- No hardcoded values

## 8. app/auth/login/page.tsx
Page de connexion simple

Layout :
- Form minimal (email + password)
- "Se connecter" button
- Lien "S'inscrire" + "Mot de passe oublié"
- Remember me checkbox

Logique :
1. Valider avec loginSchema
2. Appeler action serveur logIn()
3. Si succès → redirect /dashboard
4. Si erreur → afficher message

## 9. app/auth/sign-up-success/page.tsx
Page de confirmation après inscription

Affichage :
- Message de succès personnalisé
- "Un lien de confirmation a été envoyé à XXX@email.com"
- Instructions : "Vérifiez votre email et cliquez le lien"
- Button "Retour à l'accueil"
- Option "Resend email"

Logique :
- Si pas d'email en session → redirect /auth/sign-up
- Afficher l'email utilisé
- Resend action pour renvoyer le mail

## 10. app/auth/error/page.tsx
Page d'erreur d'authentification

Affichage :
- Message d'erreur lisible
- Code d'erreur technique
- Button "Réessayer" / "Retour à l'accueil"
- Liens de support

## 11. app/api/referrals/verify-code/route.ts
API endpoint pour vérifier un code parrain

\`\`\`typescript
// GET /api/referrals/verify-code?code=ABC123
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (!code) {
    return Response.json({ exists: false })
  }
  
  const supabase = createClient() // serveur
  const { data, error } = await supabase
    .from('profiles')
    .select('id, referral_code, first_name, last_name')
    .eq('referral_code', code)
    .single()
  
  if (error) return Response.json({ exists: false })
  return Response.json({ 
    exists: true, 
    sponsor: { id: data.id, name: \`\${data.first_name} \${data.last_name}\` } 
  })
}
\`\`\`

## 12. app/api/auth/sign-up/route.ts
API pour créer un nouvel utilisateur

\`\`\`typescript
export async function POST(request: Request) {
  const body = await request.json()
  
  // 1. Valider
  const validation = signUpSchema.safeParse(body)
  if (!validation.success) {
    return Response.json({ error: validation.error }, { status: 400 })
  }
  
  const { email, password, first_name, last_name, phone, country, city, referral_code, member_type } = body
  
  // 2. Vérifier code parrain
  const { data: sponsor } = await supabase
    .from('profiles')
    .select('id')
    .eq('referral_code', referral_code)
    .single()
  
  if (!sponsor) {
    return Response.json({ error: 'Code parrain invalide' }, { status: 400 })
  }
  
  // 3. Créer utilisateur
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name,
        last_name,
        phone,
        country,
        city,
        member_type,
      },
    },
  })
  
  if (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }
  
  // 4. Créer referral
  await supabase.from('referrals').insert({
    sponsor_id: sponsor.id,
    sponsored_id: data.user.id,
    generation_level: 1,
  })
  
  return Response.json({
    user: data.user,
    session: data.session,
    requiresEmailConfirmation: !data.session,
  })
}
\`\`\`

---

REGLES DE VALIDATION :

✅ Tous les secrets dans .env.local (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY)
✅ Middleware gère tokens refresh automatiquement
✅ RLS policies appliquées côté database
✅ Types TypeScript stricts (strict: true dans tsconfig)
✅ Validation Zod sur tous les inputs
✅ Erreurs sensibles (pas de data leaks)
✅ Server Components par défaut (Client Components si UI interactive)
✅ Loading states visuels + skeleton loaders

OUTPUT ATTENDU :
- Tous les fichiers créés et syntaxe TypeScript correcte
- Routes d'authentification fonctionnelles
- Middleware en place et testé
- Validation complète des inputs
- Gestion d'erreurs appropriée
\`\`\`

---

## ✅ Checklist d'Implémentation

- [ ] Clients Supabase créés (client.ts, server.ts)
- [ ] Middleware fonctionne (token refresh, route protection)
- [ ] Pages auth complètes (signup, login, success, error)
- [ ] Validation Zod implémentée
- [ ] Vérification code parrain en frontend ET backend
- [ ] Création profil automatique (via trigger)
- [ ] Référral record créé automatiquement
- [ ] Types TypeScript complets
- [ ] Tests d'inscription avec code parrain valide/invalide
- [ ] Messages d'erreur clairs et localisés

## 📊 Variables d'Environnement Requises

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
\`\`\`

## 📚 Références

- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase SSR](https://supabase.com/docs/guides/auth/server-side-rendering)
- [Zod Validation](https://zod.dev/)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
