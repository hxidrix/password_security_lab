import { COMMON_PASSWORDS, COMMON_WORDS } from './common'

export type PasswordStrengthLabel = 'Very weak' | 'Weak' | 'Fair' | 'Strong' | 'Very strong'

export type PasswordAnalysis = {
  password: string
  length: number
  hasLower: boolean
  hasUpper: boolean
  hasDigit: boolean
  hasSymbol: boolean
  charsetSize: number
  entropyBits: number
  effectiveEntropyBits: number
  score: number // 0..100
  label: PasswordStrengthLabel
  patterns: string[]
  warnings: string[]
  suggestions: string[]
  detailedMetrics: {
    uniqueCharRatio: number
    lowerCaseCount: number
    upperCaseCount: number
    digitCount: number
    symbolCount: number
    consecutiveCharLength: number
    dictionaryWordCount: number
  }
}

const CHARSET_SIZES = {
  lower: 26,
  upper: 26,
  digit: 10,
  // Accurate estimate of commonly typeable ASCII punctuation/symbols.
  symbol: 33,
}

// Extended common patterns that weaken passwords
const COMMON_YEAR_PATTERNS = /19\d{2}|20\d{2}|202[0-9]/
const KEYBOARD_PATTERNS = [
  'qwerty', 'asdfgh', 'zxcvbn', 'qazwsx', 'qweasd',
  '123456', '654321', '111111', '222222', '333333', '444444', '555555', '666666', '777777', '888888', '999999'
]
const COMMON_SUBSTITUTIONS = ['a0', '@0', 'a@', '1!', 'l1', 'o0', 's5', 'e3', 'b8', 'g9', 't7']

function log2(n: number) {
  return Math.log(n) / Math.log(2)
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function computeCharsetSize(pw: string) {
  const hasLower = /[a-z]/.test(pw)
  const hasUpper = /[A-Z]/.test(pw)
  const hasDigit = /\d/.test(pw)
  const hasSymbol = /[^A-Za-z0-9]/.test(pw)

  const size =
    (hasLower ? CHARSET_SIZES.lower : 0) +
    (hasUpper ? CHARSET_SIZES.upper : 0) +
    (hasDigit ? CHARSET_SIZES.digit : 0) +
    (hasSymbol ? CHARSET_SIZES.symbol : 0)

  return { hasLower, hasUpper, hasDigit, hasSymbol, size }
}

function isCommonPassword(pwLower: string) {
  return COMMON_PASSWORDS.includes(pwLower as (typeof COMMON_PASSWORDS)[number])
}



function getConsecutiveCharLength(pw: string): number {
  let maxConsecutive = 1
  let currentConsecutive = 1
  for (let i = 1; i < pw.length; i++) {
    if (pw[i] === pw[i - 1]) {
      currentConsecutive++
      maxConsecutive = Math.max(maxConsecutive, currentConsecutive)
    } else {
      currentConsecutive = 1
    }
  }
  return maxConsecutive
}

function hasRepeatedChars(pw: string) {
  // More sensitive: detects 3+ identical characters
  return /(.)\1{2,}/.test(pw)
}

function hasSequentialRun(pwLower: string) {
  const runs: string[] = [
    '0123456789',
    'abcdefghijklmnopqrstuvwxyz',
  ]

  for (const base of runs) {
    for (let i = 0; i <= base.length - 4; i++) {
      const forward = base.slice(i, i + 4)
      const backward = forward.split('').reverse().join('')
      if (pwLower.includes(forward) || pwLower.includes(backward)) return true
    }
  }

  return false
}

function hasKeyboardPattern(pwLower: string): boolean {
  return KEYBOARD_PATTERNS.some((k) => pwLower.includes(k))
}

function hasYearPattern(pw: string): boolean {
  return COMMON_YEAR_PATTERNS.test(pw)
}

function hasLeetSubstitution(pwLower: string): boolean {
  // Detect simple leetspeak substitutions that reduce entropy
  return COMMON_SUBSTITUTIONS.some((sub) => pwLower.includes(sub))
}

function strengthLabel(score: number): PasswordStrengthLabel {
  if (score >= 80) return 'Very strong'
  if (score >= 60) return 'Strong'
  if (score >= 40) return 'Fair'
  if (score >= 20) return 'Weak'
  return 'Very weak'
}

export function analyzePassword(password: string): PasswordAnalysis {
  const pw = password ?? ''
  const pwLower = pw.toLowerCase()
  const length = pw.length

  const { hasLower, hasUpper, hasDigit, hasSymbol, size: charsetSize } =
    computeCharsetSize(pw)

  // Count character types for detailed metrics
  const lowerCount = (pw.match(/[a-z]/g) || []).length
  const upperCount = (pw.match(/[A-Z]/g) || []).length
  const digitCount = (pw.match(/\d/g) || []).length
  const symbolCount = (pw.match(/[^A-Za-z0-9]/g) || []).length

  // Baseline brute-force entropy estimate: length * log2(searchSpace)
  const baselineBits = length > 0 && charsetSize > 0 ? length * log2(charsetSize) : 0

  // Detailed pattern detection
  const patterns: string[] = []
  const warnings: string[] = []
  let totalEntropyPenalty = 0

  // Check for common password
  const commonPw = length > 0 && isCommonPassword(pwLower)
  if (commonPw) {
    patterns.push('Top 20 common password')
    warnings.push('This password ranks in the top 20 most-breached passwords worldwide. It will be cracked in seconds.')
    totalEntropyPenalty += 50 // Massive penalty
  }

  // Check for dictionary words
  const dictWordCount = (pw.toLowerCase().match(new RegExp(COMMON_WORDS.join('|'), 'g')) || []).length
  const dictionary = length > 0 && dictWordCount > 0
  if (dictionary) {
    patterns.push(`Dictionary words (${dictWordCount})`)
    warnings.push(`Contains ${dictWordCount} common word(s). Dictionary attacks will succeed quickly.`)
    // Aggressive penalty: each word reduces entropy by ~20-30 bits
    // For "december" alone, that's a major reduction from 50+ bits
    totalEntropyPenalty += 30 * Math.min(dictWordCount, 4)
  }

  // Check for sequential patterns
  const sequential = hasSequentialRun(pwLower)
  if (sequential) {
    patterns.push('Sequential pattern')
    warnings.push('Sequential digits or letters (like 1234, abcd, qwerty) are predictable and easy to guess.')
    totalEntropyPenalty += 12
  }

  // Check for keyboard patterns
  const keyboard = hasKeyboardPattern(pwLower)
  if (keyboard) {
    patterns.push('Keyboard pattern')
    warnings.push('Common keyboard patterns (qwerty, asdf) are in most attack dictionaries.')
    totalEntropyPenalty += 10
  }

  // Check for year patterns
  const yearPattern = hasYearPattern(pw)
  if (yearPattern) {
    patterns.push('Year pattern')
    warnings.push('Birth years or common dates (1990-2025) are frequently guessed.')
    totalEntropyPenalty += 8
  }

  // Check for repeated characters
  const consecutive = getConsecutiveCharLength(pw)
  const repeated = hasRepeatedChars(pw)
  if (repeated) {
    patterns.push(`Repeated characters (${consecutive}+ in a row)`)
    warnings.push(`Long runs of identical characters (${pw[0]?.repeat(consecutive)}) reduce effective complexity.`)
    // More aggressive penalty for repeated sequences (e.g., 1122, aaaa, etc.)
    totalEntropyPenalty += 12 + (consecutive - 2) * 4
  }

  // Check for leet substitutions
  const leet = hasLeetSubstitution(pwLower)
  if (leet) {
    patterns.push('Simple leet substitution')
    warnings.push('Basic substitutions like a→@ or 1→l are in all modern crack dictionaries.')
    totalEntropyPenalty += 6
  }

  // Unique character ratio penalty
  const uniqueChars = new Set(pw).size
  const uniqueRatio = length === 0 ? 1 : uniqueChars / length
  const repetitionPenalty = uniqueRatio < 0.5 ? (0.5 - uniqueRatio) * 30 : 
                            uniqueRatio < 0.7 ? (0.7 - uniqueRatio) * 15 : 0

  // Calculate effective entropy
  const effectiveEntropyBits = Math.max(0, baselineBits - totalEntropyPenalty - repetitionPenalty)

  const categoriesUsed = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length

  // Improved scoring algorithm
  // Heavily weight entropy, but also consider length and variety
  const entropyScore = clamp((effectiveEntropyBits / 100) * 75, 0, 75)
  
  // Length bonus: more generous for very long passwords
  const lengthScore = Math.min(15, (length / 12) * 12 + Math.max(0, (length - 20) * 0.5))
  
  // Variety bonus
  const varietyBonus = (categoriesUsed / 4) * 10

  let score = entropyScore + lengthScore + varietyBonus

  // Apply direct penalties for major weaknesses
  if (commonPw) score -= 45
  if (dictionary && dictWordCount > 2) score -= 20
  if (sequential) score -= 8
  if (repeated && consecutive >= 5) score -= 10

  score = clamp(Math.round(score), 0, 100)

  // Smart, contextual suggestions
  const suggestions: string[] = []
  
  if (length === 0) {
    suggestions.push('Enter a password to analyze.')
  } else if (commonPw) {
    suggestions.push('⚠️ CRITICAL: Replace immediately with a unique, random password.')
    suggestions.push('This password has been compromised in major breaches.')
  } else {
    if (length < 8) suggestions.push('Increase to minimum 8 characters (12+ is better).')
    if (length < 12) suggestions.push('Aim for 12–16+ characters for better security.')
    if (!hasLower && (hasUpper || hasDigit || hasSymbol)) suggestions.push('Add lowercase letters.')
    if (!hasUpper && (hasLower || hasDigit || hasSymbol)) suggestions.push('Add uppercase letters.')
    if (!hasDigit) suggestions.push('Add at least one digit.')
    if (!hasSymbol) suggestions.push('Add special characters (!@#$%^&*-_=+).')
    if (dictionary) suggestions.push('Avoid dictionary words. Use random character sequences or long passphrases.')
    if (sequential) suggestions.push('Remove predictable sequences (1234, abcd, qwerty).')
    if (repeated && consecutive >= 4) suggestions.push(`Avoid character runs. Replace '${pw[0]?.repeat(consecutive)}' with variety.`)
    if (keyboard) suggestions.push('Avoid keyboard patterns like "qwerty" or "asdf".')
    if (yearPattern) suggestions.push('Avoid years or birth dates. Use random numbers instead.')
    if (leet) suggestions.push('Leet substitutions are easily defeated. Use actual special characters instead.')
  }

  return {
    password: pw,
    length,
    hasLower,
    hasUpper,
    hasDigit,
    hasSymbol,
    charsetSize,
    entropyBits: Math.round(baselineBits * 10) / 10,
    effectiveEntropyBits: Math.round(effectiveEntropyBits * 10) / 10,
    score,
    label: strengthLabel(score),
    patterns,
    warnings,
    suggestions,
    detailedMetrics: {
      uniqueCharRatio: Math.round(uniqueRatio * 100) / 100,
      lowerCaseCount: lowerCount,
      upperCaseCount: upperCount,
      digitCount: digitCount,
      symbolCount: symbolCount,
      consecutiveCharLength: consecutive,
      dictionaryWordCount: dictWordCount,
    },
  }
}
