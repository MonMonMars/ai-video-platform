import type { ReactNode } from 'react'
import type { VideoTitle } from '../types/catalog'
import { PosterCard } from './PosterCard'
import styles from './ContentShelf.module.css'

export interface ShelfItem {
  title: VideoTitle
  rank?: number
  progressPercent?: number
}

interface ContentShelfProps {
  heading: string
  items: ShelfItem[]
  variant?: 'poster' | 'landscape'
  ranked?: boolean
  trailing?: ReactNode
  emptyFallback?: ReactNode
}

export function ContentShelf({
  heading,
  items,
  variant = 'poster',
  ranked = false,
  trailing,
  emptyFallback,
}: ContentShelfProps) {
  if (items.length === 0) {
    return emptyFallback ? <section className={styles.row}>{emptyFallback}</section> : null
  }

  return (
    <section className={styles.row}>
      <div className={styles.head}>
        <h2>{heading}</h2>
        {trailing}
      </div>
      <div className={styles.scrollerWrap}>
        <div className={styles.scroller} role="list">
          {items.map((item, index) => (
            <PosterCard
              key={item.title.id}
              title={item.title}
              rank={ranked ? (item.rank ?? index + 1) : item.rank}
              progressPercent={item.progressPercent}
              variant={variant}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
