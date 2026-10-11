import { Link } from 'react-router-dom'
import { catalog, getTitle } from '../data/catalog'
import { getChannel } from '../data/channels'
import { useWallet } from '../context/WalletContext'
import styles from './StudioPage.module.css'

export function StudioPage() {
  const { studio, saveEpisodeStudio, setMembershipPrice } = useWallet()
  const channel = getChannel(studio.channelId)
  const channelTitles = catalog.filter((t) => t.channelId === studio.channelId)
  const totalEarnings = studio.earnings.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className={styles.page}>
      <header>
        <p className={styles.kicker}>Creator studio</p>
        <h1>{channel?.name ?? 'Studio'} — demo dashboard</h1>
        <p>Set prices, publish episodes, and track demo earnings (localStorage only).</p>
      </header>

      <section className={styles.panel}>
        <h2>Earnings summary</h2>
        <p className={styles.earningsTotal}>${totalEarnings.toFixed(2)} lifetime (demo)</p>
        {studio.earnings.length === 0 ? (
          <p className={styles.muted}>Purchases and tips from your wallet will appear here.</p>
        ) : (
          <ul className={styles.earningsList}>
            {studio.earnings.slice(0, 8).map((row) => (
              <li key={row.id}>
                <span>{row.label}</span>
                <span className={styles.earningsAmount}>+${row.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.panel}>
        <h2>Channel membership price</h2>
        <label className={styles.field}>
          <span>Monthly (demo)</span>
          <input
            type="number"
            min={0}
            step={0.5}
            value={studio.membershipPrice}
            onChange={(e) => setMembershipPrice(Number(e.target.value))}
          />
        </label>
      </section>

      <section className={styles.panel}>
        <h2>Episodes — prices & publish</h2>
        <ul className={styles.episodeEditor}>
          {channelTitles.map((title) => {
            const draft = studio.episodes.find((e) => e.titleId === title.id)
            const published = draft?.published ?? true
            const episodePrice = draft?.episodePrice ?? title.episodePrice ?? 0
            const seriesBundlePrice = draft?.seriesBundlePrice ?? title.seriesBundlePrice ?? 0
            return (
              <li key={title.id}>
                <div className={styles.episodeHead}>
                  <strong>
                    {title.episodeLabel} · {title.name}
                  </strong>
                  <label className={styles.publishToggle}>
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) =>
                        saveEpisodeStudio(title.id, { published: e.target.checked })
                      }
                    />
                    Published
                  </label>
                </div>
                <div className={styles.priceRow}>
                  <label className={styles.field}>
                    <span>Episode $</span>
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      value={episodePrice}
                      onChange={(e) =>
                        saveEpisodeStudio(title.id, { episodePrice: Number(e.target.value) })
                      }
                    />
                  </label>
                  {title.seriesId ? (
                    <label className={styles.field}>
                      <span>Series bundle $</span>
                      <input
                        type="number"
                        min={0}
                        step={0.5}
                        value={seriesBundlePrice}
                        onChange={(e) =>
                          saveEpisodeStudio(title.id, {
                            seriesBundlePrice: Number(e.target.value),
                          })
                        }
                      />
                    </label>
                  ) : null}
                </div>
                <Link to={`/watch/${title.id}`} className={styles.previewLink}>
                  Preview watch page →
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <p className={styles.note}>
        Demo studio is scoped to <strong>{channel?.name}</strong>. Open{' '}
        {getTitle('paper-hearts') ? (
          <Link to="/watch/paper-hearts">Paper Hearts</Link>
        ) : (
          'a paywalled title'
        )}{' '}
        as a viewer to test unlock flows.
      </p>
    </div>
  )
}
