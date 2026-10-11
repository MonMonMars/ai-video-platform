import { getCommentsForTitle } from '../data/comments'
import { isChannelMember } from '../lib/access'
import { useWallet } from '../context/WalletContext'
import styles from './EpisodeComments.module.css'

interface EpisodeCommentsProps {
  titleId: string
  channelId: string
}

export function EpisodeComments({ titleId, channelId }: EpisodeCommentsProps) {
  const { monetization } = useWallet()
  const viewerIsMember = isChannelMember(channelId, monetization)
  const comments = getCommentsForTitle(titleId)

  return (
    <section className={styles.section} aria-labelledby="comments-heading">
      <h2 id="comments-heading">Comments</h2>
      <ul className={styles.list}>
        {comments.map((comment) => {
          const showMemberBadge = comment.isMember || (comment.author === 'you' && viewerIsMember)
          return (
            <li key={comment.id}>
              <div className={styles.authorRow}>
                <span className={styles.author}>{comment.author}</span>
                {showMemberBadge ? (
                  <span className={styles.memberBadge}>Member</span>
                ) : null}
              </div>
              <p className={styles.body}>{comment.body}</p>
            </li>
          )
        })}
        {viewerIsMember ? (
          <li className={styles.viewerComment}>
            <div className={styles.authorRow}>
              <span className={styles.author}>you</span>
              <span className={styles.memberBadge}>Member</span>
            </div>
            <p className={styles.body}>Thanks for supporting the channel — demo comment thread.</p>
          </li>
        ) : null}
      </ul>
    </section>
  )
}
