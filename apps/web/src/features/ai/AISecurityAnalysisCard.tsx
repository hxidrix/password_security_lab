import { useEffect, useState } from 'react'

import { Card } from '../../components/ui/Card'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { usePassword } from '../../state/password'
import useDebouncedValue from '../../hooks/useDebouncedValue'
import { runSecurityAnalysis, TRANSPARENCY_LABEL } from './securityAnalysisEngine'
import type { SecurityAnalysis } from './securityAnalysisEngine'

export function AISecurityAnalysisCard({ delay = 0 }: { delay?: number }) {
  const { password } = usePassword()
  const debouncedPassword = useDebouncedValue(password, 400)

  const [analysis, setAnalysis] = useState<SecurityAnalysis | null>(null)

  useEffect(() => {
    if (!debouncedPassword) {
      setAnalysis(null)
      return
    }
    // Deterministic local analysis — no external APIs used.
    const res = runSecurityAnalysis(debouncedPassword)
    setAnalysis(res)
  }, [debouncedPassword])

  function renderRecommendations(recommendations: string[]) {
    const nodes: React.ReactNode[] = []
    
    recommendations.forEach((line, lineIdx) => {
      const t = line.trim()
      
      // Section headers (end with ':')
      if (t.endsWith(':')) {
        nodes.push(
          <div key={`sec-${lineIdx}`} className="mt-2 font-semibold text-xs text-[color:var(--muted)]">
            {t.replace(/:$/, '')}
          </div>
        )
        return
      }

      // Bullet items (start with •, -, or number)
      if (t.startsWith('•') || t.startsWith('-') || /^\d+\./.test(t)) {
        nodes.push(
          <div key={`item-${lineIdx}`} className="ml-4 text-xs text-[color:var(--muted)]">
            • {t.replace(/^[•\-]\s*/, '').replace(/^\d+\.\s*/, '')}
          </div>
        )
        return
      }

      // Regular paragraphs
      nodes.push(
        <div key={`par-${lineIdx}`} className="text-xs text-[color:var(--muted)]">
          {t}
        </div>
      )
    })

    return nodes
  }

  return (
    <Card delay={delay}>
      <SectionHeader
        title="Security Analysis"
        subtitle="Deterministic, rule-based security evaluation (no external services)."
      />

      <div className="mt-4 text-xs text-[color:var(--muted)]">{TRANSPARENCY_LABEL}</div>

      {!analysis ? (
        <div className="mt-4 text-sm text-[color:var(--muted)]">Enter a password to run a deterministic security analysis.</div>
      ) : (
        <div className="mt-4 grid gap-3">
          <div className="rounded-xl border border-white/10 bg-black/10 p-3">
            <div className="text-xs text-[color:var(--muted)]">Executive Summary</div>
            <div className="mt-1 text-sm text-[color:var(--text)]">{analysis.executiveSummary}</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/10 p-3">
            <div className="text-xs text-[color:var(--muted)]">Technical Findings</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[color:var(--muted)]">
              {analysis.technicalFindings.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/10 p-3">
            <div className="text-xs text-[color:var(--muted)]">Attack Feasibility Analysis</div>
              <div className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-x-6 gap-y-3">
                {analysis.attackFeasibility.map((a, i) => {
                  const t = a.trim()

                  // Arrowed helper notes: render as small muted text spanning the detail column
                  if (t.startsWith('→')) {
                    return (
                      <div key={i} className="text-xs text-[color:var(--muted)] md:col-start-2">{t.replace(/^→\s*/, '')}</div>
                    )
                  }

                  // Labeled row: split on first colon to create left label and right detail
                  if (t.includes(':')) {
                    const idx = t.indexOf(':')
                    const label = t.slice(0, idx)
                    const detail = t.slice(idx + 1).trim()
                    return (
                      <>
                        <div key={`label-${i}`} className="text-xs font-semibold text-blue-300">{label}</div>
                        <div key={`detail-${i}`} className="text-sm leading-relaxed text-[color:var(--text)]">{detail}</div>
                      </>
                    )
                  }

                  // Fallback: plain paragraph spanning both columns
                  return (
                    <div key={i} className="md:col-span-2 text-sm text-[color:var(--text)]">{t}</div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/10 p-3">
            <div className="text-xs text-[color:var(--muted)]">Risk Classification</div>
            <div className="mt-1 text-sm font-medium">{analysis.riskClassification}</div>
            <div className="mt-1 text-sm text-[color:var(--muted)]">Justification: {analysis.technicalFindings[0]}</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/10 p-3">
            <div className="text-xs text-[color:var(--muted)]">Professional Recommendations</div>
            <div className="mt-2 text-sm text-[color:var(--muted)]">
              {renderRecommendations(analysis.recommendations)}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
