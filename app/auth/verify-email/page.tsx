"use client"

import Link from "next/link"
import Header from "@/components/Header"

export default function VerifyEmailPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f8f4ef] flex items-center justify-center pt-16">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="bg-white rounded-xl border border-[#a3ade8]/30 p-10 shadow-sm">
            <div className="text-5xl mb-4">✉️</div>
            <h1 className="text-2xl font-bold text-[#3f2f85] mb-3">Vérifiez votre email</h1>
            <p className="text-slate-600 mb-6">
              Un email de confirmation a été envoyé à votre adresse. Vérifiez votre boîte de réception pour activer votre compte.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-lg bg-[#3f2f85] px-6 py-3 font-semibold text-white hover:opacity-90 transition"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
