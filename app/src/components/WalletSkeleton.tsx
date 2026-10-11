import styles from './Skeleton.module.css'

export function WalletSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading wallet">
      <div className={`${styles.shimmer} ${styles.line}`} style={{ width: '12rem', height: '1.5rem' }} />
      <div
        className={`${styles.shimmer}`}
        style={{ marginTop: '1.25rem', height: '3rem', borderRadius: '0.75rem' }}
      />
      {[1, 2, 3].map((row) => (
        <div
          key={row}
          className={`${styles.shimmer}`}
          style={{ marginTop: '0.65rem', height: '3.25rem', borderRadius: '0.65rem' }}
        />
      ))}
    </div>
  )
}
