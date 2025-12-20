import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type PasswordContextValue = {
  password: string
  setPassword: (next: string) => void
}

const PasswordContext = createContext<PasswordContextValue | null>(null)

export function PasswordProvider({ children }: { children: ReactNode }) {
  const [password, setPassword] = useState('')

  const value = useMemo(() => ({ password, setPassword }), [password])

  return <PasswordContext.Provider value={value}>{children}</PasswordContext.Provider>
}

export function usePassword() {
  const ctx = useContext(PasswordContext)
  if (!ctx) throw new Error('usePassword must be used within <PasswordProvider>')
  return ctx
}
