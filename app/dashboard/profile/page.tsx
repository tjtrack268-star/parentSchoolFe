"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { GRADE_COLORS } from "@/lib/constants"
import { Copy, Check, Pencil, X, Save } from "lucide-react"

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  userType: string
  userStatus: string
  totalPoints: number
  directSponsorshipsCount: number
  sponsorshipCode: string
  currentGrade?: { name: string; level: number }
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState<Partial<User>>({})

  useEffect(() => {
    const token = authClient.getToken()
    if (!token) { router.push("/auth/login"); return }
    fetch('/api/fetch-user', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setUser(data); setForm(data) })
      .catch(() => router.push("/auth/login"))
      .finally(() => setLoading(false))
  }, [router])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      const token = authClient.getToken()
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: form.firstName, lastName: form.lastName, phone: form.phone, city: form.city }),
      })
      if (res.ok) { const updated = await res.json(); setUser(updated); setEditing(false) }
    } finally { setSaving(false) }
  }

  const copyCode = () => {
    if (user?.sponsorshipCode) { navigator.clipboard.writeText(user.sponsorshipCode); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 rounded-full border-4 border-[#a3ade8] border-t-[#3f2f85] animate-spin" />
    </div>
  )

  if (!user) return null

  const gradeColor = GRADE_COLORS[user.currentGrade?.name as keyof typeof GRADE_COLORS] || '#a3ade8'

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-[#3f2f85]">Mon Profil</h1>
        <p className="text-slate-500 mt-1 text-sm">Gérez vos informations personnelles</p>
      </div>

      {/* Avatar + grade */}
      <div className="bg-[#3f2f85] rounded-xl p-6 text-white flex items-center gap-5">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shrink-0"
          style={{ backgroundColor: '#e8b41f', color: '#3f2f85' }}>
          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
          <p className="text-[#a3ade8] text-sm">{user.email}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="rounded-full px-3 py-1 text-xs font-bold"
              style={{ backgroundColor: gradeColor, color: 'white' }}>
              {user.currentGrade?.name || "Aucun grade"}
            </span>
            <span className="text-xs text-[#a3ade8]">{user.userType}</span>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-2xl font-bold text-[#e8b41f]">{user.totalPoints}</p>
          <p className="text-xs text-[#a3ade8]">points</p>
          <p className="text-lg font-bold text-white mt-1">{user.directSponsorshipsCount}</p>
          <p className="text-xs text-[#a3ade8]">filleuls</p>
        </div>
      </div>

      {/* Code de parrainage */}
      <div className="bg-white rounded-xl border border-[#a3ade8]/30 p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#e8b41f] mb-2">Code de parrainage</p>
        <div className="flex items-center gap-3">
          <code className="flex-1 rounded-lg bg-[#f8f4ef] px-4 py-3 font-mono text-lg font-bold text-[#3f2f85] border border-[#a3ade8]/30">
            {user.sponsorshipCode}
          </code>
          <button onClick={copyCode}
            className="flex items-center gap-2 rounded-lg bg-[#3f2f85] px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition">
            {copied ? <><Check className="h-4 w-4" /> Copié</> : <><Copy className="h-4 w-4" /> Copier</>}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">Partagez ce code pour parrainer de nouveaux membres</p>
      </div>

      {/* Infos */}
      <div className="bg-white rounded-xl border border-[#a3ade8]/30 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <p className="font-bold text-[#3f2f85]">Informations personnelles</p>
          {!editing ? (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-2 rounded-lg border-2 border-[#3f2f85] px-3 py-1.5 text-sm font-semibold text-[#3f2f85] hover:bg-[#3f2f85] hover:text-white transition">
              <Pencil className="h-3.5 w-3.5" /> Modifier
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[#3f2f85] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition">
                <Save className="h-3.5 w-3.5" /> {saving ? "..." : "Enregistrer"}
              </button>
              <button onClick={() => { setEditing(false); setForm(user) }}
                className="flex items-center gap-2 rounded-lg border-2 border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition">
                <X className="h-3.5 w-3.5" /> Annuler
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Prénom", key: "firstName" },
              { label: "Nom", key: "lastName" },
              { label: "Téléphone", key: "phone" },
              { label: "Ville", key: "city" },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="mb-1 block text-xs font-semibold text-[#3f2f85]">{label}</label>
                <input
                  value={(form as any)[key] || ""}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full rounded-lg border border-[#a3ade8]/40 bg-[#f8f4ef] px-3 py-2 text-sm focus:border-[#3f2f85] focus:outline-none"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Prénom", value: user.firstName },
              { label: "Nom", value: user.lastName },
              { label: "Email", value: user.email },
              { label: "Téléphone", value: user.phone || "Non renseigné" },
              { label: "Ville", value: user.city || "Non renseigné" },
              { label: "Statut", value: user.userStatus },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-[#f8f4ef] p-3">
                <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-[#3f2f85]">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
