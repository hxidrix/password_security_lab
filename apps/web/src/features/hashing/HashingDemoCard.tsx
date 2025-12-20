import { useMemo, useState, useEffect, useRef } from 'react'
import useDebouncedValue from '../../hooks/useDebouncedValue'
import bcrypt from 'bcryptjs'

import { Card } from '../../components/ui/Card'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { usePassword } from '../../state/password'
import { sha256Hex } from '../../utils/crypto/sha256'
import { formatDurationSeconds } from '../../utils/format/duration'

type DemoState = {
  sha256?: string
  bcryptA?: string
  bcryptB?: string
  pbkdf2?: string
  pbkdf2Ms?: number
  bcryptMs?: number
  error?: string
  loading: boolean
}

export function HashingDemoCard({ delay = 0 }: { delay?: number }) {
  const { password } = usePassword()
  const [state, setState] = useState<DemoState>({ loading: false })
  const [stepText, setStepText] = useState<string | null>(null)

  const canRun = useMemo(() => password.trim().length > 0, [password])
  const debouncedPassword = useDebouncedValue(password, 400)
  const lastRunRef = useRef<string | null>(null)

  async function runDemo() {
    if (!canRun) return

    setState({ loading: true })
    setStepText('Computing SHA-256…')
    try {
      const sha = await sha256Hex(password)
      await new Promise((r) => setTimeout(r, 600))

      setStepText('Generating salt A…')
      const saltA = await bcrypt.genSalt(10)
      await new Promise((r) => setTimeout(r, 500))

      setStepText('Generating salt B…')
      const saltB = await bcrypt.genSalt(10)
      await new Promise((r) => setTimeout(r, 500))

      setStepText('Measuring PBKDF2 (100k iterations)…')
      const pbkSalt = crypto.getRandomValues(new Uint8Array(16))
      const pbkStart = performance.now()
      const pbk = await derivePbkdf2(password, pbkSalt, 100_000)
      const pbkMs = Math.max(0, performance.now() - pbkStart)

      setStepText('Hashing with bcrypt (A & B)…')
      const bcryptStart = performance.now()
      const [hashA, hashB] = await Promise.all([
        bcrypt.hash(password, saltA),
        bcrypt.hash(password, saltB),
      ])
      const bcryptMs = Math.max(0, performance.now() - bcryptStart)

      await new Promise((r) => setTimeout(r, 400))
      setState({
        loading: false,
        sha256: sha,
        bcryptA: hashA,
        bcryptB: hashB,
        pbkdf2: pbk,
        pbkdf2Ms: Math.round(pbkMs),
        bcryptMs: Math.round(bcryptMs),
      })
      setStepText(null)

      const argonEstimateSeconds = estimateArgon2Time(pbkMs, { memoryKb: 65536, iterations: 3 })
      setTimeout(() => setStepText(`Estimated Argon2 time: ${formatDurationSeconds(argonEstimateSeconds)}`), 300)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setState({ loading: false, error: msg })
      setStepText(null)
    }
  }

  useEffect(() => {
    if (!debouncedPassword) return
    if (lastRunRef.current === debouncedPassword) return
    lastRunRef.current = debouncedPassword
    runDemo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPassword])

  async function derivePbkdf2(password: string, salt: Uint8Array, iterations = 100000) {
    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey('raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveBits'])
    const params = { name: 'PBKDF2', hash: 'SHA-256', salt, iterations }
    const bits = await crypto.subtle.deriveBits(params as any, key, 256)
    const arr = new Uint8Array(bits)
    return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('')
  }

  function estimateArgon2Time(pbkMs: number, opts: { memoryKb: number; iterations: number }) {
    const base = pbkMs || 100
    const memFactor = Math.log2(Math.max(1024, opts.memoryKb)) / 10
    const iterFactor = opts.iterations / 3
    return (base * memFactor * iterFactor) / 1000
  }

  return (
    <Card delay={delay}>
      <SectionHeader
        title="Hashing & Salting Demo"
        subtitle="SHA-256 is deterministic (no salt); bcrypt includes a random salt."
      />

      <div className="mt-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <div className="text-xs text-[color:var(--muted)]">
              Uses the password from the analyzer card.
            </div>
            <div className="mt-1 truncate text-sm font-medium">
              {password ? `Current password: ${'*'.repeat(Math.min(password.length, 24))}` : 'Enter a password above to run the demo.'}
            </div>
          </div>

          <button
            type="button"
            onClick={runDemo}
            disabled={!canRun || state.loading}
            className={`btn primary ${state.loading ? 'opacity-80 cursor-wait' : ''}`}
          >
            {state.loading ? 'Hashing…' : 'Run demo'}
          </button>
        </div>

        {state.error && (
          <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {state.error}
          </div>
        )}

        <div className="mt-4 grid gap-3">
          <div className="rounded-xl border border-white/10 bg-black/10 p-3">
            <div className="text-xs text-[color:var(--muted)]">SHA-256 (no salt)</div>
            <div className="mt-1 break-all font-mono text-[10px] sm:text-xs text-[color:var(--text)]">{state.sha256 ?? '—'}</div>
            {stepText && <div className="mt-2 text-xs text-[color:var(--muted)]">{stepText}</div>}
            <div className="mt-2 text-xs text-[color:var(--muted)]">Same input → same hash (always).</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/10 p-3">
            <div className="text-xs text-[color:var(--muted)]">bcrypt (salted) — run A</div>
            <div className="mt-1 break-all font-mono text-[10px] sm:text-xs text-[color:var(--text)]">{state.bcryptA ?? '—'}</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/10 p-3">
            <div className="text-xs text-[color:var(--muted)]">bcrypt (salted) — run B</div>
            <div className="mt-1 break-all font-mono text-[10px] sm:text-xs text-[color:var(--text)]">{state.bcryptB ?? '—'}</div>
            <div className="mt-2 text-xs text-[color:var(--muted)]">Same input → different hashes (salt makes each hash unique).</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/10 p-3">
            <div className="text-xs text-[color:var(--muted)]">PBKDF2 (100k iterations)</div>
            <div className="mt-1 break-all font-mono text-[10px] sm:text-xs text-[color:var(--text)]">{state.pbkdf2 ?? '—'}</div>
            <div className="mt-2 text-xs text-[color:var(--muted)]">Time taken: {state.pbkdf2Ms != null ? `${state.pbkdf2Ms} ms` : '—'}</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
