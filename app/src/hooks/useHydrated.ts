import { useEffect, useState } from 'react'

/** True after mount — safe to read localStorage without SSR mismatch. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHydrated(true)
  }, [])
  return hydrated
}
