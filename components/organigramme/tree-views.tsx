import type { OrganigrammeNode } from './types'
import { EmployeeCard } from './employee-card'
import { ConnectionLines } from './connection-lines'

interface DesktopTreeNodeProps {
  node: OrganigrammeNode
  expandedNodes: Set<string>
  onToggle: (id: string) => void
  level?: number
}

export function DesktopTreeNode({
  node,
  expandedNodes,
  onToggle,
  level = 0,
}: DesktopTreeNodeProps) {
  const isRoot = level === 0
  const hasChildren = node.children.length > 0
  const isExpanded = expandedNodes.has(node.id) || isRoot

  if (!isExpanded && !isRoot) return null

  return (
    <div className="flex flex-col items-center">
      <EmployeeCard
        node={node}
        isRoot={isRoot}
        isMobile={false}
        isExpanded={isExpanded}
        onToggle={() => hasChildren && onToggle(node.id)}
      />

      {hasChildren && isExpanded && (
        <div className="relative pt-8 sm:pt-12 hidden md:flex md:flex-col md:items-center">
          <ConnectionLines level={level} childrenCount={node.children.length} />
          <div className="mt-20 flex flex-wrap justify-center items-start gap-3 sm:gap-6">
            {node.children.map((child) => (
              <div key={child.id} className="flex justify-center">
                <DesktopTreeNode
                  node={child}
                  level={level + 1}
                  expandedNodes={expandedNodes}
                  onToggle={onToggle}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface MobileNodeListProps {
  node: OrganigrammeNode
  expandedNodes: Set<string>
  onToggle: (id: string) => void
  level?: number
}

export function MobileNodeList({
  node,
  expandedNodes,
  onToggle,
  level = 0,
}: MobileNodeListProps) {
  const hasChildren = node.children.length > 0
  const isExpanded = expandedNodes.has(node.id)

  return (
    <div>
      <div style={{ marginLeft: `${level * 12}px` }} className="mb-2">
        <EmployeeCard
          node={node}
          isRoot={level === 0}
          isExpanded={isExpanded}
          onToggle={() => hasChildren && onToggle(node.id)}
          isMobile
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
