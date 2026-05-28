"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const IMAGES = [
  "/acceuil_img/WhatsApp Image 2026-05-26 at 12.23.24 AM.jpeg",
  "/acceuil_img/WhatsApp Image 2026-05-26 at 12.23.24 AM (1).jpeg",
  "/acceuil_img/WhatsApp Image 2026-05-26 at 12.23.25 AM.jpeg",
  "/acceuil_img/WhatsApp Image 2026-05-26 at 12.23.25 AM (1).jpeg",
  "/acceuil_img/WhatsApp Image 2026-05-26 at 12.23.25 AM (2).jpeg",
  "/acceuil_img/WhatsApp Image 2026-05-26 at 12.23.26 AM.jpeg",
  "/acceuil_img/WhatsApp Image 2026-05-26 at 12.23.28 AM (1).jpeg",
  "/acceuil_img/WhatsApp Image 2026-05-26 at 12.23.29 AM.jpeg",
  "/acceuil_img/WhatsApp Image 2026-05-26 at 12.23.30 AM.jpeg",
]

export default function HomeCarousel() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent(c => (c + 1) % IMAGES.length), [])
  const prev = () => setCurrent(c => (c - 1 + IMAGES.length) % IMAGES.length)

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Images en background avec transition */}
      {IMAGES.map((src, idx) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: idx === current ? 1 : 0 }}
        >
          <Image
            src={src}
            alt={`Parents School ${idx + 1}`}
            fill
            className="object-cover"
            priority={idx === 0}
          />
        </div>
      ))}

      {/* Overlay sombre comme le hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-slate-900/80" />

      {/* Contenu centré */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-blue-300 uppercase tracking-widest text-sm font-semibold mb-4">
              {/* Notre Communauté en Images */}
            </p>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-balance text-white">
              Former des Parents Selon les Valeurs Chrétiennes
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
Rejoignez une communauté internationale de formation à la parentalité ancrée dans les principes bibliques et le développement personnel.            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                  Rejoindre la communauté
                </Button>
              </Link>
              {/* <Link href="/organigramme">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                  Voir l'organigramme
                </Button>
              </Link> */}
              <a href="#activites">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:bg-opacity-10 bg-transparent"
                    >
                      Découvrir plus
                    </Button>
                  </a>
            </div>
          </div>

          {/* Compteur + dots côté droit */}
          <div className="hidden lg:flex flex-col items-center justify-center gap-6">
            <div className="text-white/60 text-sm tracking-widest uppercase">Galerie</div>
            <div className="text-8xl font-bold text-white/20 leading-none">
              {String(current + 1).padStart(2, '0')}
            </div>
            <div className="text-white/40 text-sm">/ {String(IMAGES.length).padStart(2, '0')}</div>
            <div className="flex flex-col gap-2 mt-4">
              {IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`rounded-full transition-all duration-300 ${
                    idx === current ? "h-6 w-2 bg-white" : "h-2 w-2 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Boutons navigation */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all hover:scale-110"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all hover:scale-110"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`rounded-full transition-all duration-300 ${
              idx === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
