import styles from './Skeleton.module.css'

export function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading browse">
      <div className={`${styles.shimmer} ${styles.heroBlock}`} />
      {[1, 2, 3].map((row) => (
        <div key={row} className={styles.shelf}>
          <div className={`${styles.shimmer} ${styles.rowTitle}`} />
          <div className={styles.scroller}>
            {[1, 2, 3, 4, 5].map((card) => (
              <div key={card} className={styles.cardStack}>
                <div className={`${styles.shimmer} ${styles.poster}`} />
                <div className={`${styles.shimmer} ${styles.line} ${styles.lineFull}`} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
