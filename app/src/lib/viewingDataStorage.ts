/** Matches library PR storage so clears stay compatible across branches. */
const LIBRARY_KEY = 'everything-ai.library.v1'
const WATCH_HISTORY_KEY = 'everything-ai.watchHistory.v1'

export interface WatchHistoryEntry {
  id: string
  watchedAt: string
}

interface LibrarySnapshot {
  watchLaterIds?: string[]
  likedIds?: string[]
  continueWatching?: Array<{ id: string; progressPercent: number; updatedAt: string }>
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

export function loadWatchHistory(): WatchHistoryEntry[] {
  return readJson<WatchHistoryEntry[]>(WATCH_HISTORY_KEY, [])
}

export function recordWatchHistory(titleId: string): void {
  const history = loadWatchHistory().filter((entry) => entry.id !== titleId)
  const next: WatchHistoryEntry[] = [
    { id: titleId, watchedAt: new Date().toISOString() },
    ...history,
  ].slice(0, 50)
  localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(next))

  const library = readJson<LibrarySnapshot | null>(LIBRARY_KEY, null)
  if (!library) return

  const continueWatching = library.continueWatching ?? []
  const without = continueWatching.filter((entry) => entry.id !== titleId)
  const nextLibrary: LibrarySnapshot = {
    ...library,
    continueWatching: [
      { id: titleId, progressPercent: 8, updatedAt: new Date().toISOString() },
      ...without,
    ].slice(0, 24),
  }
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(nextLibrary))
}

export function clearWatchHistory(): void {
  localStorage.removeItem(WATCH_HISTORY_KEY)

  const library = readJson<LibrarySnapshot | null>(LIBRARY_KEY, null)
  if (!library) return

  localStorage.setItem(
    LIBRARY_KEY,
    JSON.stringify({
      ...library,
      continueWatching: [],
    }),
  )
}

export function clearSavedLibrary(): void {
  const library = readJson<LibrarySnapshot | null>(LIBRARY_KEY, null)
  if (library) {
    localStorage.setItem(
      LIBRARY_KEY,
      JSON.stringify({
        ...library,
        watchLaterIds: [],
        likedIds: [],
      }),
    )
  }
}

export function getWatchHistoryCount(): number {
  const historyCount = loadWatchHistory().length
  const library = readJson<LibrarySnapshot | null>(LIBRARY_KEY, null)
  const continueCount = library?.continueWatching?.length ?? 0
  return Math.max(historyCount, continueCount)
}

export function getSavedLibraryCount(): number {
  const library = readJson<LibrarySnapshot | null>(LIBRARY_KEY, null)
  if (!library) return 0
  return (library.watchLaterIds?.length ?? 0) + (library.likedIds?.length ?? 0)
}
