import { getDropsForChannels } from '../data/drops'
import { filterMatureDrops } from './matureFilter'

const FOLLOWS_KEY = 'everything-ai.follows.v1'
const SEEN_DROPS_KEY = 'everything-ai.follows.v1.seenDrops'

export interface FollowState {
  followedChannelIds: string[]
  seenDropIds: string[]
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function loadFollowState(): FollowState {
  return {
    followedChannelIds: readJson<string[]>(FOLLOWS_KEY, []),
    seenDropIds: readJson<string[]>(SEEN_DROPS_KEY, []),
  }
}

export function saveFollowState(state: FollowState): void {
  localStorage.setItem(FOLLOWS_KEY, JSON.stringify(state.followedChannelIds))
  localStorage.setItem(SEEN_DROPS_KEY, JSON.stringify(state.seenDropIds))
}

export function toggleFollowChannel(state: FollowState, channelId: string): FollowState {
  const set = new Set(state.followedChannelIds)
  if (set.has(channelId)) {
    set.delete(channelId)
  } else {
    set.add(channelId)
  }
  const next = { ...state, followedChannelIds: [...set] }
  saveFollowState(next)
  return next
}

/** Drops the viewer can see: followed channels, minus mature titles when filtering. */
export function visibleFollowedDrops(state: FollowState) {
  return filterMatureDrops(getDropsForChannels(state.followedChannelIds))
}

export function countUnreadDrops(state: FollowState): number {
  const seen = new Set(state.seenDropIds)
  return visibleFollowedDrops(state).filter((drop) => !seen.has(drop.id)).length
}

/** Mark visible followed drops as seen. Hidden mature drops stay unread. */
export function markFollowedDropsSeen(state: FollowState): FollowState {
  const seen = new Set(state.seenDropIds)
  for (const drop of visibleFollowedDrops(state)) {
    seen.add(drop.id)
  }
  const next = { ...state, seenDropIds: [...seen] }
  saveFollowState(next)
  return next
}
