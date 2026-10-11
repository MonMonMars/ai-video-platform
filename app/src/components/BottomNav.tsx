import { NavLink } from 'react-router-dom'
import { useWallet } from '../context/WalletContext'
import styles from './BottomNav.module.css'

const tabs = [
  { to: '/', label: 'Home', end: true, icon: '⌂' },
  { to: '/trending', label: 'Trending', icon: '▲' },
  { to: '/library', label: 'Saved', icon: '☆' },
  { to: '/wallet', label: 'Wallet', icon: '◈' },
  { to: '/founding-fan', label: 'Fan', icon: '♥' },
] as const

export function BottomNav() {
  const { balance } = useWallet()

  return (
    <nav className={styles.nav} aria-label="Mobile primary">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={'end' in tab ? tab.end : undefined}
          className={({ isActive }) =>
            isActive ? `${styles.tab} ${styles.active}` : styles.tab
          }
        >
          <span className={styles.icon} aria-hidden>
            {tab.icon}
          </span>
          <span className={styles.label}>{tab.label}</span>
          {tab.to === '/wallet' ? (
            <span className={styles.walletHint} aria-hidden>
              ${balance.toFixed(0)}
            </span>
          ) : null}
        </NavLink>
      ))}
    </nav>
  )
}
