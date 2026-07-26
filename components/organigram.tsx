"use client"

import { useState, useEffect } from 'react'
import { API_CONFIG, getApiUrl } from '@/lib/api-config'
import { ChevronDown, ChevronUp } from 'lucide-react'

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

function NodeCard({ 
  node, 
  isRoot = false,
  isExpanded = true,
  onToggle,
  isMobile = false
}: { 
  node: OrganigrammeNode
  isRoot?: boolean
  isExpanded?: boolean
  onToggle?: () => void
  isMobile?: boolean
}) {
  const hasChildren = node.children.length > 0

  return (
    <div className={`relative transition-all duration-300 ${isMobile ? 'w-full' : ''}`}>
      <div
        className={`relative rounded-xl border transition-all duration-300 hover:shadow-xl ${
          isRoot
            ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg border-primary/50'
            : 'bg-white text-gray-900 shadow-md border-gray-200 hover:border-primary/30'
        } ${isMobile ? 'p-3 min-h-0' : 'p-4 sm:p-5 min-w-48 sm:min-w-56'} overflow-hidden`}
        role="article"
        aria-label={`${node.firstName} ${node.lastName}`}
      >
        {/* Connection point for parent lines */}
        {!isRoot && !isMobile && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full opacity-90 border-2 border-green-600 shadow-sm z-10">
            <div className="absolute inset-1 bg-green-400 rounded-full" />
          </div>
        )}
        
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <h3 className={`font-normal truncate ${isMobile ? 'text-sm' : 'text-sm sm:text-base'}`}>
              {node.firstName}
            </h3>
            <p className={`font-normal truncate opacity-90 ${isMobile ? 'text-xs' : 'text-xs sm:text-sm'}`}>
              {node.lastName}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {isRoot && (
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs sm:text-sm font-bold">👑</span>
              </div>
            )}
            {hasChildren && isMobile && onToggle && (
              <button
                onClick={onToggle}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'Masquer les enfants' : 'Afficher les enfants'}
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>

        <div className={`mt-2 sm:mt-3 pt-2 sm:pt-3 border-t ${isRoot ? 'border-white/20' : 'border-gray-200'}`}>
          <div className={`grid grid-cols-2 gap-1 sm:gap-2 text-xs ${isMobile ? 'text-xs' : 'text-xs sm:text-sm'}`}>
            <div>
              <p className={`font-medium ${isRoot ? 'opacity-75' : 'text-gray-600'}`}>
                Grade
              </p>
              <p className="font-medium truncate">{node.gradeName}</p>
            </div>
            <div>
              <p className={`font-medium ${isRoot ? 'opacity-75' : 'text-gray-600'}`}>
                Code
              </p>
              <p className="font-mono text-xs font-medium truncate">{node.sponsorshipCode}</p>
            </div>
          </div>
        </div>

        <div className={`mt-2 sm:mt-3 grid grid-cols-2 gap-1 sm:gap-2 text-xs ${isRoot ? 'bg-white/10' : 'bg-gray-50'} rounded-lg p-2`}>
          <div className="text-center">
            <p className={`font-medium ${isRoot ? 'opacity-75' : 'text-gray-600'}`}>Parrainages</p>
            <p className={`text-base sm:text-lg font-semibold ${isRoot ? 'text-accent' : 'text-primary'}`}>
              {node.directSponsorshipsCount}
            </p>
          </div>
          <div className="text-center">
            <p className={`font-medium ${isRoot ? 'opacity-75' : 'text-gray-600'}`}>Points</p>
            <p className={`text-base sm:text-lg font-semibold ${isRoot ? 'text-accent' : 'text-primary'}`}>
              {node.totalPoints}
            </p>
          </div>
        </div>

        <p className="text-xs mt-2 sm:mt-3 truncate opacity-75">{node.email}</p>

        {hasChildren && isMobile && !isExpanded && (
          <div className="text-xs text-center mt-2 text-primary font-medium">
            +{node.children.length} {node.children.length === 1 ? 'enfant' : 'enfants'}
          </div>
        )}
      </div>
    </div>
  )
}

// Desktop tree view component
function DesktopTreeNode({ 
  node, 
  level = 0,
  expandedNodes,
}: { 
  node: OrganigrammeNode
  level?: number
  expandedNodes: Set<number>
}) {
  const isRoot = level === 0
  const hasChildren = node.children.length > 0
  const isExpanded = expandedNodes.has(node.id) || isRoot

  if (!isExpanded && !isRoot) {
    return null
  }

  return (
    <div className="flex flex-col items-center">
      <NodeCard node={node} isRoot={isRoot} isMobile={false} />

      {hasChildren && isExpanded && (
        <div className="relative pt-8 sm:pt-12 hidden md:flex md:flex-col md:items-center">
          {/* SVG connectors - responsive */}
          <svg
            className="absolute -top-8 sm:-top-12 left-1/2 -translate-x-1/2"
            viewBox={`0 0 ${Math.max(400, node.children.length * 220)} 120`}
            preserveAspectRatio="xMidYMid meet"
            width={Math.max(300, Math.min(node.children.length * 220, 800))}
            height="120"
            style={{ zIndex: 1 }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`treeGradient-${level}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B4513" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#654321" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            
            {/* Main trunk */}
            <line
              x1="50%"
              y1="0"
              x2="50%"
              y2="40"
              stroke={`url(#treeGradient-${level})`}
              strokeWidth="4"
              strokeLinecap="round"
            />
            
            {/* Tree branches */}
            {node.children.map((_, idx) => {
              const totalChildren = node.children.length
              const childX = ((idx + 1) / (totalChildren + 1)) * 100
              const centerX = 50
              const branchCurve = Math.abs(childX - centerX) * 0.2
              
              return (
                <g key={`branch-${idx}`}>
                  <path
                    d={`M 50% 40 Q ${centerX + (childX - centerX) * 0.5}% ${40 + branchCurve} ${childX}% 80`}
                    stroke={`url(#treeGradient-${level})`}
                    strokeWidth={Math.max(2, 4 - level * 0.5)}
                    fill="none"
                    strokeLinecap="round"
                  />
                  <circle cx="50%" cy="40" r={Math.max(2, 4 - level)} fill="#8B4513" opacity="0.8" />
                  <circle cx={`${childX}%`} cy="80" r="3" fill="#228B22" opacity="0.7" />
                </g>
              )
            })}
          </svg>

          <div className="mt-20 flex flex-wrap justify-center items-start gap-3 sm:gap-6">
            {node.children.map((child) => (
              <div key={child.id} className="flex justify-center">
                <DesktopTreeNode 
                  node={child} 
                  level={level + 1}
                  expandedNodes={expandedNodes}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Mobile list view component
function MobileNodeList({ 
  node,
  level = 0,
  expandedNodes,
  onToggle
}: {
  node: OrganigrammeNode
  level?: number
  expandedNodes: Set<number>
  onToggle: (id: number) => void
}) {
  const hasChildren = node.children.length > 0
  const isExpanded = expandedNodes.has(node.id)

  return (
    <div>
      <div style={{ marginLeft: `${level * 12}px` }} className="mb-2">
        <NodeCard 
          node={node}
          isRoot={level === 0}
          isExpanded={isExpanded}
          onToggle={() => hasChildren && onToggle(node.id)}
          isMobile={true}
        />
      </div>

      {hasChildren && isExpanded && (
        <div className="space-y-2">
          {node.children.map((child) => (
            <MobileNodeList
              key={child.id}
              node={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Organigram() {
  const [data, setData] = useState<OrganigrammeNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set())
  const [isMobile, setIsMobile] = useState(false)

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleNode = (id: number) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedNodes(newExpanded)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">Chargement de l'organigramme...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4">
        <div className="bg-card border border-destructive/20 rounded-xl p-6 max-w-md shadow-lg">
          <p className="text-destructive font-semibold mb-2">Erreur</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary to-background py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
          Organigramme
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Structure du réseau et hiérarchie des parrainages
        </p>
        {isMobile && (
          <p className="text-xs text-muted-foreground mt-2">
            💡 Appuyez sur les chevrons pour développer/réduire
          </p>
        )}
      </div>

      {isMobile ? (
        // Mobile view: List layout
        <div className="space-y-4">
          {data.map((rootNode) => (
            <div key={rootNode.id} className="bg-white/50 backdrop-blur rounded-lg p-4">
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
        // Desktop view: Tree layout with horizontal scroll
        <div className="overflow-x-auto pb-8">
          <div className="flex flex-col items-center gap-8 min-w-min px-4">
            {data.map((rootNode) => (
              <div key={rootNode.id} className="flex justify-center">
                <DesktopTreeNode 
                  node={rootNode} 
                  expandedNodes={expandedNodes}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}