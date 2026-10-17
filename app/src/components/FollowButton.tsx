import { useFollow } from '../context/FollowContext'
import styles from './FollowButton.module.css'

interface FollowButtonProps {
  channelId: string
  channelName?: string
  compact?: boolean
}

export function FollowButton({ channelId, channelName, compact }: FollowButtonProps) {
  const { isFollowing, toggleFollow } = useFollow()
  const following = isFollowing(channelId)
  const label = following ? 'Following' : 'Follow'

  return (
    <button
      type="button"
      className={compact ? `${styles.btn} ${styles.compact}` : styles.btn}
      aria-pressed={following}
      aria-label={
        channelName ? (following ? `Unfollow ${channelName}` : `Follow ${channelName}`) : label
      }
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleFollow(channelId)
      }}
    >
      {label}
    </button>
  )
}
