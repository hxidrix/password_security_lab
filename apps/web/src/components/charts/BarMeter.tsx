import { motion } from 'framer-motion'

import { cn } from '../../utils/cn'

type Segment = {
  label: string
  value: number
  className: string
}

type BarMeterProps = {
  segments: Segment[]
  /** Total used for normalization; defaults to sum of segment values. */
  total?: number
  className?: string
  heightClassName?: string
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

export function BarMeter({ segments, total, className, heightClassName = 'h-2.5' }: BarMeterProps) {
  const sum = segments.reduce((a, s) => a + Math.max(0, s.value), 0)
  const denom = Math.max(1e-9, total ?? sum)

  return (
    <div className={cn('w-full overflow-hidden rounded-full bg-white/10', heightClassName, className)}>
      <div className="flex h-full w-full">
        {segments.map((s) => {
          const pct = clamp01(Math.max(0, s.value) / denom)
          return (
            <motion.div
              key={s.label}
              className={cn('h-full', s.className)}
              initial={{ width: 0 }}
              animate={{ width: `${pct * 100}%` }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              aria-label={s.label}
              title={`${s.label}: ${s.value.toFixed(1)}`}
            />
          )
        })}
      </div>
    </div>
  )
}
