import { useEffect, useState } from 'react'

export default function useDebouncedValue<T>(value: T, delay = 250) {
  const [state, setState] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setState(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return state
}
