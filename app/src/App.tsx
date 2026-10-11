import { Navigate, Route, Routes } from 'react-router-dom'
import { TopNav } from './components/TopNav'
import { FoundingFanPage } from './pages/FoundingFanPage'
import { HomePage } from './pages/HomePage'
import { TrendingPage } from './pages/TrendingPage'
import { WalletPage } from './pages/WalletPage'
import { WatchPage } from './pages/WatchPage'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.shell}>
      <TopNav />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/founding-fan" element={<FoundingFanPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/watch/:id" element={<WatchPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
