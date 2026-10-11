import { useWallet } from '../context/WalletContext'
import styles from './WalletPage.module.css'

export function WalletPage() {
  const { ledger, balance } = useWallet()

  return (
    <div className={styles.page}>
      <header>
        <h1>Wallet ledger</h1>
        <p>Demo credits and tips stored locally for the public preview build.</p>
      </header>
      <p className={styles.balance}>Balance: ${balance.toFixed(2)}</p>
      {ledger.length === 0 ? (
        <p className={styles.empty}>No transactions yet. Join Founding Fan to receive a bonus.</p>
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
