import { NavLink } from 'react-router-dom'
import { useFollow } from '../context/FollowContext'
import styles from './NotificationBell.module.css'

export function NotificationBell() {
  const { unreadDropCount } = useFollow()

  return (
    <NavLink
      to="/following"
      className={({ isActive }) =>
        isActive ? `${styles.bell} ${styles.active}` : styles.bell
      }
      aria-label={
        unreadDropCount > 0
          ? `Following, ${unreadDropCount} unread drops`
          : 'Following feed'
      }
    >
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden focusable="false">
        <path
          fill="currentColor"
          d="M12 2a5 5 0 0 0-5 5v2.1c0 .5-.2 1-.5 1.4L4.8 13.2A1 1 0 0 0 5.8 15H18.2a1 1 0 0 0 .9-1.5l-1.7-2.7c-.3-.4-.5-.9-.5-1.4V7a5 5 0 0 0-5-5zm0 20a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22z"
        />
      </svg>
      {unreadDropCount > 0 ? (
        <span className={styles.badge}>{unreadDropCount > 9 ? '9+' : unreadDropCount}</span>
      ) : null}
    </NavLink>
  )
}
