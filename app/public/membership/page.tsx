'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function MembershipPage() {
  const plans = [
    {
      name: 'Starter',
      price: '0',
      description: 'Pour découvrir la plateforme',
      features: [
        'Accès aux ressources de base',
        'Forum communautaire',
        'Profil personnel',
        'Support par email',
      ],
      color: 'bg-slate-50',
      buttonColor: 'bg-slate-600',
    },
    {
      name: 'Premium',
      price: '5,000',
      currency: 'FCFA/mois',
      description: 'Pour les utilisateurs actifs',
      features: [
        'Accès complet aux ressources',
        'Webinaires exclusifs',
        'Support prioritaire',
        'Système de parrainage',
        'Tableau de bord avancé',
      ],
      color: 'bg-blue-50',
      buttonColor: 'bg-blue-600',
      highlight: true,
    },
    {
      name: 'Elite',
      price: 'Variable',
      description: 'Pour les leaders du réseau',
      features: [
        'Tout Premium +',
        'Coaching personnel',
        'Formations certifiées',
        'Commission MLM illimitée',
        'Événements VIP',
      ],
      color: 'bg-purple-50',
      buttonColor: 'bg-purple-600',
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <nav className="fixed w-full top-0 bg-white bg-opacity-95 backdrop-blur shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Parents School
          </Link>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Se connecter</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>S'inscrire</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">Plans d'Adhésion</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Choisissez le plan qui correspond à vos besoins et commencez votre parcours
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-xl border-2 p-8 flex flex-col h-full ${
                  plan.highlight ? 'border-blue-600 shadow-2xl scale-105' : 'border-slate-200'
                } ${plan.color}`}
              >
                {plan.highlight && (
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-full inline-block w-fit mb-4">
                    Recommandé
                  </div>
                )}
                <h3 className="text-3xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <p className="text-4xl font-bold text-slate-900">{plan.price}</p>
                  <p className="text-sm text-slate-600">{plan.currency}</p>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-green-600 font-bold mt-0.5">✓</span>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className="w-full">
                  <Button className={`w-full ${plan.buttonColor} hover:opacity-90`}>
                    Choisir ce plan
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-100 rounded-xl p-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Questions Fréquentes</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                q: 'Puis-je changer de plan à tout moment?',
                a: 'Oui, vous pouvez passer à tout moment. Les changements prennent effet le mois suivant.',
              },
              {
                q: 'Y a-t-il des frais cachés?',
                a: 'Non, nos tarifs sont transparents. Aucun frais supplémentaire n\'est appliqué.',
              },
              {
                q: 'Comment fonctionne le système de parrainage?',
                a: 'Gagnez des commissions en parrainant d\'autres membres. Plus de détails dans notre guide.',
              },
              {
                q: 'Quelle est la politique d\'annulation?',
                a: 'Vous pouvez annuler à tout moment sans engagement à long terme.',
              },
            ].map((item, i) => (
              <div key={i}>
                <h3 className="font-bold text-slate-900 mb-2">{item.q}</h3>
                <p className="text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}"
