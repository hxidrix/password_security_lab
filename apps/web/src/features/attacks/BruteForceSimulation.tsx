import { useEffect, useRef, useState } from 'react'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { analyzePassword } from '../../utils/password/analysis'
import { formatDurationSeconds } from '../../utils/format/duration'

export function BruteForceSimulation({
  password,
  mode = 'online',
  entropyBits,
}: {
  password: string
  mode?: 'online' | 'offline'
  entropyBits?: number
}) {
  const analysis = password
    ? analyzePassword(password)
    : { entropyBits: entropyBits ?? 0 }

  const effectiveEntropy = entropyBits ?? analysis.entropyBits

  const [coverage, setCoverage] = useState(0) // % of keyspace searched
  const [attempts, setAttempts] = useState(0)

  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    setCoverage(0)
    setAttempts(0)
  }, [password, mode])

  useEffect(() => {
    if (!password || effectiveEntropy <= 0) return

    /**
     * SECURITY MODEL
     * ---------------
     * • Uniform random password
     * • Average case brute-force → 50% of keyspace
     * • Animation shows search-space coverage, not real cracking
     */

    const keyspaceSize = Math.pow(2, effectiveEntropy)
    const expectedGuesses = keyspaceSize / 2

    // Attacker capability (chosen for demo clarity)
    const guessesPerSecond =
      mode === 'online' ? 100 : 1_000_000_000

    // Cap animation so UI remains responsive
    const animationDurationMs = 3000
    const start = performance.now()

    function tick(now: number) {
      const t = Math.min(1, (now - start) / animationDurationMs)

      // Linear mapping: animation progress → keyspace coverage
      const searchedGuesses = expectedGuesses * t
      const cappedGuesses = Math.min(searchedGuesses, 5_000_000)

      setCoverage(t)
      setAttempts(Math.round(cappedGuesses))

      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [password, mode, effectiveEntropy])

  function avgSecondsForRate(gps: number) {
    if (effectiveEntropy <= 0) return Infinity
    const expectedGuesses = Math.pow(2, effectiveEntropy - 1)
    return expectedGuesses / gps
  }

  const attackerProfiles = [
    {
      label: 'Online (rate-limited)',
      guessesPerSecond: 100,
      note: 'Strict authentication throttling',
    },
    {
      label: 'Scripted bot',
      guessesPerSecond: 1_000,
      note: 'Automated attempts with limited parallelism',
    },
    {
      label: 'Single GPU',
      guessesPerSecond: 1_000_000,
      note: 'High-end consumer GPU (offline)',
    },
    {
      label: 'GPU farm',
      guessesPerSecond: 1_000_000_000,
      note: 'Optimized distributed cracking cluster',
    },
  ]

  const estimateLabel = (() => {
    const gpuFarm = attackerProfiles[3]
    const secs = avgSecondsForRate(gpuFarm.guessesPerSecond)
    return `${formatDurationSeconds(secs)} (average case)`
  })()

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Brute-force simulation</div>
          <div className="mt-1 text-xs text-[color:var(--muted)]">
            Visualization of average-case search-space coverage.
          </div>
        </div>
        <div className="text-xs text-[color:var(--muted)]">
          Estimate: <span className="font-medium">{estimateLabel}</span>
        </div>
      </div>

      <div className="mt-3">
        <ProgressBar value={coverage} />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-[color:var(--muted)]">
        <div>
          Mode:{' '}
          <span className="text-[color:var(--text)]">{mode}</span>
        </div>
        <div>
          Simulated attempts:{' '}
          <span className="font-mono text-[color:var(--text)]">
            {attempts.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-3 text-sm text-[color:var(--muted)]">
        <div className="font-medium mb-1">Attack scenarios (average case)</div>
        <ul className="space-y-1">
          {attackerProfiles.map((p) => {
            const secs = avgSecondsForRate(p.guessesPerSecond)
            const formatted = formatDurationSeconds(secs)
            return (
              <li key={p.label} className="flex justify-between">
                <div>
                  <span className="font-medium">{p.label}:</span>{' '}
                  <span>{formatted}</span>
                  <div className="text-xs text-[color:var(--muted)]">
                    {p.note}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default BruteForceSimulation
