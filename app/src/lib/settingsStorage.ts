export type ThemePreference = 'dark' | 'light' | 'system'

export interface DemoAccount {
  displayName: string
  email: string
  avatarInitials: string
}

export interface AppSettings {
  theme: ThemePreference
  autoplay: boolean
  kidMode: boolean
  account: DemoAccount
}

const SETTINGS_KEY = 'everything-ai.settings.v1'

const defaultSettings: AppSettings = {
  theme: 'dark',
  autoplay: true,
  kidMode: false,
  account: {
    displayName: 'Mon Mon',
    email: 'mon.demo@everything.ai',
    avatarInitials: 'MM',
  },
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function loadSettings(): AppSettings {
  const stored = readJson<Partial<AppSettings> | null>(SETTINGS_KEY, null)
  if (!stored) return { ...defaultSettings, account: { ...defaultSettings.account } }
  return {
    theme: stored.theme ?? defaultSettings.theme,
    autoplay: stored.autoplay ?? defaultSettings.autoplay,
    kidMode: stored.kidMode ?? defaultSettings.kidMode,
    account: { ...defaultSettings.account, ...stored.account },
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function resolveTheme(preference: ThemePreference): 'dark' | 'light' {
  if (preference === 'system') {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  }
  return preference
}
