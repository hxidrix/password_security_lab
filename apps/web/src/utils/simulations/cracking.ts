const LN2 = Math.log(2)

export type CrackScenario = {
  entropyBits: number
  guessesPerSecond: number
}

function safeExp(x: number) {
  // Avoid Infinity for large values.
  if (x > 700) return Number.POSITIVE_INFINITY
  if (x < -700) return 0
  return Math.exp(x)
}

export function avgTimeToCrackSeconds(opts: CrackScenario): number {
  const { entropyBits, guessesPerSecond } = opts
  if (!Number.isFinite(entropyBits) || entropyBits <= 0) return 0
  if (!Number.isFinite(guessesPerSecond) || guessesPerSecond <= 0) return 0

  // Average time ≈ (N/2)/g where N = 2^entropyBits
  const ln = (entropyBits - 1) * LN2 - Math.log(guessesPerSecond)
  return safeExp(ln)
}

export function probCrackedBySeconds(opts: CrackScenario & { seconds: number }): number {
  const { entropyBits, guessesPerSecond, seconds } = opts
  if (!Number.isFinite(entropyBits) || entropyBits <= 0) return 0
  if (!Number.isFinite(guessesPerSecond) || guessesPerSecond <= 0) return 0
  if (!Number.isFinite(seconds) || seconds <= 0) return 0

  const guesses = guessesPerSecond * seconds
  if (guesses <= 0) return 0

  // Visual-only approximation:
  // Let lambda = guesses / N, with N = 2^entropy.
  // Probability of success after random guesses: 1 - exp(-lambda).
  const lnLambda = Math.log(guesses) - entropyBits * LN2
  const lambda = safeExp(lnLambda)
  if (!Number.isFinite(lambda) || lambda > 50) return 1
  return 1 - Math.exp(-lambda)
}

export function buildProbabilityHeatmap(opts: {
  entropyBits: number
  guessesPerSecond: number
  horizonsSeconds: number[]
  bands: number[]
}): number[][] {
  const { entropyBits, guessesPerSecond, horizonsSeconds, bands } = opts
  // bands define thresholds; each row becomes a probability level at each horizon.
  // We return a matrix where each cell is the probability (0..1) clamped.
  return bands.map((band) =>
    horizonsSeconds.map((t) => {
      const p = probCrackedBySeconds({ entropyBits, guessesPerSecond, seconds: t })
      return Math.max(0, Math.min(1, p * band))
    }),
  )
}
