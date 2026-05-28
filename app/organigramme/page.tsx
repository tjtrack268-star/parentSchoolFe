"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ChartControls } from '@/components/organigramme/chart-controls'
import { ChartLegend } from '@/components/organigramme/chart-legend'
import { MobileNodeList } from '@/components/organigramme/tree-views'
import { OrganizationChart } from '@/components/dashboard/organization-chart'
import type { OrganigrammeNode } from '@/components/organigramme/types'

export default function OrganigramPage() {
  const [data, setData] = useState<OrganigrammeNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [isMobile, setIsMobile] = useState(false)

  const mapToChartNode = (node: OrganigrammeNode): {
    id: string
    name: string
    email: string
    grade: string
    points: number
    children: Array<{
      id: string
      name: string
      email: string
      grade: string
      points: number
      children: any[]
    }>
  } => ({
    id: String(node.id),
    name: `${node.firstName} ${node.lastName}`.trim(),
    email: node.email || "",
    grade: node.gradeName || "Aucun",
    points: node.totalPoints || 0,
    children: (node.children || []).map(mapToChartNode),
  })

  useEffect(() => {
    async function fetchPublicOrganigramme() {
      try {
        const response = await fetch('/api/organigramme/public')
        //const response = await fetch('/api/organigramme')
        if (!response.ok) throw new Error('Failed to fetch')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }

    fetchPublicOrganigramme()
  }, [])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleNode = (id: string) => {
    const next = new Set(expandedNodes)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpandedNodes(next)
  }

  const getAllIds = (nodes: OrganigrammeNode[]): string[] => {
    const ids: string[] = []
    const walk = (node: OrganigrammeNode) => {
      ids.push(String(node.id))
      node.children.forEach(walk)
    }
    nodes.forEach(walk)
    return ids
  }

  const expandAll = () => setExpandedNodes(new Set(getAllIds(data)))
  const collapseAll = () => setExpandedNodes(new Set(data.map((node) => String(node.id))))

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      <main className="max-w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Organigramme de la Communauté
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-2">
            Découvrez la structure de notre communauté Parents School.
          </p>
          {isMobile && (
            <p className="text-xs text-gray-500 mt-3">
              Appuyez sur les chevrons pour développer/réduire les branches
            </p>
          )}
        </div>

        {loading && (
          <div className="text-center py-16 sm:py-20">
            <div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16 sm:py-20">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 text-sm">Erreur: {error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {data.length > 0 ? (
              <>
                <ChartControls onExpandAll={expandAll} onCollapseAll={collapseAll} />

                {isMobile ? (
                  <div className="space-y-4 mb-8">
                    {data.map((rootNode) => (
                      <div key={rootNode.id} className="bg-white rounded-lg p-4 shadow-sm">
                        <MobileNodeList
                          node={rootNode}
                          level={0}
                          expandedNodes={expandedNodes}
                          onToggle={toggleNode}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6 mb-8">
                    {data.map((rootNode) => (
                      <div key={String(rootNode.id)} className="rounded-lg bg-white/70 p-2">
                        <OrganizationChart
                          root={mapToChartNode(rootNode)}
                          expandedNodes={expandedNodes}
                          onToggleNode={toggleNode}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 sm:py-20">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Organigramme en construction</h3>
                <p className="text-gray-500">L'organigramme sera bientôt disponible.</p>
              </div>
            )}

            {data.length > 0 && <ChartLegend />}
          </>
        )}

        <div className="text-center mt-8 sm:mt-12">
          <Link
            href="/auth/signup"
            className="inline-block bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base"
          >
            Rejoindre la communauté
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

