import styles from './Skeleton.module.css'

export function TrendingSkeleton() {
  return (
    <div className={styles.shelf} aria-busy="true" aria-label="Loading trending">
      <div className={`${styles.shimmer} ${styles.rowTitle}`} style={{ width: '10rem' }} />
      <div
        className={styles.scroller}
        style={{ flexWrap: 'wrap', rowGap: '1rem', paddingBottom: '1rem' }}
      >
        {[1, 2, 3, 4, 5, 6].map((card) => (
          <div key={card} className={styles.cardStack}>
            <div className={`${styles.shimmer} ${styles.poster}`} />
            <div className={`${styles.shimmer} ${styles.line} ${styles.lineShort}`} />
          </div>
        ))}
      </div>
    </div>
  )
}
