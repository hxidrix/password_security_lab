// React import not required with new JSX runtime
import { motion } from 'framer-motion'

type Preset = { id: string; label: string; guesses: number }

export default function AverageCrackTimeBars({
  presets,
  entropyBits,
  width = 520,
  height = 160,
}: {
  presets: Preset[]
  entropyBits: number
  width?: number
  height?: number
}) {
  const pad = { l: 110, r: 12, t: 12, b: 28 }
  const innerW = width - pad.l - pad.r
  const innerH = height - pad.t - pad.b

  // average-case seconds = 2^(entropy-1) / g
  const denom = Math.pow(2, Math.max(0, entropyBits - 1))
  const values = presets.map((p) => ({ ...p, seconds: denom / Math.max(1, p.guesses) }))

  // clamp for visualization: map log10(seconds)
  const logVals = values.map((v) => Math.log10(Math.max(v.seconds, 1e-6)))
  const minLog = Math.min(...logVals)
  const maxLog = Math.max(...logVals)

  function xForLog(logV: number) {
    if (maxLog === minLog) return pad.l + innerW * 0.5
    return pad.l + ((logV - minLog) / (maxLog - minLog)) * innerW
  }

  return (
    <div>
      <div className="text-xs text-[color:var(--muted)]">Average crack time by attacker preset (log scale)</div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="mt-2">
        <g>
          {values.map((v, i) => {
            const logV = Math.log10(Math.max(v.seconds, 1e-6))
            const x = xForLog(logV)
            const y = pad.t + i * (innerH / Math.max(1, values.length))
            const barW = Math.max(6, x - pad.l)
            return (
              <g key={v.id}>
                <text x={6} y={y + 12} fontSize={12} fill="var(--muted)">{v.label}</text>
                <motion.rect x={pad.l} y={y + 2} width={barW} height={12} fill="#06b6d4" initial={{ width: 0 }} animate={{ width: barW }} />
                <text x={pad.l + barW + 8} y={y + 12} fontSize={12} fill="#fff">{formatSeconds(v.seconds)}</text>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}

function formatSeconds(s: number) {
  if (!isFinite(s) || s <= 0) return '∞'
  if (s < 1) return `${(s * 1000).toFixed(1)} ms`
  if (s < 60) return `${s.toFixed(1)} s`
  if (s < 3600) return `${(s / 60).toFixed(1)} m`
  if (s < 86400) return `${(s / 3600).toFixed(1)} h`
  if (s < 31536000) return `${(s / 86400).toFixed(1)} d`
  return `${(s / 31536000).toFixed(1)} y`
}
