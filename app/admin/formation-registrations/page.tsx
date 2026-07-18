"use client"

import { useEffect, useState, useCallback } from "react"
import { Loader2, RefreshCw, GraduationCap } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface FormationRegistration {
  id: number
  fullName: string
  profession: string
  country: string
  whatsapp: string
  infoSource: string
  referrer: string
  participantType: string
  paymentMode: string
  paymentMethod: string
  paymentDate: string
  createdAt: string
}

const formatDate = (value: string) =>
  value ? new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—"

export default function FormationRegistrationsPage() {
  const [registrations, setRegistrations] = useState<FormationRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true)
    setError(null)
    try {
      const data = await apiClient.get<FormationRegistration[]>("/admin/formation-registrations")
      setRegistrations(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement")
    } finally {
      setLoading(false); setRefreshing(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="h-8 w-8 animate-spin text-[#3f2f85]" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-[#3f2f85]">
            <GraduationCap className="h-6 w-6" />
            Inscriptions à la formation
          </h1>
          <p className="text-sm text-slate-500">
            Conseillers Parentaux — 7ème promotion · {registrations.length} inscription{registrations.length > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-[#3f2f85]/30 px-4 py-2 text-sm font-semibold text-[#3f2f85] transition hover:bg-[#3f2f85] hover:text-white disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {!error && registrations.length === 0 && (
        <div className="rounded-xl bg-white p-12 text-center text-slate-500 shadow-sm">
          Aucune inscription pour le moment.
        </div>
      )}

      {registrations.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#a3ade8]/30 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Nom &amp; Prénom</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">Pays</th>
                <th className="px-4 py-3">Profession</th>
                <th className="px-4 py-3">Qualité</th>
                <th className="px-4 py-3">Paiement</th>
                <th className="px-4 py-3">Moyen</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Référent</th>
                <th className="px-4 py-3">Soumis le</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map(r => (
                <tr key={r.id} className="border-b border-slate-100 last:border-0 hover:bg-[#f8f4ef]">
                  <td className="px-4 py-3 font-semibold text-slate-900">{r.fullName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.whatsapp}</td>
                  <td className="px-4 py-3">{r.country}</td>
                  <td className="px-4 py-3">{r.profession}</td>
                  <td className="px-4 py-3">
                    <span
                      title={r.participantType}
                      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                        r.participantType.startsWith("Membre")
                          ? "bg-[#e8b41f]/20 text-[#b88a00]"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {r.participantType.startsWith("Membre") ? "Membre" : "Non membre"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {r.paymentMode === "une seule fois" ? "Une fois" : "Deux tranches"}
                    <span className="block text-xs text-slate-400">{formatDate(r.paymentDate)}</span>
                  </td>
                  <td className="max-w-[180px] truncate px-4 py-3" title={r.paymentMethod}>
                    {r.paymentMethod.split(":")[0].trim()}
                  </td>
                  <td className="max-w-[150px] truncate px-4 py-3" title={r.infoSource}>{r.infoSource}</td>
                  <td className="max-w-[180px] truncate px-4 py-3" title={r.referrer}>{r.referrer}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500">{formatDate(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
