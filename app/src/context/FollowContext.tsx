import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  countUnreadDrops,
  loadFollowState,
  markFollowedDropsSeen,
  toggleFollowChannel,
  type FollowState,
} from '../lib/followStorage'

interface FollowContextValue extends FollowState {
  isFollowing: (channelId: string) => boolean
  toggleFollow: (channelId: string) => void
  unreadDropCount: number
  markFollowingSeen: () => void
}

const FollowContext = createContext<FollowContextValue | null>(null)

export function FollowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FollowState>(() => loadFollowState())

  const isFollowing = useCallback(
    (channelId: string) => state.followedChannelIds.includes(channelId),
    [state.followedChannelIds],
  )

  const toggleFollow = useCallback((channelId: string) => {
    setState((prev) => toggleFollowChannel(prev, channelId))
  }, [])

  const markFollowingSeen = useCallback(() => {
    setState((prev) => markFollowedDropsSeen(prev))
  }, [])

  const unreadDropCount = useMemo(() => countUnreadDrops(state), [state])

  const value = useMemo(
    () => ({
      ...state,
      isFollowing,
      toggleFollow,
      unreadDropCount,
      markFollowingSeen,
    }),
    [state, isFollowing, toggleFollow, unreadDropCount, markFollowingSeen],
  )

  return <FollowContext.Provider value={value}>{children}</FollowContext.Provider>
}

export function useFollow(): FollowContextValue {
  const ctx = useContext(FollowContext)
  if (!ctx) {
    throw new Error('useFollow must be used within FollowProvider')
  }
  return ctx
}
