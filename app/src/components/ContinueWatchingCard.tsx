import { Link } from 'react-router-dom'
import type { VideoTitle } from '../types/catalog'
import { GENRE_LABELS } from '../data/catalog'
import styles from './ContinueWatchingCard.module.css'

interface ContinueWatchingCardProps {
  title: VideoTitle
  progressPercent: number
}

export function ContinueWatchingCard({ title, progressPercent }: ContinueWatchingCardProps) {
  return (
    <Link to={`/watch/${title.id}`} className={styles.card}>
      <div className={styles.thumb} style={{ background: title.accent }}>
        <div className={styles.progressTrack} aria-hidden>
          <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
      <div className={styles.body}>
        <p className={styles.episode}>{title.episodeLabel}</p>
        <h3>{title.name}</h3>
        <p className={styles.meta}>
          {progressPercent}% watched · {GENRE_LABELS[title.genre]}
        </p>
      </div>
    </Link>
  )
}
