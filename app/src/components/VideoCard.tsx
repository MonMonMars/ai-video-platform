import { Link } from 'react-router-dom'
import type { VideoTitle } from '../types/catalog'
import { GENRE_LABELS } from '../data/catalog'
import { ShareButton } from './ShareButton'
import styles from './VideoCard.module.css'

interface VideoCardProps {
  title: VideoTitle
  rank?: number
}

export function VideoCard({ title, rank }: VideoCardProps) {
  return (
    <article className={styles.card}>
      <Link to={`/watch/${title.id}`} className={styles.link}>
        <div className={styles.thumb} style={{ background: title.accent }}>
          {rank !== undefined ? <span className={styles.rank}>{rank}</span> : null}
          {title.foundingFanExclusive ? (
            <span className={styles.badge}>Fan exclusive</span>
          ) : null}
          <ShareButton
            titleId={title.id}
            titleName={title.name}
            variant="icon"
            className={styles.share}
          />
        </div>
        <div className={styles.body}>
          <p className={styles.episode}>{title.episodeLabel}</p>
          <h3>{title.name}</h3>
          <p className={styles.meta}>
            {GENRE_LABELS[title.genre]} · {title.durationMinutes}m · {title.creator}
          </p>
        </div>
      </Link>
    </article>
  )
}
