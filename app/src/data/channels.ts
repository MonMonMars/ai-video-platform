import type { CreatorChannel } from '../types/catalog'

export const CREATOR_CHANNELS: CreatorChannel[] = [
  {
    id: 'mon-mon',
    name: 'Mon Mon',
    handle: '@monmon',
    tagline: 'Romance micro-series and late-night food docs — members get drops first.',
    membershipPrice: 9.99,
    membershipPerks: [
      'Full catalog access while subscribed',
      'Member badge on comments',
      'Weekly behind-the-scenes posts (demo)',
      '10% off series bundles',
    ],
    accent: 'linear-gradient(135deg, #be185d, #fb7185)',
  },
  {
    id: 'studio-lumen',
    name: 'Studio Lumen',
    handle: '@studiolumen',
    tagline: 'Ringworld sci-fi and archival futures.',
    membershipPrice: 12.99,
    membershipPerks: [
      'All Lumen episodes included',
      'Early premiere notifications',
      'Member-only comment threads',
    ],
    accent: 'linear-gradient(135deg, #1e3a8a, #7c3aed)',
  },
  {
    id: 'echo-vault',
    name: 'Echo Vault',
    handle: '@echovault',
    tagline: 'Slow-burn thrillers and signal horror.',
    membershipPrice: 8.99,
    membershipPerks: ['Vault membership unlocks the full thriller slate', 'Member badge', 'Bonus Q&A replays'],
    accent: 'linear-gradient(135deg, #111827, #6366f1)',
  },
]

export function getChannel(channelId: string): CreatorChannel | undefined {
  return CREATOR_CHANNELS.find((c) => c.id === channelId)
}

export function getChannelByCreatorName(creator: string): CreatorChannel | undefined {
  const slug = creator.toLowerCase().replace(/\s+/g, '-')
  return CREATOR_CHANNELS.find((c) => c.id === slug || c.name === creator)
}
