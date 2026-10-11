import { Link } from 'react-router-dom'
import { catalog } from '../data/catalog'
import { sortTrending } from '../lib/trending'
import { ContentRow } from '../components/ContentRow'
import { HeroBanner } from '../components/HeroBanner'
import { useWallet } from '../context/WalletContext'
import styles from './HomePage.module.css'

export function HomePage() {
  const { isFoundingFan } = useWallet()
  const featured = sortTrending('daily', 'all')[0] ?? catalog[0]
  const trendingDaily = sortTrending('daily', 'all').slice(0, 6)
  const fanExclusives = catalog.filter((title) => title.foundingFanExclusive)
  const newReleases = [...catalog].slice(0, 5)

  return (
    <div>
      <HeroBanner featured={featured} />
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
      <ContentRow heading="Trending today" titles={trendingDaily} ranked />
      <ContentRow heading="New releases" titles={newReleases} />
      <ContentRow heading="Founding Fan exclusives" titles={fanExclusives} />
    </div>
  )
}
