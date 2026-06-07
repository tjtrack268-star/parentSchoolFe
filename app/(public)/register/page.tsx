"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2, XCircle, Loader2, ArrowRight, PartyPopper } from "lucide-react"
import { COUNTRIES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

// ── Schéma Zod ───────────────────────────────────────────────────────────────
const schema = z.object({
  sponsorCode: z.string().max(32).optional().or(z.literal("")),
  firstName:   z.string().min(2, "Prénom requis"),
  lastName:    z.string().min(2, "Nom requis"),
  email:       z.string().email("Email invalide"),
  password:    z.string().min(6, "Min. 6 caractères"),
  phone:       z.string().min(8, "Numéro invalide"),
  country:     z.string().min(1, "Pays requis"),
  profession:  z.string().max(100).optional().or(z.literal("")),
  memberType:  z.enum(["ORDINARY", "HONORARY", "BENEFACTOR"], { required_error: "Type de membre requis" }),
})
type FormValues = z.infer<typeof schema>

// ── Constantes ────────────────────────────────────────────────────────────────
const MEMBER_TYPES = [
  { value: "ORDINARY",   label: "Membre Ordinaire", price: "20 000 FCFA",  desc: "Accès aux formations et à la communauté" },
  { value: "HONORARY",   label: "Membre d'Honneur", price: "200 000 FCFA", desc: "Adhésion à vie — accès premium" },
  { value: "BENEFACTOR", label: "Bienfaiteur",      price: "Gratuit",      desc: "Soutien à la mission de Parents School" },
]

type SponsorStatus = "idle" | "checking" | "valid" | "invalid"
type SuccessData   = { memberCode: string; firstName: string; memberType: string }

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [sponsorStatus, setSponsorStatus] = useState<SponsorStatus>("idle")
  const [sponsorName,   setSponsorName]   = useState("")
  const [apiError,      setApiError]      = useState<string | null>(null)
  const [success,       setSuccess]       = useState<SuccessData | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      sponsorCode: "", firstName: "", lastName: "",
      email: "", password: "", phone: "",
      country: "CM", profession: "", memberType: "ORDINARY",
    },
    mode: "onChange",
  })

  const { watch, formState: { isSubmitting, isValid } } = form
  const watchedCode    = watch("sponsorCode")
  const watchedCountry = watch("country")
  const watchedType    = watch("memberType")
  const seqPreview     = watchedCountry ? `PS${watchedCountry}_XXX` : ""

  // Validation temps réel code parrain — debounce 600ms
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

  // Soumission → POST /api/auth/register
  const onSubmit = async (data: FormValues) => {
    setApiError(null)
    try {
      const res = await fetch("/api/auth/register", {
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
          profession:  data.profession || undefined,
          userType:    data.memberType,
        }),
      })
      const result = await res.json()
      if (!res.ok) { setApiError(result.message || "Une erreur est survenue"); return }
      setSuccess({
        memberCode: result.memberCode || result.code || "—",
        firstName:  data.firstName,
        memberType: data.memberType,
      })
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
      <main className="min-h-screen bg-[#f8f4ef]">
        <Header />
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 pt-20 pb-12">
          <div className="w-full max-w-md rounded-xl bg-white p-10 shadow-sm border border-[#a3ade8]/30 text-center space-y-6">
            <PartyPopper className="mx-auto h-14 w-14 text-[#e8b41f]" />

            <div>
              <h1 className="text-2xl font-bold text-[#3f2f85]">Bienvenue, {success.firstName} !</h1>
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
        </div>
        <Footer />
      </main>
    )
  }

  // ── Formulaire ────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#f8f4ef]">
      <Header />
      <div className="mx-auto max-w-xl px-4 pt-24 pb-16">

        {/* En-tête */}
        <div className="mb-8 text-center">
          {/* <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#3f2f85] to-[#a3ade8]">
            <span className="text-xl font-bold text-[#e8b41f]">PS</span>
          </div> */}
          <h1 className="text-3xl font-bold text-[#3f2f85]">Créer un compte</h1>
          <p className="mt-1 text-sm text-slate-500">Rejoignez la communauté Parents School</p>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-sm border border-[#a3ade8]/30">

          {apiError && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* 1. Code parrain — EN PREMIER */}
              <FormField control={form.control} name="sponsorCode" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-[#3f2f85]">
                    Code parrain <span className="font-normal text-slate-400">(optionnel)</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="PS237_001"
                        disabled={isSubmitting}
                        className="border-[#a3ade8]/40 bg-[#f8f4ef] pr-10 focus-visible:border-[#3f2f85] focus-visible:ring-0"
                      />
                    </FormControl>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      {sponsorStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
                      {sponsorStatus === "valid"    && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                      {sponsorStatus === "invalid"  && <XCircle className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                  {sponsorStatus === "valid"   && <p className="text-xs text-green-600 font-medium">✓ Parrain : {sponsorName}</p>}
                  {sponsorStatus === "invalid" && <p className="text-xs text-red-600">Code parrain invalide</p>}
                  {seqPreview && (
                    <p className="text-xs text-slate-400">
                      Votre code sera : <span className="font-semibold text-[#3f2f85]">{seqPreview}</span>
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )} />

              {/* 2. Prénom + Nom */}
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-[#3f2f85]">Prénom <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Jean" disabled={isSubmitting}
                        className="border-[#a3ade8]/40 bg-[#f8f4ef] focus-visible:border-[#3f2f85] focus-visible:ring-0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-[#3f2f85]">Nom <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Dupont" disabled={isSubmitting}
                        className="border-[#a3ade8]/40 bg-[#f8f4ef] focus-visible:border-[#3f2f85] focus-visible:ring-0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* 3. Email */}
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-[#3f2f85]">Email <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="votre@email.com" disabled={isSubmitting}
                      className="border-[#a3ade8]/40 bg-[#f8f4ef] focus-visible:border-[#3f2f85] focus-visible:ring-0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* 4. Mot de passe */}
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-[#3f2f85]">Mot de passe <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="••••••••" disabled={isSubmitting}
                      className="border-[#a3ade8]/40 bg-[#f8f4ef] focus-visible:border-[#3f2f85] focus-visible:ring-0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* 5. Téléphone */}
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-[#3f2f85]">Téléphone <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" placeholder="+237 6XX XXX XXX" disabled={isSubmitting}
                      className="border-[#a3ade8]/40 bg-[#f8f4ef] focus-visible:border-[#3f2f85] focus-visible:ring-0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* 6. Pays — Select shadcn/ui avec indicatifs */}
              <FormField control={form.control} name="country" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-[#3f2f85]">Pays <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger className="border-[#a3ade8]/40 bg-[#f8f4ef] focus:ring-0 focus:border-[#3f2f85]">
                        <SelectValue placeholder="Sélectionnez votre pays" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COUNTRIES.map(c => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.name} <span className="text-slate-400 text-xs">({c.dial})</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              {/* 7. Profession */}
              <FormField control={form.control} name="profession" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-[#3f2f85]">
                    Profession <span className="font-normal text-slate-400">(optionnel)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enseignant, Médecin..." disabled={isSubmitting}
                      className="border-[#a3ade8]/40 bg-[#f8f4ef] focus-visible:border-[#3f2f85] focus-visible:ring-0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* 8. Type de membre — RadioGroup shadcn/ui */}
              <FormField control={form.control} name="memberType" render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-[#3f2f85]">Type de membre <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                      className="grid gap-3"
                    >
                      {MEMBER_TYPES.map(t => (
                        <label key={t.value}
                          className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition
                            ${watchedType === t.value
                              ? "border-[#3f2f85] bg-[#3f2f85]/5"
                              : "border-[#a3ade8]/40 bg-[#f8f4ef] hover:border-[#3f2f85]/40"}`}>
                          <RadioGroupItem value={t.value} className="mt-0.5 shrink-0" />
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
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button
                type="submit"
                disabled={isSubmitDisabled}
                className="w-full bg-[#3f2f85] py-6 font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Inscription en cours...</>
                  : <>Créer mon compte <ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>

            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Déjà un compte ?{" "}
            <Link href="/auth/login" className="font-semibold text-[#3f2f85] hover:text-[#e8b41f] transition">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
