import { useId, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { cn } from '../../utils/cn'

type TooltipProps = {
  content: ReactNode
  children: ReactNode
  className?: string
  side?: 'top' | 'bottom'
}

export function Tooltip({ content, children, className, side = 'top' }: TooltipProps) {
  const id = useId()
  const [open, setOpen] = useState(false)

  const offsetClass = side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'

  return (
    <span
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-describedby={open ? id : undefined}
    >
      {children}

      <AnimatePresence>
        {open ? (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: side === 'top' ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === 'top' ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className={cn(
              'pointer-events-none absolute left-1/2 z-50 w-max max-w-[260px] -translate-x-1/2 rounded-lg border border-white/10 bg-black/85 px-2.5 py-2 text-xs text-[color:var(--text)] shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur',
              offsetClass,
            )}
          >
            <span className="block whitespace-pre-wrap leading-snug">{content}</span>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  )
}
