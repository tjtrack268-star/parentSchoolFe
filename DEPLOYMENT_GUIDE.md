# Parents School - Guide de Déploiement

## Configuration Environnement

Ajouter dans les variables d'environnement (Vars section):

```
NEXT_PUBLIC_API_URL=http://localhost:8080  # ou l'URL de production de l'API externe
```

## Architecture du Projet

### Authentification
- **Login**: `/app/auth/login/page.tsx` - Utilise `/api/auth/login` de l'API externe
- **Signup**: `/app/auth/signup/page.tsx` - Utilise `/api/auth/register` de l'API externe
- **Tokens**: Stockés dans des cookies httpOnly pour sécurité et accès middleware

### Routes Protégées
- `/dashboard` - Tableau de bord utilisateur
- `/admin` - Administration du système
- Le middleware (`/proxy.ts`) protège ces routes

### API Routes (Proxies)
- `/app/api/fetch-user/route.ts` - Récupère les données utilisateur
- `/app/api/user-data/route.ts` - Données complètes utilisateur
- `/app/api/referrals-data/route.ts` - Données des parrainages
- `/app/api/logout/route.ts` - Déconnexion

### Pages Dashboard
- `/dashboard` - Vue d'ensemble avec statistiques
- `/dashboard/profile` - Profil utilisateur
- `/dashboard/commissions` - Historique des commissions
- `/dashboard/referrals` - Gestion des parrainages
- `/dashboard/network` - Visualisation du réseau
- `/dashboard/vouchers` - Gestion des bons

## Client API

Le client API (`/lib/api-client.ts`) gère:
- Les requêtes authentifiées avec token Bearer
- Les erreurs et redirections vers login si token expiré
- La conversion des réponses JSON

Usage dans les composants:
```typescript
const data = await apiClient.get('/endpoint')
```

## Déploiement

1. **Variables d'environnement**: Configurer `NEXT_PUBLIC_API_URL`
2. **Base de données**: L'API externe gère toutes les données
3. **Middleware**: Activé automatiquement avec `/proxy.ts`
4. **Cookies**: Supportés automatiquement par Next.js

## Supabase Supprimé

- ❌ Tous les imports Supabase ont été supprimés
- ❌ Les fichiers Supabase restent présents mais inutilisés
- ✅ L'application fonctionne entièrement avec l'API externe

## Commandes de Démarrage

```bash
npm install
npm run dev
# Accéder à http://localhost:3000
```

## Notes Importantes

- Les tokens sont stockés en cookies httpOnly
- Le proxy.ts protège automatiquement les routes authentifiées
- Les erreurs API retournent vers `/auth/login`
- Les données viennent exclusivement de l'API externe configurée
