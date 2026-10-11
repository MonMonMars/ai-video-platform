import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsContext'
import { WalletProvider } from './context/WalletContext'
import { loadSettings, resolveTheme } from './lib/settingsStorage'
import App from './App.tsx'
import './index.css'

document.documentElement.dataset.theme = resolveTheme(loadSettings().theme)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <WalletProvider>
          <App />
        </WalletProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>,
)
