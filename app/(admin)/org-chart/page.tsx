"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import dynamic from "next/dynamic"
import type { RawNodeDatum, CustomNodeElementProps, TreeProps } from "react-d3-tree"
import { RotateCcw, Loader2, Users } from "lucide-react"
import { apiClient } from "@/lib/api-client"

// react-d3-tree utilise le DOM — import dynamique obligatoire (SSR=false)
const Tree = dynamic(() => import("react-d3-tree").then(m => m.Tree), { ssr: false })

// ── Couleurs par grade (spec P17) ─────────────────────────────────────────────
const GRADE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  MEMBER:         { bg: "#94a3b8", text: "#fff", label: "Membre"         },
  LEADER:         { bg: "#22c55e", text: "#fff", label: "Leader"         },
  LEADER_SENIOR:  { bg: "#3b82f6", text: "#fff", label: "Leader Senior"  },
  COORDINATOR:    { bg: "#f97316", text: "#fff", label: "Coordinateur"   },
  MENTOR:         { bg: "#a855f7", text: "#fff", label: "Mentor"         },
  DIRECTOR:       { bg: "#e8b41f", text: "#3f2f85", label: "Directeur"  },
  // Fallback pour les noms français venant du backend
  "Aucun":        { bg: "#94a3b8", text: "#fff", label: "Membre"         },
  "Leader":       { bg: "#22c55e", text: "#fff", label: "Leader"         },
  "Leader Senior":{ bg: "#3b82f6", text: "#fff", label: "Leader Senior"  },
  "Coordinateur": { bg: "#f97316", text: "#fff", label: "Coordinateur"   },
  "Mentor":       { bg: "#a855f7", text: "#fff", label: "Mentor"         },
  "Directeur":    { bg: "#e8b41f", text: "#3f2f85", label: "Directeur"  },
}

const LEGEND_GRADES = [
  { key: "MEMBER",        label: "Membre"        },
  { key: "LEADER",        label: "Leader"        },
  { key: "LEADER_SENIOR", label: "Leader Senior" },
  { key: "COORDINATOR",   label: "Coordinateur"  },
  { key: "MENTOR",        label: "Mentor"        },
  { key: "DIRECTOR",      label: "Directeur"     },
]

// ── Types API ─────────────────────────────────────────────────────────────────
interface ApiNode {
  id:                      number
  firstName:               string
  lastName:                string
  sponsorshipCode:         string
  gradeName:               string
  totalPoints:             number
  directSponsorshipsCount: number
  children:                ApiNode[]
}

// ── Transformation API → react-d3-tree ───────────────────────────────────────
function toD3Node(node: ApiNode): RawNodeDatum {
  return {
    name: `${node.firstName} ${node.lastName.charAt(0)}.`,
    attributes: {
      code:   node.sponsorshipCode,
      grade:  node.gradeName  || "Aucun",
      points: String(node.totalPoints),
      initials: `${node.firstName.charAt(0)}${node.lastName.charAt(0)}`.toUpperCase(),
      fullName: `${node.firstName} ${node.lastName}`,
    },
    children: node.children.map(toD3Node),
  }
}

function countNodes(node: RawNodeDatum): number {
  return 1 + (node.children?.reduce((s, c) => s + countNodes(c), 0) ?? 0)
}

// ── Nœud personnalisé ─────────────────────────────────────────────────────────
function CustomNode({ nodeDatum, toggleNode }: CustomNodeElementProps) {
  const grade    = String(nodeDatum.attributes?.grade ?? "Aucun")
  const colors   = GRADE_COLORS[grade] ?? GRADE_COLORS["MEMBER"]
  const initials = String(nodeDatum.attributes?.initials ?? "??")
  const code     = String(nodeDatum.attributes?.code ?? "")
  const hasChildren = (nodeDatum.children?.length ?? 0) > 0

  const W = 130
  const H = 80

  return (
    <g onClick={toggleNode} style={{ cursor: hasChildren ? "pointer" : "default" }}>
      {/* Carte */}
      <rect x={-W / 2} y={-H / 2} width={W} height={H}
        rx={10} ry={10}
        fill="white" stroke={colors.bg} strokeWidth={2}
        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
      />

      {/* Cercle initiales */}
      <circle cx={-W / 2 + 24} cy={0} r={18}
        fill={colors.bg} />
      <text x={-W / 2 + 24} y={5}
        textAnchor="middle" fill={colors.text}
        fontSize={11} fontWeight="bold">
        {initials}
      </text>

      {/* Nom abrégé */}
      <text x={-W / 2 + 48} y={-14}
        fill="#3f2f85" fontSize={10} fontWeight="bold"
        style={{ maxWidth: 70 }}>
        {nodeDatum.name.length > 14 ? nodeDatum.name.slice(0, 13) + "…" : nodeDatum.name}
      </text>

      {/* Code membre */}
      <text x={-W / 2 + 48} y={0}
        fill="#64748b" fontSize={8} fontFamily="monospace">
        {code}
      </text>

      {/* Badge grade */}
      <rect x={-W / 2 + 46} y={8} width={62} height={14}
        rx={7} fill={colors.bg} />
      <text x={-W / 2 + 77} y={19}
        textAnchor="middle" fill={colors.text}
        fontSize={7} fontWeight="600">
        {grade.length > 12 ? grade.slice(0, 11) + "…" : grade}
      </text>

      {/* Indicateur enfants */}
      {hasChildren && (
        <>
          <circle cx={W / 2 - 8} cy={-H / 2 + 8} r={6} fill={colors.bg} />
          <text x={W / 2 - 8} y={-H / 2 + 12}
            textAnchor="middle" fill={colors.text} fontSize={8} fontWeight="bold">
            +
          </text>
        </>
      )}
    </g>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function OrgChartPage() {
  const [treeData,  setTreeData]  = useState<RawNodeDatum | null>(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)
  const [total,     setTotal]     = useState(0)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Centre initial
  const centerTree = useCallback(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect()
      setTranslate({ x: width / 2, y: 80 })
    }
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiClient.get<ApiNode | ApiNode[]>("/admin/org-chart")
        const root = Array.isArray(data) ? data[0] : data
        if (!root) { setError("Aucune donnée disponible"); return }
        const d3node = toD3Node(root)
        setTreeData(d3node)
        setTotal(countNodes(d3node))
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur de chargement")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (treeData) centerTree()
  }, [treeData, centerTree])

  // ── États de chargement / erreur ──────────────────────────────────────────
  if (loading) return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto mb-3 h-10 w-10 animate-spin text-[#3f2f85]" />
        <p className="text-sm font-medium text-[#3f2f85]">Chargement de l'organigramme…</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center max-w-sm">
        <p className="font-semibold text-red-600">Erreur</p>
        <p className="mt-1 text-sm text-red-500">{error}</p>
      </div>
    </div>
  )

  if (!treeData) return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="text-center">
        <Users className="mx-auto mb-3 h-10 w-10 text-[#a3ade8]" />
        <p className="text-sm text-slate-500">Aucune donnée à afficher</p>
      </div>
    </div>
  )

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col">

      {/* En-tête */}
      <div className="flex items-center justify-between border-b border-[#a3ade8]/30 bg-white px-6 py-3 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-[#3f2f85]">Organigramme interactif</h1>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Users className="h-3 w-3" /> {total} membre{total > 1 ? "s" : ""} affiché{total > 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={centerTree}
          className="flex items-center gap-2 rounded-lg border-2 border-[#3f2f85] px-4 py-2 text-sm font-semibold text-[#3f2f85] transition hover:bg-[#3f2f85] hover:text-white">
          <RotateCcw className="h-4 w-4" /> Recentrer
        </button>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="relative flex-1 bg-[#f8f4ef]">
        <Tree
          data={treeData}
          orientation="vertical"
          translate={translate}
          nodeSize={{ x: 180, y: 130 }}
          separation={{ siblings: 1.2, nonSiblings: 1.5 }}
          renderCustomNodeElement={CustomNode}
          pathFunc="step"
          pathClassFunc={() => "stroke-[#a3ade8] stroke-[1.5px] fill-none"}
          zoom={0.8}
          scaleExtent={{ min: 0.2, max: 2 }}
          enableLegacyTransitions
          transitionDuration={300}
          collapsible
        />

        {/* Légende */}
        <div className="absolute bottom-4 left-4 rounded-xl bg-white/95 border border-[#a3ade8]/30 px-4 py-3 shadow-md backdrop-blur-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#3f2f85]">Grades</p>
          <div className="space-y-1.5">
            {LEGEND_GRADES.map(g => (
              <div key={g.key} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: GRADE_COLORS[g.key].bg }} />
                <span className="text-xs text-slate-600">{g.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Aide navigation */}
        <div className="absolute bottom-4 right-4 rounded-lg bg-white/80 border border-[#a3ade8]/20 px-3 py-2 text-xs text-slate-400 backdrop-blur-sm">
          🖱 Molette pour zoomer · Drag pour déplacer · Clic nœud pour déplier
        </div>
      </div>
    </div>
  )
}
