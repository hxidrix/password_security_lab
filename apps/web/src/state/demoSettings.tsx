import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'

type DemoSettingsValue = {
  // Reserved for future settings
}

const DemoSettingsContext = createContext<DemoSettingsValue | null>(null)

export function DemoSettingsProvider({ children }: { children: ReactNode }) {
  const value = useMemo(
    () => ({}),
    [],
  )

  return (
    <DemoSettingsContext.Provider value={value}>
      {children}
    </DemoSettingsContext.Provider>
  )
}

export function useDemoSettings() {
  const ctx = useContext(DemoSettingsContext)
  if (!ctx) throw new Error('useDemoSettings must be used within <DemoSettingsProvider>')
  return ctx
}
