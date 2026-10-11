import { Link, useParams } from 'react-router-dom'
import { GENRE_LABELS, getTitle } from '../data/catalog'
import { getWatchAccess } from '../lib/access'
import { useWallet } from '../context/WalletContext'
import { PaywallPanel } from '../components/PaywallPanel'
import { EpisodeComments } from '../components/EpisodeComments'
import styles from './WatchPage.module.css'

export function WatchPage() {
  const { id } = useParams<{ id: string }>()
  const title = id ? getTitle(id) : undefined
  const { balance, tip, isFoundingFan, monetization, studio } = useWallet()

  if (!title) {
    return (
      <div className={styles.page}>
        <h1>Title not found</h1>
        <Link to="/">Back to home</Link>
      </div>
    )
  }

  const access = getWatchAccess(title, { isFoundingFan, monetization, studio })
  const previewMode = !access.canWatchFull && access.previewMinutes > 0
  const locked = !access.canWatchFull

  return (
    <div className={styles.page}>
      <div className={styles.player} style={{ background: title.accent }}>
        <div className={styles.playerOverlay}>
          {access.canWatchFull ? (
            <>
              <p className={styles.playerLabel}>Demo player</p>
              <p>
                Hook up episode MP4s under <code>app/public/media/</code> when available. Large demo
                files may stay gitignored in CI.
              </p>
            </>
          ) : previewMode ? (
            <>
              <p className={styles.playerLabel}>Free preview</p>
              <p>
                Watching first {access.previewMinutes} min — unlock below to continue (demo paywall).
              </p>
            </>
          ) : (
            <>
              <p className={styles.playerLabel}>Locked</p>
              <p>Preview not available — unlock or subscribe to watch.</p>
            </>
          )}
        </div>
        {locked ? <div className={styles.previewDim} aria-hidden /> : null}
      </div>

      {locked && access.blockReason && access.blockReason !== 'unpublished' ? (
        <PaywallPanel
          title={title}
          reason={access.blockReason === 'founding' ? 'founding' : 'paywall'}
          previewMinutes={access.previewMinutes}
        />
      ) : null}

      {access.blockReason === 'unpublished' ? (
        <p className={styles.unpublished}>This episode is unpublished in the creator studio.</p>
      ) : null}

      <div className={styles.details}>
        <p className={styles.episode}>{title.episodeLabel}</p>
        <h1>{title.name}</h1>
        <p>{title.logline}</p>
        <p className={styles.meta}>
          {GENRE_LABELS[title.genre]} · {title.durationMinutes} min · by{' '}
          <Link to={`/creator/${title.channelId}`}>{title.creator}</Link>
        </p>
        {access.canWatchFull ? (
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

      <EpisodeComments titleId={title.id} channelId={title.channelId} />
    </div>
  )
}
