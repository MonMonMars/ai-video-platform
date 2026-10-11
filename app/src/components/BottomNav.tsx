import { NavLink } from 'react-router-dom'
import { useFollow } from '../context/FollowContext'
import { useWallet } from '../context/WalletContext'
import styles from './BottomNav.module.css'

const tabs = [
  { to: '/', label: 'Home', end: true, icon: '⌂' },
  { to: '/trending', label: 'Trending', icon: '▲' },
  { to: '/following', label: 'Following', icon: '◎', showUnread: true },
  { to: '/wallet', label: 'Wallet', icon: '◈' },
] as const

export function BottomNav() {
  const { balance } = useWallet()
  const { unreadDropCount } = useFollow()

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
          <span className={styles.iconWrap}>
            <span className={styles.icon} aria-hidden>
              {tab.icon}
            </span>
            {'showUnread' in tab && tab.showUnread && unreadDropCount > 0 ? (
              <span className={styles.badge} aria-hidden>
                {unreadDropCount > 9 ? '9+' : unreadDropCount}
              </span>
            ) : null}
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
