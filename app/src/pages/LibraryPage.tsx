import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { ContentShelf } from '../components/ContentShelf'
import { EmptyState } from '../components/EmptyState'
import { HomeSkeleton } from '../components/HomeSkeleton'
import { usePageReady } from '../hooks/usePageReady'
import { useHydrated } from '../hooks/useHydrated'
import { getSavedTitles, toggleSaved } from '../lib/watchHistory'
import styles from './LibraryPage.module.css'

export function LibraryPage() {
  const hydrated = useHydrated()
  const ready = usePageReady()
  const [revision, setRevision] = useState(0)

  const saved = useMemo(() => {
    if (!hydrated) return []
    void revision
    return getSavedTitles()
  }, [hydrated, revision])

  if (!ready) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1>Saved</h1>
        </header>
        <HomeSkeleton />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Saved</h1>
        <p>Titles you bookmark on the watch screen — stored in this browser only.</p>
      </header>

      {saved.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          description="Open any title and tap Save to build your personal row on Home."
          icon={<span aria-hidden>☆</span>}
          action={
            <Link to="/" className={styles.cta}>
              Browse home
            </Link>
          }
        />
      ) : (
        <>
          <ContentShelf
            heading="My list"
            items={saved.map((title) => ({ title }))}
          />
          <ul className={styles.manage}>
            {saved.map((title) => (
              <li key={title.id}>
                <Link to={`/watch/${title.id}`}>{title.name}</Link>
                <button
                  type="button"
                  onClick={() => {
                    toggleSaved(title.id)
                    setRevision((n) => n + 1)
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
