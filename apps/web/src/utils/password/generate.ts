function randInt(maxExclusive: number) {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0] % maxExclusive
}

function pick(set: string) {
  return set[randInt(set.length)]
}

export function generateStrongPassword(length = 16) {
  const lower = 'abcdefghjkmnpqrstuvwxyz'
  const upper = 'ABCDEFGHJKMNPQRSTUVWXYZ'
  const digits = '23456789'
  const symbols = '!@#$%^&*-_=+?'
  const all = `${lower}${upper}${digits}${symbols}`

  const targetLen = Math.max(14, Math.min(24, length))

  // Ensure category coverage.
  const chars = [pick(lower), pick(upper), pick(digits), pick(symbols)]
  while (chars.length < targetLen) chars.push(pick(all))

  // Fisher–Yates shuffle.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randInt(i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }

  return chars.join('')
}
