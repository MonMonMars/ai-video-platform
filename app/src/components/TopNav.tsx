import { NavLink } from 'react-router-dom'
import { useWallet } from '../context/WalletContext'
import styles from './TopNav.module.css'

type NavLinkItem = { to: string; label: string; end?: boolean }

const links: NavLinkItem[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/trending', label: 'Trending' },
  { to: '/library', label: 'Saved' },
  { to: '/founding-fan', label: 'Founding Fan' },
  { to: '/wallet', label: 'Wallet' },
]

export function TopNav() {
  const { balance, isFoundingFan } = useWallet()

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
        {links.map((link) => (
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
        {isFoundingFan ? (
          <span className={styles.pill}>Founding Fan</span>
        ) : (
          <span className={styles.pillMuted}>Viewer</span>
        )}
        <span className={styles.balance} aria-label="Wallet balance">
          ${balance.toFixed(2)}
        </span>
      </div>
    </header>
  )
}
