"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { OrganizationChart } from '@/components/dashboard/organization-chart'
import { GRADE_COLORS } from '@/lib/constants'

interface OrganigrammeNode {
  id: string
  firstName: string
  lastName: string
  email?: string
  sponsorshipCode: string
  gradeName: string
  directSponsorshipsCount: number
  totalPoints: number
  children: OrganigrammeNode[]
}

interface TreeNode {
  id: string
  name: string
  email: string
  grade: string
  points: number
  children: TreeNode[]
}

export default function OrganigramPage() {
  const [data, setData] = useState<OrganigrammeNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function fetchPublicOrganigramme() {
      try {
        const response = await fetch('http://localhost:8080/api/organigramme/public')
        if (!response.ok) throw new Error('Failed to fetch')
        const result = await response.json()
        setData(result)
        if (result.length > 0) {
          setExpandedNodes(new Set(result.map((node: OrganigrammeNode) => node.id.toString())))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading organigram')
      } finally {
        setLoading(false)
      }
    }

    fetchPublicOrganigramme()
  }, [])

  const handleToggleNode = (nodeId: string) => {
    const newExpandedNodes = new Set(expandedNodes)
    if (newExpandedNodes.has(nodeId)) {
      newExpandedNodes.delete(nodeId)
    } else {
      newExpandedNodes.add(nodeId)
    }
    setExpandedNodes(newExpandedNodes)
  }

  const convertToTreeNode = (node: OrganigrammeNode): TreeNode => ({
    id: node.id.toString(),
    name: `${node.firstName} ${node.lastName}`,
    email: node.email || '',
    grade: node.gradeName,
    points: node.totalPoints,
    children: node.children.map(convertToTreeNode)
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Organigramme de la Communauté
          </h1>
          <p className="text-lg text-gray-600">
            Découvrez la structure de notre communauté Parents School.
          </p>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600">Erreur: {error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {data.length > 0 ? (
              <div className="bg-white rounded-lg shadow p-6">
                {data.map((rootNode) => (
                  <OrganizationChart
                    key={rootNode.id}
                    root={convertToTreeNode(rootNode)}
                    expandedNodes={expandedNodes}
                    onToggleNode={handleToggleNode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Organigramme en construction</h3>
                <p className="text-gray-500">L'organigramme sera bientôt disponible.</p>
              </div>
            )}
            
            {data.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h3 className="font-semibold mb-4">Légende des grades</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {Object.entries(GRADE_COLORS).filter(([name]) => name !== 'Aucun').map(([name, color]) => (
                    <div key={name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-sm">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="text-center mt-12">
          <Link href="/auth/signup" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Rejoindre la communauté
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}