"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth"
import { COUNTRIES } from "@/lib/constants"

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<Array<{ fullName: string; code?: string; country?: string }>>([])
  const [formData, setFormData] = useState<SignUpInput>({
    email: "", password: "", firstName: "", lastName: "",
    phone: "", country: "CM", referralCode: "", sponsorName: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const searchSponsors = async (query: string) => {
    if (!query || query.trim().length < 2) { setSuggestions([]); return }
    try {
      const res = await fetch(`/api/sponsors/search?q=${encodeURIComponent(query.trim())}`)
      const data = await res.json()
      setSuggestions(Array.isArray(data) ? data : [])
    } catch { setSuggestions([]) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const validated = signUpSchema.parse(formData)
      await authClient.register({
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email,
        password: validated.password,
        phone: validated.phone,
        city: validated.country,
        country: validated.country,
        userType: "ORDINARY",
        sponsorCode: validated.referralCode || undefined,
        sponsorName: validated.sponsorName || undefined,
      })
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const field = (label: string, name: keyof SignUpInput, type = "text", placeholder = "") => (
    <div>
      <label className="mb-1 block text-sm font-semibold text-[#3f2f85]">{label}</label>
      <input
        type={type} name={name} required={["email","password","firstName","lastName","phone"].includes(name)}
        value={formData[name] || ""} onChange={handleChange}
        placeholder={placeholder} disabled={loading}
        className="w-full rounded-lg border border-[#a3ade8]/40 bg-[#f8f4ef] px-4 py-2.5 text-sm focus:border-[#3f2f85] focus:outline-none"
      />
    </div>
  )

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#3f2f85]">Créer un compte</h2>
        <p className="text-sm text-slate-500 mt-1">Rejoignez la communauté Parents School</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {field("Prénom", "firstName", "text", "Jean")}
          {field("Nom", "lastName", "text", "Dupont")}
        </div>

        {field("Email", "email", "email", "votre@email.com")}
        {field("Mot de passe", "password", "password", "••••••••")}
        {field("Téléphone", "phone", "tel", "+237...")}

        {/* Pays */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#3f2f85]">Pays</label>
          <select name="country" value={formData.country} onChange={handleChange}
            className="w-full rounded-lg border border-[#a3ade8]/40 bg-[#f8f4ef] px-4 py-2.5 text-sm focus:border-[#3f2f85] focus:outline-none">
            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </div>

        {/* Code parrain */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#3f2f85]">Code de parrainage <span className="text-slate-400 font-normal">(optionnel)</span></label>
          <input type="text" name="referralCode" value={formData.referralCode || ""} onChange={handleChange}
            placeholder="PS237_001" disabled={loading}
            className="w-full rounded-lg border border-[#a3ade8]/40 bg-[#f8f4ef] px-4 py-2.5 text-sm focus:border-[#3f2f85] focus:outline-none"
          />
        </div>

        {/* Nom parrain avec autocomplétion */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#3f2f85]">Nom du parrain <span className="text-slate-400 font-normal">(optionnel)</span></label>
          <input type="text" name="sponsorName" value={formData.sponsorName || ""}
            onChange={e => { handleChange(e); searchSponsors(e.target.value) }}
            placeholder="Nom du parrain" disabled={loading}
            className="w-full rounded-lg border border-[#a3ade8]/40 bg-[#f8f4ef] px-4 py-2.5 text-sm focus:border-[#3f2f85] focus:outline-none"
          />
          {suggestions.length > 0 && (
            <div className="mt-1 max-h-44 overflow-auto rounded-lg border border-[#a3ade8]/40 bg-white shadow-md">
              {suggestions.slice(0, 8).map((s, i) => (
                <button key={i} type="button"
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#f8f4ef] border-b border-[#a3ade8]/20 last:border-0"
                  onClick={() => { setFormData(p => ({ ...p, sponsorName: s.fullName, referralCode: s.code || p.referralCode })); setSuggestions([]) }}>
                  <div className="font-semibold text-[#3f2f85]">{s.fullName}</div>
                  <div className="text-xs text-slate-400">{s.code || "Sans code"}{s.country ? ` · ${s.country}` : ""}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}
          className="w-full rounded-lg bg-[#3f2f85] py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition">
          {loading ? "Création en cours..." : "Créer mon compte"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Déjà un compte ?{" "}
        <Link href="/auth/login" className="font-semibold text-[#3f2f85] hover:text-[#e8b41f] transition">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
