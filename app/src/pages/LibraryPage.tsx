import { Link } from 'react-router-dom'
import { ContinueWatchingCard } from '../components/ContinueWatchingCard'
import { VideoCard } from '../components/VideoCard'
import { useLibrary } from '../context/LibraryContext'
import { useWallet } from '../context/WalletContext'
import { catalog, getTitle } from '../data/catalog'
import { getPurchasedTitles } from '../lib/purchasedTitles'
import styles from './LibraryPage.module.css'

function resolveTitles(ids: string[]) {
  return ids
    .map((id) => getTitle(id))
    .filter((title): title is NonNullable<typeof title> => title !== undefined)
}

export function LibraryPage() {
  const { continueWatching, watchLaterIds, likedIds } = useLibrary()
  const { isFoundingFan } = useWallet()

  const continueTitles = continueWatching.flatMap((entry) => {
    const title = getTitle(entry.id)
    if (!title) return []
    return [{ title, progressPercent: entry.progressPercent }]
  })

  const watchLater = resolveTitles(watchLaterIds)
  const liked = resolveTitles(likedIds)
  const purchased = getPurchasedTitles(isFoundingFan)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>My Library</h1>
        <p>Continue watching, saved titles, likes, and unlocked purchases — stored locally for this demo.</p>
      </header>

      <section className={styles.section} aria-labelledby="continue-heading">
        <div className={styles.sectionHeader}>
          <h2 id="continue-heading">Continue watching</h2>
          <p>Pick up where you left off</p>
        </div>
        {continueTitles.length === 0 ? (
          <div className={styles.empty}>
            Nothing in progress yet. Play any title to add it here.
            <Link to="/" className={styles.cta}>
              Browse home →
            </Link>
          </div>
        ) : (
          <div className={styles.row}>
            {continueTitles.map(({ title, progressPercent }) => (
              <ContinueWatchingCard
                key={title.id}
                title={title}
                progressPercent={progressPercent}
              />
            ))}
          </div>
        )}
      </section>

      <section className={styles.section} aria-labelledby="watch-later-heading">
        <div className={styles.sectionHeader}>
          <h2 id="watch-later-heading">Watch Later</h2>
          <p>Saved from cards and watch pages</p>
        </div>
        {watchLater.length === 0 ? (
          <div className={styles.empty}>
            Save shows with Watch Later on any title card.
            <Link to="/search" className={styles.cta}>
              Search catalog →
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {watchLater.map((title) => (
              <VideoCard key={title.id} title={title} />
            ))}
          </div>
        )}
      </section>

      <section className={styles.section} aria-labelledby="liked-heading">
        <div className={styles.sectionHeader}>
          <h2 id="liked-heading">Liked</h2>
          <p>Quick favorites for the demo</p>
        </div>
        {liked.length === 0 ? (
          <div className={styles.empty}>
            Tap Like on a title you enjoy — {catalog.length} demos in the catalog.
          </div>
        ) : (
          <div className={styles.grid}>
            {liked.map((title) => (
              <VideoCard key={title.id} title={title} />
            ))}
          </div>
        )}
      </section>

      <section className={styles.section} aria-labelledby="purchased-heading">
        <div className={styles.sectionHeader}>
          <h2 id="purchased-heading">Purchased &amp; unlocked</h2>
          <p>Founding Fan exclusives and monetization unlocks (when present)</p>
        </div>
        {purchased.length === 0 ? (
          <div className={styles.empty}>
            Join Founding Fan or unlock episodes in Wallet / Studio when monetization is enabled.
            <Link to="/founding-fan" className={styles.cta}>
              Founding Fan campaign →
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {purchased.map((title) => (
              <VideoCard key={title.id} title={title} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
