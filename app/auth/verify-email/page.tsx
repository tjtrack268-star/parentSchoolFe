"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSupabase } from "@/hooks/use-supabase"
import { Button } from "@/components/ui/button"

export default function VerifyEmailPage() {
  const router = useRouter()
  const supabase = useSupabase()
  const [email, setEmail] = useState<string>("")
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getEmail = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user?.email) {
        setEmail(session.user.email)
      } else {
        router.push("/auth/signup")
      }
    }
    getEmail()
  }, [supabase, router])

  const handleResend = async () => {
    setResendLoading(true)
    setResendMessage(null)
    setError(null)

    try {
      if (!email) throw new Error("Email not found")

      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email,
      })

      if (resendError) throw resendError
      setResendMessage("Email de verification renvoyé avec succès")
    } catch (err) {
      console.error("[v0] Resend error:", err)
      setError(err instanceof Error ? err.message : "Erreur lors du renvoi")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Vérifiez votre Email</h2>
        <p className="text-sm text-slate-600">Un lien de confirmation a été envoyé à {email}</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Cliquez sur le lien dans l'email pour confirmer votre adresse et activer votre compte.
        </p>
      </div>

      {resendMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
          {resendMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
      )}

      <div className="space-y-3">
        <p className="text-center text-sm text-slate-600">Vous n'avez pas reçu l'email?</p>
        <Button onClick={handleResend} disabled={resendLoading} variant="outline" className="w-full bg-transparent">
          {resendLoading ? "Envoi..." : "Renvoyer l'email"}
        </Button>
      </div>

      <p className="text-center text-sm text-slate-600">
        <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
          Retour à la connexion
        </Link>
      </p>
    </div>
  )
}
