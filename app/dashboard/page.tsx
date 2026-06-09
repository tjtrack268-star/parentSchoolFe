"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Pencil, X, Save, Loader2, Users, UserPlus } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { GRADE_COLORS } from "@/lib/constants"

// ── Types ─────────────────────────────────────────────────────────────────────
interface Member {
  id:                      number
  firstName:               string
  lastName:                string
  email:                   string
  phone:                   string
  country:                 string
  profession?:             string
  userType:                string
  sponsorshipCode:         string
  totalPoints:             number
  directSponsorshipsCount: number
  networkLevel?:           number
  currentGrade?:           { name: string; level: number }
  sponsor?: {
    firstName:       string
    lastName:        string
    sponsorshipCode: string
  }
}

interface Sponsoree {
  id:              number
  firstName:       string
  lastName:        string
  sponsorshipCode: string
  currentGrade?:   { name: string }
  totalPoints:     number
  createdAt:       string
}

const GRADES_ORDER = ["Leader", "Leader Senior", "Coordinateur", "Mentor", "Directeur"]
const GRADES_REQ   = [
  { name: "Leader",        sponsorships: 4  },
  { name: "Leader Senior", sponsorships: 8  },
  { name: "Coordinateur",  sponsorships: 18 },
  { name: "Mentor",        sponsorships: 30 },
  { name: "Directeur",     sponsorships: 50 },
]

const MEMBER_TYPE_LABEL: Record<string, string> = {
  ORDINARY:   "Membre Ordinaire",
  HONORARY:   "Membre d'Honneur",
  BENEFACTOR: "Bienfaiteur",
}

// ── Composant ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const [member,     setMember]     = useState<Member | null>(null)
  const [sponsorees, setSponsorees] = useState<Sponsoree[]>([])
  const [loading,    setLoading]    = useState(true)
  const [modalOpen,  setModalOpen]  = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [saveError,  setSaveError]  = useState<string | null>(null)
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", profession: "" })

  const load = useCallback(async () => {
    try {
      const [me, sps] = await Promise.all([
        apiClient.get<Member>("/members/me"),
        apiClient.get<Sponsoree[]>("/members/me/sponsorees"),
      ])
      setMember(me)
      setSponsorees(Array.isArray(sps) ? sps : [])
      setForm({
        firstName:  me.firstName,
        lastName:   me.lastName,
        phone:      me.phone      || "",
        profession: me.profession || "",
      })
    } catch {
      router.push("/auth/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { load() }, [load])

  const openModal  = () => { setSaveError(null); setModalOpen(true) }
  const closeModal = () => {
    if (member) setForm({ firstName: member.firstName, lastName: member.lastName, phone: member.phone || "", profession: member.profession || "" })
    setModalOpen(false)
  }

  const handleSave = async () => {
    if (!member) return
    setSaving(true); setSaveError(null)
    try {
      const updated = await apiClient.put<Member>("/members/me", form)
      setMember(updated)
      setModalOpen(false)
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Erreur lors de la sauvegarde")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 rounded-full border-4 border-[#a3ade8] border-t-[#3f2f85] animate-spin" />
    </div>
  )

  if (!member) return null

  // Calculs progression
  const gradeName    = member.currentGrade?.name || "Aucun"
  const gradeColor   = GRADE_COLORS[gradeName as keyof typeof GRADE_COLORS] || "#a3ade8"
  const gradeIdx     = GRADES_ORDER.indexOf(gradeName)
  const nextGradeReq = GRADES_REQ[gradeIdx + 1] || null
  const isMaxGrade   = gradeName === "Directeur"
  const referrals    = member.directSponsorshipsCount || 0
  const progress     = nextGradeReq ? Math.min(100, Math.round((referrals / nextGradeReq.sponsorships) * 100)) : 100
  const remaining    = nextGradeReq ? Math.max(0, nextGradeReq.sponsorships - referrals) : 0
  const initials     = `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase()

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-bold text-[#3f2f85]">Mon Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Bienvenue sur votre espace membre Parents School</p>
      </div>

      {/* ── Deux colonnes Profil + Progression ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Carte Profil */}
        <div className="rounded-xl bg-white border border-[#a3ade8]/30 shadow-sm overflow-hidden">
          <div className="bg-[#3f2f85] px-6 py-5 flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-full flex items-center justify-center text-xl font-bold"
              style={{ backgroundColor: gradeColor, color: "#fff" }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white truncate">{member.firstName} {member.lastName}</h2>
              <p className="font-mono text-sm font-semibold text-[#e8b41f]">{member.sponsorshipCode}</p>
            </div>
          </div>

          <div className="px-6 py-5 space-y-3">
            {[
              { label: "Pays",           value: member.country },
              { label: "Profession",     value: member.profession || "Non renseignée" },
              { label: "Type de membre", value: MEMBER_TYPE_LABEL[member.userType] || member.userType },
              { label: "Niveau réseau",  value: member.networkLevel ? `Niveau ${member.networkLevel}` : "—" },
              {
                label: "Parrain",
                value: member.sponsor
                  ? `${member.sponsor.firstName} ${member.sponsor.lastName} (${member.sponsor.sponsorshipCode})`
                  : "Aucun parrain",
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between gap-4 text-sm">
                <span className="shrink-0 text-slate-400">{label}</span>
                <span className="font-semibold text-[#3f2f85] text-right">{value}</span>
              </div>
            ))}

            <button onClick={openModal}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#3f2f85] px-4 py-2.5 text-sm font-semibold text-[#3f2f85] transition hover:bg-[#3f2f85] hover:text-white">
              <Pencil className="h-4 w-4" /> Modifier mes informations
            </button>
          </div>
        </div>

        {/* Carte Progression */}
        <div className="rounded-xl bg-white border border-[#a3ade8]/30 shadow-sm px-6 py-5 space-y-5">
          <h2 className="font-bold text-[#3f2f85]">Ma Progression</h2>

          <div className="flex items-center gap-3">
            <span className="rounded-full px-4 py-1.5 text-sm font-bold text-white"
              style={{ backgroundColor: gradeColor }}>
              {gradeName === "Aucun" ? "Sans grade" : gradeName}
            </span>
            {isMaxGrade && (
              <span className="rounded-full bg-[#e8b41f]/20 px-3 py-1 text-xs font-semibold text-[#e8b41f]">
                🏆 Grade maximum atteint
              </span>
            )}
          </div>

          <div className="rounded-lg bg-[#f8f4ef] px-4 py-3">
            <p className="text-xs text-slate-400">Points cumulés</p>
            <p className="text-2xl font-bold text-[#3f2f85]">
              {member.totalPoints} pts
              <span className="ml-2 text-sm font-normal text-slate-400">
                ({referrals} filleul{referrals > 1 ? "s" : ""} × 60)
              </span>
            </p>
          </div>

          {!isMaxGrade && nextGradeReq && (
            <div>
              <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                <span>{referrals}/{nextGradeReq.sponsorships} filleuls</span>
                <span className="font-semibold text-[#3f2f85]">→ {nextGradeReq.name}</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-[#a3ade8]/25">
                <div className="h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, backgroundColor: gradeColor }} />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Encore <span className="font-bold text-[#3f2f85]">{remaining} filleul{remaining > 1 ? "s" : ""}</span> pour atteindre {nextGradeReq.name}
              </p>
            </div>
          )}

          {isMaxGrade && (
            <div className="rounded-lg bg-[#e8b41f]/10 border border-[#e8b41f]/40 px-4 py-3 text-sm font-semibold text-[#e8b41f] text-center">
              🎉 Félicitations — vous avez atteint le grade maximum !
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-lg border-l-4 border-[#3f2f85] bg-[#f8f4ef] p-3">
              <p className="text-xs text-slate-400">Filleuls directs</p>
              <p className="text-xl font-bold text-[#3f2f85]">{referrals}</p>
            </div>
            <div className="rounded-lg border-l-4 border-[#e8b41f] bg-[#f8f4ef] p-3">
              <p className="text-xs text-slate-400">Points totaux</p>
              <p className="text-xl font-bold text-[#3f2f85]">{member.totalPoints}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mes filleuls directs ── */}
      <div className="rounded-xl bg-white border border-[#a3ade8]/30 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-bold text-[#3f2f85]">Mes filleuls directs</h2>
          <Link href="/referral"
            className="flex items-center gap-2 rounded-lg bg-[#3f2f85] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
            <UserPlus className="h-4 w-4" /> Parrainer un membre
          </Link>
        </div>

        {sponsorees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center px-4">
            <Users className="mb-3 h-12 w-12 text-[#a3ade8]" />
            <p className="font-semibold text-[#3f2f85]">Vous n'avez pas encore de filleuls.</p>
            <p className="mt-1 text-sm text-slate-500">
              Partagez votre code <span className="font-mono font-bold text-[#3f2f85]">{member.sponsorshipCode}</span> pour commencer.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f8f4ef] text-xs font-semibold uppercase text-slate-500">
                <tr>
                  {["Nom", "Code", "Grade", "Points", "Date d'inscription"].map(h => (
                    <th key={h} className="px-5 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sponsorees.map(s => {
                  const gc = GRADE_COLORS[s.currentGrade?.name as keyof typeof GRADE_COLORS] || "#a3ade8"
                  return (
                    <tr key={s.id} className="hover:bg-[#f8f4ef]/60">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: gc }}>
                            {s.firstName.charAt(0)}{s.lastName.charAt(0)}
                          </div>
                          <span className="font-medium text-[#3f2f85]">{s.firstName} {s.lastName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-slate-500">{s.sponsorshipCode}</td>
                      <td className="px-5 py-3">
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                          style={{ backgroundColor: `${gc}20`, color: gc }}>
                          {s.currentGrade?.name || "Aucun"}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-semibold text-[#e8b41f]">{s.totalPoints}</td>
                      <td className="px-5 py-3 text-slate-500">
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

      {/* ── Modal d'édition ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-bold text-[#3f2f85]">Modifier mes informations</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {saveError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{saveError}</div>
              )}

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

              {[
                { label: "Code membre", value: member.sponsorshipCode },
                { label: "Email",       value: member.email },
                { label: "Parrain",     value: member.sponsor ? `${member.sponsor.firstName} ${member.sponsor.lastName}` : "Aucun" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <label className="mb-1 block text-xs font-semibold text-slate-400">{label}</label>
                  <input value={value} disabled
                    className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed" />
                </div>
              ))}
            </div>

            <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
              <button onClick={handleSave} disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#3f2f85] py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50">
                {saving
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Enregistrement...</>
                  : <><Save className="h-4 w-4" /> Enregistrer</>}
              </button>
              <button onClick={closeModal} disabled={saving}
                className="rounded-lg border-2 border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
