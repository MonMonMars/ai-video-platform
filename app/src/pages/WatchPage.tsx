import { Link, useParams } from 'react-router-dom'
import { GENRE_LABELS, getTitle } from '../data/catalog'
import { FollowButton } from '../components/FollowButton'
import { useWallet } from '../context/WalletContext'
import styles from './WatchPage.module.css'

export function WatchPage() {
  const { id } = useParams<{ id: string }>()
  const title = id ? getTitle(id) : undefined
  const { balance, tip } = useWallet()

  if (!title) {
    return (
      <div className={styles.page}>
        <h1>Title not found</h1>
        <Link to="/">Back to home</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.player} style={{ background: title.accent }}>
        <div className={styles.playerOverlay}>
          <p className={styles.playerLabel}>Demo player</p>
          <p>
            Hook up episode MP4s under <code>app/public/media/</code> when available. Large demo
            files may stay gitignored in CI.
          </p>
        </div>
      </div>
      <div className={styles.details}>
        <p className={styles.episode}>{title.episodeLabel}</p>
        <h1>{title.name}</h1>
        <p>{title.logline}</p>
        <p className={styles.meta}>
          {GENRE_LABELS[title.genre]} · {title.durationMinutes} min · by{' '}
          <Link to={`/creator/${title.channelId}`}>{title.creator}</Link>
        </p>
        <div className={styles.followRow}>
          <FollowButton channelId={title.channelId} channelName={title.creator} />
        </div>
        <div className={styles.tipRow}>
          <button
            type="button"
            className={styles.tip}
            disabled={balance < 5}
            onClick={() => tip(5, title.creator)}
          >
            Tip $5
          </button>
          <span className={styles.tipHint}>Wallet: ${balance.toFixed(2)}</span>
        </div>
        <Link to="/" className={styles.back}>
          ← Back to browse
        </Link>
      </div>
    </div>
  )
}
