"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Copy, Check, MessageCircle, Mail, Loader2, UserPlus, ArrowRight } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { GRADE_COLORS } from "@/lib/constants"

// ── Types ─────────────────────────────────────────────────────────────────────
interface ReferralInfo {
  sponsorshipCode:         string
  firstName:               string
  lastName:                string
  directSponsorshipsCount: number
  totalPoints:             number
  gradeName:               string
  nextGrade?: {
    name:           string
    requiredSponsors: number
  }
}

const GRADES_REQ = [
  { name: "Leader",        sponsorships: 4  },
  { name: "Leader Senior", sponsorships: 8  },
  { name: "Coordinateur",  sponsorships: 18 },
  { name: "Mentor",        sponsorships: 30 },
  { name: "Directeur",     sponsorships: 50 },
]
const GRADES_ORDER = GRADES_REQ.map(g => g.name)

// ── Hook copie presse-papier ──────────────────────────────────────────────────
function useCopy(resetMs = 2000) {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(null), resetMs)
    })
  }, [resetMs])
  return { copied, copy }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ReferralPage() {
  const router  = useRouter()
  const [info,    setInfo]    = useState<ReferralInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const { copied, copy } = useCopy()

  useEffect(() => {
    apiClient.get<ReferralInfo>("/members/me/referral")
      .then(data => setInfo(data))
      .catch(e => {
        if (e?.status === 401) { router.replace("/auth/login"); return }
        setError(e instanceof Error ? e.message : "Erreur de chargement")
      })
      .finally(() => setLoading(false))
  }, [router])

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f4ef]">
      <Loader2 className="h-10 w-10 animate-spin text-[#3f2f85]" />
    </div>
  )
  if (error) return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f4ef] px-4">
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    </div>
  )
  if (!info) return null

  // Construire l'URL d'invitation
  const baseUrl    = typeof window !== "undefined" ? window.location.origin : ""
  const inviteUrl  = `${baseUrl}/register?ref=${info.sponsorshipCode}`

  // Messages partage
  const waMessage  = encodeURIComponent(
    `Bonjour ! Je vous invite à rejoindre Parents School, une communauté dédiée à la parentalité chrétienne.\n\nUtilisez mon code parrain *${info.sponsorshipCode}* lors de votre inscription :\n${inviteUrl}`
  )
  const mailSubject = encodeURIComponent("Rejoignez Parents School avec mon code parrain")
  const mailBody    = encodeURIComponent(
    `Bonjour,\n\nJe vous invite à rejoindre Parents School, une communauté dédiée à la parentalité chrétienne.\n\nMon code parrain : ${info.sponsorshipCode}\nLien d'inscription : ${inviteUrl}\n\nÀ bientôt sur la plateforme !`
  )

  // Progression
  const gradeIdx     = GRADES_ORDER.indexOf(info.gradeName)
  const nextGradeReq = GRADES_REQ[gradeIdx + 1] || null
  const isMaxGrade   = info.gradeName === "Directeur"
  const referrals    = info.directSponsorshipsCount
  const progress     = nextGradeReq ? Math.min(100, Math.round((referrals / nextGradeReq.sponsorships) * 100)) : 100
  const remaining    = nextGradeReq ? Math.max(0, nextGradeReq.sponsorships - referrals) : 0
  const gradeColor   = (GRADE_COLORS as Record<string, string>)[info.gradeName] ?? "#a3ade8"

  const cardCls = "rounded-xl bg-white border border-[#a3ade8]/30 shadow-sm p-6"
  const btnCopyCls = (key: string) =>
    `flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition
     ${copied === key
       ? "bg-green-500 text-white"
       : "bg-[#3f2f85] text-white hover:opacity-90"}`

  return (
    <div className="min-h-screen bg-[#f8f4ef]">
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-[#3f2f85]">Mon lien de parrainage</h1>
          <p className="text-sm text-slate-400 mt-1">Partagez votre code et développez votre réseau</p>
        </div>

        {/* ── Section 1 : Mon code ── */}
        <div className={cardCls}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#e8b41f]">Mon code de parrainage</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 rounded-lg bg-[#3f2f85] px-6 py-4 text-center">
              <p className="font-mono text-2xl font-bold tracking-widest text-white sm:text-3xl">
                {info.sponsorshipCode}
              </p>
            </div>
            <button onClick={() => copy(info.sponsorshipCode, "code")}
              className={btnCopyCls("code")}>
              {copied === "code"
                ? <><Check className="h-4 w-4" /> Copié !</>
                : <><Copy className="h-4 w-4" /> Copier le code</>}
            </button>
          </div>
        </div>

        {/* ── Section 2 : Lien d'invitation ── */}
        <div className={cardCls}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#e8b41f]">Lien d'invitation</p>
          <p className="mb-3 text-xs text-slate-400">
            Ce lien pré-remplit automatiquement votre code dans le formulaire d'inscription
          </p>
          <div className="flex items-center gap-3">
            <input readOnly value={inviteUrl}
              className="flex-1 min-w-0 rounded-lg border border-[#a3ade8]/40 bg-[#f8f4ef] px-4 py-2.5 text-sm font-mono text-slate-600 focus:outline-none cursor-text select-all" />
            <button onClick={() => copy(inviteUrl, "link")}
              className={btnCopyCls("link")}>
              {copied === "link"
                ? <><Check className="h-4 w-4" /> Copié !</>
                : <><Copy className="h-4 w-4" /> Copier le lien</>}
            </button>
          </div>
        </div>

        {/* ── Section 3 : Partager via ── */}
        <div className={cardCls}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#e8b41f]">Partager via</p>
          <div className="flex flex-wrap gap-3">

            {/* WhatsApp */}
            <a href={`https://wa.me/?text=${waMessage}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white hover:opacity-90 transition">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>

            {/* Email */}
            <a href={`mailto:?subject=${mailSubject}&body=${mailBody}`}
              className="flex items-center gap-2 rounded-lg bg-slate-600 px-5 py-3 text-sm font-semibold text-white hover:opacity-90 transition">
              <Mail className="h-4 w-4" /> Email
            </a>

            {/* Copier le lien */}
            <button onClick={() => copy(inviteUrl, "share")}
              className={`flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition
                ${copied === "share" ? "bg-green-500 text-white" : "border-2 border-[#3f2f85] text-[#3f2f85] hover:bg-[#3f2f85] hover:text-white"}`}>
              {copied === "share"
                ? <><Check className="h-4 w-4" /> Copié !</>
                : <><Copy className="h-4 w-4" /> Copier</>}
            </button>
          </div>
        </div>

        {/* ── Section 4 : Ma performance ── */}
        <div className={cardCls}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#e8b41f]">Ma performance</p>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="rounded-lg bg-[#f8f4ef] p-4 text-center">
              <p className="text-3xl font-bold text-[#3f2f85]">{referrals}</p>
              <p className="text-xs text-slate-400 mt-1">Filleul{referrals > 1 ? "s" : ""} direct{referrals > 1 ? "s" : ""}</p>
            </div>
            <div className="rounded-lg bg-[#f8f4ef] p-4 text-center">
              <span className="inline-block rounded-full px-3 py-1 text-sm font-bold text-white"
                style={{ backgroundColor: gradeColor }}>
                {info.gradeName || "Sans grade"}
              </span>
              <p className="text-xs text-slate-400 mt-2">Grade actuel</p>
            </div>
          </div>

          {/* Mini-graphique progression */}
          {!isMaxGrade && nextGradeReq ? (
            <div>
              <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                <span>{referrals}/{nextGradeReq.sponsorships} filleuls</span>
                <span className="font-semibold text-[#3f2f85]">→ {nextGradeReq.name}</span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-[#a3ade8]/25">
                <div className="h-4 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                  style={{ width: `${Math.max(progress, 8)}%`, backgroundColor: gradeColor }}>
                  {progress >= 20 && (
                    <span className="text-[9px] font-bold text-white">{progress}%</span>
                  )}
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Encore <span className="font-bold text-[#3f2f85]">{remaining} filleul{remaining > 1 ? "s" : ""}</span>{" "}
                pour atteindre <span className="font-semibold text-[#3f2f85]">{nextGradeReq.name}</span>
              </p>

              {/* Jalons */}
              <div className="mt-4 flex justify-between">
                {GRADES_REQ.map((g, i) => {
                  const gc    = (GRADE_COLORS as Record<string, string>)[g.name] ?? "#a3ade8"
                  const done  = gradeIdx >= i
                  const current = gradeIdx + 1 === i
                  return (
                    <div key={g.name} className="flex flex-col items-center gap-1">
                      <div className={`h-3 w-3 rounded-full border-2 transition-all
                        ${done ? "border-transparent" : current ? "border-[#3f2f85]" : "border-slate-200 bg-white"}`}
                        style={{ backgroundColor: done ? gc : current ? "#fff" : undefined }} />
                      <span className="text-[9px] text-slate-400 hidden sm:block">{g.name.split(" ")[0]}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : isMaxGrade ? (
            <div className="rounded-lg bg-[#e8b41f]/10 border border-[#e8b41f]/40 px-4 py-3 text-center text-sm font-semibold text-[#e8b41f]">
              🏆 Grade maximum atteint — Félicitations !
            </div>
          ) : null}

          <Link href="/dashboard"
            className="mt-5 flex items-center justify-center gap-2 rounded-lg border-2 border-[#3f2f85] px-4 py-2.5 text-sm font-semibold text-[#3f2f85] transition hover:bg-[#3f2f85] hover:text-white">
            <UserPlus className="h-4 w-4" /> Voir mon dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  )
}
