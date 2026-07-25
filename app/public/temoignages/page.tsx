"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Quote, Users, Send, CheckCircle } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

interface Testimonial {
  id: number
  content: string
  authorName: string
  authorCity: string
  authorRole: string
  rating: number
  createdAt: string
}

const VIDEO_TESTIMONIALS = [
  { id: "bJZNNSkbmks", title: "Impact de la formation de conseillers parentaux : témoignage de Hilaire Lelou" },
  { id: "FYl5FSGuPKI", title: "Parents School : témoignages de transformation" },
  { id: "2cenM0rspzI", title: "Cérémonie de remise de certificats — Conseillers parentaux & art oratoire" },
  { id: "EHN0ahmjfW4", title: "Notre offre sociale de formation de conseiller parental" },
  { id: "o1-JEtSrK0w", title: "Devenez conseiller parental — témoignages" },
  { id: "v_JAGz31tBo", title: "Témoignage Parents School — transformation familiale" },
  { id: "QO6zBiJCOQg", title: "Témoignage Parents School — parcours de parent" },
  { id: "QqYLkHfZqVI", title: "Témoignage Parents School — impact sur la famille" },
  { id: "E4wspMUMQWU", title: "Témoignage Parents School — expérience de formation" },
  { id: "afA4ZjWUrfk", title: "Témoignage Parents School — conseiller parental" },
  { id: "3x3mysU1kHg", title: "Témoignage Parents School — changement de vie" },
  { id: "DdPIiNO_HdY", title: "Témoignage Parents School — croissance personnelle" },
  { id: "aGYtwjYeJ5s", title: "Témoignage Parents School — accompagnement parental" },
  { id: "_b_5_oXbc7I", title: "Témoignage Parents School — vie de famille" },
  { id: "AzKPRfVHkIY", title: "Témoignage Parents School — formation parentale" },
  { id: "vlgbMl_I6V0", title: "Témoignage Parents School — devenir meilleur parent" },
  { id: "MzC7hxrtwdQ", title: "Témoignage Parents School — communauté de parents" },
  { id: "bpN7NwFQZ1E", title: "Témoignage Parents School — réseau parental" },
]

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange?.(s)}
          className={`text-2xl transition ${s <= value ? "text-[#e8b41f]" : "text-slate-300"} ${onChange ? "hover:text-[#e8b41f] cursor-pointer" : "cursor-default"}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function TemoignagesPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ authorName: "", authorCity: "", authorRole: "", content: "", rating: 5 })

  // Escalier de témoignages : fenêtre glissante, avance d'un cran en boucle
  // 1 carte visible sur petit écran, 2 à partir du breakpoint lg (1024px)
  const [stairStart, setStairStart] = useState(0)
  const [screenSteps, setScreenSteps] = useState(1)
  const stairPaused = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const update = () => setScreenSteps(mq.matches ? 2 : 1)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    fetch("/api/testimonials")
      .then(r => r.json())
      .then(data => { setTestimonials(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.content.trim() || !form.authorName.trim()) return
    setSubmitting(true)
    try {
      await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
      setForm({ authorName: "", authorCity: "", authorRole: "", content: "", rating: 5 })
    } catch {}
    setSubmitting(false)
  }

  const displayList: Testimonial[] = testimonials.length > 0 ? testimonials : [
    { id: -1, content: "J'ai adhéré à la Parents School pour renforcer mes capacités par rapport à ma mission au sein de l'ONG... La formation certifiante de conseiller parental m'a permis de rencontrer des personnes et d'apprendre d'elles. Mes yeux ont été ouverts sur la thérapie familiale, j'ai appris à faire une consultation des parents et des enfants afin de résoudre les problèmes entre parents et enfants.", authorName: "Yokoi Ahoua Esther", authorCity: "Côte d'Ivoire", authorRole: "Présidente Fondatrice de l'ONG Carrefour Famille", rating: 5, createdAt: "" },
    { id: -2, content: "La formation des conseillers parentaux a eu un impact significatif sur ma vie et mon ministère. Elle a changé ma perception et ma façon de juger le comportement des gens. Elle m'a permis d'acquérir des compétences essentielles pour accompagner les familles dans leurs défis quotidiens. Mon approche a évolué vers une meilleure écoute des souffrances des autres.", authorName: "Pasteur Yao Israël Nguessan", authorCity: "Sénégal", authorRole: "Pasteur", rating: 5, createdAt: "" },
    { id: -3, content: "Avant cette formation en art oratoire, j'étais timide. Bien qu'étant pasteur, j'étais stressé et j'avais souvent peur lorsqu'il fallait prendre la parole devant des personnalités. Les connaissances apprises m'ont permis d'être libre, de savoir ce qu'il faut faire et ce qu'il ne faut pas faire.", authorName: "Pasteur Vonopou Vangah Daniel", authorCity: "Côte d'Ivoire", authorRole: "Pasteur", rating: 5, createdAt: "" },
    { id: -4, content: "Le coach a été pour moi comme Jésus a été pour Pierre. Cette formation en art oratoire m'a énormément fait du bien, elle m'a ouvert les yeux sur un certain nombre de choses, les styles d'art oratoire, la façon de se connecter à son public.", authorName: "Pasteur Abé Clotaire Bogni", authorCity: "Côte d'Ivoire", authorRole: "Coordinateur & Membre d'honneur", rating: 5, createdAt: "" },
    { id: -5, content: "Travailler avec Monsieur Emadouan a été un moment riche d'apprentissage, il m'a parlé de croissance personnelle, il m'a appris à mieux me connaître, mieux m'organiser, à mieux gérer mon personnel. J'ai appris à lire, avant cela, je n'ai jamais aimé la lecture.", authorName: "Germaine Ndongo Ndongo", authorCity: "Cameroun", authorRole: "Chef d'entreprise", rating: 5, createdAt: "" },
    { id: -6, content: "Je faisais déjà de la maîtrise de cérémonie, mais je sentais qu'il me manquait quelque chose pour passer au niveau supérieur. Après la formation, j'ai gagné en aisance, en confiance, en influence et en impact. En avril dernier, j'ai maîtrisé une cérémonie parrainée par le Président de l'Assemblée nationale.", authorName: "Felix Dombroda Kobenan", authorCity: "Côte d'Ivoire", authorRole: "Formateur", rating: 5, createdAt: "" },
    { id: -7, content: "Je me suis inscrit à la formation en art oratoire parce que j'avais une peur bleue de prendre la parole en public. Nous avons appris beaucoup de techniques. Mais au-delà des techniques, il y a des paroles fortes qui ont changé ma façon de voir les choses, il n'y a plus d'excuses !!", authorName: "Dr Kouamé Konan", authorCity: "Côte d'Ivoire", authorRole: "Directeur Général de la Clinique Le Grand Centre", rating: 5, createdAt: "" },
    { id: -8, content: "Avant de participer à ce programme de coaching en art oratoire j'avais deux problèmes, je n'arrivais pas à structurer mon discours et je luttais avec les tics. Avec le travail et les techniques apprises, aujourd'hui les tics sont un souvenir derrière moi.", authorName: "Sylviane Kamenan", authorCity: "Côte d'Ivoire", authorRole: "Conseillère matrimoniale et Parentale", rating: 5, createdAt: "" },
    { id: -9, content: "Je suis mère de trois enfants et membre de la Parents School. J'ai choisi de suivre la formation de conseiller parental pour mieux accompagner les familles en détresse et les adolescents en perte d'identité. Grâce à cette formation riche et accessible, j'ai acquis des compétences en écoute active, en analyse des conflits et en accompagnement émotionnel.", authorName: "Mireille Obrou", authorCity: "Côte d'Ivoire", authorRole: "Mère de 3 enfants", rating: 5, createdAt: "" },
    { id: -10, content: "Je suis à la Parents School depuis près d'un an. Cette formation m'a permis d'obtenir une certification et d'approfondir mes connaissances : compréhension de l'enfant, influence des réseaux sociaux, langage de l'amour, personnalités, et surtout, l'impact de la relation entre les parents sur l'éducation. Depuis, j'applique concrètement ce que j'ai appris.", authorName: "Kadjeu Laurène", authorCity: "Cameroun", authorRole: "Accompagnatrice d'enfants", rating: 5, createdAt: "" },
    { id: -11, content: "Cette formation m'a permis d'interroger mon passé afin de faire l'inventaire des blessures émotionnelles que j'ai subies. Cet exercice m'a donné l'occasion de prendre conscience des blessures que j'ai vécues et de faire le point sur mes guérisons intérieures. J'ai désormais les compétences et les outils nécessaires pour aider toute personne dans le besoin.", authorName: "Diouf Julien Alphonse", authorCity: "Sénégal", authorRole: "Conseiller parental", rating: 5, createdAt: "" },
    { id: -12, content: "J'étais à un carrefour de ma vie où j'avais épuisé mes ressources, j'étais fatiguée et n'avais plus grand-chose à donner. Cette formation est venue à point nommé. Elle m'a permis de me redécouvrir, de mieux me comprendre et de travailler sur moi-même pour guérir de mes blessures émotionnelles. Ma famille et mes enfants ont été positivement impactés.", authorName: "Assiata Kaboré Epse Balboné", authorCity: "Burkina Faso", authorRole: "Professeur de lycées et collèges", rating: 5, createdAt: "" },
    { id: -13, content: "J'étais régulièrement en conflit avec ma fille aînée et je ne savais comment gérer cette crise. J'ai suivi la formation des conseillers parentaux. J'ai réalisé que j'étais blessée et je faisais subir cela à ma fille. J'ai décidé de changer et avec les cours, je me suis mise dans mon processus de transformation. Aujourd'hui, je suis une maman heureuse.", authorName: "Agathe Zrimba", authorCity: "Côte d'Ivoire", authorRole: "Mère de famille", rating: 5, createdAt: "" },
  ]

  const stairSteps = Math.min(screenSteps, displayList.length)

  useEffect(() => {
    if (displayList.length <= stairSteps) return
    const id = setInterval(() => {
      if (!stairPaused.current) setStairStart(i => i + 1)
    }, 4000)
    return () => clearInterval(id)
  }, [displayList.length, stairSteps])

  return (
    <main className="min-h-screen bg-[#f8f4ef]">
      <Header />

      {/* Hero */}
      <section className="bg-[#3f2f85] pt-24 pb-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">Communauté</p>
          <h1 className="text-4xl font-bold sm:text-5xl">Témoignages</h1>
          <p className="mx-auto mt-4 max-w-3xl text-white/90">
            Découvrez comment Parents School transforme concrètement les familles et renforce la parentalité.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#a3ade8]/30">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { value: "5 000+", label: "Parents accompagnés" },
              { value: "4.9/5", label: "Satisfaction moyenne" },
              { value: "10+", label: "Pays représentés" },
            ].map((s, i) => (
              <div key={i} className="rounded-lg bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-[#3f2f85]">{s.value}</p>
                <p className="text-sm text-slate-600">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-10 text-center text-3xl font-bold text-[#3f2f85]">Ce que disent nos membres</h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-center">
          {/* Colonne principale : témoignages écrits en escalier */}
          <div className="relative z-0 lg:col-span-2">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3f2f85] border-t-transparent" />
              </div>
            ) : (
              <div
                className="relative overflow-hidden"
                style={{ height: 280 }}
                onMouseEnter={() => { stairPaused.current = true }}
                onMouseLeave={() => { stairPaused.current = false }}
              >
                {Array.from({ length: stairSteps + 2 }, (_, i) => i - 1).map(offset => {
                  const absoluteIndex = stairStart + offset
                  const idx = ((absoluteIndex % displayList.length) + displayList.length) % displayList.length
                  const item = displayList[idx]
                  const lift = (offset - (stairSteps - 1) / 2) * -32
                  const visible = offset >= 0 && offset <= stairSteps - 1
                  return (
                    <div
                      key={absoluteIndex}
                      className="absolute top-8 transition-all duration-700 ease-in-out"
                      style={{
                        left: `${(offset * 100) / stairSteps}%`,
                        width: `${100 / stairSteps}%`,
                        transform: `translateY(${lift}px)`,
                        opacity: visible ? 1 : 0,
                      }}
                    >
                      <article className="mx-3 flex h-52 flex-col justify-center rounded-lg border-l-4 border-[#e8b41f] bg-white p-6 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                          <Quote className="h-6 w-6 text-[#e8b41f]" />
                          <StarRating value={item.rating} />
                        </div>
                        <p className="line-clamp-3 text-sm italic leading-relaxed text-slate-700">"{item.content}"</p>
                        <div className="mt-4 border-t border-slate-200 pt-3">
                          <p className="font-semibold text-[#3f2f85]">{item.authorName}</p>
                          <p className="text-xs text-slate-500">
                            {item.authorRole}{item.authorCity ? ` · ${item.authorCity}` : ""}
                          </p>
                        </div>
                      </article>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Colonne latérale : témoignages vidéo */}
          <div className="relative z-10 space-y-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">En vidéo</p>
            <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1">
            {VIDEO_TESTIMONIALS.map(video => (
              <div key={video.id} className="flex items-center gap-3 rounded-lg border border-[#a3ade8]/30 bg-white p-3 shadow-sm">
                <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-md">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                <p className="text-sm font-semibold text-[#3f2f85]">{video.title}</p>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire témoignage */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-2xl px-4">
          <div className="text-center mb-10">
            <Users className="mx-auto mb-4 h-10 w-10 text-[#e8b41f]" />
            <h2 className="text-3xl font-bold text-[#3f2f85]">Partagez votre expérience</h2>
            <p className="mt-3 text-slate-600">
              Votre témoignage peut encourager d'autres parents à démarrer leur transformation.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-lg border-l-4 border-[#e8b41f] bg-[#f8f4ef] p-8 text-center">
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <h3 className="text-xl font-bold text-[#3f2f85] mb-2">Merci pour votre témoignage !</h3>
              <p className="text-slate-600">Il sera publié après validation par notre équipe.</p>
              <button onClick={() => setSubmitted(false)} className="mt-4 text-sm text-[#3f2f85] underline">
                Soumettre un autre témoignage
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-slate-200 bg-[#f8f4ef] p-8 shadow-sm">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#3f2f85]">Nom complet *</label>
                  <input
                    type="text"
                    required
                    value={form.authorName}
                    onChange={e => setForm(f => ({ ...f, authorName: e.target.value }))}
                    placeholder="Votre nom"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-[#3f2f85] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#3f2f85]">Ville</label>
                  <input
                    type="text"
                    value={form.authorCity}
                    onChange={e => setForm(f => ({ ...f, authorCity: e.target.value }))}
                    placeholder="Votre ville"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-[#3f2f85] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-[#3f2f85]">Rôle / Situation</label>
                <input
                  type="text"
                  value={form.authorRole}
                  onChange={e => setForm(f => ({ ...f, authorRole: e.target.value }))}
                  placeholder="Ex: Mère de 2 enfants, Pasteur, Enseignant..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-[#3f2f85] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#3f2f85]">Note</label>
                <StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-[#3f2f85]">Votre témoignage *</label>
                <textarea
                  required
                  rows={5}
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Partagez votre expérience avec Parents School..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-[#3f2f85] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#3f2f85] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {submitting ? "Envoi en cours..." : "Soumettre mon témoignage"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#3f2f85] to-[#a3ade8] py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Rejoignez notre communauté</h2>
          <p className="mb-8 text-white/90">Devenez membre et transformez votre vie familiale</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/inscription" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e8b41f] px-8 py-4 font-semibold text-[#3f2f85] transition hover:opacity-90">
              S'inscrire maintenant
            </Link>
            <Link href="/public/formations" className="inline-flex items-center justify-center rounded-lg border-2 border-[#e8b41f] px-8 py-4 font-semibold text-[#e8b41f] transition hover:bg-[#e8b41f] hover:text-[#3f2f85]">
              Voir les formations
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
