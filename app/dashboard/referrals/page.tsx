"use client"

import { useEffect, useState } from "react"
interface ReferralRow {
  id: string
  name: string
  email: string
  grade: string
  points: number
}

interface TreeNode {
  id: string
  name: string
  email: string
  grade: string
  points: number
  children: TreeNode[]
}

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<ReferralRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadReferrals = async () => {
      try {
        const response = await fetch("/api/dashboard/tree", {
          headers: { "Content-Type": "application/json" },
        })
        if (!response.ok) throw new Error("Failed to fetch network tree")

        const root = (await response.json()) as TreeNode

        const rows: ReferralRow[] = (root?.children || []).map((child) => ({
          id: child.id,
          name: child.name,
          email: child.email || "",
          grade: child.grade || "Aucun",
          points: child.points || 0,
        }))
        setReferrals(rows)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading referrals')
        console.error("Error loading referrals:", err)
      } finally {
        setLoading(false)
      }
    }

    loadReferrals()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mes parrainages</h1>
          <p className="text-slate-600 mt-1">Liste complète des personnes que vous avez parrainées</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <div className="inline-block w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
          <p className="text-slate-600 mt-4">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mes parrainages</h1>
          <p className="text-slate-600 mt-1">Liste complète des personnes que vous avez parrainées</p>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-8 text-center">
          <p className="text-red-600">Erreur: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mes parrainages</h1>
        <p className="text-slate-600 mt-1">Liste complète des personnes que vous avez parrainées</p>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Résumé</h2>
        <p className="text-3xl font-bold text-blue-600">{referrals.length}</p>
        <p className="text-blue-700 text-sm">Personnes parrainées</p>
      </div>

      {referrals.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <div className="text-gray-500">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold mb-2">Aucun parrainage</h3>
            <p className="text-sm">Vous n'avez pas encore parrainé de personnes.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Grade</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Points</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((referral) => (
                <tr key={referral.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900">{referral.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{referral.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{referral.grade}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{referral.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
