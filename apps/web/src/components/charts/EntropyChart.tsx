export function EntropyChart({ entropyBits, length }: { entropyBits: number; length: number }) {
  const maxLen = Math.max(6, length + 4)
  const perChar = entropyBits > 0 && length > 0 ? entropyBits / length : 2
  const data = Array.from({ length: maxLen }, (_, i) => {
    const idx = i + 1
    return { x: idx, y: Math.round(perChar * idx * 10) / 10 }
  })

  const width = 400
  const height = 110
  const padding = 12
  const maxY = Math.max(...data.map((d) => d.y)) || 10

  const points = data
    .map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2)
      const y = height - padding - (d.y / maxY) * (height - padding * 2)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div style={{ width: '100%', height }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        <rect x={0} y={0} width={width} height={height} fill="transparent" />
        <polyline points={points} fill="none" stroke="#8A2BE2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export default EntropyChart
