import type { ReactNode } from 'react'

import { cn } from '../../utils/cn'

type MetricProps = {
  label: ReactNode
  value: ReactNode
  sublabel?: ReactNode
  className?: string
}

export function Metric({ label, value, sublabel, className }: MetricProps) {
  return (
    <div className={cn('rounded-xl border border-white/10 bg-black/10 p-4', className)}>
      <div className="text-xs text-[color:var(--muted)]">{label}</div>
      <div className="mt-1 text-lg font-semibold tracking-tight text-[color:var(--text)]">
        {value}
      </div>
      {sublabel ? (
        <div className="mt-1 text-xs text-[color:var(--muted)]">{sublabel}</div>
      ) : null}
    </div>
  )
}
