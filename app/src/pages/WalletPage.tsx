import { Link } from 'react-router-dom'
import { useWallet } from '../context/WalletContext'
import { EmptyState } from '../components/EmptyState'
import { WalletSkeleton } from '../components/WalletSkeleton'
import { usePageReady } from '../hooks/usePageReady'
import styles from './WalletPage.module.css'

export function WalletPage() {
  const ready = usePageReady()
  const { ledger, balance } = useWallet()

  if (!ready) {
    return (
      <div className={styles.page}>
        <header>
          <h1>Wallet ledger</h1>
        </header>
        <WalletSkeleton />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header>
        <h1>Wallet ledger</h1>
        <p>Demo credits and tips stored locally for the public preview build.</p>
      </header>
      <p className={styles.balance}>Balance: ${balance.toFixed(2)}</p>
      {ledger.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          description="Join the Founding Fan campaign to receive a welcome credit, or tip a creator while watching."
          icon={<span aria-hidden>◈</span>}
          action={
            <Link to="/founding-fan" className={styles.cta}>
              Founding Fan
            </Link>
          }
        />
      ) : (
        <ul className={styles.list}>
          {ledger.map((entry) => (
            <li key={entry.id}>
              <div>
                <strong>{entry.label}</strong>
                <span>{new Date(entry.at).toLocaleString()}</span>
              </div>
              <span className={entry.amount >= 0 ? styles.credit : styles.debit}>
                {entry.amount >= 0 ? '+' : ''}
                {entry.amount.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
