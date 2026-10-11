import { Link } from 'react-router-dom'
import { FOUNDING_BADGES } from '../data/badges'
import { useSettings } from '../context/SettingsContext'
import { useWallet } from '../context/WalletContext'
import styles from './FoundingFanPage.module.css'

export function FoundingFanPage() {
  const { isFoundingFan, badgeIds, joinCampaign, balance } = useWallet()
  const { kidMode } = useSettings()

  return (
    <div className={styles.page}>
      <header>
        <p className={styles.kicker}>Launch campaign</p>
        <h1>Founding Fan</h1>
        <p>
          Back the public launch, collect badges, and load your creator wallet for tips and
          exclusive drops.
        </p>
      </header>

      <section className={styles.panel}>
        <h2>Membership</h2>
        {kidMode ? (
          <>
            <p className={styles.status}>
              Membership offers are hidden while Kid Mode is on. A parent or guardian can manage this
              in Settings.
            </p>
            <Link to="/settings" className={styles.ctaLink}>
              Open Settings
            </Link>
          </>
        ) : isFoundingFan ? (
          <p className={styles.status}>You are in — welcome credit applied to your wallet.</p>
        ) : (
          <>
            <p>Join now to receive a $25 welcome credit (demo ledger; no real payments).</p>
            <button type="button" className={styles.cta} onClick={joinCampaign}>
              Join Founding Fan
            </button>
          </>
        )}
        {!kidMode ? <p className={styles.balance}>Wallet balance: ${balance.toFixed(2)}</p> : null}
      </section>

      <section className={styles.panel}>
        <h2>Badges</h2>
        <ul className={styles.badges}>
          {FOUNDING_BADGES.map((badge) => {
            const earned = badgeIds.includes(badge.id)
            return (
              <li key={badge.id} className={earned ? styles.badgeEarned : styles.badgeLocked}>
                <span className={styles.badgeTitle}>{badge.label}</span>
                <span>{badge.description}</span>
                <span className={styles.badgeState}>{earned ? 'Earned' : 'Locked'}</span>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
