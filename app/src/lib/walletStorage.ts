import type { FoundingBadgeId, WalletEntry } from '../types/catalog'

const WALLET_KEY = 'everything-ai.wallet.v1'
const BADGES_KEY = 'everything-ai.badges.v1'
const FOUNDING_KEY = 'everything-ai.foundingFan.v1'

export interface WalletState {
  balance: number
  ledger: WalletEntry[]
  badgeIds: FoundingBadgeId[]
  isFoundingFan: boolean
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
  return next
}
