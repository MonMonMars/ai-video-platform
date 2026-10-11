export type Genre =
  | 'sci-fi'
  | 'romance'
  | 'action'
  | 'documentary'
  | 'anime'
  | 'thriller'

export type TrendingWindow = 'daily' | 'weekly'

export interface VideoTitle {
  id: string
  name: string
  logline: string
  genre: Genre
  episodeLabel: string
  durationMinutes: number
  creator: string
  channelId: string
  seriesId?: string
  trendingScoreDaily: number
  trendingScoreWeekly: number
  foundingFanExclusive?: boolean
  /** Minutes visible before paywall (0 = no full preview) */
  freePreviewMinutes?: number
  episodePrice?: number
  seriesBundlePrice?: number
  accent: string
}

export type WalletEntryKind = 'credit' | 'debit' | 'bonus' | 'topup' | 'purchase'

export interface WalletEntry {
  id: string
  at: string
  kind: WalletEntryKind
  amount: number
  label: string
}

export type FoundingBadgeId = 'early-bird' | 'launch-crew' | 'patron' | 'member'

export interface FoundingBadge {
  id: FoundingBadgeId
  label: string
  description: string
}

export interface CreatorChannel {
  id: string
  name: string
  handle: string
  tagline: string
  membershipPrice: number
  membershipPerks: string[]
  accent: string
}

export interface ChannelComment {
  id: string
  author: string
  body: string
  isMember?: boolean
}

export interface MonetizationState {
  unlockedEpisodeIds: string[]
  unlockedSeriesIds: string[]
  subscribedChannelIds: string[]
}

export interface StudioEpisodeDraft {
  titleId: string
  published: boolean
  episodePrice: number
  seriesBundlePrice: number
}

export interface StudioState {
  channelId: string
  membershipPrice: number
  episodes: StudioEpisodeDraft[]
  earnings: StudioEarning[]
}

export interface StudioEarning {
  id: string
  at: string
  amount: number
  label: string
  kind: 'episode' | 'series' | 'membership' | 'tip'
}

export interface TopUpPack {
  id: string
  label: string
  credit: number
  bonusLabel?: string
}
