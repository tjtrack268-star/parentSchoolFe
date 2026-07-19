"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import Link from "next/link"
import { Search, X, ChevronUp, ChevronDown, ChevronsUpDown, Eye, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { GRADE_COLORS, COUNTRIES } from "@/lib/constants"

// ── Types ─────────────────────────────────────────────────────────────────────
interface Member {
  id:                      number
  firstName:               string
  lastName:                string
  sponsorshipCode:         string
  country:                 string
  gradeName:               string
  userType:                string
  totalPoints:             number
  directSponsorshipsCount: number
  createdAt:               string
  sponsor?: { firstName: string; lastName: string }
}

interface PagedResponse {
  content:       Member[]
  totalElements: number
  totalPages:    number
  number:        number
}

type SortField = "gradeName" | "directSponsorshipsCount" | "totalPoints" | "createdAt"
type SortDir   = "asc" | "desc"

// ── Constantes ────────────────────────────────────────────────────────────────
const GRADE_OPTIONS  = ["Tous", "Aucun", "Leader", "Leader Senior", "Coordinateur", "Mentor", "Directeur"]
const GRADE_VALUE: Record<string, string> = {
  "Aucun": "MEMBER", "Leader": "LEADER", "Leader Senior": "LEADER_SENIOR",
  "Coordinateur": "COORDINATOR", "Mentor": "MENTOR", "Directeur": "DIRECTOR",
}
const TYPE_OPTIONS   = [
  { value: "",           label: "Tous"       },
  { value: "ORDINARY",   label: "Ordinaire"  },
  { value: "HONORARY",   label: "D'honneur"  },
  { value: "BENEFACTOR", label: "Bienfaiteur"},
]
const PAGE_SIZES     = [10, 20, 50]

const TYPE_BADGE: Record<string, string> = {
  ORDINARY:   "bg-blue-100 text-blue-700",
  HONORARY:   "bg-[#e8b41f]/20 text-[#b88a00]",
  BENEFACTOR: "bg-green-100 text-green-700",
}
const TYPE_LABEL: Record<string, string> = {
  ORDINARY: "Ordinaire", HONORARY: "D'honneur", BENEFACTOR: "Bienfaiteur",
}

// ── Icône de tri ──────────────────────────────────────────────────────────────
function SortIcon({ field, current, dir }: { field: string; current: string; dir: SortDir }) {
  if (field !== current) return <ChevronsUpDown className="h-3.5 w-3.5 text-slate-300" />
  return dir === "asc"
    ? <ChevronUp   className="h-3.5 w-3.5 text-[#3f2f85]" />
    : <ChevronDown className="h-3.5 w-3.5 text-[#3f2f85]" />
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MembersPage() {
  const [members,   setMembers]   = useState<Member[]>([])
  const [total,     setTotal]     = useState(0)
  const [totalPages,setTotalPages]= useState(1)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  // Filtres
  const [search,    setSearch]    = useState("")
  const [grade,     setGrade]     = useState("Tous")
  const [type,      setType]      = useState("")
  const [country,   setCountry]   = useState("")
  const [page,      setPage]      = useState(0)
  const [pageSize,  setPageSize]  = useState(10)
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortDir,   setSortDir]   = useState<SortDir>("desc")

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchMembers = useCallback(async (q: string) => {
    setLoading(true); setError(null)
    try {
      const params = new URLSearchParams({
        page:  String(page),
        size:  String(pageSize),
        sort:  `${sortField},${sortDir}`,
      })
      if (q.trim())           params.set("search",  q.trim())
      if (grade !== "Tous")   params.set("grade",   GRADE_VALUE[grade] ?? grade)
      if (type)               params.set("userType",type)
      if (country)            params.set("country", country)

      const data = await apiClient.get<PagedResponse | Member[]>(`/admin/members?${params}`)

      // Supporte réponse paginée {content, totalElements} ou tableau simple
      if (Array.isArray(data)) {
        setMembers(data)
        setTotal(data.length)
        setTotalPages(1)
      } else {
        setMembers(data.content)
        setTotal(data.totalElements)
        setTotalPages(data.totalPages)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, sortField, sortDir, grade, type, country])

  // Debounce search 400ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchMembers(search), 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [search, fetchMembers])

  // Reset page quand filtres changent
  useEffect(() => { setPage(0) }, [grade, type, country, pageSize, sortField, sortDir])

  const resetFilters = () => {
    setSearch(""); setGrade("Tous"); setType(""); setCountry(""); setPage(0)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortField(field); setSortDir("asc") }
  }

  const hasFilters = search || grade !== "Tous" || type || country

  // ── Rendu ─────────────────────────────────────────────────────────────────
  const selectCls = "rounded-lg border border-[#a3ade8]/40 bg-[#f8f4ef] px-3 py-2 text-sm focus:border-[#3f2f85] focus:outline-none"

  return (
    <div className="space-y-5">

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3f2f85]">Membres</h1>
          <p className="text-sm text-slate-400">
            {loading ? "Chargement…" : `${total.toLocaleString("fr-FR")} membre${total > 1 ? "s" : ""} trouvé${total > 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par nom, email, code…"
          className="w-full rounded-lg border border-[#a3ade8]/40 bg-white py-2.5 pl-10 pr-10 text-sm focus:border-[#3f2f85] focus:outline-none shadow-sm"
        />
        {search && (
          <button onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Grade */}
        <select value={grade} onChange={e => setGrade(e.target.value)} className={selectCls}>
          {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g === "Tous" ? "Tous les grades" : g}</option>)}
        </select>

        {/* Type */}
        <select value={type} onChange={e => setType(e.target.value)} className={selectCls}>
          {TYPE_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.value ? t.label : "Tous les types"}</option>)}
        </select>

        {/* Pays */}
        <select value={country} onChange={e => setCountry(e.target.value)} className={selectCls}>
          <option value="">Tous les pays</option>
          {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>

        {/* Reset */}
        {hasFilters && (
          <button onClick={resetFilters}
            className="flex items-center gap-1.5 rounded-lg border-2 border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition">
            <X className="h-3.5 w-3.5" /> Réinitialiser
          </button>
        )}

        {/* Taille de page */}
        <div className="ml-auto flex items-center gap-2 text-sm text-slate-500">
          <span>Afficher</span>
          <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} className={selectCls}>
            {PAGE_SIZES.map(s => <option key={s} value={s}>{s} / page</option>)}
          </select>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Tableau */}
      <div className="rounded-xl bg-white border border-[#a3ade8]/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f8f4ef] text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left w-8">N°</th>
                <th className="px-4 py-3 text-left">Nom Prénom</th>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Pays</th>
                <th className="px-4 py-3 text-left">Parrain</th>
                <th className="px-4 py-3 text-left cursor-pointer select-none hover:text-[#3f2f85]"
                  onClick={() => handleSort("gradeName")}>
                  <div className="flex items-center gap-1">
                    Grade <SortIcon field="gradeName" current={sortField} dir={sortDir} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left cursor-pointer select-none hover:text-[#3f2f85]"
                  onClick={() => handleSort("directSponsorshipsCount")}>
                  <div className="flex items-center gap-1">
                    Filleuls <SortIcon field="directSponsorshipsCount" current={sortField} dir={sortDir} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left cursor-pointer select-none hover:text-[#3f2f85]"
                  onClick={() => handleSort("totalPoints")}>
                  <div className="flex items-center gap-1">
                    Points <SortIcon field="totalPoints" current={sortField} dir={sortDir} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left cursor-pointer select-none hover:text-[#3f2f85]"
                  onClick={() => handleSort("createdAt")}>
                  <div className="flex items-center gap-1">
                    Date <SortIcon field="createdAt" current={sortField} dir={sortDir} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={11} className="py-16 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#3f2f85]" />
                </td></tr>
              ) : members.length === 0 ? (
                <tr><td colSpan={11} className="py-16 text-center text-slate-400 text-sm">
                  Aucun membre trouvé
                </td></tr>
              ) : members.map((m, i) => {
                const gc = GRADE_COLORS[m.gradeName as keyof typeof GRADE_COLORS] ?? "#e5e7eb"
                const typeBadge = TYPE_BADGE[m.userType] ?? "bg-slate-100 text-slate-600"
                const typeLabel = TYPE_LABEL[m.userType] ?? m.userType
                const countryName = COUNTRIES.find(c => c.code === m.country)?.name ?? m.country

                return (
                  <tr key={m.id} className="hover:bg-[#f8f4ef]/50 transition">
                    <td className="px-4 py-3 text-slate-400 text-xs">{page * pageSize + i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: gc }}>
                          {m.firstName.charAt(0)}{m.lastName.charAt(0)}
                        </div>
                        <span className="font-medium text-[#3f2f85]">{m.firstName} {m.lastName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{m.sponsorshipCode}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{countryName}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {m.sponsor ? `${m.sponsor.firstName} ${m.sponsor.lastName}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        style={{ backgroundColor: `${gc}20`, color: gc }}>
                        {m.gradeName || "Aucun"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#3f2f85]">{m.directSponsorshipsCount}</td>
                    <td className="px-4 py-3 font-semibold text-[#e8b41f]">{m.totalPoints}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeBadge}`}>
                        {typeLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {new Date(m.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/members/${m.id}`}
                        className="flex items-center gap-1.5 rounded-lg border border-[#3f2f85] px-3 py-1.5 text-xs font-semibold text-[#3f2f85] hover:bg-[#3f2f85] hover:text-white transition">
                        <Eye className="h-3.5 w-3.5" /> Voir
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
            <p className="text-xs text-slate-400">
              Page {page + 1} / {totalPages} — {total} résultats
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="rounded-lg border border-[#a3ade8]/40 px-3 py-1.5 text-xs font-semibold text-[#3f2f85] hover:bg-[#f8f4ef] disabled:opacity-40 disabled:cursor-not-allowed">
                ← Précédent
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(0, Math.min(page - 2, totalPages - 5))
                const p = start + i
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      p === page
                        ? "bg-[#3f2f85] text-white"
                        : "border border-[#a3ade8]/40 text-[#3f2f85] hover:bg-[#f8f4ef]"}`}>
                    {p + 1}
                  </button>
                )
              })}

              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                className="rounded-lg border border-[#a3ade8]/40 px-3 py-1.5 text-xs font-semibold text-[#3f2f85] hover:bg-[#f8f4ef] disabled:opacity-40 disabled:cursor-not-allowed">
                Suivant →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
