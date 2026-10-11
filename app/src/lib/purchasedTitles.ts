import { catalog } from '../data/catalog'
import type { VideoTitle } from '../types/catalog'

const MONETIZATION_KEY = 'everything-ai.monetization.v1'

interface MonetizationSnapshot {
  unlockedEpisodeIds?: string[]
  unlockedSeriesIds?: string[]
  subscribedChannelIds?: string[]
}

function loadMonetizationSnapshot(): MonetizationSnapshot | null {
  try {
    const raw = localStorage.getItem(MONETIZATION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as MonetizationSnapshot
  } catch {
    return null
  }
}

/** Resolves purchased / unlocked titles for the library demo (wallet + optional monetization PR storage). */
export function getPurchasedTitles(isFoundingFan: boolean): VideoTitle[] {
  const ids = new Set<string>()
  const monetization = loadMonetizationSnapshot()

  if (monetization?.unlockedEpisodeIds) {
    for (const id of monetization.unlockedEpisodeIds) {
      ids.add(id)
    }
  }

  if (monetization?.unlockedSeriesIds?.length) {
    for (const title of catalog) {
      const seriesId = (title as VideoTitle & { seriesId?: string }).seriesId
      if (seriesId && monetization.unlockedSeriesIds.includes(seriesId)) {
        ids.add(title.id)
      }
    }
  }

  if (monetization?.subscribedChannelIds?.length) {
    for (const title of catalog) {
      const channelId = (title as VideoTitle & { channelId?: string }).channelId
      if (channelId && monetization.subscribedChannelIds.includes(channelId)) {
        ids.add(title.id)
      }
    }
  }

  if (isFoundingFan) {
    for (const title of catalog) {
      if (title.foundingFanExclusive) {
        ids.add(title.id)
      }
    }
  }

  return catalog.filter((title) => ids.has(title.id))
}
