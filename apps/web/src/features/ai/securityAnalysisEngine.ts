import { analyzePassword } from '../../utils/password/analysis'

export type SecurityAnalysis = {
  executiveSummary: string
  technicalFindings: string[]
  attackFeasibility: string[]
  riskClassification: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW'
  confidenceScore: number // 0-100
  recommendations: string[]
  estimatedCrackTime: {
    online: string
    laptop: string
    gpu: string
  }
  metadata: {
    baselineEntropyBits: number
    effectiveEntropyBits: number
    length: number
    charsetSize: number
    patterns: string[]
    detailedWeaknesses: string[]
  }
}

function fmtBits(n: number) {
  return `${Math.round(n * 10) / 10} bits`
}

function estimateCrackTime(entropyBits: number, guessesPerSecond: number): string {
  if (entropyBits <= 0 || guessesPerSecond <= 0) return '< 1 second'
  const avgGuesses = Math.pow(2, entropyBits) / 2
  const seconds = avgGuesses / guessesPerSecond
  
  if (seconds < 1) return '< 1 second'
  if (seconds < 60) {
    const secs = Math.round(seconds)
    return `${secs} second${secs === 1 ? '' : 's'}`
  }
  if (seconds < 3600) {
    const mins = Math.round(seconds / 60)
    return `${mins} minute${mins === 1 ? '' : 's'}`
  }
  if (seconds < 86400) {
    const hrs = Math.round(seconds / 3600)
    return `${hrs} hour${hrs === 1 ? '' : 's'}`
  }
  if (seconds < 86400 * 365.25) {
    const days = Math.round(seconds / 86400)
    return `${days} day${days === 1 ? '' : 's'}`
  }
  const years = seconds / (86400 * 365.25)
  if (years < 1000) {
    const roundedYears = Math.round(years)
    return `${roundedYears} year${roundedYears === 1 ? '' : 's'}`
  }
  if (years < 1000000) {
    const thousands = Math.round(years / 1000)
    return `${thousands}K years`
  }
  if (years < 1000000000) {
    const millions = Math.round(years / 1000000)
    return `${millions}M years`
  }
  return '> 1 billion years'
}

export function runSecurityAnalysis(password: string): SecurityAnalysis {
  const p = analyzePassword(password)

  const baselineBits = p.entropyBits
  const effectiveBits = p.effectiveEntropyBits
  const length = p.length
  const charset = p.charsetSize
  const patterns = p.patterns
  const score = p.score
  const metrics = p.detailedMetrics

  // Enhanced risk classification with CRITICAL tier
  let risk: SecurityAnalysis['riskClassification']
  let confidence = 85
  
  if (patterns.includes('Top 20 common password')) {
    risk = 'CRITICAL'
    confidence = 95
  } else if (effectiveBits < 25) {
    risk = 'CRITICAL'
    confidence = 90
  } else if (effectiveBits < 40) {
    risk = 'HIGH'
    confidence = 85
  } else if (effectiveBits < 60) {
    risk = 'MODERATE'
    confidence = 80
  } else if (score >= 75) {
    risk = 'LOW'
    confidence = 88
  } else {
    risk = 'MODERATE'
    confidence = 78
  }

  // Escalate risk if multiple high-impact patterns
  const impactfulPatterns = patterns.filter(p => 
    p.includes('Dictionary') || p.includes('Keyboard') || p.includes('Sequential')
  ).length
  if (impactfulPatterns >= 2) {
    if (risk === 'MODERATE') risk = 'HIGH'
    if (risk === 'LOW') risk = 'MODERATE'
  }

  // Estimate crack times
  const onlineTime = estimateCrackTime(effectiveBits, 100) // Rate-limited
  const laptopTime = estimateCrackTime(effectiveBits, 1_000_000)
  const gpuTime = estimateCrackTime(effectiveBits, 1_000_000_000)

  // Executive summary with professional tone
  const exec = (() => {
    if (risk === 'CRITICAL') {
      return `CRITICAL RISK: This password is highly vulnerable. It will be cracked in seconds to minutes using GPU-accelerated attacks. Immediate replacement is necessary.`
    }
    if (risk === 'HIGH') {
      return `HIGH RISK: This password exhibits significant weaknesses. With effective entropy of ${fmtBits(effectiveBits)}, offline attacks could succeed within hours to days on modern hardware.`
    }
    if (risk === 'MODERATE') {
      return `MODERATE RISK: This password provides some protection (${fmtBits(effectiveBits)} effective entropy) but contains patterns that weaken its resistance to targeted attacks.`
    }
    return `LOW RISK: This password demonstrates strong entropy (${fmtBits(effectiveBits)}) and character diversity, suitable for high-value accounts. Consider using it with multi-factor authentication.`
  })()

  // Detailed technical findings
  const findings: string[] = []
  findings.push(`Password Length: ${length} character${length === 1 ? '' : 's'} (minimum recommended: 12, optimal: 16+)`)
  findings.push(`Character Classes: ${[p.hasLower ? 'lowercase' : null, p.hasUpper ? 'UPPERCASE' : null, p.hasDigit ? 'digits' : null, p.hasSymbol ? 'symbols' : null].filter(Boolean).join(', ') || 'insufficient variety'}`)
  findings.push(`Baseline Entropy: ${fmtBits(baselineBits)} (theoretical maximum against brute-force)`)
  findings.push(`Effective Entropy: ${fmtBits(effectiveBits)} (practical estimate after pattern penalties)`)
  findings.push(`Character Set Size: ~${charset} possible values per position`)
  findings.push(`Unique Characters: ${metrics.uniqueCharRatio * 100}% ratio of unique-to-total chars`)
  
  if (metrics.consecutiveCharLength >= 3) {
    findings.push(`⚠️ Longest repeated sequence: ${metrics.consecutiveCharLength}+ identical characters (reduces entropy)`)
  }
  if (metrics.dictionaryWordCount > 0) {
    findings.push(`⚠️ Dictionary words detected: ${metrics.dictionaryWordCount} word(s) found in common-word list`)
  }
  if (patterns.length > 0) {
    findings.push(`Identified Patterns: ${patterns.join(' • ')}`)
  }
  
  if (p.warnings.length) {
    findings.push('Warnings:')
    p.warnings.forEach(w => findings.push(`  • ${w}`))
  }

  // Detailed attack feasibility analysis
  const attacks: string[] = []
  
  // Online attack scenarios
  attacks.push(`Online (Rate-Limited): Estimated ${onlineTime} to crack with 100 guesses/sec (typical auth rate limit)`)
  if (effectiveBits < 30) {
    attacks.push('  → Vulnerable to brute-force if rate limiting is weak or disabled')
  } else if (effectiveBits < 50) {
    attacks.push('  → Risk increases if rate limits are not enforced or have high thresholds')
  } else {
    attacks.push('  → Well-protected against online attacks with standard rate limiting')
  }
  
  // Offline attack scenarios  
  attacks.push(`Offline (Laptop): Estimated ${laptopTime} to crack with 1M guesses/sec (single machine)`)
  attacks.push(`Offline (GPU Farm): Estimated ${gpuTime} to crack with 1B guesses/sec (optimized hardware)`)
  
  if (effectiveBits < 25) {
    attacks.push('  → CRITICAL: Even with bcrypt/Argon2, this would be cracked on modern GPU farms')
  } else if (effectiveBits < 40) {
    attacks.push('  → Risk: Vulnerable if hash function is weak; bcrypt/Argon2 required to mitigate')
  } else if (effectiveBits < 60) {
    attacks.push('  → With bcrypt/Argon2 (cost 12+): Practically resistant to offline attacks')
  } else {
    attacks.push('  → Excellent protection even against state-level adversaries with GPU farms')
  }
  
  // Dictionary attack risk
  if (patterns.includes('Dictionary words') || patterns.includes('Keyboard pattern') || patterns.includes('Top 20 common password')) {
    attacks.push('Dictionary/Hybrid Attacks: HIGH RISK — Attackers will try common word lists and pattern variations first')
    attacks.push('  → Pre-computed rainbow tables may contain variants of this password')
  } else {
    attacks.push('Dictionary/Hybrid Attacks: LOW RISK — No common words or patterns detected')
    attacks.push('  → Random character sequences resist dictionary attacks regardless of entropy')
  }

  // Contextual recommendations
  const recs: string[] = []
  
  if (risk === 'CRITICAL') {
    recs.push('🚨 URGENT: Do not use this password. Generate a new one immediately using a password manager.')
    recs.push(`Replace with a randomly generated ${16 + Math.ceil(Math.random() * 8)}-character password containing mixed character classes.`)
  } else if (risk === 'HIGH') {
    recs.push(`Increase length to 16+ characters and add variety to reach 60+ bits of effective entropy.`)
    recs.push(`Remove all dictionary words and common patterns. Use random sequences or passphrases.`)
  } else if (risk === 'MODERATE') {
    recs.push(`Consider increasing length to 16+ characters or changing it if it contains dictionary words.`)
    recs.push(`While usable, stronger alternatives exist through password generation.`)
  } else {
    recs.push(`This password is strong. Maintain high security by:`)
    recs.push(`  1. Using a password manager to avoid memorizing or reusing it`)
    recs.push(`  2. Storing it securely encrypted`)
  }
  
  // General best practices
  recs.push('IMPLEMENTATION:')
  recs.push('  • Use bcrypt (cost ≥ 12) or Argon2id (memory ≥ 64MB) for hashing')
  recs.push('  • Apply unique per-account salts (bcrypt does this automatically)')
  recs.push('  • Never log or transmit passwords in plain text')
  recs.push('DEPLOYMENT:')
  recs.push('  • Implement rate limiting on authentication endpoints (e.g., 5 attempts per minute)')
  recs.push('  • Enable account lockout after 10 failed attempts within 1 hour')
  recs.push('  • Require multi-factor authentication (2FA/TOTP) for sensitive accounts')
  recs.push('USER PRACTICES:')
  recs.push('  • Use unique passwords per service (password manager recommended)')
  recs.push('  • Monitor for breaches at haveibeenpwned.com')
  recs.push('  • Enable 2FA whenever available, especially on accounts with sensitive data')

  return {
    executiveSummary: exec,
    technicalFindings: findings,
    attackFeasibility: attacks,
    riskClassification: risk,
    confidenceScore: confidence,
    recommendations: recs,
    estimatedCrackTime: { online: onlineTime, laptop: laptopTime, gpu: gpuTime },
    metadata: {
      baselineEntropyBits: baselineBits,
      effectiveEntropyBits: effectiveBits,
      length,
      charsetSize: charset,
      patterns,
      detailedWeaknesses: p.warnings,
    },
  }
}

export const TRANSPARENCY_LABEL =
  'Analysis uses deterministic security heuristics, entropy calculations and simulated brute-force models. Results represent reasonable estimates but are not foolproof.'
