import { catalog } from '../data/catalog'
import { getChannel } from '../data/channels'
import type {
  MonetizationState,
  StudioEarning,
  StudioEpisodeDraft,
  StudioState,
  VideoTitle,
} from '../types/catalog'

const MONETIZATION_KEY = 'everything-ai.monetization.v1'
const STUDIO_KEY = 'everything-ai.studio.v1'

const DEMO_STUDIO_CHANNEL_ID = 'mon-mon'

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function loadMonetizationState(): MonetizationState {
  return readJson<MonetizationState>(MONETIZATION_KEY, {
    unlockedEpisodeIds: [],
    unlockedSeriesIds: [],
    subscribedChannelIds: [],
  })
}

export function saveMonetizationState(state: MonetizationState): void {
  localStorage.setItem(MONETIZATION_KEY, JSON.stringify(state))
}

function defaultStudioEpisodes(channelId: string): StudioEpisodeDraft[] {
  return catalog
    .filter((t) => t.channelId === channelId)
    .map((t) => ({
      titleId: t.id,
      published: true,
      episodePrice: t.episodePrice ?? 0,
      seriesBundlePrice: t.seriesBundlePrice ?? 0,
    }))
}

export function loadStudioState(): StudioState {
  const fallback: StudioState = {
    channelId: DEMO_STUDIO_CHANNEL_ID,
    membershipPrice: getChannel(DEMO_STUDIO_CHANNEL_ID)?.membershipPrice ?? 9.99,
    episodes: defaultStudioEpisodes(DEMO_STUDIO_CHANNEL_ID),
    earnings: [],
  }
  const stored = readJson<StudioState | null>(STUDIO_KEY, null)
  if (!stored) return fallback
  const mergedEpisodes = defaultStudioEpisodes(stored.channelId).map((draft) => {
    const saved = stored.episodes.find((e) => e.titleId === draft.titleId)
    return saved ?? draft
  })
  return { ...fallback, ...stored, episodes: mergedEpisodes }
}

export function saveStudioState(state: StudioState): void {
  localStorage.setItem(STUDIO_KEY, JSON.stringify(state))
}

export function getStudioPricing(title: VideoTitle, studio: StudioState): {
  episodePrice: number
  seriesBundlePrice: number
  membershipPrice: number
} {
  const draft = studio.episodes.find((e) => e.titleId === title.id)
  const channel = getChannel(title.channelId)
  return {
    episodePrice: draft?.episodePrice ?? title.episodePrice ?? 0,
    seriesBundlePrice: draft?.seriesBundlePrice ?? title.seriesBundlePrice ?? 0,
    membershipPrice:
      studio.channelId === title.channelId ? studio.membershipPrice : (channel?.membershipPrice ?? 0),
  }
}

export function appendStudioEarning(
  studio: StudioState,
  earning: Omit<StudioEarning, 'id' | 'at'>,
): StudioState {
  const next: StudioState = {
    ...studio,
    earnings: [
      {
        id: crypto.randomUUID(),
        at: new Date().toISOString(),
        ...earning,
      },
      ...studio.earnings,
    ].slice(0, 100),
  }
  saveStudioState(next)
  return next
}

export function updateStudioEpisode(
  studio: StudioState,
  titleId: string,
  patch: Partial<StudioEpisodeDraft>,
): StudioState {
  const next: StudioState = {
    ...studio,
    episodes: studio.episodes.map((e) => (e.titleId === titleId ? { ...e, ...patch } : e)),
  }
  saveStudioState(next)
  return next
}

export function setStudioMembershipPrice(studio: StudioState, membershipPrice: number): StudioState {
  const next = { ...studio, membershipPrice: Math.max(0, membershipPrice) }
  saveStudioState(next)
  return next
}

export function unlockEpisode(monetization: MonetizationState, titleId: string): MonetizationState {
  if (monetization.unlockedEpisodeIds.includes(titleId)) return monetization
  const next = {
    ...monetization,
    unlockedEpisodeIds: [...monetization.unlockedEpisodeIds, titleId],
  }
  saveMonetizationState(next)
  return next
}

export function unlockSeries(monetization: MonetizationState, seriesId: string): MonetizationState {
  if (monetization.unlockedSeriesIds.includes(seriesId)) return monetization
  const next = {
    ...monetization,
    unlockedSeriesIds: [...monetization.unlockedSeriesIds, seriesId],
  }
  saveMonetizationState(next)
  return next
}

export function subscribeChannel(
  monetization: MonetizationState,
  channelId: string,
): MonetizationState {
  if (monetization.subscribedChannelIds.includes(channelId)) return monetization
  const next = {
    ...monetization,
    subscribedChannelIds: [...monetization.subscribedChannelIds, channelId],
  }
  saveMonetizationState(next)
  return next
}

export function seriesEpisodeIds(seriesId: string): string[] {
  return catalog.filter((t) => t.seriesId === seriesId).map((t) => t.id)
}
