import { Link, useParams } from 'react-router-dom'
import { getChannel } from '../data/channels'
import { getTitlesByChannel } from '../data/catalog'
import { isChannelMember } from '../lib/access'
import { getStudioPricing } from '../lib/monetizationStorage'
import { useWallet } from '../context/WalletContext'
import styles from './CreatorChannelPage.module.css'

export function CreatorChannelPage() {
  const { channelId } = useParams<{ channelId: string }>()
  const channel = channelId ? getChannel(channelId) : undefined
  const { subscribeToChannel, monetization, studio, balance } = useWallet()

  if (!channel) {
    return (
      <div className={styles.page}>
        <h1>Channel not found</h1>
        <Link to="/">Back to home</Link>
      </div>
    )
  }

  const titles = getTitlesByChannel(channel.id)
  const member = isChannelMember(channel.id, monetization)
  const membershipPrice =
    studio.channelId === channel.id ? studio.membershipPrice : channel.membershipPrice

  return (
    <div className={styles.page}>
      <div className={styles.hero} style={{ background: channel.accent }}>
        <div className={styles.heroInner}>
          <p className={styles.kicker}>Creator channel</p>
          <h1>{channel.name}</h1>
          <p className={styles.handle}>{channel.handle}</p>
          <p className={styles.tagline}>{channel.tagline}</p>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.panel}>
          <h2>{member ? 'Membership active' : 'Subscribe'}</h2>
          {member ? (
            <p className={styles.status}>You are a member — full catalog access and comment badge.</p>
          ) : (
            <>
              <p className={styles.price}>${membershipPrice.toFixed(2)} / month (demo)</p>
              <button
                type="button"
                className={styles.cta}
                onClick={() => subscribeToChannel(channel.id, channel.name, membershipPrice)}
              >
                Join / Subscribe
              </button>
              <p className={styles.hint}>Wallet: ${balance.toFixed(2)}</p>
            </>
          )}
        </section>

        <section className={styles.panel}>
          <h2>Member perks</h2>
          <ul className={styles.perks}>
            {channel.membershipPerks.map((perk) => (
              <li key={perk}>{perk}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className={styles.catalog}>
        <h2>Episodes</h2>
        <ul className={styles.episodes}>
          {titles.map((title) => {
            const prices = getStudioPricing(title, studio)
            return (
              <li key={title.id}>
                <Link to={`/watch/${title.id}`} className={styles.episodeLink}>
                  <span className={styles.epLabel}>{title.episodeLabel}</span>
                  <span className={styles.epName}>{title.name}</span>
                  <span className={styles.epPrice}>
                    {prices.episodePrice > 0 ? `$${prices.episodePrice.toFixed(2)}` : 'Free'}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
