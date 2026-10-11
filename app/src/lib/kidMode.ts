import type { VideoTitle } from '../types/catalog'

export function isMatureTitle(title: VideoTitle): boolean {
  return title.matureContent === true
}

export function filterTitlesForKidMode(titles: VideoTitle[], kidMode: boolean): VideoTitle[] {
  if (!kidMode) return titles
  return titles.filter((title) => !isMatureTitle(title))
}

export function pickKidSafeFeatured(titles: VideoTitle[], kidMode: boolean): VideoTitle | undefined {
  const filtered = filterTitlesForKidMode(titles, kidMode)
  return filtered[0]
}
