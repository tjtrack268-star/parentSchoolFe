"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface Testimonial {
  id: number
  content: string
  authorName: string
  authorCity: string
  authorRole: string
  rating: number
}

const FALLBACK: Testimonial[] = [
  { id: -1, authorName: "Mireille K.", authorRole: "Maman de 3 enfants", authorCity: "Douala", content: "Parents School m'a aidée à mieux comprendre mes enfants. Notre communication est devenue plus apaisée et constructive.", rating: 5 },
  { id: -2, authorName: "Paul N.", authorRole: "Père de famille", authorCity: "Yaoundé", content: "Les modules sont pratiques, concrets et adaptés à notre réalité africaine. J'applique chaque semaine ce que j'apprends.", rating: 5 },
  { id: -3, authorName: "Sarah M.", authorRole: "Parent relais", authorCity: "Abidjan", content: "La communauté est bienveillante. On se sent accompagné, pas jugé. C'est un vrai soutien pour les parents.", rating: 5 },
]

export default function HomeTestimonials() {
  const [items, setItems] = useState<Testimonial[]>(FALLBACK)

  useEffect(() => {
    fetch("/api/testimonials")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setItems(data.slice(0, 3))
      })
      .catch(() => {})
  }, [])

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-14">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">Ils témoignent</p>
          <h2 className="text-4xl font-bold text-[#3f2f85] sm:text-5xl mb-4">Témoignages</h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">Ce que nos membres disent de Parents School</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div key={item.id || idx} className="rounded-lg border-l-4 border-[#e8b41f] bg-[#f8f4ef] p-6 shadow-sm">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < item.rating ? "text-[#e8b41f]" : "text-slate-300"}>★</span>
                ))}
              </div>
              <p className="text-slate-600 mb-5 italic text-sm leading-relaxed">"{item.content}"</p>
              <div className="border-t border-[#a3ade8]/30 pt-4">
                <p className="font-bold text-[#3f2f85]">{item.authorName}</p>
                <p className="text-xs text-slate-500">
                  {item.authorRole}{item.authorCity ? ` · ${item.authorCity}` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/public/temoignages" className="inline-flex items-center gap-2 text-[#3f2f85] font-semibold hover:text-[#e8b41f] transition">
            Voir tous les témoignages <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
