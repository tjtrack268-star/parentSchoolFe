"use client"

import { useEffect, useState, useCallback } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts"
import { Users, UserCheck, GitBranch, Globe, Loader2, RefreshCw } from "lucide-react"
import { apiClient } from "@/lib/api-client"

// ── Couleurs grade ────────────────────────────────────────────────────────────
const GRADE_COLORS: Record<string, string> = {
  "Aucun":         "#e5e7eb",
  "Leader":        "hsl(140, 70%, 50%)",
  "Leader Senior": "hsl(200, 80%, 50%)",
  "Coordinateur":  "hsl(220, 90%, 50%)",
  "Mentor":        "hsl(270, 80%, 50%)",
  "Directeur":     "hsl(45,  95%, 50%)",
}

const MEMBER_TYPE: Record<string, { label: string; cls: string }> = {
  ORDINARY:   { label: "Ordinaire",   cls: "bg-blue-100 text-blue-700"          },
  HONORARY:   { label: "Honneur",     cls: "bg-[#e8b41f]/20 text-[#b88a00]"    },
  BENEFACTOR: { label: "Bienfaiteur", cls: "bg-green-100 text-green-700"        },
}

const MEDALS = ["🥇", "🥈", "🥉"]

// ── Types ─────────────────────────────────────────────────────────────────────
interface KPI {
  totalMembers:    number
  activeSponsors:  number
  hierarchyLevels: number
  countriesCount:  number
}

interface GradeStat   { grade: string; count: number }
interface TopSponsor  { rank: number; firstName: string; lastName: string; sponsorshipCode: string; gradeName: string; sponsoreesCount: number }
interface RecentMember{ firstName: string; lastName: string; sponsorshipCode: string; userType: string; gradeName: string; createdAt: string }

interface AdminStats {
  kpi:           KPI
  gradeStats:    GradeStat[]
  topSponsors:   TopSponsor[]
  recentMembers: RecentMember[]
}

function GradeTooltip({ active, payload }: { active?: boolean; payload?: { value: number; name: string }[] }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="rounded-lg bg-white border border-[#a3ade8]/40 px-3 py-2 shadow-md text-sm">
      <span className="font-semibold text-[#3f2f85]">{name}</span>
      <span className="text-slate-500"> : {value} membre{value > 1 ? "s" : ""}</span>
    </div>
  )
}

export default function AdminDashboardPage() {
  const [stats,      setStats]      = useState<AdminStats | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [lastSync,   setLastSync]   = useState<Date | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchStats = useCallback(async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true)
    setError(null)
    try {
      const data = await apiClient.get<AdminStats>("/admin/stats")
      setStats(data)
      setLastSync(new Date())
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement")
    } finally {
      setLoading(false); setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchStats() }, [fetchStats])
  useEffect(() => {
    const t = setInterval(() => fetchStats(true), 60_000)
    return () => clearInterval(t)
  }, [fetchStats])

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-[#3f2f85]" />
    </div>
  )
  if (error) return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-semibold text-red-600">Erreur : {error}</p>
      <button onClick={() => fetchStats()}
        className="mt-3 rounded-lg bg-[#3f2f85] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
        Réessayer
      </button>
    </div>
  )
  if (!stats) return null

  const { kpi, gradeStats, topSponsors, recentMembers } = stats
  const chartData = gradeStats.filter(g => g.grade !== "Aucun" && g.count > 0).map(g => ({ name: g.grade, Membres: g.count }))

  const kpiCards = [
    { icon: Users,     value: kpi.totalMembers,    label: "Total membres",         color: "#3f2f85" },
    { icon: UserCheck, value: kpi.activeSponsors,  label: "Parrains actifs",       color: "#22c55e" },
    { icon: GitBranch, value: kpi.hierarchyLevels, label: "Niveaux hiérarchiques", color: "#f97316" },
    { icon: Globe,     value: kpi.countriesCount,  label: "Pays représentés",      color: "#3b82f6" },
  ]

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3f2f85]">Dashboard Administrateur</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {lastSync && <>Dernière mise à jour : {lastSync.toLocaleTimeString("fr-FR")}</>}
          </p>
        </div>
        <button onClick={() => fetchStats(true)} disabled={refreshing}
          className="flex items-center gap-2 rounded-lg border-2 border-[#3f2f85] px-4 py-2 text-sm font-semibold text-[#3f2f85] transition hover:bg-[#3f2f85] hover:text-white disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Actualiser
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpiCards.map(({ icon: Icon, value, label, color }) => (
          <div key={label} className="rounded-xl bg-white border border-[#a3ade8]/30 p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}18` }}>
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ color }}>{value.toLocaleString("fr-FR")}</p>
          </div>
        ))}
      </div>

      {/* Graphique + Top 5 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="rounded-xl bg-white border border-[#a3ade8]/30 p-5 shadow-sm lg:col-span-3">
          <h2 className="mb-4 font-bold text-[#3f2f85]">Répartition par grade</h2>
          {chartData.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">Aucune donnée</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
                <Tooltip content={<GradeTooltip />} />
                <Bar dataKey="Membres" radius={[6, 6, 0, 0]}>
                  {chartData.map(entry => (
                    <Cell key={entry.name} fill={GRADE_COLORS[entry.name] ?? "#a3ade8"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-xl bg-white border border-[#a3ade8]/30 p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-4 font-bold text-[#3f2f85]">Top 5 parrains actifs</h2>
          {topSponsors.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">Aucune donnée</p>
          ) : (
            <div className="space-y-2">
              {topSponsors.slice(0, 5).map((s, i) => {
                const gc = GRADE_COLORS[s.gradeName] ?? "#a3ade8"
                return (
                  <div key={s.sponsorshipCode} className="flex items-center gap-3 rounded-lg bg-[#f8f4ef] px-3 py-2.5">
                    <span className="w-6 text-center text-base shrink-0">
                      {i < 3 ? MEDALS[i] : <span className="text-xs font-bold text-slate-400">{i + 1}</span>}
                    </span>
                    <div className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: gc }}>
                      {s.firstName.charAt(0)}{s.lastName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#3f2f85] truncate">{s.firstName} {s.lastName}</p>
                      <p className="font-mono text-xs text-slate-400">{s.sponsorshipCode}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="rounded-full px-2 py-0.5 text-xs font-semibold"
                        style={{ backgroundColor: `${gc}20`, color: gc }}>{s.gradeName || "Aucun"}</span>
                      <p className="mt-0.5 text-xs text-slate-400">{s.sponsoreesCount} filleuls</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Dernières inscriptions */}
      <div className="rounded-xl bg-white border border-[#a3ade8]/30 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-bold text-[#3f2f85]">Dernières inscriptions</h2>
          <p className="text-xs text-slate-400">5 derniers membres inscrits</p>
        </div>
        {recentMembers.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">Aucune inscription récente</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f8f4ef] text-xs font-semibold uppercase text-slate-500">
                <tr>
                  {["Nom", "Code", "Type", "Grade", "Date"].map(h => (
                    <th key={h} className="px-5 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentMembers
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map((m, i) => {
                    const gc   = GRADE_COLORS[m.gradeName] ?? "#e5e7eb"
                    const type = MEMBER_TYPE[m.userType] ?? { label: m.userType, cls: "bg-slate-100 text-slate-600" }
                    return (
                      <tr key={i} className="hover:bg-[#f8f4ef]/60">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-white text-xs font-bold"
                              style={{ backgroundColor: gc }}>
                              {m.firstName.charAt(0)}{m.lastName.charAt(0)}
                            </div>
                            <span className="font-medium text-[#3f2f85]">{m.firstName} {m.lastName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 font-mono text-xs text-slate-500">{m.sponsorshipCode}</td>
                        <td className="px-5 py-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${type.cls}`}>{type.label}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                            style={{ backgroundColor: `${gc}20`, color: gc }}>{m.gradeName || "Aucun"}</span>
                        </td>
                        <td className="px-5 py-3 text-slate-500">
                          {new Date(m.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
