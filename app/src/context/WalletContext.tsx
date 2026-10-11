import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { MonetizationState, StudioState, TopUpPack, VideoTitle } from '../types/catalog'
import {
  getStudioPricing,
  loadMonetizationState,
  loadStudioState,
  setStudioMembershipPrice,
  updateStudioEpisode,
} from '../lib/monetizationStorage'
import {
  joinFoundingFan,
  loadWalletState,
  purchaseChannelMembership,
  purchaseEpisodeUnlock,
  purchaseSeriesUnlock,
  tipCreator,
  topUpWallet,
  type WalletState,
} from '../lib/walletStorage'
interface WalletContextValue extends WalletState {
  monetization: MonetizationState
  studio: StudioState
  joinCampaign: () => void
  tip: (amount: number, creator: string) => void
  topUp: (pack: TopUpPack) => void
  buyEpisode: (title: VideoTitle) => { ok: boolean; error?: string }
  buySeries: (title: VideoTitle) => { ok: boolean; error?: string }
  subscribeToChannel: (
    channelId: string,
    channelName: string,
    price: number,
  ) => { ok: boolean; error?: string }
  refresh: () => void
  saveEpisodeStudio: (
    titleId: string,
    patch: { episodePrice?: number; seriesBundlePrice?: number; published?: boolean },
  ) => void
  setMembershipPrice: (price: number) => void
}

const WalletContext = createContext<WalletContextValue | null>(null)

function mapPurchaseError(error?: 'insufficient' | 'already'): string | undefined {
  if (error === 'insufficient') return 'Insufficient wallet balance — top up or join Founding Fan.'
  if (error === 'already') return 'Already unlocked.'
  return undefined
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(() => loadWalletState())
  const [monetization, setMonetization] = useState<MonetizationState>(() => loadMonetizationState())
  const [studio, setStudio] = useState<StudioState>(() => loadStudioState())

  const refresh = useCallback(() => {
    setState(loadWalletState())
    setMonetization(loadMonetizationState())
    setStudio(loadStudioState())
  }, [])

  const joinCampaign = useCallback(() => {
    setState((prev) => joinFoundingFan(prev))
  }, [])

  const tip = useCallback((amount: number, creator: string) => {
    setState((prev) => tipCreator(prev, amount, creator))
    setStudio(loadStudioState())
  }, [])

  const topUp = useCallback((pack: TopUpPack) => {
    setState((prev) => topUpWallet(prev, pack))
  }, [])

  const buyEpisode = useCallback(
    (title: VideoTitle) => {
      const prices = getStudioPricing(title, studio)
      const result = purchaseEpisodeUnlock(
        state,
        monetization,
        title.id,
        prices.episodePrice,
        `Unlock episode: ${title.name}`,
        title.channelId,
      )
      if (result.ok) {
        setState(result.wallet)
        setMonetization(result.monetization)
        setStudio(loadStudioState())
      }
      return { ok: result.ok, error: mapPurchaseError(result.error) }
    },
    [state, monetization, studio],
  )

  const buySeries = useCallback(
    (title: VideoTitle) => {
      if (!title.seriesId) return { ok: false, error: 'No series bundle for this title.' }
      const prices = getStudioPricing(title, studio)
      const result = purchaseSeriesUnlock(
        state,
        monetization,
        title.seriesId,
        prices.seriesBundlePrice,
        `Series bundle: ${title.seriesId}`,
        title.channelId,
      )
      if (result.ok) {
        setState(result.wallet)
        setMonetization(result.monetization)
        setStudio(loadStudioState())
      }
      return { ok: result.ok, error: mapPurchaseError(result.error) }
    },
    [state, monetization, studio],
  )

  const subscribeToChannel = useCallback(
    (channelId: string, channelName: string, price: number) => {
      const result = purchaseChannelMembership(state, monetization, channelId, price, channelName)
      if (result.ok) {
        setState(result.wallet)
        setMonetization(result.monetization)
        setStudio(loadStudioState())
      }
      return { ok: result.ok, error: mapPurchaseError(result.error) }
    },
    [state, monetization],
  )

  const saveEpisodeStudio = useCallback(
    (
      titleId: string,
      patch: { episodePrice?: number; seriesBundlePrice?: number; published?: boolean },
    ) => {
      setStudio((prev) => {
        const next = updateStudioEpisode(prev, titleId, patch)
        return next
      })
    },
    [],
  )

  const setMembershipPrice = useCallback((price: number) => {
    setStudio((prev) => setStudioMembershipPrice(prev, price))
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      monetization,
      studio,
      joinCampaign,
      tip,
      topUp,
      buyEpisode,
      buySeries,
      subscribeToChannel,
      refresh,
      saveEpisodeStudio,
      setMembershipPrice,
    }),
    [
      state,
      monetization,
      studio,
      joinCampaign,
      tip,
      topUp,
      buyEpisode,
      buySeries,
      subscribeToChannel,
      refresh,
      saveEpisodeStudio,
      setMembershipPrice,
    ],
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
