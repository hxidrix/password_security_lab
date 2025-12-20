const MIN = 60
const HOUR = 60 * MIN
const DAY = 24 * HOUR
const YEAR = 365.25 * DAY

export function formatDurationSeconds(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '—'

  if (seconds < 1) return `${Math.max(0.001, seconds).toFixed(3)}s`
  if (seconds < MIN) return `${seconds.toFixed(1)}s`
  if (seconds < HOUR) return `${(seconds / MIN).toFixed(1)} min`
  if (seconds < DAY) return `${(seconds / HOUR).toFixed(1)} hr`
  if (seconds < YEAR) return `${(seconds / DAY).toFixed(1)} days`

  // Cap extreme values (still show scale)
  const years = seconds / YEAR
  // Use readable scales instead of scientific notation for very large values
  if (years < 1000) return `${Math.round(years)} year${Math.round(years) === 1 ? '' : 's'}`
  if (years < 1_000_000) return `${Math.round(years / 1000)}K years`
  if (years < 1_000_000_000) return `${Math.round(years / 1_000_000)}M years`
  return '> 1 billion years'
}
