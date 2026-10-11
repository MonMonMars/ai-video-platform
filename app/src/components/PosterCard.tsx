import { Link } from 'react-router-dom'
import type { VideoTitle } from '../types/catalog'
import { GENRE_LABELS } from '../data/catalog'
import styles from './PosterCard.module.css'

interface PosterCardProps {
  title: VideoTitle
  rank?: number
  progressPercent?: number
  variant?: 'poster' | 'landscape'
}

export function PosterCard({
  title,
  rank,
  progressPercent,
  variant = 'poster',
}: PosterCardProps) {
  const cardClass =
    variant === 'landscape' ? `${styles.card} ${styles.landscape}` : styles.card

  return (
    <Link to={`/watch/${title.id}`} className={cardClass}>
      <div className={styles.thumb} style={{ background: title.accent }}>
        {rank !== undefined ? <span className={styles.rank}>{rank}</span> : null}
        {title.foundingFanExclusive ? (
          <span className={styles.badge}>Fan</span>
        ) : null}
        {progressPercent !== undefined ? (
          <div className={styles.progressTrack} aria-hidden>
            <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
          </div>
        ) : null}
      </div>
      <div className={styles.body}>
        <p className={styles.episode}>{title.episodeLabel}</p>
        <h3>{title.name}</h3>
        <p className={styles.meta}>
          {GENRE_LABELS[title.genre]} · {title.durationMinutes}m
        </p>
      </div>
    </Link>
  )
}
