"use client"

import { useState, useEffect } from 'react'
import { API_CONFIG, getApiUrl } from '@/lib/api-config'

interface OrganigrammeNode {
  id: number
  firstName: string
  lastName: string
  email: string
  sponsorshipCode: string
  gradeName: string
  directSponsorshipsCount: number
  totalPoints: number
  children: OrganigrammeNode[]
}

function NodeCard({ node }: { node: OrganigrammeNode }) {
  return (
    <div className="bg-white border rounded-lg p-3 sm:p-4 shadow-sm w-full max-w-xs sm:min-w-[200px]">
      <h3 className="font-semibold text-xs sm:text-sm">{node.firstName} {node.lastName}</h3>
      <p className="text-xs text-gray-600">{node.gradeName}</p>
      <p className="text-xs text-blue-600">Code: {node.sponsorshipCode}</p>
      <div className="text-xs text-gray-500 mt-1">
        <div>Parrains: {node.directSponsorshipsCount}</div>
        <div>Points: {node.totalPoints}</div>
      </div>
    </div>
  )
}

function TreeNode({ node }: { node: OrganigrammeNode }) {
  return (
    <div className="flex flex-col items-center">
      <NodeCard node={node} />
      {node.children.length > 0 && (
        <div className="mt-4">
          <div className="w-px h-4 bg-gray-300 mx-auto"></div>
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
            {node.children.map((child) => (
              <div key={child.id} className="relative">
                <div className="w-px h-4 bg-gray-300 mx-auto"></div>
                <TreeNode node={child} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Organigram() {
  const [data, setData] = useState<OrganigrammeNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrganigramme() {
      try {
        const response = await fetch(getApiUrl(API_CONFIG.endpoints.organigramme))
        if (!response.ok) throw new Error('Failed to fetch')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading organigram')
      } finally {
        setLoading(false)
      }
    }

    fetchOrganigramme()
  }, [])

  if (loading) return <div className="p-4">Loading organigram...</div>
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>

  return (
    <div className="p-6 overflow-auto">
      <h2 className="text-2xl font-bold mb-6">Organigramme</h2>
      <div className="flex gap-8">
        {data.map((rootNode) => (
          <TreeNode key={rootNode.id} node={rootNode} />
        ))}
      </div>
    </div>
  )
}