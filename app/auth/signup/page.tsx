"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2, XCircle, Loader2, ArrowRight, PartyPopper } from "lucide-react"
import { COUNTRIES } from "@/lib/constants"

// ── Schéma ──────────────────────────────────────────────────────────────────
const schema = z.object({
  sponsorCode: z.string().max(32).optional().or(z.literal("")),
  firstName:   z.string().min(2, "Prénom requis"),
  lastName:    z.string().min(2, "Nom requis"),
  email:       z.string().email("Email invalide"),
  password:    z.string().min(6, "Min. 6 caractères"),
  phone:       z.string().min(8, "Numéro invalide"),
  country:     z.string().min(1, "Pays requis"),
  profession:  z.string().max(100).optional().or(z.literal("")),
  memberType:  z.enum(["ORDINARY", "HONORARY", "BENEFACTOR"], { required_error: "Requis" }),
})
type FormValues = z.infer<typeof schema>

// ── Constantes ───────────────────────────────────────────────────────────────
const MEMBER_TYPES = [
  { value: "ORDINARY",   label: "Membre Ordinaire", price: "20 000 FCFA",  desc: "Accès aux formations et à la communauté" },
  { value: "HONORARY",   label: "Membre d'Honneur", price: "200 000 FCFA", desc: "Adhésion à vie — accès premium" },
  { value: "BENEFACTOR", label: "Bienfaiteur",      price: "Gratuit",      desc: "Soutien à la mission de Parents School" },
]

type SponsorStatus = "idle" | "checking" | "valid" | "invalid"
type SuccessData   = { memberCode: string; firstName: string; memberType: string }

// ── Composant ────────────────────────────────────────────────────────────────
export default function SignUpPage() {
  const [sponsorStatus, setSponsorStatus] = useState<SponsorStatus>("idle")
  const [sponsorName,   setSponsorName]   = useState("")
  const [apiError,      setApiError]      = useState<string | null>(null)
  const [success,       setSuccess]       = useState<SuccessData | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      sponsorCode: "", firstName: "", lastName: "",
      email: "", password: "", phone: "",
      country: "CM", profession: "", memberType: "ORDINARY",
    },
    mode: "onChange",
  })

  const watchedCode    = watch("sponsorCode")
  const watchedCountry = watch("country")
  const watchedType    = watch("memberType")
  const seqPreview     = watchedCountry ? `PS${watchedCountry}_XXX` : ""

  // Validation temps réel code parrain (debounce 600ms)
  const validateSponsor = useCallback(async (code: string) => {
    const trimmed = code.trim()
    if (!trimmed) { setSponsorStatus("idle"); setSponsorName(""); return }
    setSponsorStatus("checking")
    try {
      const res  = await fetch(`/api/public/validate-code/${encodeURIComponent(trimmed)}`)
      const data = await res.json()
      if (res.ok && data.valid) {
        setSponsorStatus("valid")
        setSponsorName(data.sponsorName || "")
      } else {
        setSponsorStatus("invalid")
        setSponsorName("")
      }
    } catch {
      setSponsorStatus("invalid")
      setSponsorName("")
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => validateSponsor(watchedCode || ""), 600)
    return () => clearTimeout(t)
  }, [watchedCode, validateSponsor])

  // Soumission
  const onSubmit = async (data: FormValues) => {
    setApiError(null)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://13.140.155.201:8080" || "http://13.140.155.201:8080" || 'API_URL' || "http://localhost:8080"}/api/auth/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sponsorCode: data.sponsorCode || undefined,
          firstName:   data.firstName,
          lastName:    data.lastName,
          email:       data.email,
          password:    data.password,
          phone:       data.phone,
          country:     data.country,
          countryCode: data.country,
          profession:  data.profession || undefined,
          memberType:  data.memberType,
        }),
      })
      const result = await res.json()
      if (!res.ok) { setApiError(result.message || "Une erreur est survenue"); return }
      setSuccess({ memberCode: result.memberCode || result.code || "—", firstName: data.firstName, memberType: data.memberType })
    } catch {
      setApiError("Impossible de joindre le serveur. Veuillez réessayer.")
    }
  }

  const isSubmitDisabled =
    isSubmitting ||
    !isValid ||
    (!!watchedCode?.trim() && (sponsorStatus === "invalid" || sponsorStatus === "checking"))

  // ── Page de confirmation ──────────────────────────────────────────────────
  if (success) {
    const typeLabel = MEMBER_TYPES.find(t => t.value === success.memberType)?.label ?? success.memberType
    return (
      <div className="space-y-6 text-center">
        <PartyPopper className="mx-auto h-14 w-14 text-[#e8b41f]" />
        <div>
          <h2 className="text-2xl font-bold text-[#3f2f85]">Bienvenue, {success.firstName} !</h2>
          <p className="mt-1 text-sm text-slate-500">Votre inscription a été enregistrée avec succès.</p>
        </div>

        <div className="rounded-lg bg-[#3f2f85] px-6 py-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#e8b41f] mb-1">Votre code membre</p>
          <p className="text-3xl font-bold tracking-widest">{success.memberCode}</p>
          <p className="mt-2 text-xs text-slate-300">{typeLabel}</p>
        </div>

        <p className="text-sm text-slate-600">
          Un email de confirmation vous a été envoyé. Conservez votre code — il vous servira pour le parrainage.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/auth/login"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3f2f85] px-6 py-3 font-semibold text-white transition hover:opacity-90">
            Se connecter <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/" className="text-sm text-[#3f2f85] hover:text-[#e8b41f] transition">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  // ── Formulaire ────────────────────────────────────────────────────────────
  const inputCls = "w-full rounded-lg border border-[#a3ade8]/40 bg-[#f8f4ef] px-4 py-2.5 text-sm focus:border-[#3f2f85] focus:outline-none disabled:opacity-50"
  const labelCls = "mb-1 block text-sm font-semibold text-[#3f2f85]"
  const errCls   = "mt-1 text-xs text-red-600"

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#3f2f85]">Créer un compte</h2>
        <p className="text-sm text-slate-500 mt-1">Rejoignez la communauté Parents School</p>
      </div>

      {apiError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{apiError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* 1. Code parrain — EN PREMIER */}
        <div>
          <label className={labelCls}>
            Code parrain <span className="font-normal text-slate-400">(optionnel)</span>
          </label>
          <div className="relative">
            <input {...register("sponsorCode")} placeholder="PS237_001" disabled={isSubmitting} className={`${inputCls} pr-10`} />
            <div className="absolute inset-y-0 right-3 flex items-center">
              {sponsorStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
              {sponsorStatus === "valid"    && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              {sponsorStatus === "invalid"  && <XCircle className="h-4 w-4 text-red-500" />}
            </div>
          </div>
          {sponsorStatus === "valid"   && <p className="mt-1 text-xs text-green-600 font-medium">✓ Parrain : {sponsorName}</p>}
          {sponsorStatus === "invalid" && <p className={errCls}>Code parrain invalide</p>}
          {seqPreview && <p className="mt-1 text-xs text-slate-400">Votre code sera : <span className="font-semibold text-[#3f2f85]">{seqPreview}</span></p>}
        </div>

        {/* 2. Prénom + Nom */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Prénom</label>
            <input {...register("firstName")} placeholder="Jean" disabled={isSubmitting} className={inputCls} />
            {errors.firstName && <p className={errCls}>{errors.firstName.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Nom</label>
            <input {...register("lastName")} placeholder="Dupont" disabled={isSubmitting} className={inputCls} />
            {errors.lastName && <p className={errCls}>{errors.lastName.message}</p>}
          </div>
        </div>

        {/* 3. Email */}
        <div>
          <label className={labelCls}>Email</label>
          <input {...register("email")} type="email" placeholder="votre@email.com" disabled={isSubmitting} className={inputCls} />
          {errors.email && <p className={errCls}>{errors.email.message}</p>}
        </div>

        {/* 4. Mot de passe */}
        <div>
          <label className={labelCls}>Mot de passe</label>
          <input {...register("password")} type="password" placeholder="••••••••" disabled={isSubmitting} className={inputCls} />
          {errors.password && <p className={errCls}>{errors.password.message}</p>}
        </div>

        {/* 5. Téléphone */}
        <div>
          <label className={labelCls}>Téléphone</label>
          <input {...register("phone")} type="tel" placeholder="+237 6XX XXX XXX" disabled={isSubmitting} className={inputCls} />
          {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
        </div>

        {/* 6. Pays */}
        <div>
          <label className={labelCls}>Pays</label>
          <select {...register("country")} disabled={isSubmitting} className={inputCls}>
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>{c.name} ({c.dial})</option>
            ))}
          </select>
          {errors.country && <p className={errCls}>{errors.country.message}</p>}
        </div>

        {/* 7. Profession */}
        <div>
          <label className={labelCls}>Profession <span className="font-normal text-slate-400">(optionnel)</span></label>
          <input {...register("profession")} placeholder="Enseignant, Médecin..." disabled={isSubmitting} className={inputCls} />
        </div>

        {/* 8. Type de membre */}
        <div>
          <label className={labelCls}>Type de membre</label>
          <div className="grid gap-2">
            {MEMBER_TYPES.map(t => (
              <label key={t.value}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition
                  ${watchedType === t.value
                    ? "border-[#3f2f85] bg-[#3f2f85]/5"
                    : "border-[#a3ade8]/40 bg-[#f8f4ef] hover:border-[#3f2f85]/40"}`}>
                <input type="radio" value={t.value} {...register("memberType")}
                  className="mt-0.5 shrink-0 accent-[#3f2f85]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[#3f2f85] text-sm">{t.label}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold
                      ${t.value === "HONORARY"
                        ? "bg-[#e8b41f] text-[#3f2f85]"
                        : t.value === "BENEFACTOR"
                        ? "bg-green-100 text-green-700"
                        : "bg-[#3f2f85] text-white"}`}>
                      {t.price}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{t.desc}</p>
                </div>
              </label>
            ))}
          </div>
          {errors.memberType && <p className={errCls}>{errors.memberType.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitDisabled}
          className="w-full rounded-lg bg-[#3f2f85] py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2">
          {isSubmitting
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Inscription en cours...</>
            : <>Créer mon compte <ArrowRight className="h-4 w-4" /></>}
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
