import { CREATOR_DROPS } from '../data/drops'

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

export function countUnreadDrops(state: FollowState): number {
  const followed = new Set(state.followedChannelIds)
  const seen = new Set(state.seenDropIds)
  return CREATOR_DROPS.filter((d) => followed.has(d.channelId) && !seen.has(d.id)).length
}

/** Mark all drops from followed channels as seen (opening Following feed). */
export function markFollowedDropsSeen(state: FollowState): FollowState {
  const followed = new Set(state.followedChannelIds)
  const seen = new Set(state.seenDropIds)
  for (const drop of CREATOR_DROPS) {
    if (followed.has(drop.channelId)) {
      seen.add(drop.id)
    }
  }
  const next = { ...state, seenDropIds: [...seen] }
  saveFollowState(next)
  return next
}

export function isDropUnread(state: FollowState, dropId: string): boolean {
  const drop = CREATOR_DROPS.find((d) => d.id === dropId)
  if (!drop) return false
  if (!state.followedChannelIds.includes(drop.channelId)) return false
  return !state.seenDropIds.includes(dropId)
}
