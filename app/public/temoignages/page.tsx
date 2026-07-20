"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Quote, Star, Users, Send, CheckCircle } from "lucide-react"
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

  // Fallback si pas encore de témoignages approuvés
  const displayList: Testimonial[] = testimonials.length > 0 ? testimonials : [
    { id: 0, content: "Parents School m'a aidée à mieux comprendre mes enfants. Notre communication est devenue plus apaisée et constructive.", authorName: "Mireille K.", authorCity: "Douala", authorRole: "Maman de 3 enfants", rating: 5, createdAt: "" },
    { id: 0, content: "Les modules sont pratiques, concrets et adaptés à notre réalité. J'applique chaque semaine ce que j'apprends.", authorName: "Paul N.", authorCity: "Yaoundé", authorRole: "Père de famille", rating: 5, createdAt: "" },
    { id: 0, content: "La communauté est bienveillante. On se sent accompagné, pas jugé. C'est un vrai soutien pour les parents.", authorName: "Sarah M.", authorCity: "Abidjan", authorRole: "Parent relais", rating: 5, createdAt: "" },
    { id: 0, content: "Au-delà de la formation, j'ai gagné en confiance dans mon rôle de parent et de mentor dans ma communauté.", authorName: "Clotaire A.", authorCity: "Bafoussam", authorRole: "Leader Senior", rating: 5, createdAt: "" },
  ]

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

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3f2f85] border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {displayList.map((item, idx) => (
              <article key={item.id || idx} className="rounded-lg border-l-4 border-[#e8b41f] bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <Quote className="h-7 w-7 text-[#e8b41f]" />
                  <StarRating value={item.rating} />
                </div>
                <p className="text-slate-700 leading-relaxed italic">"{item.content}"</p>
                <div className="mt-5 border-t border-slate-200 pt-4">
                  <p className="font-semibold text-[#3f2f85]">{item.authorName}</p>
                  <p className="text-sm text-slate-500">
                    {item.authorRole}{item.authorCity ? ` · ${item.authorCity}` : ""}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Témoignages en vidéo */}
      <section className="bg-[#3f2f85]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="mb-2 text-center text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">En vidéo</p>
          <h2 className="mb-10 text-center text-3xl font-bold text-white">Témoignages en vidéo</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              { id: "bJZNNSkbmks", title: "Impact de la formation de conseillers parentaux : témoignage de Hilaire Lelou" },
              { id: "FYl5FSGuPKI", title: "Parents School : témoignages de transformation" },
              { id: "2cenM0rspzI", title: "Cérémonie de remise de certificats — Conseillers parentaux & art oratoire" },
              { id: "EHN0ahmjfW4", title: "Notre offre sociale de formation de conseiller parental" },
              { id: "o1-JEtSrK0w", title: "Devenez conseiller parental — témoignages" },
            ].map(video => (
              <div key={video.id}>
                <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg ring-1 ring-white/10">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                <p className="mt-3 text-center text-sm font-semibold text-white">{video.title}</p>
              </div>
            ))}
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
