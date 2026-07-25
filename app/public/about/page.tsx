"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Eye, Heart, Lightbulb, Sprout, Users, Zap, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { ORG_MEMBERS } from "@/data/organisation"

const objectives = [
  {
    icon: Lightbulb,
    title: "Conscientiser les parents",
    description:
      "Susciter une prise de conscience du rôle des parents comme premiers éducateurs.",
  },
  {
    icon: Zap,
    title: "Renforcer les capacités",
    description:
      "Outiller les parents avec des méthodes concrètes et adaptées aux réalités actuelles.",
  },
  {
    icon: Sprout,
    title: "Promouvoir l'esprit familial",
    description:
      "Encourager le partage d'expériences, la solidarité et la transmission intergénérationnelle.",
  },
  {
    icon: Users,
    title: "Bâtir une communauté",
    description:
      "Créer un réseau de parents équipés, engagés et accompagnés spirituellement.",
  },
]

const team = ORG_MEMBERS

const values = [
  {
    icon: Users,
    title: "Responsabilité parentale",
    description: "Placer les parents au coeur de l'éducation de leurs enfants.",
  },
  {
    icon: Heart,
    title: "Amour et respect de l'enfant",
    description: "Développer un environnement de bienveillance, d'écoute et de confiance.",
  },
  {
    icon: Lightbulb,
    title: "Transmission des valeurs",
    description: "Préserver et partager des principes solides pour des familles stables.",
  },
]

function TeamCarousel() {
  const [current, setCurrent] = useState(0)
  const visible = 3
  const total = team.length
  const prev = () => setCurrent((i) => (i === 0 ? total - 1 : i - 1))
  const next = () => setCurrent((i) => (i === total - 1 ? 0 : i + 1))

  useEffect(() => {
    const timer = setInterval(next, 3000)
    return () => clearInterval(timer)
  }, [])

  const visibleMembers = Array.from({ length: visible }, (_, i) => team[(current + i) % total])

  return (
    <section className="bg-[#3f2f85]/5">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="mb-4 text-center text-4xl font-bold text-[#3f2f85] sm:text-5xl">Notre Équipe</h2>
        <p className="mx-auto mb-12 max-w-3xl text-center text-slate-600">
          Des passionnés engagés pour transformer la parentalité et accompagner les familles vers l'épanouissement.
        </p>

        <div className="relative flex items-center gap-4">
          <button
            onClick={prev}
            className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-full bg-[#3f2f85] text-white shadow-lg hover:bg-[#e8b41f] hover:text-[#3f2f85] transition"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="grid grid-cols-3 gap-6 flex-1">
            {visibleMembers.map((member, i) => (
              <div
                key={(current + i) % total}
                className={`flex flex-col rounded-xl bg-white shadow-md overflow-hidden border-t-4 transition-all duration-300 ${
                  i === 1 ? "border-[#e8b41f] scale-105 shadow-xl" : "border-[#3f2f85] opacity-80"
                }`}
              >
                <div className="h-72 w-full overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: "center 20%" }}
                  />
                </div>
                <div className="flex flex-col items-center p-5 text-center">
                  <h3 className="text-lg font-bold text-[#3f2f85]">{member.name}</h3>
                  <p className="mb-2 text-xs font-semibold text-[#e8b41f] uppercase tracking-wide">{member.role}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={next}
            className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-full bg-[#3f2f85] text-white shadow-lg hover:bg-[#e8b41f] hover:text-[#3f2f85] transition"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {team.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === current ? "bg-[#3f2f85] w-6" : "bg-slate-300 w-2.5"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8f4ef] text-slate-900">
      <Header />
      <div className="pt-16">
      <section className="bg-[#3f2f85] text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-20 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <div className="mb-4 inline-flex items-center gap-3">
              <Eye className="h-6 w-6 text-[#e8b41f]" />
              <h1 className="text-4xl font-bold tracking-wide text-[#e8b41f] sm:text-5xl">Notre Vision</h1>
            </div>
            <p className="mb-6 text-lg leading-relaxed text-slate-100">
              Voir émerger des parents restaurés et instruits, qui bâtissent des familles stables,
              harmonieuses et épanouies, selon le plan divin.
            </p>
            <p className="text-slate-300">
              Nous aspirons à une communauté mondiale où chaque parent dispose des ressources,
              du soutien et de l'accompagnement nécessaires pour transformer durablement sa famille.
            </p>
          </div>
          <div className="order-1 lg:order-2 overflow-hidden rounded-xl border border-white/10">
            <img
              src="/vision/vision.jpeg"
              alt="Vision Parents School"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#a3ade8]/30">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-20 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-xl shadow-lg">
            <img
              src="/mission/missionz.jpeg"
              alt="Mission Parents School"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="mb-4 inline-flex items-center gap-3">
              <Zap className="h-6 w-6 text-[#3f2f85]" />
              <h2 className="text-4xl font-bold text-[#3f2f85] sm:text-5xl">Notre Mission</h2>
            </div>
            <p className="mb-6 text-xl font-semibold leading-relaxed">
              Former et équiper les parents pour l'éducation de leurs enfants, tout en recherchant
              l'intervention de Dieu par la prière.
            </p>
            <p className="mb-3 text-slate-700">
              Nous donnons aux parents des outils pratiques, des méthodes applicables et un soutien
              communautaire concret.
            </p>
            <p className="text-slate-700">
              « Allez donc, et enseignez toutes les nations... »{" "}
              <span className="font-semibold text-[#3f2f85]">Matthieu 28:19</span>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="mb-12 text-center text-4xl font-bold text-[#3f2f85] sm:text-5xl">Nos Valeurs</h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="overflow-hidden rounded-xl shadow-lg">
              <img
                src="/vision/valeur.jpeg"
                alt="Valeurs Parents School"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-6">
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <div key={value.title} className="flex gap-4 rounded-lg border border-slate-200 p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#3f2f85] text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{value.title}</h3>
                      <p className="text-slate-600">{value.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <TeamCarousel />

      <section className="bg-[#a3ade8]/20">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="mb-4 text-center text-4xl font-bold text-[#3f2f85] sm:text-5xl">Nos Objectifs</h2>
          <p className="mx-auto mb-12 max-w-3xl text-center text-slate-600">
            Parents School poursuit des objectifs structurants pour transformer la parentalité de
            façon durable.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {objectives.map((objective) => {
              const Icon = objective.icon
              return (
                <div key={objective.title} className="rounded-lg border-l-4 border-[#e8b41f] bg-white p-6 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#3f2f85] text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{objective.title}</h3>
                  </div>
                  <p className="text-slate-600">{objective.description}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-14 overflow-hidden rounded-xl bg-white shadow-lg">
            <img
              src="/vision/objectif.jpeg"
              alt="Objectif de croissance mondiale"
              className="h-full w-full object-cover"
            />
            <div className="p-6 text-center">
              <p className="text-lg font-semibold text-slate-700">
                Notre ambition: <span className="text-3xl font-bold text-[#3f2f85]">1 000 000 membres</span>
              </p>
              <p className="mt-2 text-xl font-bold text-[#e8b41f]">Objectif 2026: 400 membres</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#3f2f85] to-[#a3ade8] py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Heart className="mx-auto mb-6 h-14 w-14 fill-white" />
          <h2 className="mb-5 text-4xl font-bold sm:text-5xl">Rejoignez Notre Communauté</h2>
          <p className="mb-8 text-lg text-red-100">
            Rejoignez Parents School et développez votre leadership parental avec une communauté
            engagée.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e8b41f] px-8 py-4 font-semibold text-[#3f2f85] transition hover:opacity-90"
            >
              Commencer maintenant
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-lg border-2 border-[#e8b41f] px-8 py-4 font-semibold text-[#e8b41f] transition hover:bg-[#e8b41f] hover:text-[#3f2f85]"
            >
              Nous contacter
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold">50+</p>
              <p className="text-sm text-red-100">Modules</p>
            </div>
            <div>
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-sm text-red-100">Membres actifs</p>
            </div>
            <div>
              <p className="text-3xl font-bold">20+</p>
              <p className="text-sm text-red-100">Pays</p>
            </div>
          </div>
        </div>
      </section>
      </div>
      <Footer />
    </main>
  )
}
