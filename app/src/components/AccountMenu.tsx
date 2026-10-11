import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import styles from './AccountMenu.module.css'

export function AccountMenu() {
  const { settings } = useSettings()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.avatar} aria-hidden>
          {settings.account.avatarInitials}
        </span>
        <span className={styles.chevron} aria-hidden>
          ▾
        </span>
      </button>
      {open ? (
        <div className={styles.menu} role="menu">
          <p className={styles.menuHint}>{settings.account.displayName}</p>
          <Link
            to="/settings"
            className={styles.menuItem}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Settings
          </Link>
        </div>
      ) : null}
    </div>
  )
}
