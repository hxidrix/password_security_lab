import { probCrackedBySeconds } from './cracking'

export type RiskTier = 'low' | 'medium' | 'high'

export type RiskReport = {
  score: number // 0..100
  tier: RiskTier
  online: { p1h: number; p1d: number; p1w: number }
  offline: { p1h: number; p1d: number; p1w: number }
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

function clamp100(n: number) {
  return Math.max(0, Math.min(100, n))
}

export function riskTierFromScore(score: number): RiskTier {
  if (score >= 70) return 'high'
  if (score >= 35) return 'medium'
  return 'low'
}

export function computeRisk(opts: {
  entropyBits: number
  onlineGuessesPerSecond?: number
  offlineGuessesPerSecond?: number
  patternMultiplier?: number
}): RiskReport {
  const onlineG = opts.onlineGuessesPerSecond ?? 100
  const offlineG = opts.offlineGuessesPerSecond ?? 1_000_000_000
  const mult = Math.max(0.25, Math.min(4, opts.patternMultiplier ?? 1))

  const seconds1h = 60 * 60
  const seconds1d = 24 * 60 * 60
  const seconds1w = 7 * 24 * 60 * 60

  const online = {
    p1h: clamp01(probCrackedBySeconds({ entropyBits: opts.entropyBits, guessesPerSecond: onlineG * mult, seconds: seconds1h })),
    p1d: clamp01(probCrackedBySeconds({ entropyBits: opts.entropyBits, guessesPerSecond: onlineG * mult, seconds: seconds1d })),
    p1w: clamp01(probCrackedBySeconds({ entropyBits: opts.entropyBits, guessesPerSecond: onlineG * mult, seconds: seconds1w })),
  }

  const offline = {
    p1h: clamp01(probCrackedBySeconds({ entropyBits: opts.entropyBits, guessesPerSecond: offlineG * mult, seconds: seconds1h })),
    p1d: clamp01(probCrackedBySeconds({ entropyBits: opts.entropyBits, guessesPerSecond: offlineG * mult, seconds: seconds1d })),
    p1w: clamp01(probCrackedBySeconds({ entropyBits: opts.entropyBits, guessesPerSecond: offlineG * mult, seconds: seconds1w })),
  }

  // Score emphasizes faster/offline threat but includes online.
  const worst = Math.max(online.p1d * 0.55 + online.p1w * 0.45, offline.p1h * 0.6 + offline.p1d * 0.4)
  const score = clamp100(Math.round(worst * 100))

  return { score, tier: riskTierFromScore(score), online, offline }
}
