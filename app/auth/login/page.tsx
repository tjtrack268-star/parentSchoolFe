"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"

export default function LoginPage() {
  const router  = useRouter()
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [blocked,  setBlocked]  = useState(false)
  const [formData, setFormData] = useState<LoginInput>({ email: "", password: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null); setBlocked(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null); setBlocked(false)
    try {
      const validated = loginSchema.parse(formData)

      const res = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: validated.email.trim().toLowerCase(), password: validated.password }),
      })

      // 423 — compte bloqué
      if (res.status === 423) {
        setBlocked(true)
        setError("Votre compte est bloqué. Veuillez contacter l'administrateur.")
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Email ou mot de passe incorrect")
        return
      }

      // Réinitialisation forcée du mot de passe
      if (data.mustResetPassword && data.tempToken) {
        sessionStorage.setItem("tempToken", data.tempToken)
        router.push("/reset-password")
        return
      }

      // Connexion normale — stocker le token
      if (data.token) {
        document.cookie = `auth_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}`
        localStorage.setItem("auth_token", data.token)
      }
      router.push("/dashboard")

    } catch (err) {
      setError(err instanceof Error ? err.message : "Email ou mot de passe incorrect")
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full rounded-lg border border-[#a3ade8]/40 bg-[#f8f4ef] px-4 py-2.5 text-sm focus:border-[#3f2f85] focus:outline-none disabled:opacity-50"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#3f2f85]">Se connecter</h2>
        <p className="text-sm text-slate-500 mt-1">Accédez à votre tableau de bord</p>
      </div>

      {error && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${
          blocked
            ? "border-orange-200 bg-orange-50 text-orange-700"
            : "border-red-200 bg-red-50 text-red-700"}`}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#3f2f85]">Email</label>
          <input
            type="email" name="email" required
            value={formData.email} onChange={handleChange}
            placeholder="votre@email.com" disabled={loading}
            className={inputCls}
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-semibold text-[#3f2f85]">Mot de passe</label>
            <Link href="/forgot-password"
              className="text-xs text-[#3f2f85] hover:text-[#e8b41f] transition">
              Mot de passe oublié ?
            </Link>
          </div>
          <input
            type="password" name="password" required
            value={formData.password} onChange={handleChange}
            placeholder="••••••••" disabled={loading}
            className={inputCls}
          />
        </div>

        <button type="submit" disabled={loading}
          className="w-full rounded-lg bg-[#3f2f85] py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition flex items-center justify-center gap-2">
          {loading
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Connexion en cours...</>
            : "Se connecter"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Pas encore de compte ?{" "}
        <Link href="/auth/signup" className="font-semibold text-[#3f2f85] hover:text-[#e8b41f] transition">
          S'inscrire
        </Link>
      </p>
    </div>
  )
}
