export function getWatchShareUrl(titleId: string): string {
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://example.com'
  return `${origin}/watch/${titleId}`
}

export function buildTwitterShareUrl(shareUrl: string, text: string): string {
  const params = new URLSearchParams({
    url: shareUrl,
    text,
  })
  return `https://twitter.com/intent/tweet?${params.toString()}`
}

export function buildWhatsAppShareUrl(shareUrl: string, text: string): string {
  const params = new URLSearchParams({
    text: `${text} ${shareUrl}`,
  })
  return `https://wa.me/?${params.toString()}`
}
