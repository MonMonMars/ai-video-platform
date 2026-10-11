import { useState } from 'react'
import packageJson from '../../package.json'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useSettings } from '../context/SettingsContext'
import type { ThemePreference } from '../lib/settingsStorage'
import {
  clearSavedLibrary,
  clearWatchHistory,
  getSavedLibraryCount,
  getWatchHistoryCount,
} from '../lib/viewingDataStorage'
import styles from './SettingsPage.module.css'

type PendingConfirm =
  | { kind: 'kid-off' }
  | { kind: 'clear-history' }
  | { kind: 'clear-library' }
  | null

const themeOptions: ThemePreference[] = ['dark', 'light', 'system']

function themeLabel(theme: ThemePreference): string {
  if (theme === 'system') return 'System'
  return theme.charAt(0).toUpperCase() + theme.slice(1)
}

export function SettingsPage() {
  const { settings, setTheme, setAutoplay, setKidMode } = useSettings()
  const [pending, setPending] = useState<PendingConfirm>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [storageRevision, setStorageRevision] = useState(0)

  void storageRevision
  const historyCount = getWatchHistoryCount()
  const savedCount = getSavedLibraryCount()

  const onKidToggle = () => {
    if (settings.kidMode) {
      setPending({ kind: 'kid-off' })
      return
    }
    setKidMode(true)
    setFeedback('Kid Mode is on — mature titles and membership prompts are hidden.')
  }

  const resolvePending = () => {
    if (!pending) return
    if (pending.kind === 'kid-off') {
      setKidMode(false)
      setFeedback('Kid Mode is off. Mature catalog titles are visible again.')
    }
    if (pending.kind === 'clear-history') {
      clearWatchHistory()
      setFeedback('Watch history cleared on this device.')
    }
    if (pending.kind === 'clear-library') {
      clearSavedLibrary()
      setFeedback('Saved Watch Later and Liked lists cleared.')
    }
    setPending(null)
    setStorageRevision((value) => value + 1)
  }

  return (
    <div className={styles.page}>
      <header>
        <h1>Settings</h1>
        <p>Demo preferences stored locally in your browser.</p>
      </header>

      <section className={styles.section} aria-labelledby="account-heading">
        <h2 id="account-heading">Account</h2>
        <div className={styles.accountCard}>
          <span className={styles.accountAvatar} aria-hidden>
            {settings.account.avatarInitials}
          </span>
          <div className={styles.accountMeta}>
            <p>{settings.account.displayName}</p>
            <p className={styles.email}>{settings.account.email}</p>
          </div>
          <span className={styles.demoTag}>Demo profile</span>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="appearance-heading">
        <h2 id="appearance-heading">Appearance</h2>
        <div className={styles.row}>
          <div className={styles.rowLabel}>
            <strong>Theme</strong>
            <span>Dark, light, or match your system</span>
          </div>
          <div className={styles.segmented} role="group" aria-label="Theme">
            {themeOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={
                  settings.theme === option ? `${styles.segment} ${styles.segmentActive}` : styles.segment
                }
                aria-pressed={settings.theme === option}
                onClick={() => setTheme(option)}
              >
                {themeLabel(option)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="playback-heading">
        <h2 id="playback-heading">Playback</h2>
        <div className={styles.row}>
          <div className={styles.rowLabel}>
            <strong>Autoplay next episode</strong>
            <span>When media is wired up, start the next episode automatically</span>
          </div>
          <button
            type="button"
            className={settings.autoplay ? `${styles.toggle} ${styles.toggleOn}` : styles.toggle}
            role="switch"
            aria-checked={settings.autoplay}
            aria-label="Autoplay next episode"
            onClick={() => setAutoplay(!settings.autoplay)}
          >
            <span className={styles.knob} />
          </button>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="privacy-heading">
        <h2 id="privacy-heading">Privacy</h2>
        <div className={styles.row}>
          <div className={styles.rowLabel}>
            <strong>Kid Mode</strong>
            <span>Hide mature titles and membership prompts across the app</span>
          </div>
          <button
            type="button"
            className={settings.kidMode ? `${styles.toggle} ${styles.toggleOn}` : styles.toggle}
            role="switch"
            aria-checked={settings.kidMode}
            aria-label="Kid Mode"
            onClick={onKidToggle}
          >
            <span className={styles.knob} />
          </button>
        </div>
        <div className={styles.row}>
          <div className={styles.rowLabel}>
            <strong>Clear watch history</strong>
            <span>
              {historyCount > 0
                ? `${historyCount} recent title${historyCount === 1 ? '' : 's'} on this device`
                : 'No watch history stored yet'}
            </span>
          </div>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.actionDanger}`}
            disabled={historyCount === 0}
            onClick={() => setPending({ kind: 'clear-history' })}
          >
            Clear
          </button>
        </div>
        <div className={styles.row}>
          <div className={styles.rowLabel}>
            <strong>Clear saved library</strong>
            <span>
              {savedCount > 0
                ? `${savedCount} saved item${savedCount === 1 ? '' : 's'} (Watch Later / Liked)`
                : 'No saved lists yet'}
            </span>
          </div>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.actionDanger}`}
            disabled={savedCount === 0}
            onClick={() => setPending({ kind: 'clear-library' })}
          >
            Clear
          </button>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="about-heading">
        <h2 id="about-heading">About</h2>
        <div className={styles.row}>
          <div className={styles.rowLabel}>
            <strong>App version</strong>
            <span>Everything AI video demo</span>
          </div>
          <span className={styles.version}>v{packageJson.version}</span>
        </div>
      </section>

      {feedback ? <p className={styles.feedback}>{feedback}</p> : null}

      {pending?.kind === 'kid-off' ? (
        <ConfirmDialog
          title="Turn off Kid Mode?"
          description="Mature-rated titles and membership prompts will appear again. A parent or guardian should confirm."
          confirmLabel="Turn off"
          danger
          onConfirm={resolvePending}
          onCancel={() => setPending(null)}
        />
      ) : null}
      {pending?.kind === 'clear-history' ? (
        <ConfirmDialog
          title="Clear watch history?"
          description="This removes continue-watching progress and recent history stored in localStorage on this device."
          confirmLabel="Clear history"
          danger
          onConfirm={resolvePending}
          onCancel={() => setPending(null)}
        />
      ) : null}
      {pending?.kind === 'clear-library' ? (
        <ConfirmDialog
          title="Clear saved library?"
          description="Watch Later and Liked lists will be emptied. This cannot be undone."
          confirmLabel="Clear saved"
          danger
          onConfirm={resolvePending}
          onCancel={() => setPending(null)}
        />
      ) : null}
    </div>
  )
}
