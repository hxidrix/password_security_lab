import { useState } from 'react'
import { motion } from 'framer-motion'

import { cn } from '../../utils/cn'

type CopyButtonProps = {
  text: string
  label?: string
  className?: string
  size?: 'sm' | 'md'
}

export function CopyButton({ text, label = 'Copy', className, size = 'sm' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 900)
    } catch {
      // Ignore; caller can optionally wrap with their own error UI.
    }
  }

  const sizeCls =
    size === 'md' ? 'px-3 py-2 text-xs' : 'px-2.5 py-1.5 text-[11px]'

  return (
    <motion.button
      type="button"
      onClick={onCopy}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'btn',
        sizeCls,
        className,
      )}
    >
      {copied ? 'Copied' : label}
    </motion.button>
  )
}
