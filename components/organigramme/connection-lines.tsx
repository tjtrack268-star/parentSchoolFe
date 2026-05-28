interface ConnectionLinesProps {
  level: number
  childrenCount: number
}

export function ConnectionLines({ level, childrenCount }: ConnectionLinesProps) {
  if (childrenCount <= 0) return null

  return (
    <svg
      className="absolute -top-8 sm:-top-12 left-1/2 -translate-x-1/2"
      viewBox={`0 0 ${Math.max(400, childrenCount * 200)} 120`}
      preserveAspectRatio="xMidYMid meet"
      width={Math.max(300, Math.min(childrenCount * 200, 800))}
      height="120"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`orgGradient-${level}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#6B7280" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      <line x1="50%" y1="0" x2="50%" y2="30" stroke={`url(#orgGradient-${level})`} strokeWidth="3" strokeLinecap="round" />

      {childrenCount > 1 && (
        <line
          x1={`${(1 / (childrenCount + 1)) * 100}%`}
          y1="30"
          x2={`${(childrenCount / (childrenCount + 1)) * 100}%`}
          y2="30"
          stroke={`url(#orgGradient-${level})`}
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}

      {Array.from({ length: childrenCount }).map((_, idx) => {
        const childX = ((idx + 1) / (childrenCount + 1)) * 100
        return (
          <line
            key={`vline-${idx}`}
            x1={`${childX}%`}
            y1="30"
            x2={`${childX}%`}
            y2="80"
            stroke={`url(#orgGradient-${level})`}
            strokeWidth="2"
            strokeLinecap="round"
          />
        )
      })}
    </svg>
  )
}
