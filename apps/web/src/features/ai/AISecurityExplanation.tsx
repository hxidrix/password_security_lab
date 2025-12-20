import { useEffect, useState } from 'react'
import useDebouncedValue from '../../hooks/useDebouncedValue'
import { Card } from '../../components/ui/Card'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { runSecurityAnalysis, TRANSPARENCY_LABEL } from './securityAnalysisEngine'

export function AISecurityExplanation({ password }: { password: string }) {
  const debouncedPassword = useDebouncedValue(password, 400)
  const [summary, setSummary] = useState<string | null>(null)

  useEffect(() => {
    if (!debouncedPassword) {
      setSummary(null)
      return
    }
    const res = runSecurityAnalysis(debouncedPassword)
    // Keep this component concise: show the executive summary and first recommendation
    const s = `${res.executiveSummary} Recommendation: ${res.recommendations[0]}`
    setSummary(s)
  }, [debouncedPassword])

  return (
    <Card>
      <SectionHeader title="Security Explanation" subtitle="Deterministic technical assessment (local heuristics)." />

      <div className="mt-4">
        <div className="text-xs text-[color:var(--muted)]">{TRANSPARENCY_LABEL}</div>
        <div className="mt-3 text-sm text-[color:var(--muted)]">{summary ?? 'Enter a password to receive a concise professional explanation.'}</div>
      </div>
    </Card>
  )
}

export default AISecurityExplanation
