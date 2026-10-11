import type { CreatorDrop } from '../types/catalog'

/** Fixed demo drop times (localStorage tracks which are “seen”). */
export const CREATOR_DROPS: CreatorDrop[] = [
  {
    id: 'drop-neon-orbit',
    channelId: 'studio-lumen',
    titleId: 'neon-orbit',
    droppedAt: '2026-10-10T18:00:00.000Z',
    headline: 'New episode · Neon Orbit S1 E3',
  },
  {
    id: 'drop-paper-hearts',
    channelId: 'mon-mon',
    titleId: 'paper-hearts',
    droppedAt: '2026-10-11T08:30:00.000Z',
    headline: 'Founding Fan drop · Paper Hearts',
  },
  {
    id: 'drop-glass-tiger',
    channelId: 'north-frame',
    titleId: 'glass-tiger',
    droppedAt: '2026-10-09T12:00:00.000Z',
    headline: 'Premiere · Glass Tiger S2 E1',
  },
  {
    id: 'drop-model-citizens',
    channelId: 'field-notes-ai',
    titleId: 'model-citizens',
    droppedAt: '2026-10-07T20:00:00.000Z',
    headline: 'Feature drop · Model Citizens',
  },
  {
    id: 'drop-starlit-dorm',
    channelId: 'kira-pixel',
    titleId: 'starlit-dorm',
    droppedAt: '2026-10-11T06:00:00.000Z',
    headline: 'New episode · Starlit Dorm S1 E8',
  },
  {
    id: 'drop-quiet-frequency',
    channelId: 'echo-vault',
    titleId: 'quiet-frequency',
    droppedAt: '2026-10-11T09:15:00.000Z',
    headline: 'Vault drop · Quiet Frequency',
  },
  {
    id: 'drop-deep-catalog',
    channelId: 'studio-lumen',
    titleId: 'deep-catalog',
    droppedAt: '2026-10-05T14:00:00.000Z',
    headline: 'Catalog deep cut · Deep Catalog',
  },
  {
    id: 'drop-market-midnight',
    channelId: 'mon-mon',
    titleId: 'market-midnight',
    droppedAt: '2026-10-08T22:00:00.000Z',
    headline: 'Doc series · Market at Midnight',
  },
]

export function getDropsForChannels(channelIds: string[]): CreatorDrop[] {
  const set = new Set(channelIds)
  return CREATOR_DROPS.filter((d) => set.has(d.channelId)).sort(
    (a, b) => Date.parse(b.droppedAt) - Date.parse(a.droppedAt),
  )
}
