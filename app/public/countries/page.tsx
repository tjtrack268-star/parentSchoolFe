'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { COUNTRIES } from '@/lib/constants'

export default function CountriesPage() {
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
            <Link href="/inscription">
              <Button>S'inscrire</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Présence Mondiale
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Parents School est présente dans plus de 50 pays à travers le monde
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COUNTRIES.map(country => (
              <div
                key={country.code}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition"
              >
                <div className="text-4xl mb-3">🌍</div>
                <h3 className="font-bold text-slate-900 mb-2">{country.name}</h3>
                <p className="text-sm text-slate-600 mb-4">Rejoignez notre communauté locale</p>
                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  En savoir plus →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 mt-20 rounded-xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Expansion Continue</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Nous expandons constamment pour atteindre plus de familles dans le monde entier
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Rejoindre Notre Réseau
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
