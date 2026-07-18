'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GRADES, GRADE_COLORS } from '@/lib/constants'

export default function GradesPage() {
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
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">Les Niveaux de Grade</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Progressez a travers nos 5 niveaux de grade et debloquez des avantages exclusifs
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {Object.entries(GRADES).map(([gradeName, config], index) => {
            const color =
              GRADE_COLORS[gradeName as keyof typeof GRADE_COLORS] || GRADE_COLORS.Leader
            const bgColor = color

            return (
              <div key={gradeName} className="grid md:grid-cols-2 gap-8 items-center">
                <div
                  className="rounded-xl p-8 text-white h-full flex flex-col justify-between"
                  style={{ background: bgColor }}
                >
                  <div>
                    <div className="text-5xl font-bold mb-2">#{index + 1}</div>
                    <h3 className="text-4xl font-bold mb-6">{gradeName}</h3>
                    <div className="space-y-3 text-white/90">
                      <p>
                        <span className="font-semibold">Parrainages requis:</span> {config.requiredReferrals}
                      </p>
                      <p>
                        <span className="font-semibold">Points requis:</span> {config.requiredPoints}
                      </p>
                      <p>
                        <span className="font-semibold">Bonus FCFA:</span> {config.benefitsFcfa.toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-2xl font-bold text-slate-900">Avantages</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">✓</span>
                      <span className="text-slate-700">
                        Bonus initial de {config.benefitsFcfa.toLocaleString('fr-FR')} FCFA
                      </span>
                    </li>
                    {config.commissions.directCommission > 0 && (
                      <li className="flex items-start gap-3">
                        <span className="text-2xl">✓</span>
                        <span className="text-slate-700">
                          Commission directe: {(config.commissions.directCommission * 100).toFixed(1)}%
                        </span>
                      </li>
                    )}
                    {config.commissions.teamCommission > 0 && (
                      <li className="flex items-start gap-3">
                        <span className="text-2xl">✓</span>
                        <span className="text-slate-700">
                          Commission equipe: {(config.commissions.teamCommission * 100).toFixed(1)}%
                        </span>
                      </li>
                    )}
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">✓</span>
                      <span className="text-slate-700">Acces a tous les webinaires exclusifs</span>
                    </li>
                  </ul>
                </div>
              </div>
            )
          })}
        </section>
      </div>
    </main>
  )
}
