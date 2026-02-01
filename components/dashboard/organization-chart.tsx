"use client"

import { GRADE_COLORS } from "@/lib/constants"

interface TreeNode {
  id: string
  name: string
  email: string
  grade: string
  points: number
  children: TreeNode[]
}

interface OrgChartProps {
  root: TreeNode
  expandedNodes?: Set<string>
  onToggleNode?: (nodeId: string) => void
}

export function OrganizationChart({ root, expandedNodes = new Set(), onToggleNode }: OrgChartProps) {
  const getGradeColor = (grade: string): string => {
    return GRADE_COLORS[grade as keyof typeof GRADE_COLORS] || "#e5e7eb"
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-max p-4">
        <TreeNode 
          node={root}
          gradeColor={getGradeColor(root.grade)}
          expandedNodes={expandedNodes}
          onToggleNode={onToggleNode}
        />
      </div>
    </div>
  )
}

function TreeNode({
  node,
  gradeColor,
  expandedNodes,
  onToggleNode,
}: {
  node: TreeNode
  gradeColor: string
  expandedNodes: Set<string>
  onToggleNode?: (nodeId: string) => void
}) {
  const isExpanded = expandedNodes.has(node.id)
  const hasChildren = node.children && node.children.length > 0

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div
        className="mb-4 w-full max-w-xs sm:w-56 rounded-lg border-2 p-3 sm:p-4 shadow-md transition-all hover:shadow-lg"
        style={{ borderColor: gradeColor, backgroundColor: `${gradeColor}15` }}
      >
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="h-8 w-8 sm:h-12 sm:w-12 rounded-full flex-shrink-0"
              style={{ backgroundColor: gradeColor }}
            >
              <div className="flex h-full w-full items-center justify-center text-white font-bold text-xs sm:text-base">
                {node.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-xs sm:text-sm truncate">{node.name}</h3>
              <p className="text-xs text-gray-600 truncate hidden sm:block">{node.email}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-medium" style={{ color: gradeColor }}>
                  {node.grade}
                </span>
                <span className="text-xs text-gray-500">{node.points} pts</span>
              </div>
            </div>
          </div>

        {hasChildren && (
          <button
            onClick={() => onToggleNode?.(node.id)}
            className="mt-2 w-full rounded px-2 py-1 text-xs font-medium transition-colors"
            style={{
              backgroundColor: gradeColor,
              color: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.8"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1"
            }}
          >
            {isExpanded ? "- Réduire" : "+ Développer"} ({node.children.length})
          </button>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="relative">
          {/* Vertical line from parent */}
          <div
            className="absolute left-1/2 top-0 w-0.5 h-4"
            style={{ backgroundColor: gradeColor, transform: "translateX(-50%)" }}
          />

          {/* Children container */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-6">
            {node.children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                {/* Connection line */}
                <div className="relative">
                  <div
                    className="absolute left-1/2 top-0 h-4 border-t-2 border-l-2"
                    style={{
                      borderColor: gradeColor,
                      width: "2rem",
                      transform: "translateX(-50%)",
                    }}
                  />
                </div>

                {/* Recursive child node */}
                <TreeNode
                  node={child}
                  gradeColor={GRADE_COLORS[child.grade as keyof typeof GRADE_COLORS] || "#e5e7eb"}
                  expandedNodes={expandedNodes}
                  onToggleNode={onToggleNode}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}