import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CREATOR_CHANNELS } from '../data/channels'
import { getDropsForChannels } from '../data/drops'
import { getTitle } from '../data/catalog'
import { useFollow } from '../context/FollowContext'
import { FollowButton } from '../components/FollowButton'
import styles from './FollowingPage.module.css'

function formatDropTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function FollowingPage() {
  const { followedChannelIds, markFollowingSeen } = useFollow()

  useEffect(() => {
    markFollowingSeen()
  }, [markFollowingSeen])

  const drops = useMemo(
    () => getDropsForChannels(followedChannelIds),
    [followedChannelIds],
  )

  const suggested = useMemo(() => {
    const followed = new Set(followedChannelIds)
    return CREATOR_CHANNELS.filter((c) => !followed.has(c.id)).slice(0, 4)
  }, [followedChannelIds])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Following</h1>
        <p>Drops from creators you follow — stored locally for this demo.</p>
      </header>

      {followedChannelIds.length === 0 ? (
        <section className={styles.empty}>
          <h2>No subscriptions yet</h2>
          <p>Follow a channel to see new episode drops here and get unread alerts in the nav bell.</p>
        </section>
      ) : drops.length === 0 ? (
        <section className={styles.empty}>
          <h2>No drops yet</h2>
          <p>When followed creators release episodes, they will show up in this feed.</p>
        </section>
      ) : (
        <ul className={styles.feed}>
          {drops.map((drop) => {
            const channel = CREATOR_CHANNELS.find((c) => c.id === drop.channelId)
            const title = getTitle(drop.titleId)
            return (
              <li key={drop.id} className={styles.drop}>
                <div
                  className={styles.dropThumb}
                  style={{ background: title?.accent ?? channel?.accent }}
                />
                <div className={styles.dropBody}>
                  <p className={styles.dropMeta}>
                    {channel?.name ?? drop.channelId} · {formatDropTime(drop.droppedAt)}
                  </p>
                  <h2 className={styles.dropHeadline}>{drop.headline}</h2>
                  {title ? <p className={styles.dropLogline}>{title.logline}</p> : null}
                  <div className={styles.dropActions}>
                    {title ? (
                      <Link to={`/watch/${title.id}`} className={styles.watch}>
                        Watch
                      </Link>
                    ) : null}
                    {channel ? (
                      <Link to={`/creator/${channel.id}`} className={styles.channelLink}>
                        Channel
                      </Link>
                    ) : null}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <section className={styles.suggested}>
        <h2>Suggested creators</h2>
        <ul className={styles.suggestList}>
          {suggested.map((channel) => (
            <li key={channel.id} className={styles.suggestCard}>
              <Link to={`/creator/${channel.id}`} className={styles.suggestMain}>
                <span
                  className={styles.suggestAvatar}
                  style={{ background: channel.accent }}
                  aria-hidden
                />
                <span>
                  <span className={styles.suggestName}>{channel.name}</span>
                  <span className={styles.suggestHandle}>{channel.handle}</span>
                </span>
              </Link>
              <FollowButton channelId={channel.id} channelName={channel.name} compact />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
