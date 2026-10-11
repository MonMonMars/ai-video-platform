import type { VideoTitle } from '../types/catalog'
import { catalog, getTitle } from '../data/catalog'

const HISTORY_KEY = 'everything-ai.watchHistory.v1'
const SAVED_KEY = 'everything-ai.saved.v1'

export interface WatchProgress {
  titleId: string
  progressPercent: number
  updatedAt: string
}

function readHistory(): WatchProgress[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    return JSON.parse(raw) as WatchProgress[]
  } catch {
    return []
  }
}

function writeHistory(entries: WatchProgress[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 20)))
}

export function recordWatchProgress(titleId: string, progressPercent: number): void {
  const clamped = Math.min(100, Math.max(0, progressPercent))
  const entries = readHistory().filter((e) => e.titleId !== titleId)
  if (clamped >= 98) {
    writeHistory(entries)
    return
  }
  writeHistory([
    { titleId, progressPercent: clamped, updatedAt: new Date().toISOString() },
    ...entries,
  ])
}

export function getContinueWatching(): Array<{ title: VideoTitle; progressPercent: number }> {
  return readHistory()
    .map((entry) => {
      const title = getTitle(entry.titleId)
      if (!title) return null
      return { title, progressPercent: entry.progressPercent }
    })
    .filter((item): item is { title: VideoTitle; progressPercent: number } => item !== null)
}

export function loadSavedIds(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY)
    if (!raw) return []
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

export function saveTitleId(titleId: string): void {
  const ids = loadSavedIds()
  if (ids.includes(titleId)) return
  localStorage.setItem(SAVED_KEY, JSON.stringify([titleId, ...ids].slice(0, 50)))
}

export function removeSavedId(titleId: string): void {
  localStorage.setItem(
    SAVED_KEY,
    JSON.stringify(loadSavedIds().filter((id) => id !== titleId)),
  )
}

export function toggleSaved(titleId: string): boolean {
  const ids = loadSavedIds()
  if (ids.includes(titleId)) {
    removeSavedId(titleId)
    return false
  }
  saveTitleId(titleId)
  return true
}

export function isSaved(titleId: string): boolean {
  return loadSavedIds().includes(titleId)
}

export function getSavedTitles(): VideoTitle[] {
  return loadSavedIds()
    .map((id) => getTitle(id))
    .filter((t): t is VideoTitle => t !== undefined)
}

export function titlesByGenre(genre: VideoTitle['genre']): VideoTitle[] {
  return catalog.filter((t) => t.genre === genre)
}

export const HOME_GENRE_SHELVES: VideoTitle['genre'][] = [
  'sci-fi',
  'romance',
  'action',
  'thriller',
  'anime',
  'documentary',
]
