"use client"

import { useEffect, useState, useCallback } from "react"
import { Loader2, RefreshCw, MessageSquareQuote, Check, X, Trash2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface Testimonial {
  id: number
  content: string
  authorName: string
  authorCity: string
  authorRole: string
  rating: number
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
}

const STATUS_META: Record<Testimonial["status"], { label: string; cls: string }> = {
  PENDING: { label: "En attente", cls: "bg-[#e8b41f]/20 text-[#b88a00]" },
  APPROVED: { label: "Approuvé", cls: "bg-green-100 text-green-700" },
  REJECTED: { label: "Rejeté", cls: "bg-red-100 text-red-600" },
}

const FILTERS: { key: "ALL" | Testimonial["status"]; label: string }[] = [
  { key: "PENDING", label: "En attente" },
  { key: "APPROVED", label: "Approuvés" },
  { key: "REJECTED", label: "Rejetés" },
  { key: "ALL", label: "Tous" },
]

const formatDate = (value: string) =>
  value ? new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—"

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"ALL" | Testimonial["status"]>("PENDING")
  const [pendingId, setPendingId] = useState<number | null>(null)

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true)
    setError(null)
    try {
      const data = await apiClient.get<Testimonial[]>("/admin/testimonials")
      setTestimonials(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement")
    } finally {
      setLoading(false); setRefreshing(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const act = async (id: number, action: "approve" | "reject" | "delete") => {
    setPendingId(id)
    try {
      if (action === "delete") await apiClient.delete(`/admin/testimonials/${id}`)
      else await apiClient.put(`/admin/testimonials/${id}/${action}`, {})
      await load(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action impossible")
    } finally {
      setPendingId(null)
    }
  }

  const counts = {
    PENDING: testimonials.filter(t => t.status === "PENDING").length,
    APPROVED: testimonials.filter(t => t.status === "APPROVED").length,
    REJECTED: testimonials.filter(t => t.status === "REJECTED").length,
  }
  const visible = filter === "ALL" ? testimonials : testimonials.filter(t => t.status === filter)

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
            <MessageSquareQuote className="h-6 w-6" />
            Témoignages
          </h1>
          <p className="text-sm text-slate-500">
            {counts.PENDING} en attente · {counts.APPROVED} approuvés · {counts.REJECTED} rejetés
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

      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === f.key ? "bg-[#3f2f85] text-white" : "bg-white text-slate-600 hover:bg-[#a3ade8]/20"
            }`}
          >
            {f.label}
            {f.key !== "ALL" && ` (${counts[f.key]})`}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {visible.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center text-slate-500 shadow-sm">
          Aucun témoignage dans cette catégorie.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visible.map(t => (
            <article key={t.id} className="flex flex-col rounded-xl border-l-4 border-[#e8b41f] bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#3f2f85]">{t.authorName}</p>
                  <p className="text-xs text-slate-500">
                    {t.authorRole}{t.authorCity ? ` · ${t.authorCity}` : ""} · {formatDate(t.createdAt)}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_META[t.status].cls}`}>
                  {STATUS_META[t.status].label}
                </span>
              </div>
              <div className="mb-3 flex gap-0.5 text-[#e8b41f]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < t.rating ? "text-[#e8b41f]" : "text-slate-300"}>★</span>
                ))}
              </div>
              <p className="flex-1 text-sm italic leading-relaxed text-slate-700">"{t.content}"</p>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                {t.status !== "APPROVED" && (
                  <button
                    onClick={() => act(t.id, "approve")}
                    disabled={pendingId === t.id}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                  >
                    <Check className="h-4 w-4" /> Approuver
                  </button>
                )}
                {t.status !== "REJECTED" && (
                  <button
                    onClick={() => act(t.id, "reject")}
                    disabled={pendingId === t.id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    <X className="h-4 w-4" /> Rejeter
                  </button>
                )}
                <button
                  onClick={() => act(t.id, "delete")}
                  disabled={pendingId === t.id}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-400 transition hover:text-red-600 disabled:opacity-60"
                >
                  <Trash2 className="h-4 w-4" /> Supprimer
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
