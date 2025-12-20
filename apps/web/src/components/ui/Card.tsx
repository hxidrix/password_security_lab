import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

import { cn } from '../../utils/cn'

type CardProps = {
  children: ReactNode
  className?: string
  /** Stagger entrances across the dashboard. */
  delay?: number
}

export function Card({ children, className, delay = 0 }: CardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.section
      variants={cardVariants}
      whileHover={{ y: -4 }}
      className={cn(
        'relative group card-glass rounded-2xl border border-white/8 bg-[color:var(--card)] p-6 backdrop-blur-sm shadow-lg transition-transform duration-200',
        className,
      )}
    >
      <div className="card-hover-ring" />
      {children}
    </motion.section>
  )
}
