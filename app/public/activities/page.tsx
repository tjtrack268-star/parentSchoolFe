'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ActivitiesPage() {
  const activities = [
    {
      id: 1,
      title: 'Webinaires mensuels',
      description: 'Des sessions interactives animées par des experts en éducation chrétienne',
      icon: '🎥',
    },
    {
      id: 2,
      title: 'Ressources téléchargeables',
      description: 'Livres, guides et outils pour l\'éducation familiale',
      icon: '📚',
    },
    {
      id: 3,
      title: 'Communauté en ligne',
      description: 'Forums, groupes d\'entraide et connexions avec d\'autres parents',
      icon: '💬',
    },
    {
      id: 4,
      title: 'Formations certifiées',
      description: 'Programmes complets pour les éducateurs et leaders',
      icon: '🎓',
    },
    {
      id: 5,
      title: 'Coaching personnel',
      description: 'Accompagnement individualisé par des professionnels',
      icon: '🤝',
    },
    {
      id: 6,
      title: 'Événements internationaux',
      description: 'Conférences et rassemblements mondiaux',
      icon: '🌍',
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Nos Activités
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Découvrez les différents services et programmes que Parents School propose pour
            soutenir votre croissance spirituelle et personnelle
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map(activity => (
              <div
                key={activity.id}
                className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-xl transition hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">{activity.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{activity.title}</h3>
                <p className="text-slate-600 mb-6">{activity.description}</p>
                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  En savoir plus →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à rejoindre?</h2>
            <p className="text-lg text-blue-100 mb-8">
              Commencez votre parcours d'éducation chrétienne avec Parents School
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                S'inscrire Maintenant
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
