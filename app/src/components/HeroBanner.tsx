import { Link } from 'react-router-dom'
import type { VideoTitle } from '../types/catalog'
import { GENRE_LABELS } from '../data/catalog'
import styles from './HeroBanner.module.css'

interface HeroBannerProps {
  featured: VideoTitle
  hideMembershipCta?: boolean
}

export function HeroBanner({ featured, hideMembershipCta = false }: HeroBannerProps) {
  return (
    <section className={styles.hero} style={{ backgroundImage: featured.accent }}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <p className={styles.kicker}>Featured premiere</p>
        <h1>{featured.name}</h1>
        <p className={styles.logline}>{featured.logline}</p>
        <p className={styles.meta}>
          {featured.episodeLabel} · {GENRE_LABELS[featured.genre]} · {featured.durationMinutes}{' '}
          min
        </p>
        <div className={styles.actions}>
          <Link to={`/watch/${featured.id}`} className={styles.primary}>
            Play
          </Link>
          {hideMembershipCta ? null : (
            <Link to="/founding-fan" className={styles.secondary}>
              Founding Fan perks
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
