import { GRADE_COLORS } from '@/lib/constants'

export function ChartLegend() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto mb-8">
      <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Légende des grades</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {Object.entries(GRADE_COLORS)
          .filter(([name]) => name !== 'Aucun')
          .map(([name, color]) => (
            <div key={name} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-xs sm:text-sm text-gray-700 truncate">{name}</span>
            </div>
          ))}
      </div>
    </div>
  )
}
