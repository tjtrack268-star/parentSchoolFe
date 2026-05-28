import { Maximize2, Minimize2 } from 'lucide-react'

interface ChartControlsProps {
  onExpandAll: () => void
  onCollapseAll: () => void
}

export function ChartControls({ onExpandAll, onCollapseAll }: ChartControlsProps) {
  return (
    <div className="mb-6 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={onExpandAll}
        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
      >
        <Maximize2 className="h-4 w-4" />
        Développer tout
      </button>
      <button
        type="button"
        onClick={onCollapseAll}
        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
      >
        <Minimize2 className="h-4 w-4" />
        Réduire tout
      </button>
    </div>
  )
}
