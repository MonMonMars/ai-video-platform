import { Link, useLocation } from 'react-router-dom'
import { useMemo, useState, useEffect } from 'react'
import { catalog, GENRE_LABELS } from '../data/catalog'
import { sortTrending } from '../lib/trending'
import {
  getContinueWatching,
  getSavedTitles,
  HOME_GENRE_SHELVES,
  titlesByGenre,
} from '../lib/watchHistory'
import { ContentShelf } from '../components/ContentShelf'
import { EmptyState } from '../components/EmptyState'
import { HeroBanner } from '../components/HeroBanner'
import { HomeSkeleton } from '../components/HomeSkeleton'
import { useHydrated } from '../hooks/useHydrated'
import { usePageReady } from '../hooks/usePageReady'
import { useWallet } from '../context/WalletContext'
import styles from './HomePage.module.css'

export function HomePage() {
  const { isFoundingFan } = useWallet()
  const hydrated = useHydrated()
  const ready = usePageReady()
  const location = useLocation()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (location.pathname === '/') {
      setTick((n) => n + 1)
    }
  }, [location.pathname, location.key])

  const browse = useMemo(() => {
    if (!hydrated) {
      return {
        featured: catalog[0],
        continueWatching: [] as ReturnType<typeof getContinueWatching>,
        trendingDaily: [] as ReturnType<typeof sortTrending>,
        trendingWeekly: [] as ReturnType<typeof sortTrending>,
        saved: [] as ReturnType<typeof getSavedTitles>,
        fanExclusives: [] as typeof catalog,
        featuredRow: [] as typeof catalog,
      }
    }
    void tick
    const featured = sortTrending('weekly', 'all')[0] ?? catalog[0]
    return {
      featured,
      continueWatching: getContinueWatching(),
      trendingDaily: sortTrending('daily', 'all').slice(0, 10),
      trendingWeekly: sortTrending('weekly', 'all').slice(0, 8),
      saved: getSavedTitles(),
      fanExclusives: catalog.filter((title) => title.foundingFanExclusive),
      featuredRow: sortTrending('daily', 'all').slice(0, 6),
    }
  }, [hydrated, tick])

  if (!ready) {
    return <HomeSkeleton />
  }

  return (
    <div className={styles.page}>
      <HeroBanner featured={browse.featured} />

      {!isFoundingFan ? (
        <div className={styles.campaign}>
          <div>
            <p className={styles.campaignKicker}>Launch campaign</p>
            <h2>Become a Founding Fan</h2>
            <p>Unlock wallet credits, badges, and exclusive drops during public launch.</p>
          </div>
          <Link to="/founding-fan" className={styles.campaignCta}>
            View campaign
          </Link>
        </div>
      ) : null}

      {browse.continueWatching.length > 0 ? (
        <ContentShelf
          heading="Continue watching"
          variant="landscape"
          items={browse.continueWatching.map((item) => ({
            title: item.title,
            progressPercent: item.progressPercent,
          }))}
        />
      ) : (
        <section className={styles.inlineEmpty}>
          <EmptyState
            title="Pick up where you left off"
            description="Start any episode — progress saves automatically in this browser."
            icon={<span aria-hidden>▶</span>}
            action={
              <Link to="/trending" className={styles.linkBtn}>
                Explore trending
              </Link>
            }
          />
        </section>
      )}

      <ContentShelf
        heading="Trending today"
        ranked
        items={browse.trendingDaily.map((title, index) => ({ title, rank: index + 1 }))}
        trailing={
          <Link to="/trending" className={styles.seeAll}>
            See all
          </Link>
        }
      />

      <ContentShelf
        heading="Featured originals"
        variant="landscape"
        items={browse.featuredRow.map((title) => ({ title }))}
      />

      {browse.saved.length > 0 ? (
        <ContentShelf
          heading="My list"
          items={browse.saved.map((title) => ({ title }))}
          trailing={
            <Link to="/library" className={styles.seeAll}>
              Manage
            </Link>
          }
        />
      ) : null}

      <ContentShelf heading="Top this week" ranked items={browse.trendingWeekly.map((title, index) => ({ title, rank: index + 1 }))} />

      {HOME_GENRE_SHELVES.map((genre) => {
        const titles = titlesByGenre(genre)
        if (titles.length === 0) return null
        return (
          <ContentShelf
            key={genre}
            heading={GENRE_LABELS[genre]}
            items={titles.map((title) => ({ title }))}
          />
        )
      })}

      <ContentShelf heading="Founding Fan exclusives" items={browse.fanExclusives.map((title) => ({ title }))} />
    </div>
  )
}
