"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { GRADE_COLORS } from '@/lib/constants'
import { ChevronDown, ChevronRight, Users } from 'lucide-react'

interface OrgNode {
  id: string
  firstName: string
  lastName: string
  gradeName: string
  directSponsorshipsCount: number
  totalPoints: number
  sponsorshipCode: string
  children: OrgNode[]
}

function OrgCard({ node, level = 0 }: { node: OrgNode; level?: number }) {
  const [open, setOpen] = useState(level < 2)
  const hasChildren = node.children.length > 0
  const color = GRADE_COLORS[node.gradeName as keyof typeof GRADE_COLORS] || '#a3ade8'

  return (
    <div className={level > 0 ? "ml-6 border-l-2 border-[#a3ade8]/30 pl-4" : ""}>
      <div
        onClick={() => hasChildren && setOpen(!open)}
        className={`flex items-center gap-3 rounded-lg p-3 mb-2 transition ${hasChildren ? "cursor-pointer" : ""} ${
          level === 0 ? "bg-[#3f2f85] text-white shadow-md" : "bg-white border border-[#a3ade8]/30 hover:border-[#3f2f85]/40"
        }`}
      >
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ backgroundColor: level === 0 ? '#e8b41f' : color }}>
          <span style={{ color: level === 0 ? '#3f2f85' : 'white' }}>
            {node.firstName.charAt(0)}{node.lastName.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold truncate ${level === 0 ? "text-white" : "text-[#3f2f85]"}`}>
            {node.firstName} {node.lastName}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: level === 0 ? 'rgba(255,255,255,0.15)' : `${color}20`, color: level === 0 ? '#e8b41f' : color }}>
              {node.gradeName || 'Aucun grade'}
            </span>
            <span className={`text-xs ${level === 0 ? "text-[#a3ade8]" : "text-slate-400"}`}>
              {node.directSponsorshipsCount} filleuls · {node.totalPoints} pts
            </span>
          </div>
        </div>
        {hasChildren && (
          <div className={level === 0 ? "text-[#e8b41f]" : "text-[#3f2f85]"}>
            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
        )}
      </div>
      {open && hasChildren && (
        <div>{node.children.map(child => <OrgCard key={child.id} node={child} level={level + 1} />)}</div>
      )}
    </div>
  )
}

export default function OrganigramPage() {
  const [data, setData] = useState<OrgNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/organigramme/public')
      .then(r => r.json())
      .then(d => setData(Array.isArray(d) ? d : []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-[#f8f4ef]">
      <Header />
      <div className="pt-16">

        {/* Hero */}
        <section className="bg-[#3f2f85] text-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#e8b41f]">Structure</p>
              <h1 className="mb-4 text-5xl font-bold leading-tight sm:text-6xl">Organigramme</h1>
              <p className="text-lg leading-relaxed text-slate-100">
                Découvrez la structure de notre communauté Parents School et les relations de parrainage.
              </p>
            </div>
          </div>
        </section>

        {/* Légende */}
        <section className="bg-[#a3ade8]/20 border-b border-[#a3ade8]/30">
          <div className="mx-auto max-w-6xl px-4 py-6">
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#3f2f85]">Grades :</p>
              {Object.entries(GRADE_COLORS).filter(([n]) => n !== 'Aucun').map(([name, color]) => (
                <div key={name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs text-slate-600">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contenu */}
        <section className="mx-auto max-w-6xl px-4 py-12">
          {loading && (
            <div className="flex flex-col items-center py-20">
              <div className="w-10 h-10 rounded-full border-4 border-[#a3ade8] border-t-[#3f2f85] animate-spin mb-4" />
              <p className="text-[#3f2f85] font-medium">Chargement...</p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border-l-4 border-red-400 bg-red-50 p-6 text-center">
              <p className="text-red-600">Erreur : {error}</p>
            </div>
          )}

          {!loading && !error && data.length === 0 && (
            <div className="rounded-lg border border-[#a3ade8]/30 bg-white p-16 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-[#a3ade8]" />
              <h3 className="text-xl font-semibold text-[#3f2f85] mb-2">Organigramme en construction</h3>
              <p className="text-slate-500">L'organigramme sera bientôt disponible.</p>
            </div>
          )}

          {!loading && !error && data.length > 0 && (
            <div className="bg-white rounded-xl border border-[#a3ade8]/30 p-6 shadow-sm">
              {data.map(node => <OrgCard key={node.id} node={node} level={0} />)}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-[#3f2f85] to-[#a3ade8] py-16 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Rejoindre la communauté</h2>
            <p className="mb-8 text-white/90">Inscrivez-vous et intégrez notre réseau de parrainage</p>
            <Link href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-[#e8b41f] px-8 py-4 font-semibold text-[#3f2f85] transition hover:opacity-90">
              S'inscrire maintenant
            </Link>
          </div>
        </section>

      </div>
      <Footer />
    </main>
  )
}
