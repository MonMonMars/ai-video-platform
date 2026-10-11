import { useState, type MouseEvent } from 'react'
import { ShareSheet } from './ShareSheet'
import styles from './ShareButton.module.css'

interface ShareButtonProps {
  titleId: string
  titleName: string
  variant?: 'default' | 'icon'
  className?: string
  onClickCapture?: (event: MouseEvent<HTMLButtonElement>) => void
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ShareButton({
  titleId,
  titleName,
  variant = 'default',
  className,
  onClickCapture,
}: ShareButtonProps) {
  const [open, setOpen] = useState(false)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    onClickCapture?.(event)
    setOpen(true)
  }

  const isIcon = variant === 'icon'

  return (
    <>
      <button
        type="button"
        className={`${styles.button} ${isIcon ? styles.iconOnly : ''} ${className ?? ''}`}
        onClick={handleClick}
        aria-label={`Share ${titleName}`}
      >
        {isIcon ? <ShareIcon /> : 'Share'}
      </button>
      {open ? (
        <ShareSheet titleId={titleId} titleName={titleName} onClose={() => setOpen(false)} />
      ) : null}
    </>
  )
}
