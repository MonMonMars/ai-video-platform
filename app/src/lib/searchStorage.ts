const RECENT_KEY = 'everything-ai.search.recent.v1'
const MAX_RECENT = 8

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function loadRecentSearches(): string[] {
  return readJson<string[]>(RECENT_KEY, [])
}

export function pushRecentSearch(query: string): string[] {
  const trimmed = query.trim()
  if (!trimmed) return loadRecentSearches()
  const deduped = [trimmed, ...loadRecentSearches().filter((item) => item !== trimmed)].slice(
    0,
    MAX_RECENT,
  )
  localStorage.setItem(RECENT_KEY, JSON.stringify(deduped))
  return deduped
}

export function clearRecentSearches(): void {
  localStorage.removeItem(RECENT_KEY)
}
