import { Link } from 'react-router-dom'
import { TOP_UP_PACKS } from '../lib/walletStorage'
import { useWallet } from '../context/WalletContext'
import styles from './WalletPage.module.css'

export function WalletPage() {
  const { ledger, balance, topUp } = useWallet()

  return (
    <div className={styles.page}>
      <header>
        <h1>Wallet ledger</h1>
        <p>Demo credits, top-ups, and purchases stored locally for the public preview build.</p>
      </header>
      <p className={styles.balance}>Balance: ${balance.toFixed(2)}</p>

      <section className={styles.panel}>
        <h2>Top-up packs (demo)</h2>
        <p className={styles.panelHint}>No real payment — adds credits to your demo wallet instantly.</p>
        <ul className={styles.packs}>
          {TOP_UP_PACKS.map((pack) => (
            <li key={pack.id}>
              <div>
                <strong>{pack.label}</strong>
                <span>${pack.credit.toFixed(2)} credit {pack.bonusLabel ?? ''}</span>
              </div>
              <button type="button" className={styles.packBtn} onClick={() => topUp(pack)}>
                Add credit
              </button>
            </li>
          ))}
        </ul>
        <p className={styles.panelHint}>
          New to the platform? <Link to="/founding-fan">Join Founding Fan</Link> for a $25 welcome
          bonus.
        </p>
      </section>

      {ledger.length === 0 ? (
        <p className={styles.empty}>No transactions yet. Join Founding Fan or add a top-up pack.</p>
      ) : (
        <ul className={styles.list}>
          {ledger.map((entry) => (
            <li key={entry.id}>
              <div>
                <strong>{entry.label}</strong>
                <span>
                  {new Date(entry.at).toLocaleString()} · {entry.kind}
                </span>
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
