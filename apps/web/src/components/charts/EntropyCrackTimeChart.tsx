import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const LOG10_2 = Math.log10(2)

function formatSeconds(s: number) {
  if (!isFinite(s) || s <= 0) return '∞'
  if (s < 1) return `${(s * 1000).toFixed(1)} ms`
  if (s < 60) return `${s.toFixed(1)} s`
  if (s < 3600) return `${(s / 60).toFixed(1)} m`
  if (s < 86400) return `${(s / 3600).toFixed(1)} h`
  if (s < 31536000) return `${(s / 86400).toFixed(1)} d`
  return `${(s / 31536000).toFixed(1)} y`
}

type Profile = { id: string; label: string; guessesPerSec: number; color: string }

export default function EntropyCrackTimeChart({
  maxLength = 40,
  charsetSize = 94,
  highlightLength = 0,
}: {
  maxLength?: number
  charsetSize?: number
  highlightLength?: number
}) {
  const profiles: Profile[] = useMemo(
    () => [
      { id: 'online', label: 'Online (rate-limited)', guessesPerSec: 100, color: '#8A2BE2' },
      { id: 'gpu', label: 'Offline GPU', guessesPerSec: 1e9, color: '#00BFFF' },
      { id: 'botnet', label: 'Botnet', guessesPerSec: 1e11, color: '#F59E0B' },
      { id: 'nation', label: 'Nation-state', guessesPerSec: 1e14, color: '#EF4444' },
    ],
    [],
  )

  const data = useMemo(() => {
    const rows: { len: number; entropy: number; logSec: number[] }[] = []
    for (let l = 1; l <= maxLength; l++) {
      const entropy = l * Math.log2(Math.max(2, charsetSize))
      // compute log10(seconds) in a numerically stable way: log10(2^(entropy-1)/g) = (entropy-1)*log10(2) - log10(g)
      const logSeconds = profiles.map((p) => {
        if (p.guessesPerSec <= 0) return Infinity
        return (Math.max(0, entropy - 1) * LOG10_2) - Math.log10(p.guessesPerSec)
      })
      rows.push({ len: l, entropy, logSec: logSeconds })
    }
    return rows
  }, [maxLength, charsetSize, profiles])

  // y domain in log10 seconds
  const ys = data.flatMap((d) => d.logSec.filter((v) => Number.isFinite(v)))
  const yMin = Math.min(...ys, -6)
  const yMax = Math.max(...ys, 18)

  const width = 640
  const height = 260
  const pad = { l: 48, r: 12, t: 12, b: 36 }

  function xFor(len: number) {
    const x = pad.l + ((len - 1) / (maxLength - 1)) * (width - pad.l - pad.r)
    return x
  }

  function yFor(logSec: number) {
    const y = pad.t + ((yMax - logSec) / (yMax - yMin)) * (height - pad.t - pad.b)
    return y
  }

  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  return (
    <div className="w-full" style={{ maxWidth: width }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="rounded">
        {/* gridlines */}
        <g stroke="rgba(255,255,255,0.06)">
          {Array.from({ length: 6 }).map((_, i) => {
            const v = yMin + (i / 5) * (yMax - yMin)
            return <line key={i} x1={pad.l} x2={width - pad.r} y1={yFor(v)} y2={yFor(v)} />
          })}
        </g>

        {/* x ticks */}
        <g>
          {Array.from({ length: Math.min(maxLength, 8) }).map((_, i) => {
            const len = 1 + Math.round((i / (Math.min(maxLength, 8) - 1)) * (maxLength - 1))
            return (
              <g key={i} transform={`translate(${xFor(len)},${height - pad.b + 6})`}>
                <text x={0} y={0} fontSize={11} fill="var(--muted)" textAnchor="middle">
                  {len}
                </text>
              </g>
            )
          })}
        </g>

        {/* profile lines */}
        {profiles.map((p, pi) => {
          const path = data
            .map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${xFor(d.len)} ${yFor(d.logSec[pi])}`)
            .join(' ')
          return (
            <motion.path
              key={p.id}
              d={path}
              fill="none"
              stroke={p.color}
              strokeWidth={2}
              strokeOpacity={0.95}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          )
        })}

        {/* legend */}
        <g transform={`translate(${pad.l},${pad.t})`}>
          {profiles.map((p, i) => (
            <g key={p.id} transform={`translate(${i * 150},-6)`}>
              <rect width={12} height={6} fill={p.color} rx={2} />
              <text x={18} y={6} fontSize={11} fill="var(--muted)">{p.label}</text>
            </g>
          ))}
        </g>

        {/* highlight current length vertical line */}
        {highlightLength > 0 && (
          <line x1={xFor(highlightLength)} x2={xFor(highlightLength)} y1={pad.t} y2={height - pad.b} stroke="rgba(138,43,226,0.25)" strokeWidth={2} />
        )}

        {/* tooltip overlay area */}
        <rect
          x={pad.l}
          y={pad.t}
          width={width - pad.l - pad.r}
          height={height - pad.t - pad.b}
          fill="transparent"
          onMouseMove={(e) => {
            const rect = (e.target as SVGRectElement).getBoundingClientRect()
            const mx = e.clientX - rect.left
            const ratio = (mx - pad.l) / (width - pad.l - pad.r)
            const idx = Math.round(ratio * (maxLength - 1))
            if (idx >= 0 && idx < maxLength) setHoverIndex(idx + 1)
            else setHoverIndex(null)
          }}
          onMouseLeave={() => setHoverIndex(null)}
        />

        {/* hover marker and text */}
        {hoverIndex && (
          <g>
            <line x1={xFor(hoverIndex)} x2={xFor(hoverIndex)} y1={pad.t} y2={height - pad.b} stroke="rgba(255,255,255,0.06)" />
            <rect x={xFor(hoverIndex) + 8} y={pad.t + 6} rx={6} ry={6} width={200} height={profiles.length * 18 + 22} fill="rgba(0,0,0,0.6)" />
            <text x={xFor(hoverIndex) + 16} y={pad.t + 24} fontSize={12} fill="#fff">Length: {hoverIndex}</text>
            {profiles.map((p, pi) => {
              const row = data[hoverIndex - 1]
              const logSec = row ? row.logSec[pi] : Infinity
              const seconds = Number.isFinite(logSec) ? Math.pow(10, logSec) : Infinity
              return (
                <text key={p.id} x={xFor(hoverIndex) + 16} y={pad.t + 24 + 14 * (pi + 1)} fontSize={11} fill={p.color}>
                  {p.label}: {formatSeconds(seconds)}
                </text>
              )
            })}
          </g>
        )}
      </svg>

      <div className="mt-2 text-xs text-[color:var(--muted)]">
        Multi-line logarithmic chart: average crack time (log seconds) across attacker profiles.
      </div>
    </div>
  )
}
