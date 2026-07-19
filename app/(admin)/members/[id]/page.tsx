"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil, Save, X, Loader2, ShieldCheck, ShieldX, AlertTriangle } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { GRADE_COLORS, COUNTRIES } from "@/lib/constants"

// ── Types ─────────────────────────────────────────────────────────────────────
interface MemberDetail {
  id:                      number
  firstName:               string
  lastName:                string
  email:                   string
  phone:                   string
  country:                 string
  profession?:             string
  userType:                string
  userRole:                string
  sponsorshipCode:         string
  totalPoints:             number
  directSponsorshipsCount: number
  createdAt:               string
  isFounder?:              boolean
  gradeName:               string
  sponsor?: { firstName: string; lastName: string; sponsorshipCode: string }
}

interface Sponsoree {
  id:              number
  firstName:       string
  lastName:        string
  sponsorshipCode: string
  gradeName:       string
  totalPoints:     number
  createdAt:       string
}

const TYPE_LABEL: Record<string, string> = {
  ORDINARY: "Ordinaire", HONORARY: "D'honneur", BENEFACTOR: "Bienfaiteur",
}
const TYPE_BADGE: Record<string, string> = {
  ORDINARY:   "bg-blue-100 text-blue-700",
  HONORARY:   "bg-[#e8b41f]/20 text-[#b88a00]",
  BENEFACTOR: "bg-green-100 text-green-700",
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MemberDetailPage() {
  const { id }  = useParams<{ id: string }>()
  const router  = useRouter()

  const [member,     setMember]     = useState<MemberDetail | null>(null)
  const [sponsorees, setSponsorees] = useState<Sponsoree[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)

  // Edition
  const [editing,  setEditing]  = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [saveErr,  setSaveErr]  = useState<string | null>(null)
  const [form,     setForm]     = useState({ firstName: "", lastName: "", phone: "", profession: "" })

  // Modal rôle
  const [roleModal,   setRoleModal]   = useState(false)
  const [roleLoading, setRoleLoading] = useState(false)
  const [roleError,   setRoleError]   = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const [m, sps] = await Promise.all([
        apiClient.get<MemberDetail>(`/admin/members/${id}`),
        apiClient.get<Sponsoree[]>(`/admin/members/${id}/sponsorees`),
      ])
      setMember(m)
      setSponsorees(Array.isArray(sps) ? sps : [])
      setForm({ firstName: m.firstName, lastName: m.lastName, phone: m.phone || "", profession: m.profession || "" })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    if (!member) return
    setSaving(true); setSaveErr(null)
    try {
      const updated = await apiClient.put<MemberDetail>(`/admin/members/${id}`, form)
      setMember(updated); setEditing(false)
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : "Erreur")
    } finally { setSaving(false) }
  }

  const handleRoleChange = async () => {
    if (!member) return
    setRoleLoading(true); setRoleError(null)
    const newRole = member.userRole === "ADMIN" ? "MEMBER" : "ADMIN"
    try {
      await apiClient.put(`/admin/members/${id}/role`, { role: newRole })
      setMember(m => m ? { ...m, userRole: newRole } : m)
      setRoleModal(false)
    } catch (e) {
      setRoleError(e instanceof Error ? e.message : "Erreur")
    } finally { setRoleLoading(false) }
  }

  // ── États ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-[#3f2f85]" />
    </div>
  )
  if (error) return (
    <div className="space-y-4">
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
      <Link href="/admin/members" className="flex items-center gap-2 text-sm text-[#3f2f85] hover:underline">
        <ArrowLeft className="h-4 w-4" /> Retour à la liste
      </Link>
    </div>
  )
  if (!member) return null

  const gc          = GRADE_COLORS[member.gradeName as keyof typeof GRADE_COLORS] ?? "#e5e7eb"
  const initials    = `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase()
  const countryName = COUNTRIES.find(c => c.code === member.country)?.name ?? member.country
  const isAdmin     = member.userRole === "ADMIN"
  const isFounder   = !!member.isFounder

  return (
    <div className="space-y-6">

      {/* Nav */}
      <div className="flex items-center gap-3">
        <Link href="/admin/members"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#3f2f85] transition">
          <ArrowLeft className="h-4 w-4" /> Membres
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm font-semibold text-[#3f2f85]">{member.firstName} {member.lastName}</span>
      </div>

      {/* Profil header */}
      <div className="rounded-xl bg-[#3f2f85] p-6 text-white">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 shrink-0 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ backgroundColor: gc, color: "#fff" }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{member.firstName} {member.lastName}</h1>
              {isAdmin && (
                <span className="rounded-full bg-[#e8b41f] px-2.5 py-0.5 text-xs font-bold text-[#3f2f85]">ADMIN</span>
              )}
              {isFounder && (
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">👑 Fondateur</span>
              )}
            </div>
            <p className="font-mono text-sm text-[#e8b41f] mt-1">{member.sponsorshipCode}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#a3ade8]">
              <span>{countryName}</span>
              <span>·</span>
              <span>{TYPE_LABEL[member.userType] ?? member.userType}</span>
              <span>·</span>
              <span>Inscrit le {new Date(member.createdAt).toLocaleDateString("fr-FR")}</span>
            </div>
          </div>
          {/* Stats rapides */}
          <div className="hidden sm:grid grid-cols-2 gap-4 text-center shrink-0">
            <div>
              <p className="text-2xl font-bold text-[#e8b41f]">{member.directSponsorshipsCount}</p>
              <p className="text-xs text-[#a3ade8]">Filleuls</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#e8b41f]">{member.totalPoints}</p>
              <p className="text-xs text-[#a3ade8]">Points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Infos + édition */}
      <div className="rounded-xl bg-white border border-[#a3ade8]/30 shadow-sm p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-bold text-[#3f2f85]">Informations personnelles</h2>
          {!editing ? (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-2 rounded-lg border-2 border-[#3f2f85] px-3 py-1.5 text-sm font-semibold text-[#3f2f85] hover:bg-[#3f2f85] hover:text-white transition">
              <Pencil className="h-3.5 w-3.5" /> Modifier
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[#3f2f85] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {saving ? "…" : "Enregistrer"}
              </button>
              <button onClick={() => { setEditing(false); setSaveErr(null) }}
                className="flex items-center gap-2 rounded-lg border-2 border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition">
                <X className="h-3.5 w-3.5" /> Annuler
              </button>
            </div>
          )}
        </div>

        {saveErr && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{saveErr}</div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Champs éditables */}
          {editing ? (
            <>
              {[
                { label: "Prénom",     key: "firstName"  },
                { label: "Nom",        key: "lastName"   },
                { label: "Téléphone",  key: "phone"      },
                { label: "Profession", key: "profession" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="mb-1 block text-xs font-semibold text-[#3f2f85]">{label}</label>
                  <input
                    value={(form as Record<string, string>)[key] || ""}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    disabled={saving}
                    className="w-full rounded-lg border border-[#a3ade8]/40 bg-[#f8f4ef] px-4 py-2.5 text-sm focus:border-[#3f2f85] focus:outline-none disabled:opacity-50"
                  />
                </div>
              ))}
              {/* Champs grisés */}
              {[
                { label: "Email",       value: member.email },
                { label: "Code membre", value: member.sponsorshipCode },
                { label: "Pays",        value: countryName },
                { label: "Parrain",     value: member.sponsor ? `${member.sponsor.firstName} ${member.sponsor.lastName}` : "Aucun" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <label className="mb-1 block text-xs font-semibold text-slate-400">{label}</label>
                  <input value={value} disabled
                    className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed" />
                </div>
              ))}
            </>
          ) : (
            <>
              {[
                { label: "Prénom",      value: member.firstName },
                { label: "Nom",         value: member.lastName },
                { label: "Email",       value: member.email },
                { label: "Téléphone",   value: member.phone || "—" },
                { label: "Pays",        value: countryName },
                { label: "Profession",  value: member.profession || "—" },
                { label: "Type",        value: TYPE_LABEL[member.userType] ?? member.userType },
                { label: "Grade",       value: member.gradeName || "Aucun" },
                { label: "Parrain",     value: member.sponsor ? `${member.sponsor.firstName} ${member.sponsor.lastName} (${member.sponsor.sponsorshipCode})` : "Aucun" },
                { label: "Code membre", value: member.sponsorshipCode },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg bg-[#f8f4ef] p-3">
                  <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-[#3f2f85]">{value}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Filleuls directs */}
      <div className="rounded-xl bg-white border border-[#a3ade8]/30 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-bold text-[#3f2f85]">Ses filleuls directs</h2>
          <p className="text-xs text-slate-400">{sponsorees.length} filleul{sponsorees.length > 1 ? "s" : ""}</p>
        </div>
        {sponsorees.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">Aucun filleul direct</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f8f4ef] text-xs font-semibold uppercase text-slate-500">
                <tr>
                  {["Nom", "Code", "Grade", "Points", "Inscrit le"].map(h => (
                    <th key={h} className="px-5 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sponsorees.map(s => {
                  const sgc = GRADE_COLORS[s.gradeName as keyof typeof GRADE_COLORS] ?? "#e5e7eb"
                  return (
                    <tr key={s.id} className="hover:bg-[#f8f4ef]/60">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: sgc }}>
                            {s.firstName.charAt(0)}{s.lastName.charAt(0)}
                          </div>
                          <Link href={`/members/${s.id}`}
                            className="font-medium text-[#3f2f85] hover:underline">
                            {s.firstName} {s.lastName}
                          </Link>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-slate-500">{s.sponsorshipCode}</td>
                      <td className="px-5 py-3">
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                          style={{ backgroundColor: `${sgc}20`, color: sgc }}>
                          {s.gradeName || "Aucun"}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-semibold text-[#e8b41f]">{s.totalPoints}</td>
                      <td className="px-5 py-3 text-slate-500 text-xs">
                        {new Date(s.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Gestion du rôle */}
      <div className="rounded-xl bg-white border border-[#a3ade8]/30 shadow-sm p-6">
        <h2 className="mb-4 font-bold text-[#3f2f85]">Gestion du rôle</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-slate-600">
              Rôle actuel : <span className="font-semibold text-[#3f2f85]">{member.userRole}</span>
            </p>
            {isFounder && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-amber-600">
                <AlertTriangle className="h-3.5 w-3.5" />
                Le rôle du fondateur ne peut pas être modifié
              </p>
            )}
          </div>

          {/* Bouton Promouvoir/Rétrograder */}
          <div className="relative group">
            <button
              onClick={() => !isFounder && setRoleModal(true)}
              disabled={isFounder}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition
                ${isFounder
                  ? "cursor-not-allowed border-2 border-slate-200 bg-slate-100 text-slate-400"
                  : isAdmin
                  ? "border-2 border-orange-400 bg-orange-50 text-orange-600 hover:bg-orange-100"
                  : "border-2 border-[#3f2f85] bg-[#3f2f85]/5 text-[#3f2f85] hover:bg-[#3f2f85] hover:text-white"}`}>
              {isAdmin
                ? <><ShieldX className="h-4 w-4" /> Rétrograder membre</>
                : <><ShieldCheck className="h-4 w-4" /> Promouvoir admin</>}
            </button>
            {isFounder && (
              <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 hidden group-hover:block
                w-56 rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-lg z-10">
                Action interdite sur le fondateur de l'organisation
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal confirmation rôle */}
      {roleModal && member && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-bold text-[#3f2f85]">Confirmer le changement de rôle</h3>
              <button onClick={() => { setRoleModal(false); setRoleError(null) }}
                className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-slate-600">
                {isAdmin
                  ? <>Rétrograder <span className="font-semibold text-[#3f2f85]">{member.firstName} {member.lastName}</span> au rôle <span className="font-semibold">MEMBRE</span> ?</>
                  : <>Promouvoir <span className="font-semibold text-[#3f2f85]">{member.firstName} {member.lastName}</span> au rôle <span className="font-semibold">ADMIN</span> ?</>}
              </p>
              {isAdmin && (
                <div className="flex items-start gap-2 rounded-lg bg-orange-50 border border-orange-200 px-3 py-2.5 text-xs text-orange-700">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  Cet utilisateur perdra l'accès aux fonctions d'administration.
                </div>
              )}
              {roleError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{roleError}</div>
              )}
            </div>
            <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
              <button onClick={handleRoleChange} disabled={roleLoading}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition disabled:opacity-50
                  ${isAdmin ? "bg-orange-500 hover:opacity-90" : "bg-[#3f2f85] hover:opacity-90"}`}>
                {roleLoading
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> En cours…</>
                  : isAdmin ? "Rétrograder" : "Promouvoir"}
              </button>
              <button onClick={() => { setRoleModal(false); setRoleError(null) }} disabled={roleLoading}
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
