import { useEffect, useRef, useState } from 'react'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { COMMON_WORDS, COMMON_PASSWORDS } from '../../utils/password/common'

type SimulationMode = 'passwords' | 'words'

interface SimulationState {
  index: number
  running: boolean
  found: boolean
}

export function DictionaryAttackSimulation({ password }: { password: string }) {
  const [mode, setMode] = useState<SimulationMode>('passwords')
  const [passwordSim, setPasswordSim] = useState<SimulationState>({ index: 0, running: false, found: false })
  const [wordSim, setWordSim] = useState<SimulationState>({ index: 0, running: false, found: false })
  const passwordTimerRef = useRef<number | null>(null)
  const wordTimerRef = useRef<number | null>(null)

  function stopAll() {
    if (passwordTimerRef.current) {
      window.clearInterval(passwordTimerRef.current)
      passwordTimerRef.current = null
    }
    if (wordTimerRef.current) {
      window.clearInterval(wordTimerRef.current)
      wordTimerRef.current = null
    }
  }

  useEffect(() => {
    if (password) startBoth()
    else stopAll()
    return () => stopAll()
  }, [password])

  function startBoth() {
    if (!password) return
    startPasswordSimulation()
    startWordSimulation()
  }

  function startPasswordSimulation() {
    if (!password) return
    setPasswordSim({ index: 0, running: true, found: false })

    if (passwordTimerRef.current) window.clearInterval(passwordTimerRef.current)

    passwordTimerRef.current = window.setInterval(() => {
      setPasswordSim((prev) => {
        const guess = COMMON_PASSWORDS[prev.index]
        if (guess && guess === password.toLowerCase()) {
          if (passwordTimerRef.current) window.clearInterval(passwordTimerRef.current)
          return { ...prev, running: false, found: true }
        }

        const next = prev.index + 1
        if (next >= COMMON_PASSWORDS.length) {
          if (passwordTimerRef.current) window.clearInterval(passwordTimerRef.current)
          return { ...prev, index: COMMON_PASSWORDS.length, running: false }
        }
        return { ...prev, index: next }
      })
    }, 80)
  }

  function startWordSimulation() {
    if (!password) return
    setWordSim({ index: 0, running: true, found: false })

    if (wordTimerRef.current) window.clearInterval(wordTimerRef.current)

    wordTimerRef.current = window.setInterval(() => {
      setWordSim((prev) => {
        const guess = COMMON_WORDS[prev.index]
        if (guess && guess === password.toLowerCase()) {
          if (wordTimerRef.current) window.clearInterval(wordTimerRef.current)
          return { ...prev, running: false, found: true }
        }

        const next = prev.index + 1
        if (next >= COMMON_WORDS.length) {
          if (wordTimerRef.current) window.clearInterval(wordTimerRef.current)
          return { ...prev, index: COMMON_WORDS.length, running: false }
        }
        return { ...prev, index: next }
      })
    }, 80)
  }

  const currentSim = mode === 'passwords' ? passwordSim : wordSim
  const currentList = mode === 'passwords' ? COMMON_PASSWORDS : COMMON_WORDS
  const currentGuess = currentSim.index < currentList.length ? currentList[currentSim.index] : '—'
  const progress = currentSim.index / Math.max(1, currentList.length)

  const isRunning = passwordSim.running || wordSim.running

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Dictionary simulation</div>
          <div className="mt-1 text-xs text-[color:var(--muted)]">Advanced word & password list attack demo.</div>
        </div>
        <button
          type="button"
          onClick={startBoth}
          disabled={!password || isRunning}
          className={`btn primary ${isRunning ? 'opacity-80 cursor-wait' : ''}`}
        >
          {isRunning ? 'Running…' : 'Run simulation'}
        </button>
      </div>

      {/* Mode tabs */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setMode('passwords')}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${
            mode === 'passwords'
              ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30'
              : 'bg-white/5 text-[color:var(--muted)] border border-white/10 hover:bg-white/10'
          }`}
        >
          Common Passwords ({COMMON_PASSWORDS.length.toLocaleString()})
        </button>
        <button
          onClick={() => setMode('words')}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${
            mode === 'words'
              ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30'
              : 'bg-white/5 text-[color:var(--muted)] border border-white/10 hover:bg-white/10'
          }`}
        >
          Dictionary Words ({COMMON_WORDS.length.toLocaleString()})
        </button>
      </div>

      {/* Current mode simulation */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="text-xs font-medium text-[color:var(--muted)] mb-2">
          {mode === 'passwords' ? 'Password Attack' : 'Dictionary Attack'}
        </div>

        <ProgressBar value={password ? progress : 0} />

        <div className="mt-3 text-xs text-[color:var(--muted)]">
          Guess {Math.min(currentSim.index + 1, currentList.length)}/{currentList.length}: <span className="font-mono text-[color:var(--text)]">{currentGuess}</span>
        </div>

        {(!currentSim.running && (currentSim.found || currentSim.index >= currentList.length)) ? (
          <div
            className={currentSim.found ? 'mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs text-emerald-200' : 'mt-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-2 text-xs text-yellow-200'}
          >
            {currentSim.found
              ? `${mode === 'passwords' ? 'Password' : 'Dictionary'} attack succeeded: matched in ${(currentSim.index + 1).toLocaleString()} guesses.`
              : `Not found in the ${mode === 'passwords' ? 'password' : 'dictionary'} list.`}
          </div>
        ) : null}
      </div>

      {/* Summary */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-white/10 bg-white/5 p-2">
          <div className="text-xs text-[color:var(--muted)]">Password Attack</div>
          <div className="mt-1 text-xs font-mono">
            {passwordSim.found ? (
              <span className="text-emerald-200">✓ Found in {(passwordSim.index + 1).toLocaleString()} guesses</span>
            ) : passwordSim.running ? (
              <span className="text-blue-200">Running… {Math.round((passwordSim.index / COMMON_PASSWORDS.length) * 100)}%</span>
            ) : (
              <span className="text-yellow-200">Not found</span>
            )}
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-2">
          <div className="text-xs text-[color:var(--muted)]">Dictionary Attack</div>
          <div className="mt-1 text-xs font-mono">
            {wordSim.found ? (
              <span className="text-emerald-200">✓ Found in {(wordSim.index + 1).toLocaleString()} guesses</span>
            ) : wordSim.running ? (
              <span className="text-blue-200">Running… {Math.round((wordSim.index / COMMON_WORDS.length) * 100)}%</span>
            ) : (
              <span className="text-yellow-200">Not found</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DictionaryAttackSimulation
