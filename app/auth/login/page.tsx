"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"
import { saveToken } from "@/lib/auth"

const MAX_ATTEMPTS  = 5
const BLOCK_SECONDS = 30   // durée du timer affiché (en secondes)

export default function LoginPage() {
  const router = useRouter()
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [blocked,   setBlocked]   = useState(false)
  const [attempts,  setAttempts]  = useState(0)
  const [showPwd,   setShowPwd]   = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [formData,  setFormData]  = useState<LoginInput>({ email: "", password: "" })

  // Timer de déblocage
  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  useEffect(() => {
    if (countdown === 0 && blocked) {
      setBlocked(false)
      setError(null)
      setAttempts(0)
    }
  }, [countdown, blocked])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (!blocked) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (blocked) return
    setLoading(true); setError(null)

    try {
      const validated = loginSchema.parse(formData)

      const res = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: validated.email.trim().toLowerCase(), password: validated.password }),
      })

      // 423 — compte bloqué côté serveur
      if (res.status === 423) {
        setBlocked(true)
        setCountdown(BLOCK_SECONDS)
        setError("Compte bloqué")
        return
      }

      const data = await res.json()

      if (!res.ok) {
        const next = attempts + 1
        setAttempts(next)
        // Message générique — ne pas révéler si c'est l'email ou le mdp
        setError("Identifiants incorrects")
        if (next >= MAX_ATTEMPTS) {
          setBlocked(true)
          setCountdown(BLOCK_SECONDS)
        }
        return
      }

      // Réinitialisation forcée du mot de passe
      if (data.mustResetPassword && data.tempToken) {
        sessionStorage.setItem("tempToken", data.tempToken)
        router.push("/reset-password")
        return
      }

      // Connexion normale
      if (data.token) {
        const role      = data.user?.userRole ?? data.role ?? "MEMBER"
        const firstName = data.user?.firstName ?? data.firstName ?? ""
        saveToken(data.token, role, firstName)
      }

      router.push("/dashboard")

    } catch {
      setError("Identifiants incorrects")
    } finally {
      setLoading(false)
    }
  }

  const isDisabled   = loading || blocked
  const inputCls     = "w-full rounded-lg border border-[#a3ade8]/40 bg-[#f8f4ef] px-4 py-2.5 text-sm focus:border-[#3f2f85] focus:outline-none disabled:opacity-50"
  const showCounter  = attempts > 0 && !blocked

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#3f2f85]">Se connecter</h2>
        <p className="text-sm text-slate-500 mt-1">Accédez à votre tableau de bord</p>
      </div>

      {/* Compteur de tentatives */}
      {showCounter && (
        <div className="flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm text-orange-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Attention : {attempts}/{MAX_ATTEMPTS} tentatives
        </div>
      )}

      {/* Erreur / Compte bloqué */}
      {error && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${
          blocked
            ? "border-red-300 bg-red-50 text-red-700"
            : "border-red-200 bg-red-50 text-red-700"}`}>
          {blocked ? (
            <div className="space-y-1">
              <p className="font-semibold">🔒 Compte bloqué</p>
              {countdown > 0
                ? <p className="text-xs">Réessayez dans <span className="font-bold">{countdown}s</span></p>
                : <p className="text-xs">Veuillez contacter l'administrateur.</p>}
            </div>
          ) : error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#3f2f85]">Email</label>
          <input
            type="email" name="email" required
            value={formData.email} onChange={handleChange}
            placeholder="votre@email.com" disabled={isDisabled}
            className={inputCls}
          />
        </div>

        {/* Mot de passe avec toggle */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-semibold text-[#3f2f85]">Mot de passe</label>
            <Link href="/reset-password"
              className="text-xs text-[#3f2f85] hover:text-[#e8b41f] transition">
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"} name="password" required
              value={formData.password} onChange={handleChange}
              placeholder="••••••••" disabled={isDisabled}
              className={`${inputCls} pr-10`}
            />
            <button type="button" onClick={() => setShowPwd(v => !v)}
              disabled={isDisabled}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 disabled:opacity-40">
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={isDisabled}
          className="w-full rounded-lg bg-[#3f2f85] py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2">
          {loading
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Connexion en cours...</>
            : blocked
            ? `Bloqué (${countdown}s)`
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
