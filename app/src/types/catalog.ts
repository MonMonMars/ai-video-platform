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
  trendingScoreDaily: number
  trendingScoreWeekly: number
  foundingFanExclusive?: boolean
  /** When true, hidden while Kid Mode is on */
  matureContent?: boolean
  accent: string
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
