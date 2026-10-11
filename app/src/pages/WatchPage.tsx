import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { GENRE_LABELS, getTitle } from '../data/catalog'
import { isMatureTitle } from '../lib/kidMode'
import { recordWatchHistory } from '../lib/viewingDataStorage'
import { useSettings } from '../context/SettingsContext'
import { useWallet } from '../context/WalletContext'
import styles from './WatchPage.module.css'

export function WatchPage() {
  const { id } = useParams<{ id: string }>()
  const title = id ? getTitle(id) : undefined
  const { balance, tip } = useWallet()
  const { kidMode, settings } = useSettings()

  useEffect(() => {
    if (!title || (kidMode && isMatureTitle(title))) return
    recordWatchHistory(title.id)
  }, [title, kidMode])

  if (!title) {
    return (
      <div className={styles.page}>
        <h1>Title not found</h1>
        <Link to="/">Back to home</Link>
      </div>
    )
  }

  if (kidMode && isMatureTitle(title)) {
    return (
      <div className={styles.page}>
        <h1>Not available in Kid Mode</h1>
        <p className={styles.blocked}>
          This title is tagged for mature audiences. Turn off Kid Mode in Settings with a guardian
          to watch.
        </p>
        <Link to="/settings" className={styles.back}>
          Go to Settings
        </Link>
        <Link to="/" className={styles.back}>
          ← Back to browse
        </Link>
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
          {settings.autoplay ? (
            <p className={styles.autoplayNote}>Autoplay is on (next episode would start automatically).</p>
          ) : null}
        </div>
      </div>
      <div className={styles.details}>
        <p className={styles.episode}>{title.episodeLabel}</p>
        <h1>{title.name}</h1>
        <p>{title.logline}</p>
        <p className={styles.meta}>
          {GENRE_LABELS[title.genre]} · {title.durationMinutes} min · by {title.creator}
        </p>
        {!kidMode ? (
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
        ) : null}
        <Link to="/" className={styles.back}>
          ← Back to browse
        </Link>
      </div>
    </div>
  )
}
