import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { VideoCard } from '../components/VideoCard'
import { searchCatalog } from '../lib/searchCatalog'
import {
  clearRecentSearches,
  loadRecentSearches,
  pushRecentSearch,
} from '../lib/searchStorage'
import styles from './SearchPage.module.css'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryParam = searchParams.get('q') ?? ''
  const [draft, setDraft] = useState(queryParam)
  const [recent, setRecent] = useState<string[]>(() => loadRecentSearches())

  useEffect(() => {
    setDraft(queryParam)
  }, [queryParam])

  const results = useMemo(() => searchCatalog(queryParam), [queryParam])
  const hasQuery = queryParam.trim().length > 0

  const applySearch = useCallback(
    (raw: string) => {
      const trimmed = raw.trim()
      if (!trimmed) {
        setSearchParams({})
        return
      }
      setSearchParams({ q: trimmed })
      setRecent(pushRecentSearch(trimmed))
    },
    [setSearchParams],
  )

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    applySearch(draft)
  }

  function onClearRecent() {
    clearRecentSearches()
    setRecent([])
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Search</h1>
        <p>Find titles by name, creator, or genre. Recent searches stay on this device.</p>
      </header>

      <form className={styles.form} onSubmit={onSubmit} role="search">
        <input
          className={styles.input}
          type="search"
          name="q"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Search titles, creators, genres…"
          aria-label="Search query"
          autoComplete="off"
        />
        <button type="submit" className={styles.submit}>
          Search
        </button>
      </form>

      {recent.length > 0 ? (
        <section className={styles.recent} aria-label="Recent searches">
          <div className={styles.recentHeader}>
            <h2>Recent</h2>
            <button type="button" className={styles.clearRecent} onClick={onClearRecent}>
              Clear
            </button>
          </div>
          <div className={styles.chips}>
            {recent.map((term) => (
              <button
                key={term}
                type="button"
                className={styles.chip}
                onClick={() => {
                  setDraft(term)
                  applySearch(term)
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {!hasQuery ? (
        <div className={styles.empty}>
          <h2>Start typing to search</h2>
          <p>Try &quot;Mon Mon&quot;, &quot;sci-fi&quot;, or a show title like &quot;Neon Orbit&quot;.</p>
        </div>
      ) : results.length === 0 ? (
        <div className={styles.noResults}>
          <h2>No matches for &quot;{queryParam}&quot;</h2>
          <p>Check spelling or try a genre such as documentary or anime.</p>
        </div>
      ) : (
        <>
          <p className={styles.resultMeta}>
            {results.length} result{results.length === 1 ? '' : 's'} for &quot;{queryParam}&quot;
          </p>
          <div className={styles.grid}>
            {results.map((title) => (
              <VideoCard key={title.id} title={title} />
            ))}
          </div>
        </>
      )}

      {hasQuery && results.length === 0 ? (
        <p className={styles.resultMeta}>
          <button
            type="button"
            className={styles.chip}
            onClick={() => navigate('/')}
            style={{ marginTop: '1rem' }}
          >
            Browse home
          </button>
        </p>
      ) : null}
    </div>
  )
}
