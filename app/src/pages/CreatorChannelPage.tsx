import { Link, useParams } from 'react-router-dom'
import { getTitlesByChannel } from '../data/catalog'
import { getChannel } from '../data/channels'
import { FollowButton } from '../components/FollowButton'
import { filterMatureTitles } from '../lib/matureFilter'
import styles from './CreatorChannelPage.module.css'

export function CreatorChannelPage() {
  const { channelId } = useParams<{ channelId: string }>()
  const channel = channelId ? getChannel(channelId) : undefined

  if (!channel) {
    return (
      <div className={styles.page}>
        <h1>Channel not found</h1>
        <Link to="/following">Back to Following</Link>
      </div>
    )
  }

  const allTitles = getTitlesByChannel(channel.id)
  const titles = filterMatureTitles(allTitles)
  const hiddenMature = allTitles.length - titles.length

  return (
    <div className={styles.page}>
      <div className={styles.hero} style={{ background: channel.accent }}>
        <div className={styles.heroInner}>
          <p className={styles.kicker}>Creator channel</p>
          <div className={styles.titleRow}>
            <h1>{channel.name}</h1>
            <FollowButton channelId={channel.id} channelName={channel.name} />
          </div>
          <p className={styles.handle}>{channel.handle}</p>
          <p className={styles.tagline}>{channel.tagline}</p>
        </div>
      </div>

      <section className={styles.catalog}>
        <h2>Series and episodes</h2>
        {titles.length === 0 ? (
          <div className={styles.empty}>
            <p>
              {hiddenMature > 0
                ? 'Episodes tagged mature are hidden in this demo.'
                : 'This channel has no episodes yet.'}
            </p>
            <Link to="/following">Back to Following</Link>
          </div>
        ) : (
          <ul className={styles.episodes}>
            {titles.map((title) => (
              <li key={title.id}>
                <Link to={`/watch/${title.id}`} className={styles.episodeLink}>
                  <span className={styles.epLabel}>{title.episodeLabel}</span>
                  <span className={styles.epName}>{title.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {titles.length > 0 && hiddenMature > 0 ? (
          <p className={styles.notice}>
            {hiddenMature} mature-tagged episode{hiddenMature === 1 ? '' : 's'} hidden.
          </p>
        ) : null}
      </section>
    </div>
  )
}
