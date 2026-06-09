"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Lock, CheckCircle2, Trophy } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

// ── Seuils hardcodés (doc d'implémentation) ───────────────────────────────────
const GRADES = [
  { name: "Aucun",         min: 0,  max: 3,  points: 0,      color: "#94a3b8", bg: "#f1f5f9"  },
  { name: "Leader",        min: 4,  max: 7,  points: 240,    color: "#22c55e", bg: "#dcfce7"  },
  { name: "Leader Senior", min: 8,  max: 17, points: 1200,   color: "#3b82f6", bg: "#dbeafe"  },
  { name: "Coordinateur",  min: 18, max: 29, points: 3000,   color: "#f97316", bg: "#ffedd5"  },
  { name: "Mentor",        min: 30, max: 49, points: 10000,  color: "#a855f7", bg: "#f3e8ff"  },
  { name: "Directeur",     min: 50, max: 60, points: 30000,  color: "#e8b41f", bg: "#fef9c3"  },
]

const POINTS_PER_REFERRAL = 60

function getGradeIndex(referrals: number): number {
  for (let i = GRADES.length - 1; i >= 0; i--) {
    if (referrals >= GRADES[i].min) return i
  }
  return 0
}

export default function SimulatorPage() {
  const [referrals, setReferrals] = useState(0)

  const gradeIdx    = getGradeIndex(referrals)
  const currentGrade = GRADES[gradeIdx]
  const nextGrade    = GRADES[gradeIdx + 1] ?? null
  const points       = referrals * POINTS_PER_REFERRAL
  const isMaxGrade   = gradeIdx === GRADES.length - 1
  const remaining    = nextGrade ? nextGrade.min - referrals : 0

  // Largeur de la barre de progression dans le curseur
  const pct = Math.round((referrals / 60) * 100)

  return (
    <main className="min-h-screen bg-[#f8f4ef]">
      <Header />
      <div className="pt-16">

        {/* Hero */}
        <section className="bg-[#3f2f85] py-16 text-white">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">Outil interactif</p>
            <h1 className="mb-3 text-4xl font-bold sm:text-5xl">Simulateur de progression</h1>
            <p className="text-lg text-slate-200">Découvrez votre grade selon votre réseau de parrainage</p>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">

          {/* ── Curseur ── */}
          <div className="rounded-xl bg-white border border-[#a3ade8]/30 shadow-sm p-8">
            <div className="mb-6 flex items-center justify-between">
              <label className="text-lg font-bold text-[#3f2f85]">
                Filleuls directs
              </label>
              <span className="rounded-full bg-[#3f2f85] px-4 py-1.5 text-xl font-bold text-white">
                {referrals}
              </span>
            </div>

            {/* Track custom */}
            <div className="relative mb-2">
              <div className="h-3 w-full overflow-hidden rounded-full bg-[#a3ade8]/25">
                <div className="h-3 rounded-full transition-all duration-200"
                  style={{ width: `${pct}%`, backgroundColor: currentGrade.color }} />
              </div>
              <input
                type="range" min={0} max={60} step={1}
                value={referrals}
                onChange={e => setReferrals(Number(e.target.value))}
                className="absolute inset-0 h-3 w-full cursor-pointer opacity-0"
                aria-label="Nombre de filleuls directs"
              />
            </div>

            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0</span>
              {[4, 8, 18, 30, 50].map(n => (
                <span key={n} className="hidden sm:block">{n}</span>
              ))}
              <span>60</span>
            </div>

            {/* Jalons cliquables */}
            <div className="mt-4 flex flex-wrap gap-2">
              {GRADES.filter(g => g.name !== "Aucun").map(g => (
                <button key={g.name} onClick={() => setReferrals(g.min)}
                  className="rounded-full px-3 py-1 text-xs font-semibold border-2 transition hover:scale-105"
                  style={{
                    borderColor: g.color,
                    backgroundColor: referrals >= g.min ? g.bg : "transparent",
                    color: g.color,
                  }}>
                  {g.min} → {g.name}
                </button>
              ))}
            </div>
          </div>

          {/* ── Résultat dynamique ── */}
          <div className="rounded-xl border-2 shadow-sm p-8 transition-all duration-300"
            style={{ borderColor: currentGrade.color, backgroundColor: currentGrade.bg }}>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Grade actuel</p>
                <div className="flex items-center gap-3">
                  {isMaxGrade && <Trophy className="h-7 w-7 shrink-0" style={{ color: currentGrade.color }} />}
                  <span className="rounded-full px-5 py-2 text-lg font-bold text-white"
                    style={{ backgroundColor: currentGrade.color }}>
                    {currentGrade.name}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Points cumulés</p>
                <p className="text-3xl font-bold" style={{ color: currentGrade.color }}>
                  {points.toLocaleString("fr-FR")} pts
                </p>
                <p className="text-xs text-slate-400">{referrals} filleuls × {POINTS_PER_REFERRAL} pts</p>
              </div>
            </div>

            {/* Message prochain grade */}
            <div className="mt-5 rounded-lg bg-white/70 px-4 py-3 text-sm font-semibold text-center"
              style={{ color: currentGrade.color }}>
              {isMaxGrade ? (
                <span className="flex items-center justify-center gap-2">
                  <Trophy className="h-5 w-5" /> Grade maximum atteint !
                </span>
              ) : nextGrade ? (
                <>
                  Encore <span className="font-bold underline underline-offset-2">{remaining} filleul{remaining > 1 ? "s" : ""}</span> pour atteindre{" "}
                  <span style={{ color: nextGrade.color }}>{nextGrade.name}</span>
                </>
              ) : null}
            </div>
          </div>

          {/* ── Tableau récapitulatif ── */}
          <div className="rounded-xl bg-white border border-[#a3ade8]/30 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="font-bold text-[#3f2f85]">Tableau des grades</h2>
              <p className="text-xs text-slate-400">Déplacez le curseur pour voir votre progression</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#f8f4ef] text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Grade</th>
                    <th className="px-4 py-3 text-center">Filleuls min</th>
                    <th className="px-4 py-3 text-center">Filleuls max</th>
                    <th className="px-4 py-3 text-center">Points</th>
                    <th className="px-4 py-3 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {GRADES.map((g, i) => {
                    const isCurrent  = i === gradeIdx
                    const isAchieved = i < gradeIdx
                    const isFuture   = i > gradeIdx

                    return (
                      <tr key={g.name}
                        className={`transition-colors ${isCurrent ? "ring-2 ring-inset" : ""}`}
                        style={{
                          backgroundColor: isCurrent ? g.bg : isAchieved ? `${g.bg}80` : undefined,
                          // @ts-ignore
                          "--tw-ring-color": g.color,
                        }}>
                        {/* Grade */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                            <span className={`font-semibold ${isCurrent ? "text-[#3f2f85]" : isAchieved ? "text-slate-600" : "text-slate-400"}`}>
                              {g.name}
                            </span>
                            {isCurrent && (
                              <span className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                                style={{ backgroundColor: g.color }}>
                                Actuel
                              </span>
                            )}
                          </div>
                        </td>
                        {/* Filleuls min */}
                        <td className={`px-4 py-3 text-center font-mono font-semibold ${isFuture ? "text-slate-300" : "text-[#3f2f85]"}`}>
                          {g.min === 0 ? "—" : g.min}
                        </td>
                        {/* Filleuls max */}
                        <td className={`px-4 py-3 text-center font-mono font-semibold ${isFuture ? "text-slate-300" : "text-[#3f2f85]"}`}>
                          {i === GRADES.length - 1 ? "60+" : g.max}
                        </td>
                        {/* Points */}
                        <td className={`px-4 py-3 text-center font-semibold ${isFuture ? "text-slate-300" : "text-[#e8b41f]"}`}>
                          {g.points === 0 ? "—" : g.points.toLocaleString("fr-FR")}
                        </td>
                        {/* Statut */}
                        <td className="px-4 py-3 text-center">
                          {isAchieved && (
                            <span className="inline-flex items-center justify-center">
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </span>
                          )}
                          {isCurrent && (
                            <span className="inline-block rounded-full w-3 h-3 animate-pulse"
                              style={{ backgroundColor: g.color }} />
                          )}
                          {isFuture && (
                            <span className="inline-flex items-center justify-center">
                              <Lock className="h-4 w-4 text-slate-300" />
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── CTA ── */}
          <div className="rounded-xl bg-gradient-to-r from-[#3f2f85] to-[#a3ade8] p-8 text-center text-white">
            <p className="mb-2 text-lg font-bold">Prêt à commencer votre parcours ?</p>
            <p className="mb-6 text-sm text-white/80">
              Rejoignez Parents School et commencez à bâtir votre réseau de parrainage dès aujourd'hui.
            </p>
            <Link href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-[#e8b41f] px-8 py-3 font-semibold text-[#3f2f85] transition hover:opacity-90">
              Rejoindre ParentSchool <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  )
}
