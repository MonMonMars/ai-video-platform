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
  /** Stable creator channel slug for follows and /creator/:channelId */
  channelId: string
  trendingScoreDaily: number
  trendingScoreWeekly: number
  foundingFanExclusive?: boolean
  accent: string
}

export interface CreatorChannel {
  id: string
  name: string
  handle: string
  tagline: string
  accent: string
}

/** Demo “new episode” notification for the Following feed */
export interface CreatorDrop {
  id: string
  channelId: string
  titleId: string
  droppedAt: string
  headline: string
}

export interface WalletEntry {
  id: string
  at: string
  kind: 'credit' | 'debit' | 'bonus'
  amount: number
  label: string
}

export type FoundingBadgeId = 'early-bird' | 'launch-crew' | 'patron'

export interface FoundingBadge {
  id: FoundingBadgeId
  label: string
  description: string
}
