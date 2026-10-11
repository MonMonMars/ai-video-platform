import { getChannelByCreatorName } from '../data/channels'
import type { FoundingBadgeId, MonetizationState, TopUpPack, WalletEntry } from '../types/catalog'
import {
  appendStudioEarning,
  loadMonetizationState,
  loadStudioState,
  saveMonetizationState,
  saveStudioState,
  subscribeChannel,
  unlockEpisode,
  unlockSeries,
} from './monetizationStorage'

const WALLET_KEY = 'everything-ai.wallet.v1'
const BADGES_KEY = 'everything-ai.badges.v1'
const FOUNDING_KEY = 'everything-ai.foundingFan.v1'

export interface WalletState {
  balance: number
  ledger: WalletEntry[]
  badgeIds: FoundingBadgeId[]
  isFoundingFan: boolean
}

export const TOP_UP_PACKS: TopUpPack[] = [
  { id: 'pack-10', label: 'Starter pack', credit: 10 },
  { id: 'pack-25', label: 'Creator pack', credit: 28, bonusLabel: '+$3 demo bonus' },
  { id: 'pack-50', label: 'Binge pack', credit: 58, bonusLabel: '+$8 demo bonus' },
]

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function loadWalletState(): WalletState {
  const balance = readJson<number>(`${WALLET_KEY}.balance`, 0)
  const ledger = readJson<WalletEntry[]>(`${WALLET_KEY}.ledger`, [])
  const badgeIds = readJson<FoundingBadgeId[]>(BADGES_KEY, [])
  const isFoundingFan = readJson<boolean>(FOUNDING_KEY, false)
  return { balance, ledger, badgeIds, isFoundingFan }
}

export function saveWalletState(state: WalletState): void {
  localStorage.setItem(`${WALLET_KEY}.balance`, JSON.stringify(state.balance))
  localStorage.setItem(`${WALLET_KEY}.ledger`, JSON.stringify(state.ledger))
  localStorage.setItem(BADGES_KEY, JSON.stringify(state.badgeIds))
  localStorage.setItem(FOUNDING_KEY, JSON.stringify(state.isFoundingFan))
}

export function appendLedgerEntry(
  state: WalletState,
  entry: Omit<WalletEntry, 'id' | 'at'>,
): WalletState {
  const next: WalletState = {
    ...state,
    balance: state.balance + entry.amount,
    ledger: [
      {
        id: crypto.randomUUID(),
        at: new Date().toISOString(),
        ...entry,
      },
      ...state.ledger,
    ].slice(0, 50),
  }
  saveWalletState(next)
  return next
}

function debitPurchase(
  state: WalletState,
  amount: number,
  label: string,
): WalletState | null {
  if (amount <= 0) return state
  if (state.balance < amount) return null
  return appendLedgerEntry(state, {
    kind: 'purchase',
    amount: -amount,
    label,
  })
}

function maybeMemberBadge(state: WalletState): WalletState {
  if (state.badgeIds.includes('member')) return state
  const next = { ...state, badgeIds: [...state.badgeIds, 'member'] as FoundingBadgeId[] }
  saveWalletState(next)
  return next
}

export function topUpWallet(state: WalletState, pack: TopUpPack): WalletState {
  return appendLedgerEntry(state, {
    kind: 'topup',
    amount: pack.credit,
    label: `Demo top-up: ${pack.label}`,
  })
}

export function joinFoundingFan(state: WalletState): WalletState {
  if (state.isFoundingFan) return state
  let next = appendLedgerEntry(state, {
    kind: 'bonus',
    amount: 25,
    label: 'Founding Fan welcome credit',
  })
  next = {
    ...next,
    isFoundingFan: true,
    badgeIds: next.badgeIds.includes('launch-crew')
      ? next.badgeIds
      : [...next.badgeIds, 'launch-crew'],
  }
  saveWalletState(next)
  return next
}

export function tipCreator(state: WalletState, amount: number, creator: string): WalletState {
  if (amount <= 0 || state.balance < amount) return state
  let next = appendLedgerEntry(state, {
    kind: 'debit',
    amount: -amount,
    label: `Tip to ${creator}`,
  })
  if (!next.badgeIds.includes('patron')) {
    next = { ...next, badgeIds: [...next.badgeIds, 'patron'] }
    saveWalletState(next)
  }
  const channel = getChannelByCreatorName(creator)
  if (channel) {
    let studio = loadStudioState()
    if (studio.channelId === channel.id) {
      studio = appendStudioEarning(studio, {
        amount,
        label: `Tip on ${creator}`,
        kind: 'tip',
      })
      saveStudioState(studio)
    }
  }
  return next
}

export interface PurchaseResult {
  wallet: WalletState
  monetization: MonetizationState
  ok: boolean
  error?: 'insufficient' | 'already'
}

export function purchaseEpisodeUnlock(
  wallet: WalletState,
  monetization: MonetizationState,
  titleId: string,
  price: number,
  label: string,
  channelId: string,
): PurchaseResult {
  if (monetization.unlockedEpisodeIds.includes(titleId)) {
    return { wallet, monetization, ok: false, error: 'already' }
  }
  const nextWallet = debitPurchase(wallet, price, label)
  if (!nextWallet) {
    return { wallet, monetization, ok: false, error: 'insufficient' }
  }
  const nextMon = unlockEpisode(monetization, titleId)
  let studio = loadStudioState()
  if (studio.channelId === channelId) {
    studio = appendStudioEarning(studio, {
      amount: price,
      label,
      kind: 'episode',
    })
  }
  return { wallet: nextWallet, monetization: nextMon, ok: true }
}

export function purchaseSeriesUnlock(
  wallet: WalletState,
  monetization: MonetizationState,
  seriesId: string,
  price: number,
  label: string,
  channelId: string,
): PurchaseResult {
  if (monetization.unlockedSeriesIds.includes(seriesId)) {
    return { wallet, monetization, ok: false, error: 'already' }
  }
  const nextWallet = debitPurchase(wallet, price, label)
  if (!nextWallet) {
    return { wallet, monetization, ok: false, error: 'insufficient' }
  }
  const nextMon = unlockSeries(monetization, seriesId)
  let studio = loadStudioState()
  if (studio.channelId === channelId) {
    studio = appendStudioEarning(studio, {
      amount: price,
      label,
      kind: 'series',
    })
  }
  return { wallet: nextWallet, monetization: nextMon, ok: true }
}

export function purchaseChannelMembership(
  wallet: WalletState,
  monetization: MonetizationState,
  channelId: string,
  price: number,
  channelName: string,
): PurchaseResult {
  if (monetization.subscribedChannelIds.includes(channelId)) {
    return { wallet, monetization, ok: false, error: 'already' }
  }
  const nextWallet = debitPurchase(wallet, price, `Subscribe: ${channelName}`)
  if (!nextWallet) {
    return { wallet, monetization, ok: false, error: 'insufficient' }
  }
  const nextMon = subscribeChannel(monetization, channelId)
  let withBadge = maybeMemberBadge(nextWallet)
  let studio = loadStudioState()
  if (studio.channelId === channelId) {
    studio = appendStudioEarning(studio, {
      amount: price,
      label: `Membership — ${channelName}`,
      kind: 'membership',
    })
  }
  return { wallet: withBadge, monetization: nextMon, ok: true }
}

export { loadMonetizationState, saveMonetizationState }
