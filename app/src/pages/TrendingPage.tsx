import { useMemo, useState } from 'react'
import type { Genre, TrendingWindow } from '../types/catalog'
import { GENRE_LABELS } from '../data/catalog'
import { sortTrending } from '../lib/trending'
import { EmptyState } from '../components/EmptyState'
import { PosterCard } from '../components/PosterCard'
import { TrendingSkeleton } from '../components/TrendingSkeleton'
import { usePageReady } from '../hooks/usePageReady'
import styles from './TrendingPage.module.css'

const genres: Array<Genre | 'all'> = [
  'all',
  'sci-fi',
  'romance',
  'action',
  'documentary',
  'anime',
  'thriller',
]

function genreLabel(genre: Genre | 'all'): string {
  if (genre === 'all') return 'All genres'
  return GENRE_LABELS[genre]
}

export function TrendingPage() {
  const ready = usePageReady()
  const [window, setWindow] = useState<TrendingWindow>('daily')
  const [genre, setGenre] = useState<Genre | 'all'>('all')

  const titles = useMemo(() => sortTrending(window, genre), [window, genre])

  if (!ready) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1>Trending</h1>
        </header>
        <TrendingSkeleton />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Trending</h1>
        <p>Daily and weekly charts with genre filters for discovery.</p>
      </header>

      <div className={styles.windowToggle} role="tablist" aria-label="Trending window">
        {(['daily', 'weekly'] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={window === value}
            className={window === value ? styles.tabActive : styles.tab}
            onClick={() => setWindow(value)}
          >
            {value === 'daily' ? 'Daily' : 'Weekly'}
          </button>
        ))}
      </div>

      <div className={styles.genres} aria-label="Genre filters">
        {genres.map((value) => (
          <button
            key={value}
            type="button"
            className={genre === value ? styles.chipActive : styles.chip}
            onClick={() => setGenre(value)}
          >
            {genreLabel(value)}
          </button>
        ))}
      </div>

      {titles.length === 0 ? (
        <EmptyState
          title="No titles in this chart"
          description="Try another genre or switch between daily and weekly windows."
          icon={<span aria-hidden>▲</span>}
        />
      ) : (
        <div className={styles.grid}>
          {titles.map((title, index) => (
            <PosterCard key={title.id} title={title} rank={index + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
