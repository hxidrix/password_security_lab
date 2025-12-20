// Very small demo heatmap: show relative cracking probability bins
export function ProbabilityHeatmap({
  entropyBits,
  guessesPerSecond = 1000,
}: {
  entropyBits: number
  guessesPerSecond?: number
}) {
  const steps = [1, 60, 3600, 86400, 31536000]

  const bins = steps.map((s, i) => {
    // average-case keyspace is half the full space => denom 2^(entropy-1)
    const denom = Math.pow(2, Math.max(0, entropyBits - 1))
    const p = entropyBits > 0 ? Math.min(1, (guessesPerSecond * s) / denom) : 0
    return {
      seconds: s,
      label: i === 0 ? '1s' : i === 1 ? '1m' : i === 2 ? '1h' : i === 3 ? '1d' : '1y',
      p,
    }
  })

  return (
    <div className="space-y-2">
      {bins.map((b) => {
        // format percent for display and clamp
        const rawPct = Number.isFinite(b.p) ? b.p * 100 : 0
        const pct = rawPct <= 0.0001 ? '<0.01' : rawPct >= 99.9999 ? '>99.99' : (Math.round(rawPct * 100) / 100).toFixed(2)
        const widthPct = Math.min(100, Math.max(0, rawPct))
        return (
          <div key={b.label} className="flex items-center gap-3">
            <div className="w-12 text-xs text-[color:var(--muted)]">{b.label}</div>
            <div className="flex-1">
              <div className={`w-full rounded-full bg-white/8 h-3 overflow-hidden`}>
                <div
                  style={{ width: `${widthPct}%`, maxWidth: '100%' }}
                  className={`h-3 bg-[linear-gradient(90deg,var(--purple),var(--blue))]`}
                  title={`${pct}% chance`}
                />
              </div>
            </div>
            <div className="w-16 text-right text-xs font-mono text-[color:var(--muted)]">{pct}%</div>
          </div>
        )
      })}
    </div>
  )
}

export default ProbabilityHeatmap
