"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { OrganizationChart } from "@/components/dashboard/organization-chart"

interface TreeNode {
  id: string
  name: string
  email: string
  grade: string
  points: number
  children: TreeNode[]
}

export default function NetworkPage() {
  const [tree, setTree] = useState<TreeNode | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadNetwork = async () => {
      try {
        // Fetch the referral tree from the API
        const treeData = await apiClient.get<TreeNode>('/dashboard/tree')
        
        if (treeData) {
          setTree(treeData)
          // Auto-expand root node
          setExpandedNodes(new Set([treeData.id]))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load network")
        console.error("Error loading network:", err)
      } finally {
        setLoading(false)
      }
    }

    loadNetwork()
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

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 mx-auto" />
          <p className="text-gray-600">Chargement de votre réseau...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4">
        <h3 className="font-semibold text-red-900">Erreur</h3>
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold">Mon Réseau de Parrainage</h1>
        <p className="text-gray-600 mt-2">Visualisez la structure de votre réseau avec codes couleur par grade</p>
      </div>

      {tree ? (
        <div className="p-0">
          <OrganizationChart 
            root={tree}
            expandedNodes={expandedNodes}
            onToggleNode={handleToggleNode}
          />
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">Aucune donnée de réseau disponible</p>
        </div>
      )}
    </div>
  )
}
