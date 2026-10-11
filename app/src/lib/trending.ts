import { catalog } from '../data/catalog'
import type { Genre, TrendingWindow, VideoTitle } from '../types/catalog'

export function sortTrending(
  window: TrendingWindow,
  genre: Genre | 'all',
): VideoTitle[] {
  const scoreKey = window === 'daily' ? 'trendingScoreDaily' : 'trendingScoreWeekly'
  return [...catalog]
    .filter((title) => genre === 'all' || title.genre === genre)
    .sort((a, b) => b[scoreKey] - a[scoreKey])
}
