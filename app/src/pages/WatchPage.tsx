import { Link, useParams } from 'react-router-dom'
import { CommentsSection } from '../components/CommentsSection'
import { ShareButton } from '../components/ShareButton'
import { GENRE_LABELS, getTitle } from '../data/catalog'
import { useWallet } from '../context/WalletContext'
import styles from './WatchPage.module.css'

export function WatchPage() {
  const { id } = useParams<{ id: string }>()
  const title = id ? getTitle(id) : undefined
  const { balance, walletReady } = useWallet()

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
          {GENRE_LABELS[title.genre]} · {title.durationMinutes} min · by {title.creator}
        </p>
        <div className={styles.actionRow}>
          <ShareButton titleId={title.id} titleName={title.name} />
          {walletReady ? (
            <span className={styles.tipHint}>Wallet: ${balance.toFixed(2)}</span>
          ) : (
            <Link to="/founding-fan" className={styles.walletCta}>
              Load wallet to tip in comments
            </Link>
          )}
        </div>
        <Link to="/" className={styles.back}>
          ← Back to browse
        </Link>
      </div>
      <CommentsSection titleId={title.id} creatorName={title.creator} />
    </div>
  )
}
