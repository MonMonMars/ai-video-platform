import { Link, useParams } from 'react-router-dom'
import { getChannel } from '../data/channels'
import { getTitlesByChannel } from '../data/catalog'
import { FollowButton } from '../components/FollowButton'
import styles from './CreatorChannelPage.module.css'

export function CreatorChannelPage() {
  const { channelId } = useParams<{ channelId: string }>()
  const channel = channelId ? getChannel(channelId) : undefined

  if (!channel) {
    return (
      <div className={styles.page}>
        <h1>Channel not found</h1>
        <Link to="/">Back to home</Link>
      </div>
    )
  }

  const titles = getTitlesByChannel(channel.id)

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
        <h2>Series & episodes</h2>
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
      </section>
    </div>
  )
}
