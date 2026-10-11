import type { VideoTitle } from '../types/catalog'
import { VideoCard } from './VideoCard'
import styles from './ContentRow.module.css'

interface ContentRowProps {
  heading: string
  titles: VideoTitle[]
  ranked?: boolean
}

export function ContentRow({ heading, titles, ranked = false }: ContentRowProps) {
  if (titles.length === 0) return null

  return (
    <section className={styles.row}>
      <h2>{heading}</h2>
      <div className={styles.scroller}>
        {titles.map((title, index) => (
          <VideoCard key={title.id} title={title} rank={ranked ? index + 1 : undefined} />
        ))}
      </div>
    </section>
  )
}
