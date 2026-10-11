import type { MonetizationState, StudioState, VideoTitle } from '../types/catalog'
import { getStudioPricing } from './monetizationStorage'

export type AccessBlockReason = 'founding' | 'paywall' | 'unpublished'

export interface WatchAccess {
  canWatchFull: boolean
  blockReason?: AccessBlockReason
  previewMinutes: number
}

export function getWatchAccess(
  title: VideoTitle,
  opts: {
    isFoundingFan: boolean
    monetization: MonetizationState
    studio: StudioState
  },
): WatchAccess {
  const draft = opts.studio.episodes.find((e) => e.titleId === title.id)
  if (draft && !draft.published && opts.studio.channelId === title.channelId) {
    return { canWatchFull: false, blockReason: 'unpublished', previewMinutes: 0 }
  }

  if (title.foundingFanExclusive && !opts.isFoundingFan) {
    return {
      canWatchFull: false,
      blockReason: 'founding',
      previewMinutes: title.freePreviewMinutes ?? 0,
    }
  }

  const { episodePrice } = getStudioPricing(title, opts.studio)
  if (episodePrice <= 0 && !title.foundingFanExclusive) {
    return { canWatchFull: true, previewMinutes: 0 }
  }

  if (hasUnlockedTitle(title, opts.monetization)) {
    return { canWatchFull: true, previewMinutes: 0 }
  }

  return {
    canWatchFull: false,
    blockReason: 'paywall',
    previewMinutes: title.freePreviewMinutes ?? 3,
  }
}

export function hasUnlockedTitle(title: VideoTitle, monetization: MonetizationState): boolean {
  if (monetization.unlockedEpisodeIds.includes(title.id)) return true
  if (title.seriesId && monetization.unlockedSeriesIds.includes(title.seriesId)) return true
  if (monetization.subscribedChannelIds.includes(title.channelId)) return true
  return false
}

export function isChannelMember(channelId: string, monetization: MonetizationState): boolean {
  return monetization.subscribedChannelIds.includes(channelId)
}
