"use client"

import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { GRADE_COLORS } from "@/lib/constants"

interface DashboardStats {
  totalPoints: number
  directReferrals: number
  currentGrade: string
  monthlyCommission: number
}

interface ExcelImportReport {
  lignesLues: number
  elevesCrees: number
  elevesMisAJour: number
  tuteursCrees: number
  lignesIgnorees: number
  avertissements: string[]
}

const GRADES_ORDER = ["Leader", "Leader Senior", "Coordinateur", "Mentor", "Directeur"]
const GRADES_REQ = [
  { name: "Leader", sponsorships: 4, points: 240 },
  { name: "Leader Senior", sponsorships: 8, points: 1200 },
  { name: "Coordinateur", sponsorships: 18, points: 3000 },
  { name: "Mentor", sponsorships: 30, points: 10000 },
  { name: "Directeur", sponsorships: 50, points: 30000 },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [importReport, setImportReport] = useState<ExcelImportReport | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const token = authClient.getToken()
        if (!token) return

        const userRes = await fetch("/api/fetch-user", { headers: { Authorization: `Bearer ${token}` } })
        if (!userRes.ok) return
        const user = await userRes.json()

        const teamRes = await fetch(`/api/users/${user.id}/team`, { headers: { Authorization: `Bearer ${token}` } })
        const team = teamRes.ok ? await teamRes.json() : []

        setUserRole(user.userRole)
        setStats({
          totalPoints: user.totalPoints || 0,
          directReferrals: Array.isArray(team) ? team.length : 0,
          currentGrade: user.currentGrade || "Aucun",
          monthlyCommission: 0,
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleImport = async () => {
    if (!excelFile) { setImportError("Sélectionne un fichier .xlsx"); return }
    setImporting(true); setImportError(null); setImportReport(null)
    try {
      const formData = new FormData()
      formData.append("file", excelFile)
      const res = await fetch("/api/admin/eleves/import", { method: "POST", body: formData })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload?.error || "Erreur import")
      setImportReport(payload)
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Erreur import")
    } finally {
      setImporting(false)
    }
  }

  // Calcul progression vers prochain grade
  const currentGradeIdx = GRADES_ORDER.indexOf(stats?.currentGrade || "")
  const nextGrade = GRADES_REQ[currentGradeIdx + 1] || null
  const progress = nextGrade
    ? Math.min(100, Math.round(((stats?.directReferrals || 0) / nextGrade.sponsorships) * 100))
    : 100

  const gradeColor = GRADE_COLORS[stats?.currentGrade as keyof typeof GRADE_COLORS] || "#a3ade8"

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 rounded-full border-4 border-[#a3ade8] border-t-[#3f2f85] animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#3f2f85]">Vue d'ensemble</h1>
        <p className="text-slate-500 mt-1 text-sm">Bienvenue sur votre tableau de bord Parents School</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Grade actuel", value: stats?.currentGrade || "Aucun", color: gradeColor, bg: "bg-white" },
          { label: "Parrainages directs", value: stats?.directReferrals || 0, color: "#3f2f85", bg: "bg-white" },
          { label: "Points totaux", value: stats?.totalPoints || 0, color: "#3f2f85", bg: "bg-white" },
          { label: "Commissions ce mois", value: `${(stats?.monthlyCommission || 0).toLocaleString("fr-FR")} FCFA`, color: "#e8b41f", bg: "bg-white" },
        ].map((card, i) => (
          <div key={i} className={`${card.bg} rounded-xl border border-[#a3ade8]/30 p-5 shadow-sm`}>
            <p className="text-slate-500 text-xs mb-2">{card.label}</p>
            <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Progression grade */}
      <div className="bg-white rounded-xl border border-[#a3ade8]/30 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[#3f2f85]">Progression vers le prochain grade</h3>
          {nextGrade && <span className="text-xs text-[#e8b41f] font-semibold">{nextGrade.name}</span>}
        </div>
        <div className="w-full bg-[#a3ade8]/20 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: "#3f2f85" }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>{stats?.directReferrals || 0} parrainages</span>
          {nextGrade && <span>Objectif : {nextGrade.sponsorships} parrainages · {nextGrade.points} pts</span>}
          <span>{progress}%</span>
        </div>
      </div>

      {/* Grades roadmap */}
      <div className="bg-white rounded-xl border border-[#a3ade8]/30 p-5 shadow-sm">
        <h3 className="font-semibold text-[#3f2f85] mb-4">Plan de carrière</h3>
        <div className="space-y-3">
          {GRADES_REQ.map((g, i) => {
            const color = GRADE_COLORS[g.name as keyof typeof GRADE_COLORS]
            const done = currentGradeIdx >= i
            return (
              <div key={g.name} className={`flex items-center gap-3 rounded-lg p-3 ${done ? "bg-[#3f2f85]/5 border border-[#3f2f85]/20" : "bg-slate-50"}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: color }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#3f2f85]">{g.name}</p>
                  <p className="text-xs text-slate-500">{g.sponsorships} parrainages · {g.points} pts</p>
                </div>
                {done && <span className="text-[#e8b41f] text-lg">✓</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Import Excel — Admin seulement */}
      {userRole === "ADMIN" && (
        <div className="bg-white rounded-xl border border-[#a3ade8]/30 p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-[#3f2f85]">Admin : Import Excel membres</h3>
          <p className="text-sm text-slate-500">Importer le fichier .xlsx pour mettre à jour les membres et leurs parrains.</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-[#3f2f85] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90"
            />
            <button
              onClick={handleImport}
              disabled={importing}
              className="rounded-lg bg-[#e8b41f] px-5 py-2 text-sm font-semibold text-[#3f2f85] hover:opacity-90 disabled:opacity-60 shrink-0"
            >
              {importing ? "Import en cours..." : "Importer"}
            </button>
          </div>

          {importError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{importError}</div>
          )}

          {importReport && (
            <div className="rounded-lg border border-[#a3ade8]/40 bg-[#f8f4ef] p-4 text-sm space-y-1">
              <p className="font-semibold text-[#3f2f85] mb-2">Rapport d'import</p>
              {[
                ["Lignes lues", importReport.lignesLues],
                ["Membres créés", importReport.elevesCrees],
                ["Membres mis à jour", importReport.elevesMisAJour],
                ["Liens parrain créés", importReport.tuteursCrees],
                ["Lignes ignorées", importReport.lignesIgnorees],
              ].map(([label, val]) => (
                <div key={label as string} className="flex justify-between">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-semibold text-[#3f2f85]">{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
