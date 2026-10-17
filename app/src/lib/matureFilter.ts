import { getTitle } from '../data/catalog'
import type { CreatorDrop, VideoTitle } from '../types/catalog'

/** Shared with the Settings draft so a stored Kid Mode toggle can drive this filter. */
const SETTINGS_KEY = 'everything-ai.settings.v1'

/**
 * This branch does not include a Settings page.
 * When `everything-ai.settings.v1` is missing, mature-flagged titles are still
 * omitted from follow feeds, unread counts, and channel lists.
 * When the key exists, its `kidMode` boolean wins.
 */
export function shouldFilterMatureContent(): boolean {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return true
    const parsed = JSON.parse(raw) as { kidMode?: unknown }
    if (typeof parsed.kidMode === 'boolean') return parsed.kidMode
    return true
  } catch {
    return true
  }
}

export function isMatureTitle(title: VideoTitle | undefined): boolean {
  return title?.matureContent === true
}

export function filterMatureTitles(titles: VideoTitle[]): VideoTitle[] {
  if (!shouldFilterMatureContent()) return titles
  return titles.filter((title) => !isMatureTitle(title))
}

export function isMatureDrop(drop: CreatorDrop): boolean {
  return isMatureTitle(getTitle(drop.titleId))
}

export function filterMatureDrops(drops: CreatorDrop[]): CreatorDrop[] {
  if (!shouldFilterMatureContent()) return drops
  return drops.filter((drop) => !isMatureDrop(drop))
}
