import type { CreatorChannel } from '../types/catalog'

export const CREATOR_CHANNELS: CreatorChannel[] = [
  {
    id: 'studio-lumen',
    name: 'Studio Lumen',
    handle: '@studiolumen',
    tagline: 'Ringworld sci-fi and archival futures.',
    accent: 'linear-gradient(135deg, #1e3a8a, #7c3aed)',
  },
  {
    id: 'mon-mon',
    name: 'Mon Mon',
    handle: '@monmon',
    tagline: 'Romance micro-series and late-night food docs.',
    accent: 'linear-gradient(135deg, #be185d, #fb7185)',
  },
  {
    id: 'north-frame',
    name: 'North Frame',
    handle: '@northframe',
    tagline: 'Mirror-market action and undercover thrillers.',
    accent: 'linear-gradient(135deg, #b45309, #ef4444)',
  },
  {
    id: 'field-notes-ai',
    name: 'Field Notes AI',
    handle: '@fieldnotesai',
    tagline: 'Documentaries on synthetic culture and labor.',
    accent: 'linear-gradient(135deg, #047857, #14b8a6)',
  },
  {
    id: 'kira-pixel',
    name: 'Kira Pixel',
    handle: '@kirapixel',
    tagline: 'Campus anime and cozy midnight broadcasts.',
    accent: 'linear-gradient(135deg, #4338ca, #ec4899)',
  },
  {
    id: 'echo-vault',
    name: 'Echo Vault',
    handle: '@echovault',
    tagline: 'Slow-burn thrillers and signal horror.',
    accent: 'linear-gradient(135deg, #111827, #6366f1)',
  },
]

export function getChannel(channelId: string): CreatorChannel | undefined {
  return CREATOR_CHANNELS.find((channel) => channel.id === channelId)
}
