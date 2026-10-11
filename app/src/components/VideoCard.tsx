import { Link } from 'react-router-dom'
import type { VideoTitle } from '../types/catalog'
import { GENRE_LABELS } from '../data/catalog'
import { SaveActions } from './SaveActions'
import styles from './VideoCard.module.css'

interface VideoCardProps {
  title: VideoTitle
  rank?: number
  showSaveActions?: boolean
}

export function VideoCard({ title, rank, showSaveActions = true }: VideoCardProps) {
  return (
    <article className={styles.card}>
      <Link to={`/watch/${title.id}`} className={styles.thumbLink}>
        <div className={styles.thumb} style={{ background: title.accent }}>
          {rank !== undefined ? <span className={styles.rank}>{rank}</span> : null}
          {title.foundingFanExclusive ? (
            <span className={styles.badge}>Fan exclusive</span>
          ) : null}
        </div>
      </Link>
      <div className={styles.body}>
        <p className={styles.episode}>{title.episodeLabel}</p>
        <h3>
          <Link to={`/watch/${title.id}`} className={styles.titleLink}>
            {title.name}
          </Link>
        </h3>
        <p className={styles.meta}>
          {GENRE_LABELS[title.genre]} · {title.durationMinutes}m · {title.creator}
        </p>
        {showSaveActions ? <SaveActions titleId={title.id} compact /> : null}
      </div>
    </article>
  )
}
