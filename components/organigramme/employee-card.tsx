import { ChevronDown, ChevronUp } from 'lucide-react'
import { GRADE_COLORS } from '@/lib/constants'
import type { OrganigrammeNode } from './types'

interface EmployeeCardProps {
  node: OrganigrammeNode
  isRoot?: boolean
  isExpanded?: boolean
  onToggle?: () => void
  isMobile?: boolean
}

export function EmployeeCard({
  node,
  isRoot = false,
  isExpanded = true,
  onToggle,
  isMobile = false,
}: EmployeeCardProps) {
  const gradeColor = GRADE_COLORS[node.gradeName as keyof typeof GRADE_COLORS] || '#e5e7eb'
  const hasChildren = node.children.length > 0

  return (
    <div className={`relative transition-all duration-300 ${isMobile ? 'w-full' : ''}`}>
      <div
        className={`relative bg-white rounded-xl border-l-4 shadow-lg transition-all duration-300 hover:shadow-xl ${isMobile ? 'hover:shadow-lg' : 'hover:-translate-y-1'} cursor-pointer overflow-hidden`}
        style={{ borderLeftColor: gradeColor }}
      >
        <div className={`flex items-center gap-2 sm:gap-3 ${isMobile ? 'p-3' : 'p-4'}`}>
          <div
            className={`rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${isMobile ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'}`}
            style={{ backgroundColor: gradeColor }}
          >
            {node.firstName.charAt(0)}
            {node.lastName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-sm">
              {node.firstName} {node.lastName}
            </h3>
            <p className="text-gray-500 truncate text-xs">{node.gradeName}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isRoot && <div className="text-lg sm:text-xl">👑</div>}
            {hasChildren && onToggle && (
              <button
                onClick={onToggle}
                className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'Masquer les enfants' : 'Afficher les enfants'}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {!isMobile && (
          <div className="px-4 pb-4 pt-0 border-t border-gray-100 text-xs text-gray-600">
            <div className="grid grid-cols-2 gap-2">
              <span>Code: {node.sponsorshipCode}</span>
              <span>Points: {node.totalPoints}</span>
            </div>
          </div>
        )}

        {isMobile && (
          <div className="px-3 pb-3 pt-0 border-t border-gray-100 text-xs text-gray-600">
            <div className="grid grid-cols-2 gap-2">
              <span>Code: {node.sponsorshipCode}</span>
              <span>Points: {node.totalPoints}</span>
            </div>
            {node.email && <div className="mt-1 truncate">{node.email}</div>}
          </div>
        )}

        {hasChildren && isMobile && !isExpanded && (
          <div className="px-3 pb-2 text-xs text-center text-blue-600 font-medium">
            +{node.children.length} {node.children.length === 1 ? 'enfant' : 'enfants'}
          </div>
        )}
      </div>
    </div>
  )
}
