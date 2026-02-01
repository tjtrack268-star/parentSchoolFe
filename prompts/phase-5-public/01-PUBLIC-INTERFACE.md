# Phase 5 - Prompt : Interface Publique & Marketing

## 🎯 Objectif
Créer une landing page moderne, inspirante et fonctionnelle pour attirer les visiteurs et les convertir en membres.

## 📋 Contexte à Inclure
- **00-CONTEXT-GLOBAL.md**
- **Design System** (couleurs, typo)

---

## 🔧 Prompt à Utiliser pour l'IA

\`\`\`
Tu dois créer l'interface publique (landing page) de Parents School avec design sobre, chaleureux et inspirant.

CONTEXTE : [Inclure 00-CONTEXT-GLOBAL.md]

TÂCHE : Implémenter pages publiques et composants marketing

FICHIERS À CRÉER :

## PAGES PUBLIQUES

### 1. app/page.tsx (Landing Page)

Composition : 6 sections fullscreen

#### Section 1 : HERO

Layout : 50% texte/50% image (desktop), stacked (mobile)

Texte :
- Titre grand : "Former des Parents Selon les Valeurs Chrétiennes"
- Sous-titre : "Rejoignez une communauté internationale de formation à la parentalité"
- Texte paragraphe : "Parents School propose des enseignements, séminaires et formations certifiantes pour renforcer votre rôle parental avec une perspective biblique"
- 2 CTAs : 
  - Primary : "S'inscrire maintenant" → /auth/sign-up
  - Secondary : "En savoir plus" → scroll

Image : Illustration famille heureuse / parents avec enfants

Animation : Subtle fade-in + parallax scroll

#### Section 2 : VISION & MISSION (3 colonnes)

Cards avec icônes + texte

Card 1 : Icône Bible
- Titre : "Fondement Biblique"
- Texte : "Basée sur les enseignements de la Bible pour une parentalité chrétienne authentique"

Card 2 : Icône Famille
- Titre : "Communauté Bienveillante"
- Texte : "Rejoignez des milliers de parents partageant les mêmes valeurs à travers le monde"

Card 3 : Icône Croissance
- Titre : "Développement Personnel"
- Texte : "Progressez à travers un système de grades reconnaissant votre engagement"

#### Section 3 : ACTIVITÉS PRINCIPALES (3 colonnes)

Cards avec icônes, images, texte et CTA

Card 1 : Enseignements
- Icône/Image : Livre ouvert
- Titre : "Enseignements Dominicaux"
- Texte : "Sessions hebdomadaires sur des thèmes variés de parentalité"
- CTA : "Découvrir →"

Card 2 : Séminaires
- Icône/Image : Personnes en formation
- Titre : "Séminaires & Ateliers"
- Texte : "Formations intensives mensuelles sur des sujets spécifiques"
- CTA : "Découvrir →"

Card 3 : Formations
- Icône/Image : Certificat
- Titre : "Formations Certifiantes"
- Texte : "Certifications reconnues pour approfondir votre expertise"
- CTA : "Découvrir →"

Animation : Hover scale + shadow

#### Section 4 : MEMBERSHIP (Comparaison Types)

Tableau 3 colonnes :

| | Ordinaire | Honneur | Bienfaiteur |
|---|---|---|---|
| Accès content | ✓ | ✓ | ✓ |
| Formations live | ✓ | ✓ | ✓ |
| Parrainage | ✓ | ✓ | ✓ |
| Badge premium | | ✓ | ✓ |
| Support prioritaire | | ✓ | ✓ |
| Événements VIP | | | ✓ |

CTA sous tableau : "Choisir mon type" → /auth/sign-up

#### Section 5 : PLAN DE CARRIÈRE (Timeline)

Timeline verticale (desktop) ou horizontale (mobile) : Leader → Leader Senior → Coordinateur → Mentor → Directeur

Chaque étape :
- Icône progressif
- Nom du grade
- Avantages principaux
- Indicateurs de progression

Animation : Appear on scroll

#### Section 6 : TÉMOIGNAGES (Carousel)

Carousel 3 slides avec :
- Initials/Avatar
- Nom + Titre
- Citation inspirante
- Note étoiles (5 étoiles)

Navigation : Previous/Next buttons + dots

#### Section 7 : CTA FINAL (Full Width)

Background : Gradient bleu à vert
Texte centré blanc :
- Titre : "Prêt à Commencer Votre Parcours ?"
- Sous-titre : "Rejoignez des parents du monde entier"
- 2 CTAs : "S'inscrire" + "Se Connecter"

#### Section 8 : Footer

Layout : 4 colonnes

Col 1 : Logo + Description courte
Col 2 : Menu (Accueil, À propos, Contact)
Col 3 : Contact (Email, Téléphone)
Col 4 : Réseaux sociaux (liens)

Copyright bottom

---

### 2. app/about/page.tsx
Page À Propos

Sections :
- Histoire de Parents School
- Mission & Vision
- Valeurs fondamentales
- Team/Fondateurs
- Statistiques clés

---

### 3. app/activities/page.tsx
Page Activités

3 sections détaillées :
1. Enseignements dominicaux
2. Séminaires mensuels
3. Formations certifiantes

Chaque section : description, calendrier, CTA

---

### 4. app/membership/page.tsx
Page Membership Détaillée

- Comparaison complète des types
- Processus d'inscription
- Avantages de chaque type
- FAQ
- CTA "S'inscrire"

---

### 5. app/grades/page.tsx
Page Plan de Carrière

- Timeline interactive (détails par grade)
- Conditions de progression
- Avantages et commissions
- Témoignages de chaque grade level

---

### 6. app/countries/page.tsx
Page Communautés par Pays

- Carte monde interactive (libellés cliquables)
- Liste pays avec statistiques
- Contact des focal points
- Événements locaux

---

### 7. app/testimonials/page.tsx
Page Témoignages

- Grid de cartes avec photos + citations
- Filtres par pays/grade
- Formulaire "Partager votre histoire"

---

### 8. app/contact/page.tsx
Page Contact

Layout : 2 colonnes

Col gauche :
- Formulaire (nom, email, sujet, message)
- Validation
- Submit button

Col droite :
- Infos de contact
- Adresse
- Horaires
- Réseaux sociaux
- Map embedded

---

## COMPOSANTS PUBLICS

### components/landing/hero.tsx
Section hero avec texte + image

Props : { title, subtitle, ctaText, ctaLink, image }

### components/landing/vision-mission.tsx
3 cartes vision/mission

### components/landing/activities-grid.tsx
3 cartes activités

### components/landing/membership-table.tsx
Tableau comparaison membership

### components/landing/grades-timeline.tsx
Timeline interactive

### components/landing/testimonials-carousel.tsx
Carousel témoignages

Dépendances : embla-carousel ou swiper

### components/landing/cta-section.tsx
Section CTA finale

### components/layout/navbar.tsx
Navigation publique

Sticky header :
- Logo left
- Menu center (accueil, à propos, activités, contact)
- Right buttons : Se connecter | S'inscrire

Responsive : burger menu on mobile

### components/layout/footer.tsx
Footer avec sections

### components/layout/public-layout.tsx
Wrapper pour pages publiques

Inclut : navbar + footer + main content

---

## DESIGN SYSTEM PERSONNALISÉ

### app/globals.css
Variables CSS OKLch

\`\`\`css
:root {
  /* Brand */
  --brand-primary: oklch(0.65 0.15 220);   /* Bleu spirituel */
  --brand-secondary: oklch(0.70 0.12 140); /* Vert croissance */
  --brand-accent: oklch(0.75 0.10 60);     /* Or bénédiction */
  
  /* Grades */
  --grade-leader: oklch(0.75 0.12 140);
  --grade-leader-senior: oklch(0.70 0.15 180);
  --grade-coordinateur: oklch(0.65 0.18 220);
  --grade-mentor: oklch(0.60 0.20 280);
  --grade-directeur: oklch(0.75 0.15 45);
  
  /* Semantic */
  --background: oklch(0.98 0 0);
  --foreground: oklch(0.20 0 0);
  --muted: oklch(0.85 0.02 0);
}
\`\`\`

### Typography

Headings : Inter 700, 64px/48px/36px
Body : Inter 400, 16px leading-relaxed

### Animations

- Fade-in : 0.5s ease-out
- Slide-in : 0.6s cubic-bezier(0.23, 1, 0.320, 1)
- Scale hover : 1.05 scale
- Parallax : subtle on scroll

---

## ASSETS REQUIS

### Images
- Illustration famille hero
- Icons pour sections (6)
- Photos testimonials (3)
- Background textures

### Icons
Utiliser lucide-react :
- Book, Users, Award, Globe, Checkmark, etc.

---

## API ROUTES (pour formulaires)

### app/api/contact/route.ts
POST - Envoyer un message de contact

Validations :
- Email valide
- Message non vide
- Anti-spam (Zod + rate-limit)

Envoi email via Resend ou similaire

### app/api/testimonials/submit/route.ts
POST - Soumettre un témoignage

Modération requise avant publication

---

## CONFIGURATION SEO

### metadata.ts
\`\`\`typescript
export const metadata: Metadata = {
  title: "Parents School - Formation à la Parentalité Chrétienne",
  description: "Plateforme internationale de formation à la parentalité selon les valeurs chrétiennes. Rejoignez notre communauté.",
  openGraph: {
    title: "Parents School",
    description: "Formation parentalité chrétienne",
    images: ["/og-image.jpg"],
  },
}
\`\`\`

### Sitemap & Robots
- robots.txt
- sitemap.xml (généré automatiquement)

---

REGLES DE VALIDATION :

✅ Design responsive (mobile-first)
✅ Performance : images optimisées, lazy loading
✅ Accessibilité : ARIA labels, contraste, keyboard nav
✅ SEO : meta tags, Open Graph, structured data
✅ Animations fluides (60fps, use-motion for reduced-motion)
✅ Forms validées avec Zod
✅ No sensitive data in code
✅ Lighthouse score > 90

OUTPUT ATTENDU :
- 8 pages publiques complètes
- 8+ composants réutilisables
- Navigation fluide
- Design cohérent et inspirant
- Performance excellente
- SEO optimisé
\`\`\`

---

## ✅ Checklist de Validation

- [ ] Landing page responsive
- [ ] Hero section attrayant avec CTA clairs
- [ ] Tableau membership compare les types
- [ ] Timeline carrière interactive
- [ ] Carousel témoignages fonctionne
- [ ] Navigation sticky et intuitive
- [ ] Footer complet avec contacts
- [ ] Formulaire contact valide
- [ ] Images optimisées
- [ ] Lighthouse score > 90
- [ ] Pas d'erreurs console
- [ ] Temps de chargement < 3s

## 🎨 Inspirations Design

- [Stripe.com](https://stripe.com) : Navigation, Hero
- [Notion.so](https://notion.so) : Cards, Sections
- [Framer.com](https://framer.com) : Animations, Interactif
- [Auth0.com](https://auth0.com) : CTA Strategy

## 📚 Références

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web Vitals](https://web.dev/vitals/)
- [Accessible Colors](https://www.tpgi.com/color-contrast-checker/)
