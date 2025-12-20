import { useState } from 'react'
import { analyzePassword } from '../../utils/password/analysis'

import { Card } from '../../components/ui/Card'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { generateStrongPassword } from '../../utils/password/generate'

type Suggestion = {
  password: string
  rationale: string
  entropy: number
}

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text)
}

export function SecureSuggestionsCard({ delay = 0 }: { delay?: number }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  async function generate() {
    setError(null)
    setLoading(true)

    try {
      // Generate locally using cryptographically secure random
      const newSuggestions = Array.from({ length: 6 }, () => {
        const password = generateStrongPassword(16)
        const analysis = analyzePassword(password)
        return {
          password,
          rationale: `${analysis.label} password (${analysis.entropyBits} bits entropy, ${analysis.charsetSize}-char alphabet)`,
          entropy: analysis.entropyBits,
        }
      })
      
      setSuggestions(newSuggestions)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  async function onCopy(pw: string) {
    try {
      await copyToClipboard(pw)
      setCopied(pw)
      window.setTimeout(() => setCopied(null), 1200)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Clipboard copy failed')
    }
  }

  return (
    <Card delay={delay}>
      <SectionHeader
        title="Secure Password Suggestions"
        subtitle="Generate strong passwords locally using cryptographic randomness."
      />

      <div className="mt-5">
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className={`btn primary w-full ${loading ? 'opacity-80 cursor-wait' : ''}`}
        >
          {loading ? 'Generating…' : 'Generate suggestions'}
        </button>

        {error ? (
          <div className="mt-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-200">
            {error}
          </div>
        ) : null}

        <div className="mt-4 grid gap-3">
          {suggestions.map((s) => {
            const a = analyzePassword(s.password)
            const score = a.entropyBits || 0
            const color = score < 40 ? 'border-red-500/30 bg-red-500/10 text-red-200' : score < 60 ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-200' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'

            return (
              <div key={s.password} className={`rounded-xl border p-3 ${color}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="break-all font-mono text-sm text-[color:var(--text)]">{s.password}</div>
                    <div className="mt-1 text-xs text-[color:var(--muted)]">{s.rationale}</div>
                    <div className="mt-2 text-xs">
                      <span className="text-[color:var(--muted)]">Entropy:</span>{' '}
                      <span className="font-medium">{Math.round(score)} bits</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onCopy(s.password)}
                    className="btn px-3 py-1.5"
                  >
                    {copied === s.password ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
