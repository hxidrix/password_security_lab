import { motion } from 'framer-motion'

import { cn } from '../../utils/cn'

type ProgressBarProps = {
  value: number
  className?: string
  heightClassName?: string
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

export function ProgressBar({
  value,
  className,
  heightClassName = 'h-2.5',
}: ProgressBarProps) {
  const pct = Math.round(clamp01(value) * 100)
  // color gradient depends on pct: low -> green, mid -> yellow, high -> red
  const gradient = pct < 33 ? 'linear-gradient(90deg,#10b981,#06b6d4)' : pct < 66 ? 'linear-gradient(90deg,#f59e0b,#f97316)' : 'linear-gradient(90deg,#ef4444,#8b5cf6)'

  return (
    <motion.div
      className={cn('w-full overflow-hidden rounded-full bg-white/10', heightClassName, className)}
      aria-label="progress"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      role="progressbar"
      whileHover={{ scale: 1.01 }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: gradient }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.45, ease: 'easeOut' }}
      />
    </motion.div>
  )
}
