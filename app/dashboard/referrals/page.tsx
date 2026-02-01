"use client"

import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  userType: string
  totalPoints: number
  directSponsorshipsCount: number
  sponsorshipCode: string
  createdAt: string
  currentGrade?: {
    name: string
  }
}

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadReferrals = async () => {
      try {
        // Get current user first to get their ID
        const userResponse = await fetch('/api/fetch-user', {
          headers: {
            'Authorization': `Bearer ${authClient.getToken()}`,
            'Content-Type': 'application/json',
          },
        })

        if (!userResponse.ok) throw new Error('Failed to fetch user')
        
        const user = await userResponse.json()
        
        // Then get their team (referrals)
        const teamResponse = await fetch(`/api/users/${user.id}/team`, {
          headers: {
            'Authorization': `Bearer ${authClient.getToken()}`,
            'Content-Type': 'application/json',
          },
        })

        if (!teamResponse.ok) throw new Error('Failed to fetch team')
        
        const teamData = await teamResponse.json()
        setReferrals(teamData || [])
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((referral) => (
                <tr key={referral.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {referral.firstName} {referral.lastName}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{referral.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {referral.currentGrade?.name || 'Aucun'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{referral.totalPoints}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(referral.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}