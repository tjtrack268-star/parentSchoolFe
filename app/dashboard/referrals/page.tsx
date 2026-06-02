"use client"

import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { GRADE_COLORS } from "@/lib/constants"
import { Users } from "lucide-react"

interface Referral {
  id: string
  firstName: string
  lastName: string
  email: string
  currentGrade: string
  totalPoints: number
  sponsorshipCode: string
  city: string
}

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const token = authClient.getToken()
        if (!token) return
        const userRes = await fetch("/api/fetch-user", { headers: { Authorization: `Bearer ${token}` } })
        const user = await userRes.json()
        const teamRes = await fetch(`/api/users/${user.id}/team`, { headers: { Authorization: `Bearer ${token}` } })
        const team = await teamRes.json()
        setReferrals(Array.isArray(team) ? team : [])
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 rounded-full border-4 border-[#a3ade8] border-t-[#3f2f85] animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#3f2f85]">Mes parrainages</h1>
        <p className="text-slate-500 mt-1 text-sm">Liste des personnes que vous avez parrainées</p>
      </div>

      {/* Résumé */}
      <div className="rounded-xl border-l-4 border-[#e8b41f] bg-white p-5 shadow-sm">
        <p className="text-xs text-slate-500 mb-1">Total filleuls directs</p>
        <p className="text-3xl font-bold text-[#3f2f85]">{referrals.length}</p>
      </div>

      {error && (
        <div className="rounded-lg border-l-4 border-red-400 bg-red-50 p-4 text-red-600 text-sm">{error}</div>
      )}

      {referrals.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#a3ade8]/30 p-12 text-center shadow-sm">
          <Users className="mx-auto mb-4 h-12 w-12 text-[#a3ade8]" />
          <p className="font-semibold text-[#3f2f85]">Aucun parrainage</p>
          <p className="text-sm text-slate-500 mt-1">Partagez votre code de parrainage pour agrandir votre réseau.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#a3ade8]/30 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#3f2f85]">
              <tr>
                {["Membre", "Grade", "Ville", "Points", "Code"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {referrals.map((r, i) => {
                const color = GRADE_COLORS[r.currentGrade as keyof typeof GRADE_COLORS] || '#a3ade8'
                return (
                  <tr key={r.id} className={`border-b border-[#a3ade8]/20 ${i % 2 === 0 ? "bg-white" : "bg-[#f8f4ef]"}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: color }}>
                          {r.firstName?.charAt(0)}{r.lastName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-[#3f2f85]">{r.firstName} {r.lastName}</p>
                          <p className="text-xs text-slate-400">{r.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full px-2 py-1 text-xs font-semibold"
                        style={{ backgroundColor: `${color}20`, color }}>
                        {r.currentGrade || "Aucun"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{r.city || "—"}</td>
                    <td className="px-5 py-3 font-semibold text-[#e8b41f]">{r.totalPoints}</td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">{r.sponsorshipCode}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
