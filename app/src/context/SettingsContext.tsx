import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  loadSettings,
  resolveTheme,
  saveSettings,
  type AppSettings,
  type ThemePreference,
} from '../lib/settingsStorage'

interface SettingsContextValue {
  settings: AppSettings
  resolvedTheme: 'dark' | 'light'
  kidMode: boolean
  setTheme: (theme: ThemePreference) => void
  setAutoplay: (autoplay: boolean) => void
  setKidMode: (kidMode: boolean) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

function applyTheme(resolved: 'dark' | 'light'): void {
  document.documentElement.dataset.theme = resolved
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings())
  const resolvedTheme = useMemo(() => resolveTheme(settings.theme), [settings.theme])

  useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => {
    if (settings.theme !== 'system') return

    const media = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => applyTheme(resolveTheme('system'))
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [settings.theme])

  const persist = useCallback((updater: (prev: AppSettings) => AppSettings) => {
    setSettings((prev) => {
      const next = updater(prev)
      saveSettings(next)
      return next
    })
  }, [])

  const setTheme = useCallback(
    (theme: ThemePreference) => {
      persist((prev) => ({ ...prev, theme }))
    },
    [persist],
  )

  const setAutoplay = useCallback(
    (autoplay: boolean) => {
      persist((prev) => ({ ...prev, autoplay }))
    },
    [persist],
  )

  const setKidMode = useCallback(
    (kidMode: boolean) => {
      persist((prev) => ({ ...prev, kidMode }))
    },
    [persist],
  )

  const value = useMemo(
    () => ({
      settings,
      resolvedTheme,
      kidMode: settings.kidMode,
      setTheme,
      setAutoplay,
      setKidMode,
    }),
    [settings, resolvedTheme, setTheme, setAutoplay, setKidMode],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return ctx
}
