import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  joinFoundingFan,
  loadWalletState,
  tipCreator,
  type WalletState,
} from '../lib/walletStorage'

interface WalletContextValue extends WalletState {
  joinCampaign: () => void
  tip: (amount: number, creator: string) => void
  refresh: () => void
}

const WalletContext = createContext<WalletContextValue | null>(null)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(() => loadWalletState())

  const refresh = useCallback(() => {
    setState(loadWalletState())
  }, [])

  const joinCampaign = useCallback(() => {
    setState((prev) => joinFoundingFan(prev))
  }, [])

  const tip = useCallback((amount: number, creator: string) => {
    setState((prev) => tipCreator(prev, amount, creator))
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      joinCampaign,
      tip,
      refresh,
    }),
    [state, joinCampaign, tip, refresh],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext)
  if (!ctx) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return ctx
}
