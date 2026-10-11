import { Link } from 'react-router-dom'
import { catalog } from '../data/catalog'
import { sortTrending } from '../lib/trending'
import { filterTitlesForKidMode, pickKidSafeFeatured } from '../lib/kidMode'
import { ContentRow } from '../components/ContentRow'
import { HeroBanner } from '../components/HeroBanner'
import { useSettings } from '../context/SettingsContext'
import { useWallet } from '../context/WalletContext'
import styles from './HomePage.module.css'

export function HomePage() {
  const { isFoundingFan } = useWallet()
  const { kidMode } = useSettings()
  const trendingSorted = sortTrending('daily', 'all')
  const featured = pickKidSafeFeatured(trendingSorted, kidMode) ?? catalog[0]
  const trendingDaily = filterTitlesForKidMode(trendingSorted.slice(0, 6), kidMode)
  const fanExclusives = filterTitlesForKidMode(
    catalog.filter((title) => title.foundingFanExclusive),
    kidMode,
  )
  const newReleases = filterTitlesForKidMode([...catalog].slice(0, 5), kidMode)

  return (
    <div>
      <HeroBanner featured={featured} hideMembershipCta={kidMode} />
      {!kidMode && !isFoundingFan ? (
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
      <ContentRow heading="Trending today" titles={trendingDaily} ranked hideMembershipBadge={kidMode} />
      <ContentRow heading="New releases" titles={newReleases} hideMembershipBadge={kidMode} />
      {fanExclusives.length > 0 ? (
        <ContentRow
          heading="Founding Fan exclusives"
          titles={fanExclusives}
          hideMembershipBadge={kidMode}
        />
      ) : null}
    </div>
  )
}
