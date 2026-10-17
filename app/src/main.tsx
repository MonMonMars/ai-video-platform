import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { FollowProvider } from './context/FollowContext'
import { WalletProvider } from './context/WalletContext'
import App from './App.tsx'
import './index.css'

const routerBasename =
  import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={routerBasename}>
      <WalletProvider>
        <FollowProvider>
          <App />
        </FollowProvider>
      </WalletProvider>
    </BrowserRouter>
  </StrictMode>,
)
