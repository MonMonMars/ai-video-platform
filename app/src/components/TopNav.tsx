import { NavLink } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import { useWallet } from '../context/WalletContext'
import { AccountMenu } from './AccountMenu'
import styles from './TopNav.module.css'

type NavLinkItem = { to: string; label: string; end?: boolean; hideInKidMode?: boolean }

const links: NavLinkItem[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/trending', label: 'Trending' },
  { to: '/founding-fan', label: 'Founding Fan', hideInKidMode: true },
  { to: '/wallet', label: 'Wallet', hideInKidMode: true },
]

export function TopNav() {
  const { balance, isFoundingFan } = useWallet()
  const { kidMode } = useSettings()

  const visibleLinks = links.filter((link) => !(kidMode && link.hideInKidMode))

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logoMark} aria-hidden />
        <div>
          <p className={styles.product}>Everything AI</p>
          <p className={styles.tagline}>AI Video Platform</p>
        </div>
      </div>
      <nav className={styles.nav} aria-label="Primary">
        {visibleLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className={styles.meta}>
        {kidMode ? <span className={styles.pillKid}>Kid Mode</span> : null}
        {!kidMode && isFoundingFan ? (
          <span className={styles.pill}>Founding Fan</span>
        ) : null}
        {!kidMode && !isFoundingFan ? <span className={styles.pillMuted}>Viewer</span> : null}
        {!kidMode ? (
          <span className={styles.balance} aria-label="Wallet balance">
            ${balance.toFixed(2)}
          </span>
        ) : null}
        <AccountMenu />
      </div>
    </header>
  )
}
