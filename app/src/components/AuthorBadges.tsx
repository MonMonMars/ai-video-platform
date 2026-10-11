import type { AuthorBadgeFlags } from '../types/catalog'
import styles from './AuthorBadges.module.css'

interface AuthorBadgesProps {
  flags: AuthorBadgeFlags
}

export function AuthorBadges({ flags }: AuthorBadgesProps) {
  if (!flags.isMember && !flags.isFoundingFan) return null

  return (
    <span className={styles.row} aria-label="Author badges">
      {flags.isMember ? (
        <span className={`${styles.badge} ${styles.member}`}>Member</span>
      ) : null}
      {flags.isFoundingFan ? (
        <span className={`${styles.badge} ${styles.founding}`}>Founding Fan</span>
      ) : null}
    </span>
  )
}
