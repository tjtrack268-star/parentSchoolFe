"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"

interface DashboardStats {
  totalReferrals: number
  directReferrals: number
  totalPoints: number
  currentGrade: string
  monthlyCommission: number
  nextGradeProgress: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Fetch user data from external API
        const userData = await apiClient.get<any>('/user-data')
        
        // Fetch referrals data
        const referralsData = await apiClient.get<any>('/referrals-data')

        const directReferrals = userData?.directReferrals || 0
        const totalReferrals = referralsData?.length || 0
        const points = userData?.points || 0
        const grade = userData?.currentGrade || "Leader"
        const monthlyCommission = userData?.monthlyCommission || 0

        setStats({
          totalReferrals,
          directReferrals,
          totalPoints: points,
          currentGrade: grade,
          monthlyCommission,
          nextGradeProgress: Math.min(100, (points / 1000) * 100),
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center py-8"><div className="text-center">Chargement...</div></div>
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Vue d'ensemble</h1>
        <p className="text-slate-600 mt-1 text-sm sm:text-base">Bienvenue sur votre tableau de bord</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
          <p className="text-slate-600 text-xs sm:text-sm mb-2">Grade actuel</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats?.currentGrade || "Leader"}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
          <p className="text-slate-600 text-xs sm:text-sm mb-2">Parrainages directs</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{stats?.directReferrals || 0}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
          <p className="text-slate-600 text-xs sm:text-sm mb-2">Points totaux</p>
          <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats?.totalPoints || 0}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
          <p className="text-slate-600 text-xs sm:text-sm mb-2">Commissions ce mois</p>
          <p className="text-lg sm:text-2xl font-bold text-orange-600">
            {(stats?.monthlyCommission || 0).toLocaleString("fr-FR")} FCFA
          </p>
        </div>
      </div>

      {/* Grade Progress */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Progression vers le prochain grade</h3>
        <div className="w-full bg-slate-200 rounded-full h-3 sm:h-4">
          <div
            className="bg-blue-600 h-3 sm:h-4 rounded-full transition-all"
            style={{ width: `${stats?.nextGradeProgress || 0}%` }}
          />
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">{Math.round(stats?.nextGradeProgress || 0)}% complété</p>
      </div>
    </div>
  )
}
