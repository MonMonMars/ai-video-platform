import { useCallback, useEffect, useId, useState, type MouseEvent } from 'react'
import {
  buildTwitterShareUrl,
  buildWhatsAppShareUrl,
  getWatchShareUrl,
} from '../lib/shareLink'
import styles from './ShareSheet.module.css'

interface ShareSheetProps {
  titleId: string
  titleName: string
  onClose: () => void
}

export function ShareSheet({ titleId, titleName, onClose }: ShareSheetProps) {
  const headingId = useId()
  const shareUrl = getWatchShareUrl(titleId)
  const shareText = `Watch "${titleName}" on Everything AI`
  const [feedback, setFeedback] = useState('')

  const onBackdropClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) onClose()
    },
    [onClose],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setFeedback('Link copied to clipboard.')
    } catch {
      setFeedback('Could not copy — select the link from the address bar.')
    }
  }

  const nativeShare = async () => {
    if (!navigator.share) {
      setFeedback('Web Share is not available in this browser.')
      return
    }
    try {
      await navigator.share({ title: titleName, text: shareText, url: shareUrl })
      setFeedback('Shared via your device.')
      onClose()
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setFeedback('Share was cancelled or failed.')
    }
  }

  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onClick={onBackdropClick}
    >
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
      >
        <div className={styles.header}>
          <div>
            <h2 id={headingId}>Share</h2>
            <p className={styles.subtitle}>{titleName}</p>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.action} onClick={() => void copyLink()}>
            <span>
              <span className={styles.actionLabel}>Copy link</span>
              <span className={styles.actionHint}>{shareUrl}</span>
            </span>
          </button>

          {canNativeShare ? (
            <button type="button" className={styles.action} onClick={() => void nativeShare()}>
              <span>
                <span className={styles.actionLabel}>Share…</span>
                <span className={styles.actionHint}>Native share sheet (Web Share API)</span>
              </span>
            </button>
          ) : null}

          <a
            className={styles.action}
            href={buildTwitterShareUrl(shareUrl, shareText)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>
              <span className={styles.actionLabel}>Post on X</span>
              <span className={styles.actionHint}>Opens intent link (demo)</span>
            </span>
          </a>

          <a
            className={styles.action}
            href={buildWhatsAppShareUrl(shareUrl, shareText)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>
              <span className={styles.actionLabel}>WhatsApp</span>
              <span className={styles.actionHint}>Opens chat with prefilled text (demo)</span>
            </span>
          </a>
        </div>

        <p className={styles.feedback} role="status">
          {feedback}
        </p>
        <p className={styles.demoNote}>
          Social buttons use public intent URLs only — no OAuth or posting on your behalf.
        </p>
      </div>
    </div>
  )
}
