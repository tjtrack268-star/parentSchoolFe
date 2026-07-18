"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BookOpen, GraduationCap, Quote } from "lucide-react"

type Slide =
  | { type: "formation"; title: string; text: string; image?: string }
  | { type: "ouvrage"; title: string; text: string; image: string; auteur: string; prix: string }
  | { type: "temoignage"; text: string; author: string; role: string }

const FORMATIONS: Slide[] = [
  {
    type: "formation",
    title: "Session d'Enseignement Dominical",
    text: "4 enseignements en ligne chaque dimanche : parentalité positive et relation inter-parentale. 1h30 par session.",
    image: "/formation_img/enseignement.jpeg",
  },
  {
    type: "formation",
    title: "Formation des Conseillers Parentaux",
    text: "Évaluer les situations familiales et guider les familles vers des solutions adaptées. 3 mois — 36 leçons — certificat officiel.",
    image: "/formation_img/Conseiller parental.jpeg",
  },
  {
    type: "formation",
    title: "Coaching / Formation en Art Oratoire",
    text: "Influencer et inspirer par votre communication, en famille comme en public. 21 jours — certificat de formation.",
    image: "/formation_img/Art oratoire.jpeg",
  },
  {
    type: "formation",
    title: "Programme Empower Youth",
    text: "Développement personnel intensif pour les jeunes de 11 à 20 ans : émotions, relations, leadership. 9 mois — 3 niveaux progressifs.",
  },
]

const OUVRAGES: Slide[] = [
  {
    type: "ouvrage",
    title: "Réussir le Métier de Parent",
    auteur: "Clément Emadouan",
    prix: "5 000 FCFA",
    text: "Techniques, approches et astuces pour accompagner efficacement les parents dans leur mission éducative.",
    image: "/Ouvrage_img/Réussir le metier de parent auteur clement Emadouan.jpeg",
  },
  {
    type: "ouvrage",
    title: "Et Vous Pères, Comment Être un Papa Inspirant et Impactant ?",
    auteur: "Clément Emadouan",
    prix: "7 000 FCFA",
    text: "Le rôle, la mission et la fonction du père dans l'éducation des enfants et le bien-être de la famille.",
    image: "/Ouvrage_img/Et vous pères Comment être un papa inspirant et impactant Auteur Clement Emadouan.jpeg",
  },
  {
    type: "ouvrage",
    title: "Briser la Chaîne des Blessures Émotionnelles dans la Famille",
    auteur: "Laurène Kadjeu",
    prix: "10 000 FCFA",
    text: "Les blessures émotionnelles, leurs impacts et les voies de guérison pour restaurer l'équilibre familial.",
    image: "/Ouvrage_img/Brise la chaine des blessures Emotionnelles dans ta famille auteur Laurène Kadjeu.jpeg",
  },
  {
    type: "ouvrage",
    title: "Se Réinventer après une Séparation",
    auteur: "Clément Emadouan",
    prix: "10 000 FCFA",
    text: "Un accompagnement bienveillant pour se reconstruire après une séparation et retrouver sa place de parent épanoui.",
    image: "/Ouvrage_img/Se Réinventer après une séparation auteur Clement Emadouan.jpeg",
  },
]

const TEMOIGNAGES: Slide[] = [
  {
    type: "temoignage",
    text: "Parents School m'a aidée à mieux comprendre mes enfants. Notre communication est devenue plus apaisée et constructive.",
    author: "Mireille K. — Douala",
    role: "Maman de 3 enfants",
  },
  {
    type: "temoignage",
    text: "Les modules sont pratiques, concrets et adaptés à notre réalité. J'applique chaque semaine ce que j'apprends.",
    author: "Paul N. — Yaoundé",
    role: "Père de famille",
  },
  {
    type: "temoignage",
    text: "La communauté est bienveillante. On se sent accompagné, pas jugé. C'est un vrai soutien pour les parents.",
    author: "Sarah M. — Abidjan",
    role: "Parent relais",
  },
  {
    type: "temoignage",
    text: "Au-delà de la formation, j'ai gagné en confiance dans mon rôle de parent et de mentor dans ma communauté.",
    author: "Clotaire A. — Bafoussam",
    role: "Leader Senior",
  },
]

const SLIDES: Slide[] = FORMATIONS.flatMap((formation, i) => [formation, OUVRAGES[i], TEMOIGNAGES[i]])

const META = {
  formation: { label: "Formation", href: "/public/formations", cta: "Voir les formations", badge: "bg-[#e8b41f] text-[#3f2f85]" },
  ouvrage: { label: "Ouvrage", href: "/public/ouvrages", cta: "Voir les ouvrages", badge: "bg-[#a3ade8] text-[#3f2f85]" },
  temoignage: { label: "Témoignage", href: "/public/temoignages", cta: "Lire les témoignages", badge: "bg-white text-[#3f2f85]" },
}

export default function PromoBanner() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => setIndex(i => (i + 1) % SLIDES.length), 4500)
    return () => clearInterval(timer)
  }, [paused])

  return (
    <section
      className="bg-[#3f2f85] text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">
          Découvrez aussi Parents School
        </p>

        <div className="relative min-h-[340px] sm:min-h-[240px]">
          {SLIDES.map((slide, i) => {
            const meta = META[slide.type]
            return (
              <div
                key={i}
                className={`absolute inset-0 flex flex-col items-center gap-6 transition-opacity duration-700 sm:flex-row ${
                  i === index ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                aria-hidden={i !== index}
              >
                <div className="h-40 w-40 shrink-0 overflow-hidden rounded-xl bg-white/10 sm:h-52 sm:w-52">
                  {"image" in slide && slide.image ? (
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      width={208}
                      height={208}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      {slide.type === "temoignage" ? (
                        <Quote className="h-16 w-16 text-[#e8b41f]" />
                      ) : slide.type === "ouvrage" ? (
                        <BookOpen className="h-16 w-16 text-[#e8b41f]" />
                      ) : (
                        <GraduationCap className="h-16 w-16 text-[#e8b41f]" />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${meta.badge}`}>
                    {meta.label}
                  </span>

                  {slide.type === "temoignage" ? (
                    <>
                      <p className="mt-3 text-lg italic leading-relaxed text-white/95">“{slide.text}”</p>
                      <p className="mt-3 font-semibold text-[#e8b41f]">{slide.author}</p>
                      <p className="text-sm text-white/70">{slide.role}</p>
                    </>
                  ) : (
                    <>
                      <h3 className="mt-3 text-2xl font-bold">{slide.title}</h3>
                      {slide.type === "ouvrage" && (
                        <p className="mt-1 text-sm font-semibold text-[#e8b41f]">
                          {slide.auteur} — {slide.prix}
                        </p>
                      )}
                      <p className="mt-2 leading-relaxed text-white/85">{slide.text}</p>
                    </>
                  )}

                  <Link
                    href={meta.href}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#e8b41f] px-5 py-2.5 text-sm font-semibold text-[#3f2f85] transition hover:opacity-90"
                  >
                    {meta.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {SLIDES.map((slide, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Diapositive ${i + 1} — ${META[slide.type].label}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-[#e8b41f]" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
