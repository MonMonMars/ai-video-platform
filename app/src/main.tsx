import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LibraryProvider } from './context/LibraryContext'
import { WalletProvider } from './context/WalletContext'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <WalletProvider>
        <LibraryProvider>
          <App />
        </LibraryProvider>
      </WalletProvider>
    </BrowserRouter>
  </StrictMode>,
)
