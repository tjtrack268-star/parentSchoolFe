"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronDown, ChevronUp, Loader2, Save, X, AlertTriangle, CheckCircle2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"

// ── Types ─────────────────────────────────────────────────────────────────────
interface GradeRow {
  name:           string
  minSponsors:    number
  maxSponsors:    number
  minPoints:      number
  maxPoints:      number
  currentMembers: number
  totalMembers:   number
  color:          string
}

interface GradeThreshold {
  name:        string
  minSponsors: number
  maxSponsors: number
  minPoints:   number
  maxPoints:   number
}

interface HistoryEntry {
  id:        number
  date:      string
  adminName: string
  changes:   { grade: string; field: string; oldValue: number; newValue: number }[]
}

// ── Couleurs ──────────────────────────────────────────────────────────────────
const GRADE_META: Record<string, { color: string; bg: string }> = {
  "Leader":        { color: "#22c55e", bg: "#dcfce7" },
  "Leader Senior": { color: "#3b82f6", bg: "#dbeafe" },
  "Coordinateur":  { color: "#f97316", bg: "#ffedd5" },
  "Mentor":        { color: "#a855f7", bg: "#f3e8ff" },
  "Directeur":     { color: "#e8b41f", bg: "#fef9c3" },
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function GradesPage() {
  const [rows,     setRows]     = useState<GradeRow[]>([])
  const [history,  setHistory]  = useState<HistoryEntry[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  // Formulaire
  const [thresholds, setThresholds] = useState<GradeThreshold[]>([])
  const [isDirty,    setIsDirty]    = useState(false)
  const [validErrors,setValidErrors]= useState<Record<string, string>>({})

  // Modal + résultat
  const [modal,     setModal]     = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [changed,   setChanged]   = useState<number | null>(null)

  // Accordéon historique
  const [histOpen, setHistOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const [gradeData, hist] = await Promise.all([
        apiClient.get<GradeRow[]>("/admin/grades/stats"),
        apiClient.get<HistoryEntry[]>("/admin/grades/history"),
      ])
      setRows(gradeData)
      setHistory(Array.isArray(hist) ? hist : [])
      setThresholds(gradeData.map(g => ({
        name:        g.name,
        minSponsors: g.minSponsors,
        maxSponsors: g.maxSponsors,
        minPoints:   g.minPoints,
        maxPoints:   g.maxPoints,
      })))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // Validation : seuils doivent être croissants entre grades
  const validate = useCallback((t: GradeThreshold[]): Record<string, string> => {
    const errs: Record<string, string> = {}
    for (let i = 0; i < t.length; i++) {
      const cur = t[i]
      if (cur.minSponsors > cur.maxSponsors) errs[`${cur.name}_sponsors`] = "Min > Max"
      if (cur.minPoints   > cur.maxPoints  ) errs[`${cur.name}_points`]   = "Min > Max"
      if (i > 0) {
        const prev = t[i - 1]
        if (cur.minSponsors < prev.maxSponsors) errs[`${cur.name}_sponsors`] = "Non croissant vs grade précédent"
        if (cur.minPoints   < prev.maxPoints  ) errs[`${cur.name}_points`]   = "Non croissant vs grade précédent"
      }
    }
    return errs
  }, [])

  const handleChange = (idx: number, field: keyof Omit<GradeThreshold, "name">, val: string) => {
    const num = parseInt(val) || 0
    const updated = thresholds.map((t, i) => i === idx ? { ...t, [field]: num } : t)
    setThresholds(updated)
    setIsDirty(true)
    setValidErrors(validate(updated))
  }

  const hasErrors = Object.keys(validErrors).length > 0

  const handleApply = async () => {
    setSaving(true); setSaveError(null)
    try {
      const res = await apiClient.put<{ membersChanged: number }>("/admin/grades/thresholds", { thresholds })
      setChanged(res.membersChanged)
      setModal(false)
      setIsDirty(false)
      await load()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Erreur")
    } finally { setSaving(false) }
  }

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-[#3f2f85]" />
    </div>
  )
  if (error) return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="text-red-600">{error}</p>
      <button onClick={load} className="mt-3 rounded-lg bg-[#3f2f85] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
        Réessayer
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#3f2f85]">Gestion des grades</h1>
        <p className="text-sm text-slate-400">Seuils et répartition des membres par grade</p>
      </div>

      {/* Résultat application */}
      {changed !== null && (
        <div className="flex items-center gap-3 rounded-xl border border-green-300 bg-green-50 px-5 py-3 text-green-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="text-sm font-semibold">
            {changed} membre{changed > 1 ? "s" : ""} {changed > 1 ? "ont" : "a"} changé de grade suite à la mise à jour.
          </p>
          <button onClick={() => setChanged(null)} className="ml-auto text-green-500 hover:text-green-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Tableau des grades actuels ── */}
      <div className="rounded-xl bg-white border border-[#a3ade8]/30 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-bold text-[#3f2f85]">Tableau des grades</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f8f4ef] text-xs font-semibold uppercase text-slate-500">
              <tr>
                {["Grade","Filleuls min","Filleuls max","Points min","Points max","Membres actuels","Progression"].map(h => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(row => {
                const meta    = GRADE_META[row.name] ?? { color: "#94a3b8", bg: "#f1f5f9" }
                const pct     = row.totalMembers > 0 ? Math.round((row.currentMembers / row.totalMembers) * 100) : 0
                return (
                  <tr key={row.name} className="hover:bg-[#f8f4ef]/50">
                    <td className="px-4 py-3">
                      <span className="rounded-full px-3 py-1 text-xs font-bold"
                        style={{ backgroundColor: meta.bg, color: meta.color }}>
                        {row.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[#3f2f85]">{row.minSponsors}</td>
                    <td className="px-4 py-3 font-mono text-[#3f2f85]">{row.maxSponsors}</td>
                    <td className="px-4 py-3 font-mono text-[#3f2f85]">{row.minPoints.toLocaleString("fr-FR")}</td>
                    <td className="px-4 py-3 font-mono text-[#3f2f85]">{row.maxPoints.toLocaleString("fr-FR")}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: meta.color }}>{row.currentMembers}</td>
                    <td className="px-4 py-3 w-40">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-2 rounded-full transition-all"
                            style={{ width: `${pct}%`, backgroundColor: meta.color }} />
                        </div>
                        <span className="text-xs text-slate-400 w-8 text-right">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Formulaire modification des seuils ── */}
      <div className="rounded-xl bg-white border border-[#a3ade8]/30 shadow-sm p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-bold text-[#3f2f85]">Modifier les seuils</h2>
          {isDirty && !hasErrors && (
            <button onClick={() => setModal(true)}
              className="flex items-center gap-2 rounded-lg bg-[#3f2f85] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition">
              <Save className="h-4 w-4" /> Appliquer les modifications
            </button>
          )}
        </div>

        <div className="space-y-4">
          {thresholds.map((t, i) => {
            const meta      = GRADE_META[t.name] ?? { color: "#94a3b8", bg: "#f1f5f9" }
            const spErrKey  = `${t.name}_sponsors`
            const ptErrKey  = `${t.name}_points`
            const spErr     = validErrors[spErrKey]
            const ptErr     = validErrors[ptErrKey]

            return (
              <div key={t.name} className={`rounded-lg border-2 p-4 transition
                ${spErr || ptErr ? "border-red-300 bg-red-50/40" : "border-[#a3ade8]/30"}`}>

                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full px-3 py-1 text-xs font-bold"
                    style={{ backgroundColor: meta.bg, color: meta.color }}>
                    {t.name}
                  </span>
                  {(spErr || ptErr) && (
                    <span className="flex items-center gap-1 text-xs text-red-600">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {spErr || ptErr}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {([
                    { label: "Filleuls min", field: "minSponsors" as const },
                    { label: "Filleuls max", field: "maxSponsors" as const },
                    { label: "Points min",   field: "minPoints"   as const },
                    { label: "Points max",   field: "maxPoints"   as const },
                  ] as const).map(({ label, field }) => {
                    const errKey = field.includes("onsor") ? spErrKey : ptErrKey
                    const hasErr = !!validErrors[errKey]
                    return (
                      <div key={field}>
                        <label className="mb-1 block text-xs font-semibold text-slate-500">{label}</label>
                        <input
                          type="number" min={0}
                          value={t[field]}
                          onChange={e => handleChange(i, field, e.target.value)}
                          className={`w-full rounded-lg border px-3 py-2 text-sm font-mono focus:outline-none
                            ${hasErr
                              ? "border-red-400 bg-red-50 focus:border-red-500"
                              : "border-[#a3ade8]/40 bg-[#f8f4ef] focus:border-[#3f2f85]"}`}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {hasErrors && (
          <p className="mt-3 flex items-center gap-2 text-xs text-red-600">
            <AlertTriangle className="h-3.5 w-3.5" />
            Corrigez les erreurs avant d'appliquer les modifications
          </p>
        )}
      </div>

      {/* ── Historique (accordéon) ── */}
      <div className="rounded-xl bg-white border border-[#a3ade8]/30 shadow-sm overflow-hidden">
        <button onClick={() => setHistOpen(v => !v)}
          className="flex w-full items-center justify-between px-6 py-4 hover:bg-[#f8f4ef]/50 transition">
          <h2 className="font-bold text-[#3f2f85]">Historique des modifications</h2>
          {histOpen
            ? <ChevronUp className="h-5 w-5 text-[#3f2f85]" />
            : <ChevronDown className="h-5 w-5 text-[#3f2f85]" />}
        </button>

        {histOpen && (
          <div className="border-t border-slate-100 divide-y divide-slate-100">
            {history.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-slate-400">Aucune modification enregistrée</p>
            ) : history.map(h => (
              <div key={h.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#3f2f85]">{h.adminName}</span>
                  <span className="text-xs text-slate-400">
                    {new Date(h.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="space-y-1">
                  {h.changes.map((c, ci) => (
                    <div key={ci} className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="font-semibold text-[#3f2f85]">{c.grade}</span>
                      <span className="text-slate-400">·</span>
                      <span>{c.field}</span>
                      <span className="text-red-400 line-through">{c.oldValue}</span>
                      <span className="text-slate-400">→</span>
                      <span className="text-green-600 font-semibold">{c.newValue}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal confirmation ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-bold text-[#3f2f85]">Confirmer la modification</h3>
              <button onClick={() => { setModal(false); setSaveError(null) }}
                className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
                <p className="text-sm text-amber-700">
                  Cette action va recalculer les grades de tous les membres selon les nouveaux seuils. Des membres peuvent changer de grade.
                </p>
              </div>
              {saveError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{saveError}</div>
              )}
            </div>
            <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
              <button onClick={handleApply} disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#3f2f85] py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50">
                {saving
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Application…</>
                  : <><Save className="h-4 w-4" /> Confirmer</>}
              </button>
              <button onClick={() => { setModal(false); setSaveError(null) }} disabled={saving}
                className="rounded-lg border-2 border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
