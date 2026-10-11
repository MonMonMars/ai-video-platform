import { Link } from 'react-router-dom'
import type { VideoTitle } from '../types/catalog'
import { GENRE_LABELS } from '../data/catalog'
import styles from './VideoCard.module.css'

interface VideoCardProps {
  title: VideoTitle
  rank?: number
  hideMembershipBadge?: boolean
}

export function VideoCard({ title, rank, hideMembershipBadge = false }: VideoCardProps) {
  return (
    <Link to={`/watch/${title.id}`} className={styles.card}>
      <div className={styles.thumb} style={{ background: title.accent }}>
        {rank !== undefined ? <span className={styles.rank}>{rank}</span> : null}
        {!hideMembershipBadge && title.foundingFanExclusive ? (
          <span className={styles.badge}>Fan exclusive</span>
        ) : null}
      </div>
      <div className={styles.body}>
        <p className={styles.episode}>{title.episodeLabel}</p>
        <h3>{title.name}</h3>
        <p className={styles.meta}>
          {GENRE_LABELS[title.genre]} · {title.durationMinutes}m · {title.creator}
        </p>
      </div>
    </Link>
  )
}
