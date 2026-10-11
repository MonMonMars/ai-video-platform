const LIBRARY_KEY = 'everything-ai.library.v1'

export interface ContinueWatchingEntry {
  id: string
  progressPercent: number
  updatedAt: string
}

export interface LibraryState {
  watchLaterIds: string[]
  likedIds: string[]
  continueWatching: ContinueWatchingEntry[]
}

const defaultState: LibraryState = {
  watchLaterIds: [],
  likedIds: [],
  continueWatching: [],
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

export function loadLibraryState(): LibraryState {
  const stored = readJson<LibraryState | null>(LIBRARY_KEY, null)
  if (!stored) return { ...defaultState }
  return {
    watchLaterIds: stored.watchLaterIds ?? [],
    likedIds: stored.likedIds ?? [],
    continueWatching: stored.continueWatching ?? [],
  }
}

export function saveLibraryState(state: LibraryState): void {
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(state))
}

export function toggleIdList(ids: string[], id: string): string[] {
  if (ids.includes(id)) {
    return ids.filter((item) => item !== id)
  }
  return [id, ...ids]
}

export function toggleWatchLater(state: LibraryState, titleId: string): LibraryState {
  const next = {
    ...state,
    watchLaterIds: toggleIdList(state.watchLaterIds, titleId),
  }
  saveLibraryState(next)
  return next
}

export function toggleLiked(state: LibraryState, titleId: string): LibraryState {
  const next = {
    ...state,
    likedIds: toggleIdList(state.likedIds, titleId),
  }
  saveLibraryState(next)
  return next
}

export function recordContinueWatching(
  state: LibraryState,
  titleId: string,
  progressPercent: number,
): LibraryState {
  const clamped = Math.min(100, Math.max(0, Math.round(progressPercent)))
  const without = state.continueWatching.filter((entry) => entry.id !== titleId)
  const nextEntry: ContinueWatchingEntry = {
    id: titleId,
    progressPercent: clamped,
    updatedAt: new Date().toISOString(),
  }
  const next = {
    ...state,
    continueWatching: [nextEntry, ...without].slice(0, 24),
  }
  saveLibraryState(next)
  return next
}

export function removeContinueWatching(state: LibraryState, titleId: string): LibraryState {
  const next = {
    ...state,
    continueWatching: state.continueWatching.filter((entry) => entry.id !== titleId),
  }
  saveLibraryState(next)
  return next
}
