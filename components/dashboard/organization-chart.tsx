"use client"

import { useMemo, useState } from "react"
import {
  Expand,
  Maximize,
  Minimize,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { GRADE_COLORS } from "@/lib/constants"

interface TreeNode {
  id: string
  name: string
  email: string
  grade: string
  points: number
  children: TreeNode[]
}

interface OrganizationChartProps {
  root: TreeNode
  expandedNodes: Set<string>
  onToggleNode: (nodeId: string) => void
}

type PositionedNode = {
  node: TreeNode
  depth: number
  x: number
  y: number
}

function collectIds(node: TreeNode, acc: string[] = []) {
  acc.push(node.id)
  node.children.forEach((child) => collectIds(child, acc))
  return acc
}

export function OrganizationChart({ root, expandedNodes, onToggleNode }: OrganizationChartProps) {
  const [scale, setScale] = useState(0.23)
  const [isCompact, setIsCompact] = useState(false)
  const SAFE_LEFT = 190
  const SAFE_TOP = 76

  const CARD_WIDTH = isCompact ? 136 : 168
  const CARD_HEIGHT = isCompact ? 42 : 56
  const H_GAP = isCompact ? 24 : 32
  const V_GAP = isCompact ? 48 : 66

  const visible = useMemo(() => {
    const nodes: PositionedNode[] = []
    const links: Array<{ from: { x: number; y: number }; to: { x: number; y: number } }> = []

    let leafIndex = 0
    const layout = (node: TreeNode, depth: number): { x: number; y: number } => {
      const children = node.id === root.id || expandedNodes.has(node.id) ? node.children : []
      const positionedChildren = children.map((child) => layout(child, depth + 1))

      let x: number
      if (positionedChildren.length === 0) {
        x = leafIndex * (CARD_WIDTH + H_GAP)
        leafIndex += 1
      } else {
        const first = positionedChildren[0].x
        const last = positionedChildren[positionedChildren.length - 1].x
        x = (first + last) / 2
      }

      const y = SAFE_TOP + depth * (CARD_HEIGHT + V_GAP)
      nodes.push({ node, depth, x, y })

      positionedChildren.forEach((childPos) => {
        links.push({
          from: { x: x + CARD_WIDTH / 2, y: y + CARD_HEIGHT },
          to: { x: childPos.x + CARD_WIDTH / 2, y: childPos.y },
        })
      })
      return { x, y }
    }

    layout(root, 0)
    return { nodes, links }
  }, [root, expandedNodes, CARD_WIDTH, CARD_HEIGHT, H_GAP, V_GAP, SAFE_TOP])

  const bounds = useMemo(() => {
    const xs = visible.nodes.map((n) => n.x)
    const ys = visible.nodes.map((n) => n.y)
    return {
      minX: Math.min(...xs, 0),
      minY: Math.min(...ys, 0),
      maxX: Math.max(...xs, 0) + CARD_WIDTH,
      maxY: Math.max(...ys, 0) + CARD_HEIGHT,
    }
  }, [visible.nodes, CARD_WIDTH, CARD_HEIGHT])

  const canvasWidth = Math.max(1400, bounds.maxX - bounds.minX + 180 + SAFE_LEFT)
  const canvasHeight = Math.max(560, bounds.maxY - bounds.minY + 180)
  const contentWidth = bounds.maxX - bounds.minX
  const contentHeight = bounds.maxY - bounds.minY
  const offsetX = Math.max(SAFE_LEFT, (canvasWidth - contentWidth) / 2)
  const offsetY = Math.max(SAFE_TOP, (canvasHeight - contentHeight) / 2 - 24)

  const updateZoom = (delta: number) => setScale((v) => Math.min(1.2, Math.max(0.15, v + delta)))

  const allIds = useMemo(() => collectIds(root, []), [root])

  const expandAll = () => {
    allIds.forEach((id) => {
      if (!expandedNodes.has(id)) onToggleNode(id)
    })
  }

  const collapseAll = () => {
    allIds.forEach((id) => {
      if (id !== root.id && expandedNodes.has(id)) onToggleNode(id)
    })
  }

  return (
    <div className="relative min-h-[560px] w-full overflow-hidden bg-transparent">
      <div className="absolute left-4 top-4 z-20 rounded-lg border border-slate-300 bg-white/90 p-4 shadow-sm">
        <p className="mb-3 text-xs font-semibold text-slate-700">Grades</p>
        <div className="space-y-2">
          {Object.entries(GRADE_COLORS)
            .filter(([grade]) => grade !== "Aucun")
            .map(([grade, color]) => (
            <div key={grade} className="flex items-center gap-2 text-xs text-slate-700">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
              {grade}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-4 top-4 z-20 grid grid-cols-2 gap-2">
        <button type="button" onClick={expandAll} className="rounded-md border border-slate-300 bg-white p-2 shadow-sm hover:bg-slate-50"><Expand className="h-4 w-4" /></button>
        <button type="button" onClick={() => setIsCompact((v) => !v)} className="rounded-md border border-slate-300 bg-white p-2 shadow-sm hover:bg-slate-50"><Minimize className="h-4 w-4" /></button>
        <button type="button" onClick={() => setScale(0.35)} className="rounded-md border border-slate-300 bg-white p-2 shadow-sm hover:bg-slate-50"><Maximize className="h-4 w-4" /></button>
        <button type="button" onClick={() => { setScale(0.23); collapseAll() }} className="rounded-md border border-slate-300 bg-white p-2 shadow-sm hover:bg-slate-50"><RotateCcw className="h-4 w-4" /></button>
      </div>

      <div className="absolute bottom-4 right-4 z-20 flex gap-2">
        <button type="button" onClick={() => updateZoom(-0.05)} className="rounded-md border border-slate-300 bg-white p-2 shadow-sm hover:bg-slate-50"><ZoomOut className="h-4 w-4" /></button>
        <button type="button" onClick={() => updateZoom(0.05)} className="rounded-md border border-slate-300 bg-white p-2 shadow-sm hover:bg-slate-50"><ZoomIn className="h-4 w-4" /></button>
      </div>
      <div className="absolute bottom-1 right-4 z-20 w-[88px] rounded bg-white/80 py-1 text-center text-xs text-slate-600 shadow-sm">
        {Math.round(scale * 100)}%
      </div>

      <div className="relative overflow-y-auto overflow-x-hidden p-2">
        <div
          className="relative origin-top-left transition-transform duration-150"
          style={{ width: canvasWidth, height: canvasHeight, transform: `scale(${scale})` }}
        >
          <svg className="absolute left-0 top-0 h-full w-full pointer-events-none">
            <g transform={`translate(${offsetX}, ${offsetY - SAFE_TOP})`}>
              {visible.links.map((link, idx) => {
                const midY = (link.from.y + link.to.y) / 2
                const d = `M ${link.from.x} ${link.from.y} C ${link.from.x} ${midY}, ${link.to.x} ${midY}, ${link.to.x} ${link.to.y}`
                return <path key={idx} d={d} stroke="#94a3b8" strokeWidth="1.3" strokeDasharray="3,3" fill="none" />
              })}
            </g>
          </svg>

          {visible.nodes.map(({ node, x, y }) => {
            const color = GRADE_COLORS[node.grade as keyof typeof GRADE_COLORS] ?? GRADE_COLORS.Aucun
            const hasChildren = node.children.length > 0
            const isExpanded = expandedNodes.has(node.id)
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => hasChildren && onToggleNode(node.id)}
                className="absolute rounded-md border border-slate-300 bg-white px-2 py-1 text-left shadow-sm hover:shadow-md"
                style={{ left: x + offsetX, top: y + (offsetY - SAFE_TOP), width: CARD_WIDTH, height: CARD_HEIGHT }}
              >
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="truncate text-[10px] font-semibold text-slate-800">{node.name}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[9px] text-slate-500">
                  <span className="truncate">{node.grade || "Parent"}</span>
                  <span>{node.points ?? 0} pts</span>
                </div>
                {hasChildren && (
                  <div className="absolute -right-1 -top-1 rounded-full bg-slate-700 px-1 text-[8px] text-white">
                    {isExpanded ? "-" : "+"}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
