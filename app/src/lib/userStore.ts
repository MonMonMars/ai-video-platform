import type { AuthorBadgeFlags } from '../types/catalog'
import { loadWalletState } from './walletStorage'

const PROFILE_KEY = 'everything-ai.profile.v1'

export interface ViewerProfile {
  displayName: string
}

export type { AuthorBadgeFlags }

function readProfile(): ViewerProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return { displayName: 'You' }
    const parsed = JSON.parse(raw) as ViewerProfile
    if (!parsed.displayName?.trim()) return { displayName: 'You' }
    return parsed
  } catch {
    return { displayName: 'You' }
  }
}

export function saveViewerDisplayName(displayName: string): void {
  const trimmed = displayName.trim() || 'You'
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ displayName: trimmed }))
}

export function getViewerProfile(): ViewerProfile {
  return readProfile()
}

/** Badge flags for the signed-in viewer when posting comments. */
export function getViewerBadgeFlags(): AuthorBadgeFlags {
  const wallet = loadWalletState()
  return {
    isMember: wallet.isMember,
    isFoundingFan: wallet.isFoundingFan,
  }
}
