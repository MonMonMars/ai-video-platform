import { catalog, GENRE_LABELS } from '../data/catalog'
import type { VideoTitle } from '../types/catalog'

export function searchCatalog(query: string): VideoTitle[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return catalog.filter((title) => {
    const genreLabel = GENRE_LABELS[title.genre].toLowerCase()
    return (
      title.name.toLowerCase().includes(q) ||
      title.creator.toLowerCase().includes(q) ||
      title.logline.toLowerCase().includes(q) ||
      genreLabel.includes(q) ||
      title.genre.includes(q)
    )
  })
}
