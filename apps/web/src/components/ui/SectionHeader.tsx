import type { ReactNode } from 'react'

import { cn } from '../../utils/cn'

type SectionHeaderProps = {
  title: string
  subtitle?: string
  right?: ReactNode
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  right,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div>
        <h2 className="text-xl font-semibold tracking-tight flex items-center gap-3 text-white glow-title glow-hover">
          <span className="accent-dot pulse" />
          <span>{title}</span>
        </h2>
        {subtitle ? <div className="mt-3 h-px bg-white/6 rounded" /> : null}
        {subtitle ? (
          <p className="mt-1 text-sm text-[color:var(--muted)]">{subtitle}</p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  )
}
