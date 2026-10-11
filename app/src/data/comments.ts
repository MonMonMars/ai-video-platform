import type { ChannelComment } from '../types/catalog'

const COMMENTS_BY_TITLE: Record<string, ChannelComment[]> = {
  'paper-hearts': [
    { id: '1', author: 'maya_reads', body: 'The letter folding scene destroyed me.', isMember: true },
    { id: '2', author: 'archive_fan', body: 'Need E6 immediately.' },
    { id: '3', author: 'monmon_mod', body: 'Members get the director cut next week.', isMember: true },
  ],
  'market-midnight': [
    { id: '1', author: 'streetbite', body: 'Hologram judges are too real.', isMember: true },
    { id: '2', author: 'late_snack', body: 'Preview hooked me — unlocking tonight.' },
  ],
  'quiet-frequency': [
    { id: '1', author: 'static_ghost', body: 'That last call… chills.', isMember: true },
    { id: '2', author: 'radiohead99', body: 'Echo Vault never misses.' },
  ],
  'neon-orbit': [
    { id: '1', author: 'ringrunner', body: 'Solar flare sequence is insane.' },
    { id: '2', author: 'lumen_crew', body: 'Members saw the alt ending in studio drops.', isMember: true },
  ],
}

const DEFAULT_COMMENTS: ChannelComment[] = [
  { id: '1', author: 'viewer_demo', body: 'Loving the demo platform vibe.' },
  { id: '2', author: 'creator_fan', body: 'Subscribe for the full drop — worth it.', isMember: true },
]

export function getCommentsForTitle(titleId: string): ChannelComment[] {
  return COMMENTS_BY_TITLE[titleId] ?? DEFAULT_COMMENTS
}
