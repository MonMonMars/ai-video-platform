import { useLibrary } from '../context/LibraryContext'
import styles from './SaveActions.module.css'

interface SaveActionsProps {
  titleId: string
  compact?: boolean
  className?: string
}

export function SaveActions({ titleId, compact, className }: SaveActionsProps) {
  const { isWatchLater, isLiked, toggleWatchLaterFor, toggleLikedFor } = useLibrary()
  const saved = isWatchLater(titleId)
  const liked = isLiked(titleId)

  const rootClass = [styles.row, compact ? styles.compact : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClass} role="group" aria-label="Save actions">
      <button
        type="button"
        className={saved ? styles.btnActive : styles.btn}
        aria-pressed={saved}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          toggleWatchLaterFor(titleId)
        }}
      >
        {saved ? 'Saved' : 'Watch Later'}
      </button>
      <button
        type="button"
        className={liked ? styles.btnActive : styles.btn}
        aria-pressed={liked}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          toggleLikedFor(titleId)
        }}
      >
        {liked ? 'Liked' : 'Like'}
      </button>
    </div>
  )
}
