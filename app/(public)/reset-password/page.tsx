"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

// ── Schéma ────────────────────────────────────────────────────────────────────
const schema = z.object({
  password: z
    .string()
    .min(8,      "Min. 8 caractères")
    .regex(/[A-Z]/, "1 majuscule requise")
    .regex(/[0-9]/, "1 chiffre requis"),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirm"],
})
type FormValues = z.infer<typeof schema>

// ── Force du mot de passe ─────────────────────────────────────────────────────
function getStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0
  if (pwd.length >= 8)        score++
  if (/[A-Z]/.test(pwd))      score++
  if (/[0-9]/.test(pwd))      score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  if (pwd.length >= 12)       score++
  if (score <= 1) return { score, label: "Faible",  color: "bg-red-500" }
  if (score <= 3) return { score, label: "Moyen",   color: "bg-orange-400" }
  return              { score, label: "Fort",    color: "bg-green-500" }
}

// ── Règles ────────────────────────────────────────────────────────────────────
const RULES = [
  { label: "Min. 8 caractères", test: (p: string) => p.length >= 8 },
  { label: "1 lettre majuscule", test: (p: string) => /[A-Z]/.test(p) },
  { label: "1 chiffre",          test: (p: string) => /[0-9]/.test(p) },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ResetPasswordPage() {
  const router   = useRouter()
  const [tempToken,  setTempToken]  = useState<string | null>(null)
  const [showPwd,    setShowPwd]    = useState(false)
  const [showConf,   setShowConf]   = useState(false)
  const [apiError,   setApiError]   = useState<string | null>(null)

  // Vérifier tempToken en sessionStorage
  useEffect(() => {
    const token = sessionStorage.getItem("tempToken")
    if (!token) { router.replace("/auth/login"); return }
    setTempToken(token)
  }, [router])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
    mode: "onChange",
  })

  const watchedPwd = watch("password") || ""
  const strength   = getStrength(watchedPwd)

  const onSubmit = async (data: FormValues) => {
    if (!tempToken) return
    setApiError(null)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken, newPassword: data.password }),
      })
      const result = await res.json()
      if (!res.ok) { setApiError(result.message || "Une erreur est survenue"); return }

      // Stocker le JWT normal et nettoyer le tempToken
      sessionStorage.removeItem("tempToken")
      authClient.setToken(result.token)
      router.replace("/dashboard")
    } catch {
      setApiError("Impossible de joindre le serveur. Veuillez réessayer.")
    }
  }

  // Ne rien rendre tant que le token n'est pas vérifié
  if (tempToken === null) return null

  const inputCls = "w-full rounded-lg border border-[#a3ade8]/40 bg-[#f8f4ef] px-4 py-2.5 text-sm focus:border-[#3f2f85] focus:outline-none pr-10 disabled:opacity-50"

  return (
    <main className="min-h-screen bg-[#f8f4ef]">
      <Header />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 pt-20 pb-12">
        <div className="w-full max-w-md">

          {/* En-tête */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#3f2f85] to-[#a3ade8]">
              <span className="text-xl font-bold text-[#e8b41f]">PS</span>
            </div>
            <h1 className="text-2xl font-bold text-[#3f2f85]">Nouveau mot de passe</h1>
            <p className="mt-1 text-sm text-slate-500">Choisissez un mot de passe sécurisé pour votre compte</p>
          </div>

          <div className="rounded-xl bg-white p-8 shadow-sm border border-[#a3ade8]/30 space-y-5">

            {apiError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{apiError}</div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* Nouveau mot de passe */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#3f2f85]">Nouveau mot de passe</label>
                <div className="relative">
                  <input {...register("password")} type={showPwd ? "text" : "password"}
                    placeholder="••••••••" disabled={isSubmitting} className={inputCls} />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}

                {/* Indicateur de force */}
                {watchedPwd && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Force :</span>
                      <span className={`font-semibold ${
                        strength.label === "Fort"  ? "text-green-600" :
                        strength.label === "Moyen" ? "text-orange-500" : "text-red-500"}`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all
                          ${i <= strength.score ? strength.color : "bg-slate-200"}`} />
                      ))}
                    </div>

                    {/* Règles */}
                    <div className="space-y-1 pt-1">
                      {RULES.map(rule => (
                        <div key={rule.label} className="flex items-center gap-2 text-xs">
                          {rule.test(watchedPwd)
                            ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
                            : <XCircle     className="h-3.5 w-3.5 shrink-0 text-slate-300" />}
                          <span className={rule.test(watchedPwd) ? "text-green-600" : "text-slate-400"}>
                            {rule.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmation */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#3f2f85]">Confirmer le mot de passe</label>
                <div className="relative">
                  <input {...register("confirm")} type={showConf ? "text" : "password"}
                    placeholder="••••••••" disabled={isSubmitting} className={inputCls} />
                  <button type="button" onClick={() => setShowConf(v => !v)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600">
                    {showConf ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirm && <p className="mt-1 text-xs text-red-600">{errors.confirm.message}</p>}
              </div>

              <button type="submit" disabled={isSubmitting || !isValid}
                className="w-full rounded-lg bg-[#3f2f85] py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                {isSubmitting
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Enregistrement...</>
                  : "Définir mon mot de passe"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
