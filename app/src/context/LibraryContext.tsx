import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  loadLibraryState,
  recordContinueWatching,
  removeContinueWatching,
  toggleLiked,
  toggleWatchLater,
  type LibraryState,
} from '../lib/libraryStorage'

interface LibraryContextValue extends LibraryState {
  isWatchLater: (titleId: string) => boolean
  isLiked: (titleId: string) => boolean
  toggleWatchLaterFor: (titleId: string) => void
  toggleLikedFor: (titleId: string) => void
  trackProgress: (titleId: string, progressPercent?: number) => void
  clearContinueWatching: (titleId: string) => void
  refresh: () => void
}

const LibraryContext = createContext<LibraryContextValue | null>(null)

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LibraryState>(() => loadLibraryState())

  const refresh = useCallback(() => {
    setState(loadLibraryState())
  }, [])

  const isWatchLater = useCallback(
    (titleId: string) => state.watchLaterIds.includes(titleId),
    [state.watchLaterIds],
  )

  const isLiked = useCallback(
    (titleId: string) => state.likedIds.includes(titleId),
    [state.likedIds],
  )

  const toggleWatchLaterFor = useCallback((titleId: string) => {
    setState((prev) => toggleWatchLater(prev, titleId))
  }, [])

  const toggleLikedFor = useCallback((titleId: string) => {
    setState((prev) => toggleLiked(prev, titleId))
  }, [])

  const trackProgress = useCallback((titleId: string, progressPercent?: number) => {
    setState((prev) => {
      const resolved =
        progressPercent ??
        (() => {
          const entry = prev.continueWatching.find((item) => item.id === titleId)
          return entry ? Math.min(92, entry.progressPercent + 12) : 38
        })()
      return recordContinueWatching(prev, titleId, resolved)
    })
  }, [])

  const clearContinueWatching = useCallback((titleId: string) => {
    setState((prev) => removeContinueWatching(prev, titleId))
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      isWatchLater,
      isLiked,
      toggleWatchLaterFor,
      toggleLikedFor,
      trackProgress,
      clearContinueWatching,
      refresh,
    }),
    [
      state,
      isWatchLater,
      isLiked,
      toggleWatchLaterFor,
      toggleLikedFor,
      trackProgress,
      clearContinueWatching,
      refresh,
    ],
  )

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext)
  if (!ctx) {
    throw new Error('useLibrary must be used within LibraryProvider')
  }
  return ctx
}
