"use client"

import { Suspense, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<LoginInput>({ email: "", password: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const validated = loginSchema.parse(formData)
      await authClient.login(validated.email, validated.password)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email ou mot de passe incorrect")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#3f2f85]">Se connecter</h2>
        <p className="text-sm text-slate-500 mt-1">Accédez à votre tableau de bord</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#3f2f85]">Email</label>
          <input
            type="email" name="email" required
            value={formData.email} onChange={handleChange}
            placeholder="votre@email.com" disabled={loading}
            className="w-full rounded-lg border border-[#a3ade8]/40 bg-[#f8f4ef] px-4 py-2.5 text-sm focus:border-[#3f2f85] focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-[#3f2f85]">Mot de passe</label>
          <input
            type="password" name="password" required
            value={formData.password} onChange={handleChange}
            placeholder="••••••••" disabled={loading}
            className="w-full rounded-lg border border-[#a3ade8]/40 bg-[#f8f4ef] px-4 py-2.5 text-sm focus:border-[#3f2f85] focus:outline-none"
          />
        </div>

        <button type="submit" disabled={loading}
          className="w-full rounded-lg bg-[#3f2f85] py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition">
          {loading ? "Connexion en cours..." : "Se connecter"}
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
