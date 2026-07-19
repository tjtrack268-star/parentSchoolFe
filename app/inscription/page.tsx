"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import PromoBanner from "@/components/PromoBanner"

const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSdz7RzVBGB2h5f7hNweuTlnUGckZoibxU87ZGRd5PtPIZd-Sw/formResponse"

const SOURCE_OPTIONS = [
  { value: "Groupe watsapp", label: "Groupe WhatsApp" },
  { value: "Annonce à l'église", label: "Annonce à l'église" },
  { value: "Tierce personne", label: "Tierce personne" },
]

const MEMBERSHIP_OPTIONS = [
  {
    value: "Membre Parents School: 95 000F ( Inscription 15000F, frais de formation: 80000F)",
    label: "Membre Parents School — 95 000 F",
    detail: "Inscription 15 000 F + frais de formation 80 000 F",
  },
  {
    value: "Non membre : 170 000F ( Inscription 20000F, frais de formation: 150000F)",
    label: "Non membre — 170 000 F",
    detail: "Inscription 20 000 F + frais de formation 150 000 F",
  },
]

const PAYMENT_MODE_OPTIONS = [
  { value: "une seule fois", label: "En une seule fois" },
  { value: "deux tranches", label: "En deux tranches" },
]

const PAYMENT_METHOD_OPTIONS = [
  {
    value:
      "Cameroun-Afrique Centrale et payement mobil international : MOMO +237 674700408 - OM +237 695150366 EMADOUAN NGUH CLEMENT",
    label: "Cameroun / Afrique Centrale et paiement mobile international",
    detail: "MOMO +237 674 700 408 — OM +237 695 150 366 (EMADOUAN NGUH CLEMENT)",
  },
  {
    value: "Cote d'Ivoire : +225 0707505079 – BOGNI ABE CLOTAIRE",
    label: "Côte d'Ivoire",
    detail: "+225 07 07 50 50 79 (BOGNI ABE CLOTAIRE)",
  },
  {
    value: "Togo :  +228 90 07 92 56. - VIGLO Yawovi Oga Mawuena",
    label: "Togo",
    detail: "+228 90 07 92 56 (VIGLO Yawovi Oga Mawuena)",
  },
  {
    value: "Burkina Faso : +226 71 60 38 62 - KABORE Assiata Epouse BALBONE",
    label: "Burkina Faso",
    detail: "+226 71 60 38 62 (KABORE Assiata épouse BALBONE)",
  },
  {
    value: "MONEYGRAM, WESTERN UNION, TAPSEND, à  Nom : EMADOUAN NGUH  - Prénom : Clément",
    label: "MoneyGram, Western Union, Tapsend",
    detail: "Nom : EMADOUAN NGUH — Prénom : Clément",
  },
]

const MODULES = [
  "Module 1 : Blessures émotionnelles et traumatismes",
  "Module 2 : Connaître et comprendre les enfants",
  "Module 3 : Communiquer, interagir avec les enfants",
  "Module 4 : Relation interparentale",
]

const BENEFITS = [
  "Participation aux cours",
  "Accès au replay des cours",
  "Soutenance devant le jury",
  "Diplôme imprimé haut de gamme",
  "Support de cours",
  "Enrôlement dans un de nos programmes pour exercer les compétences acquises",
  "Éligibilité pour suivre les spécialisations",
]

const initialForm = {
  fullName: "",
  profession: "",
  country: "",
  whatsapp: "",
  source: "",
  sourceOther: "",
  referrer: "",
  membership: "",
  paymentMode: "",
  paymentMethod: "",
  paymentDate: "",
}

export default function InscriptionPage() {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const setField = (field: keyof typeof initialForm, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const params = new URLSearchParams({
      "entry.357560557": form.fullName,
      "entry.1351780913": form.profession,
      "entry.1525994042": form.country,
      "entry.748701749": form.whatsapp,
      "entry.1835131414": form.referrer,
      "entry.876448959": form.membership,
      "entry.1578828311": form.paymentMode,
      "entry.911275658": form.paymentMethod,
      "entry.933790055": form.paymentDate,
    })
    if (form.source === "__other_option__") {
      params.set("entry.1481789807", "__other_option__")
      params.set("entry.1481789807.other_option_response", form.sourceOther)
    } else {
      params.set("entry.1481789807", form.source)
    }
    await Promise.allSettled([
      fetch(GOOGLE_FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }),
      fetch("/api/public/formation-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          profession: form.profession,
          country: form.country,
          whatsapp: form.whatsapp,
          infoSource: form.source === "__other_option__" ? `Autre : ${form.sourceOther}` : form.source,
          referrer: form.referrer,
          participantType: form.membership,
          paymentMode: form.paymentMode,
          paymentMethod: form.paymentMethod,
          paymentDate: form.paymentDate,
        }),
      }),
    ])
    setLoading(false)
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3f2f85]"

  const RadioOption = ({
    name,
    value,
    label,
    detail,
    checked,
    onChange,
  }: {
    name: string
    value: string
    label: string
    detail?: string
    checked: boolean
    onChange: (value: string) => void
  }) => (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${
        checked ? "border-[#3f2f85] bg-[#3f2f85]/5" : "border-slate-200 bg-white hover:border-[#a3ade8]"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        required
        className="mt-1 h-4 w-4 accent-[#3f2f85]"
      />
      <span>
        <span className="block text-sm font-medium text-slate-900">{label}</span>
        {detail && <span className="mt-0.5 block text-xs text-slate-500">{detail}</span>}
      </span>
    </label>
  )

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#f8f4ef] text-slate-900">
        <Header />
        <div className="flex min-h-screen items-center justify-center px-4 pt-16">
          <div className="max-w-lg rounded-xl bg-white p-10 text-center shadow-lg">
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-600" />
            <h1 className="mb-3 text-2xl font-bold text-[#3f2f85]">Inscription envoyée !</h1>
            <p className="mb-8 text-slate-600">
              Votre fiche d'inscription à la 7ème promotion de la formation Conseillers Parentaux a bien été
              enregistrée. Vous serez contacté via WhatsApp pour la suite du processus.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg bg-[#3f2f85] px-6 py-3 font-semibold text-white transition hover:opacity-90"
              >
                Retour à l'accueil
              </Link>
              <button
                onClick={() => {
                  setForm(initialForm)
                  setSubmitted(false)
                }}
                className="inline-flex items-center justify-center rounded-lg border-2 border-[#3f2f85] px-6 py-3 font-semibold text-[#3f2f85] transition hover:bg-[#3f2f85] hover:text-white"
              >
                Nouvelle inscription
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f8f4ef] text-slate-900">
      <Header />
      <div className="pt-16">
        <section className="bg-[#3f2f85] text-white">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">
              Formation certifiante — 7ème promotion
            </p>
            <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl">
              Conseillers Parentaux — Fiche d'inscription
            </h1>
            <p className="max-w-3xl text-lg text-slate-100">
              Du 03 août au 26 octobre 2026 — 3 mois de formation, 3 séances par semaine, 2 heures par séance.
              Lundi et mercredi 19h–21h, samedi 18h–20h (heure du Cameroun).
            </p>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-14 lg:grid-cols-12">
          <form onSubmit={handleSubmit} className="space-y-8 rounded-xl bg-white p-6 shadow-sm sm:p-8 lg:col-span-8">
            <div className="space-y-5">
              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Nom &amp; Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  value={form.fullName}
                  onChange={e => setField("fullName", e.target.value)}
                  required
                  className={inputClass}
                  placeholder="Votre nom complet"
                />
              </div>
              <div>
                <label htmlFor="profession" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Profession <span className="text-red-500">*</span>
                </label>
                <input
                  id="profession"
                  value={form.profession}
                  onChange={e => setField("profession", e.target.value)}
                  required
                  className={inputClass}
                  placeholder="Votre profession"
                />
              </div>
              <div>
                <label htmlFor="country" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Pays <span className="text-red-500">*</span>
                </label>
                <input
                  id="country"
                  value={form.country}
                  onChange={e => setField("country", e.target.value)}
                  required
                  className={inputClass}
                  placeholder="Votre pays de résidence"
                />
              </div>
              <div>
                <label htmlFor="whatsapp" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Numéro de téléphone (WhatsApp) <span className="text-red-500">*</span>
                </label>
                <input
                  id="whatsapp"
                  type="tel"
                  value={form.whatsapp}
                  onChange={e => setField("whatsapp", e.target.value)}
                  required
                  className={inputClass}
                  placeholder="+237 6XX XXX XXX"
                />
              </div>
            </div>

            <fieldset className="space-y-3">
              <legend className="mb-1 text-sm font-semibold text-slate-700">
                Comment avez-vous été informé de cette formation ? <span className="text-red-500">*</span>
              </legend>
              {SOURCE_OPTIONS.map(option => (
                <RadioOption
                  key={option.value}
                  name="source"
                  value={option.value}
                  label={option.label}
                  checked={form.source === option.value}
                  onChange={value => setField("source", value)}
                />
              ))}
              <RadioOption
                name="source"
                value="__other_option__"
                label="Autre"
                checked={form.source === "__other_option__"}
                onChange={value => setField("source", value)}
              />
              {form.source === "__other_option__" && (
                <input
                  value={form.sourceOther}
                  onChange={e => setField("sourceOther", e.target.value)}
                  required
                  className={inputClass}
                  placeholder="Précisez"
                />
              )}
            </fieldset>

            <div>
              <label htmlFor="referrer" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Nom et contact de la personne qui vous a référé à cette formation{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="referrer"
                value={form.referrer}
                onChange={e => setField("referrer", e.target.value)}
                required
                rows={2}
                className={`${inputClass} resize-none`}
                placeholder="Nom et numéro de téléphone du référent"
              />
            </div>

            <fieldset className="space-y-3">
              <legend className="mb-1 text-sm font-semibold text-slate-700">
                Je participe en qualité de <span className="text-red-500">*</span>
              </legend>
              {MEMBERSHIP_OPTIONS.map(option => (
                <RadioOption
                  key={option.value}
                  name="membership"
                  value={option.value}
                  label={option.label}
                  detail={option.detail}
                  checked={form.membership === option.value}
                  onChange={value => setField("membership", value)}
                />
              ))}
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="mb-1 text-sm font-semibold text-slate-700">
                Modalité de paiement <span className="text-red-500">*</span>
              </legend>
              {PAYMENT_MODE_OPTIONS.map(option => (
                <RadioOption
                  key={option.value}
                  name="paymentMode"
                  value={option.value}
                  label={option.label}
                  checked={form.paymentMode === option.value}
                  onChange={value => setField("paymentMode", value)}
                />
              ))}
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="mb-1 text-sm font-semibold text-slate-700">
                Moyen de paiement <span className="text-red-500">*</span>
              </legend>
              {PAYMENT_METHOD_OPTIONS.map(option => (
                <RadioOption
                  key={option.value}
                  name="paymentMethod"
                  value={option.value}
                  label={option.label}
                  detail={option.detail}
                  checked={form.paymentMethod === option.value}
                  onChange={value => setField("paymentMethod", value)}
                />
              ))}
            </fieldset>

            <div>
              <label htmlFor="paymentDate" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Date de paiement <span className="text-red-500">*</span>
              </label>
              <input
                id="paymentDate"
                type="date"
                value={form.paymentDate}
                onChange={e => setField("paymentDate", e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#3f2f85] px-8 py-4 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Envoi en cours..." : "Envoyer mon inscription"}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>

          <div className="space-y-8 lg:col-span-4">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-[#3f2f85]">Programme</h2>
              <ul className="space-y-3">
                {MODULES.map(module => (
                  <li key={module} className="flex items-start gap-2 text-sm text-slate-600">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#e8b41f]" />
                    {module}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-[#3f2f85]">La formation offre</h2>
              <ul className="space-y-3">
                {BENEFITS.map(benefit => (
                  <li key={benefit} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#e8b41f]" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-[#3f2f85] p-6 text-white shadow-sm">
              <h2 className="mb-2 text-lg font-bold text-[#e8b41f]">Notre objectif</h2>
              <p className="text-sm text-slate-100">Équiper le maximum pour changer notre monde.</p>
            </div>
            <PromoBanner />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
