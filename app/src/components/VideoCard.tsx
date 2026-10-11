import { Link } from 'react-router-dom'
import type { VideoTitle } from '../types/catalog'
import { GENRE_LABELS } from '../data/catalog'
import { useWallet } from '../context/WalletContext'
import { getWatchAccess } from '../lib/access'
import styles from './VideoCard.module.css'

interface VideoCardProps {
  title: VideoTitle
  rank?: number
}

export function VideoCard({ title, rank }: VideoCardProps) {
  const { isFoundingFan, monetization, studio } = useWallet()
  const access = getWatchAccess(title, { isFoundingFan, monetization, studio })
  const showLock = !access.canWatchFull && access.blockReason !== 'unpublished'

  return (
    <Link to={`/watch/${title.id}`} className={styles.card}>
      <div className={styles.thumb} style={{ background: title.accent }}>
        {rank !== undefined ? <span className={styles.rank}>{rank}</span> : null}
        {title.foundingFanExclusive ? (
          <span className={styles.badge}>Fan exclusive</span>
        ) : null}
        {showLock ? <span className={styles.lockBadge}>Preview</span> : null}
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
