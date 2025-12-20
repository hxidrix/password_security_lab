import { useMemo } from 'react'

import { Card } from '../../components/ui/Card'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { usePassword } from '../../state/password'
import { analyzePassword } from '../../utils/password/analysis'

function labelColor(label: string) {
  switch (label) {
    case 'Very strong':
      return 'text-emerald-300'
    case 'Strong':
      return 'text-sky-300'
    case 'Fair':
      return 'text-yellow-300'
    case 'Weak':
      return 'text-orange-300'
    default:
      return 'text-red-300'
  }
}

export function PasswordAnalyzerCard({ delay = 0 }: { delay?: number }) {
  const { password, setPassword } = usePassword()

  const analysis = useMemo(() => analyzePassword(password), [password])

  const entropyLoss = Math.max(
    0,
    Math.round((analysis.entropyBits - analysis.effectiveEntropyBits) * 10) / 10
  )

  return (
    <Card delay={delay}>
      <SectionHeader
        title="Password Input & Analysis"
        subtitle="Entropy, effective security, and real-world attack resistance."
      />

      <div className="mt-5">
        <label className="block text-sm font-medium">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type a password…"
          autoComplete="off"
          spellCheck={false}
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-[color:var(--text)] placeholder:text-white/35 focus:border-white/20 focus:outline-none"
        />

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="text-sm">
            <span className="text-[color:var(--muted)]">Strength: </span>
            <span className={labelColor(analysis.label)}>{analysis.label}</span>
          </div>
          <div className="text-xs text-[color:var(--muted)]">
            {analysis.entropyBits} bits (raw entropy)
          </div>
        </div>

        <div className="mt-2">
          <ProgressBar value={analysis.score / 100} />
        </div>

        {/* Core metrics */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-[color:var(--muted)]">
          <div className="rounded-xl border border-white/10 bg-black/10 p-3">
            <div className="text-[color:var(--text)]">Length</div>
            <div className="mt-1">{analysis.length}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/10 p-3">
            <div className="text-[color:var(--text)]">Character sets</div>
            <div className="mt-1">
              {[analysis.hasLower && 'a-z', analysis.hasUpper && 'A-Z', analysis.hasDigit && '0-9', analysis.hasSymbol && '!@#']
                .filter(Boolean)
                .join(' · ') || '—'}
            </div>
          </div>
        </div>

        {/* Entropy vs Effective Entropy */}
        <div className="mt-5 rounded-xl border border-white/10 bg-black/10 p-4">
          <div className="text-sm font-medium mb-1">
            Entropy vs Effective Entropy
          </div>
          <div className="text-xs text-[color:var(--muted)] mb-3">
            Raw entropy assumes a perfectly random password. Effective entropy
            accounts for patterns, dictionary words, repetition, and attacker
            heuristics.
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <div className="text-[color:var(--muted)]">Raw entropy</div>
              <div className="mt-1 font-medium text-[color:var(--text)]">
                {analysis.entropyBits} bits
              </div>
            </div>
            <div>
              <div className="text-[color:var(--muted)]">Effective entropy</div>
              <div className="mt-1 font-medium text-[color:var(--text)]">
                {analysis.effectiveEntropyBits} bits
              </div>
            </div>
            <div>
              <div className="text-[color:var(--muted)]">Entropy lost</div>
              <div className="mt-1 font-medium text-red-300">
                −{entropyLoss} bits
              </div>
            </div>
          </div>

          <div className="mt-3 text-xs text-[color:var(--muted)]">
            Effective entropy is a more accurate predictor of real-world
            brute-force and dictionary attack success.
          </div>
        </div>

        {/* Detected patterns */}
        {analysis.patterns.length ? (
          <div className="mt-5">
            <div className="text-sm font-medium">Detected weaknesses</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {analysis.patterns.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-[color:var(--muted)]"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {/* Suggestions */}
        {analysis.suggestions.length ? (
          <div className="mt-5">
            <div className="text-sm font-medium">Security recommendations</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[color:var(--muted)]">
              {analysis.suggestions.slice(0, 5).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Card>
  )
}
