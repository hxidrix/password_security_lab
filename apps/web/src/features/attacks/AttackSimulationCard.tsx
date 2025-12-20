import { useMemo, useState } from 'react'

import { Card } from '../../components/ui/Card'
import { SectionHeader } from '../../components/ui/SectionHeader'
import ProbabilityHeatmap from '../../components/charts/ProbabilityHeatmap'
import BruteForceSimulation from './BruteForceSimulation'
import DictionaryAttackSimulation from './DictionaryAttackSimulation'
import { usePassword } from '../../state/password'
import { formatDurationSeconds } from '../../utils/format/duration'
import { analyzePassword } from '../../utils/password/analysis'

type BruteMode = 'online' | 'offline'


const ONLINE_GUESSES_PER_SEC = 100 // typical rate-limited login
const OFFLINE_GUESSES_PER_SEC = 1_000_000_000 // GPU-ish (demo scale)

function estimateAvgCrackSeconds(entropyBits: number, guessesPerSecond: number) {
  if (entropyBits <= 0 || guessesPerSecond <= 0) return 0

  // Average case is roughly half the keyspace.
  return Math.pow(2, entropyBits - 1) / guessesPerSecond
}

export function AttackSimulationCard({ delay = 0 }: { delay?: number }) {
  const { password } = usePassword()
  const analysis = useMemo(() => analyzePassword(password), [password])

  const [bruteMode] = useState<BruteMode>('online')
  // password length is taken from the analyzed password and is not editable
  const whatIfLength = analysis.length || 8
  const avgOfflineSeconds = useMemo(
    () => estimateAvgCrackSeconds(analysis.entropyBits, OFFLINE_GUESSES_PER_SEC),
    [analysis.entropyBits],
  )

  // compute charset size for what-if
  const whatIfCharsetSize = useMemo(() => {
    // derive charset size from the analyzed password categories when controls are disabled
    return analysis.charsetSize > 0 ? analysis.charsetSize : 26
  }, [analysis.charsetSize])

  const whatIfEntropyBits = Math.round((whatIfLength * Math.log2(Math.max(2, whatIfCharsetSize))) * 10) / 10
  // probability bins are computed in the ProbabilityHeatmap component.

  return (
    <Card delay={delay} className="lg:col-span-2">
      <SectionHeader
        title="Attack Simulation"
        subtitle="Estimates + visual simulations for brute-force and dictionary attacks."
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
          <div className="text-xs text-[color:var(--muted)]">Average time-to-crack (online)</div>
          <div className="mt-1 text-lg font-semibold">{password ? formatDurationSeconds(estimateAvgCrackSeconds(analysis.entropyBits, ONLINE_GUESSES_PER_SEC)) : '—'}</div>
          <div className="mt-1 text-xs text-[color:var(--muted)]">
            ~{ONLINE_GUESSES_PER_SEC.toLocaleString()} guesses/sec (rate-limited login)
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
          <div className="text-xs text-[color:var(--muted)]">Average time-to-crack (offline)</div>
          <div className="mt-1 text-lg font-semibold">{password ? formatDurationSeconds(avgOfflineSeconds) : '—'}</div>
          <div className="mt-1 text-xs text-[color:var(--muted)]">
            ~{OFFLINE_GUESSES_PER_SEC.toLocaleString()} guesses/sec (GPU-ish)
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
          <div className="text-xs text-[color:var(--muted)]">Based on</div>
          <div className="mt-1 text-sm">
            <span className="text-[color:var(--muted)]">Entropy:</span>{' '}
            <span className="font-medium">{analysis.entropyBits} bits</span>
          </div>
          <div className="mt-1 text-sm">
            <span className="text-[color:var(--muted)]">Charset size:</span>{' '}
            <span className="font-medium">{analysis.charsetSize || '—'}</span>
          </div>
          <div className="mt-1 text-sm">
            <span className="text-[color:var(--muted)]">Length:</span>{' '}
            <span className="font-medium">{analysis.length}</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
          <div className="text-sm font-medium">Probability heatmap</div>
          <div className="mt-2 text-xs text-[color:var(--muted)]">Chance of cracking within standard durations (based on estimated average-case).</div>
          <div className="mt-3">
            <ProbabilityHeatmap entropyBits={analysis.entropyBits} />
          </div>
        </div>
      </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
          <BruteForceSimulation password={password} mode={bruteMode} entropyBits={whatIfEntropyBits} />
        </div>

        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
          <DictionaryAttackSimulation password={password} />
        </div>
      </div>

      {!password ? (
        <div className="mt-4 text-sm text-[color:var(--muted)]">
          Enter a password in the analyzer card to enable simulations.
        </div>
      ) : null}
    </Card>
  )
}
