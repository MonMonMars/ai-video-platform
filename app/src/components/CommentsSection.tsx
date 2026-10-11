import { useCallback, useState } from 'react'
import { useWallet } from '../context/WalletContext'
import {
  addComment,
  loadCommentsForTitle,
  toggleCommentLike,
  type StoredComment,
} from '../lib/commentsStorage'
import { getViewerBadgeFlags, getViewerProfile } from '../lib/userStore'
import { AuthorBadges } from './AuthorBadges'
import styles from './CommentsSection.module.css'

interface CommentsSectionProps {
  titleId: string
  creatorName: string
}

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const diffMs = Date.now() - then
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 48) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function CommentsSection({ titleId, creatorName }: CommentsSectionProps) {
  const { balance, tip, tipComment, walletReady } = useWallet()
  const [comments, setComments] = useState<StoredComment[]>(() =>
    loadCommentsForTitle(titleId),
  )
  const [draft, setDraft] = useState('')
  const tipAmount = 2

  const refresh = useCallback(() => {
    setComments(loadCommentsForTitle(titleId))
  }, [titleId])

  const postComment = () => {
    const profile = getViewerProfile()
    const badges = getViewerBadgeFlags()
    try {
      addComment(titleId, draft, profile.displayName, badges)
      setDraft('')
      refresh()
    } catch {
      /* empty body */
    }
  }

  const onLike = (commentId: string) => {
    setComments(toggleCommentLike(titleId, commentId))
  }

  return (
    <section className={styles.section} aria-labelledby="comments-heading">
      <h2 id="comments-heading">Comments</h2>
      <p className={styles.hint}>Saved locally in your browser — demo only, no server sync.</p>

      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault()
          postComment()
        }}
      >
        <textarea
          id={`comment-${titleId}`}
          className={styles.textarea}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Share your take on this episode…"
          maxLength={500}
          aria-label="Add a comment"
        />
        <div className={styles.formRow}>
          <button type="submit" className={styles.submit} disabled={!draft.trim()}>
            Post comment
          </button>
        </div>
      </form>

      {comments.length === 0 ? (
        <p className={styles.empty}>No comments yet — be the first.</p>
      ) : (
        <ul className={styles.list}>
          {comments.map((comment) => (
            <li key={comment.id} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={styles.author}>{comment.authorName}</span>
                <AuthorBadges flags={comment.authorBadges} />
                <span className={styles.time}>{formatRelativeTime(comment.createdAt)}</span>
              </div>
              <p className={styles.body}>{comment.body}</p>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={`${styles.like} ${comment.likedByViewer ? styles.likeActive : ''}`}
                  onClick={() => onLike(comment.id)}
                  aria-pressed={comment.likedByViewer}
                >
                  {comment.likedByViewer ? '♥' : '♡'} {comment.likeCount}
                </button>
                {walletReady ? (
                  <button
                    type="button"
                    className={styles.tip}
                    disabled={balance < tipAmount}
                    onClick={() => tipComment(tipAmount, comment.authorName)}
                  >
                    Tip ${tipAmount}
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      {walletReady ? (
        <div className={styles.creatorTip}>
          <p>
            Support <strong>{creatorName}</strong> directly — demo wallet debit (${balance.toFixed(2)}{' '}
            available).
          </p>
          <button
            type="button"
            className={styles.submit}
            disabled={balance < 5}
            onClick={() => tip(5, creatorName)}
          >
            Tip creator $5
          </button>
        </div>
      ) : null}
    </section>
  )
}
