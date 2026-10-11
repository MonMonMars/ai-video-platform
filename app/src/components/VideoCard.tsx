import { Link } from 'react-router-dom'
import type { VideoTitle } from '../types/catalog'
import { GENRE_LABELS } from '../data/catalog'
import { FollowButton } from './FollowButton'
import styles from './VideoCard.module.css'

interface VideoCardProps {
  title: VideoTitle
  rank?: number
}

export function VideoCard({ title, rank }: VideoCardProps) {
  return (
    <article className={styles.card}>
      <Link to={`/watch/${title.id}`} className={styles.mediaLink}>
        <div className={styles.thumb} style={{ background: title.accent }}>
          {rank !== undefined ? <span className={styles.rank}>{rank}</span> : null}
          {title.foundingFanExclusive ? (
            <span className={styles.badge}>Fan exclusive</span>
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
      <div className={styles.creatorRow}>
        <Link to={`/creator/${title.channelId}`} className={styles.creator}>
          {title.creator}
        </Link>
        <FollowButton channelId={title.channelId} channelName={title.creator} compact />
      </div>
    </article>
  )
}
