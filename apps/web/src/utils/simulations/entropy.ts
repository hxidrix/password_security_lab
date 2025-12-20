function log2(n: number) {
  return Math.log(n) / Math.log(2)
}

export function baselineEntropyBits(opts: { length: number; charsetSize: number }): number {
  const { length, charsetSize } = opts
  if (!Number.isFinite(length) || length <= 0) return 0
  if (!Number.isFinite(charsetSize) || charsetSize <= 0) return 0
  return length * log2(charsetSize)
}

export type EntropyBreakdown = {
  baselineBits: number
  penaltyBits: number
  repetitionPenaltyBits: number
  effectiveBits: number
}

export function entropyBreakdown(opts: {
  length: number
  charsetSize: number
  penaltyBits: number
  repetitionPenaltyBits: number
}): EntropyBreakdown {
  const baselineBits = baselineEntropyBits({ length: opts.length, charsetSize: opts.charsetSize })
  const penaltyBits = Math.max(0, opts.penaltyBits)
  const repetitionPenaltyBits = Math.max(0, opts.repetitionPenaltyBits)
  const effectiveBits = Math.max(0, baselineBits - penaltyBits - repetitionPenaltyBits)
  return { baselineBits, penaltyBits, repetitionPenaltyBits, effectiveBits }
}
