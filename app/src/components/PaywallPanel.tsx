import { Link } from 'react-router-dom'
import type { VideoTitle } from '../types/catalog'
import { getChannel } from '../data/channels'
import { getStudioPricing } from '../lib/monetizationStorage'
import { useWallet } from '../context/WalletContext'
import styles from './PaywallPanel.module.css'

interface PaywallPanelProps {
  title: VideoTitle
  reason: 'paywall' | 'founding'
  previewMinutes: number
}

export function PaywallPanel({ title, reason, previewMinutes }: PaywallPanelProps) {
  const { balance, studio, buyEpisode, buySeries, subscribeToChannel, monetization } = useWallet()
  const channel = getChannel(title.channelId)
  const prices = getStudioPricing(title, studio)
  const isMember = monetization.subscribedChannelIds.includes(title.channelId)

  return (
    <section className={styles.panel} aria-labelledby="paywall-heading">
      <p className={styles.kicker}>
        {previewMinutes > 0 ? `${previewMinutes} min preview ended` : 'Locked content'}
      </p>
      <h2 id="paywall-heading">
        {reason === 'founding' ? 'Founding Fan exclusive' : 'Unlock to keep watching'}
      </h2>
      {reason === 'founding' ? (
        <p className={styles.lead}>
          Join the launch campaign for wallet credit and access to fan exclusives like{' '}
          <strong>{title.name}</strong>.
        </p>
      ) : (
        <p className={styles.lead}>
          Support <strong>{title.creator}</strong> with a single unlock, series bundle, or channel
          membership — demo wallet only.
        </p>
      )}

      {reason === 'founding' ? (
        <Link to="/founding-fan" className={styles.primary}>
          Join Founding Fan
        </Link>
      ) : (
        <div className={styles.options}>
          <button type="button" className={styles.primary} onClick={() => buyEpisode(title)}>
            Unlock episode · ${prices.episodePrice.toFixed(2)}
          </button>
          {title.seriesId && prices.seriesBundlePrice > 0 ? (
            <button type="button" className={styles.secondary} onClick={() => buySeries(title)}>
              Series bundle · ${prices.seriesBundlePrice.toFixed(2)}
            </button>
          ) : null}
          {channel && !isMember ? (
            <button
              type="button"
              className={styles.secondary}
              onClick={() =>
                subscribeToChannel(channel.id, channel.name, prices.membershipPrice)
              }
            >
              Subscribe · ${prices.membershipPrice.toFixed(2)}/mo
            </button>
          ) : null}
          {isMember ? (
            <p className={styles.memberNote}>You are subscribed — refresh if access did not update.</p>
          ) : null}
        </div>
      )}

      <p className={styles.wallet}>
        Wallet balance: ${balance.toFixed(2)} ·{' '}
        <Link to="/wallet">Top up demo packs</Link>
      </p>
      {channel ? (
        <Link to={`/creator/${channel.id}`} className={styles.channelLink}>
          View {channel.name} channel →
        </Link>
      ) : null}
    </section>
  )
}
