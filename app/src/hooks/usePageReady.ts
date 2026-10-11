import { useEffect, useState } from 'react'
import { useHydrated } from './useHydrated'

/** Brief loading gate so skeleton states render on first paint (demo catalog hydrate). */
export function usePageReady(delayMs = 280): boolean {
  const hydrated = useHydrated()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!hydrated) return
    const id = window.setTimeout(() => setReady(true), delayMs)
    return () => window.clearTimeout(id)
  }, [hydrated, delayMs])

  return ready
}
