import { Navigate, Route, Routes } from 'react-router-dom'
import { TopNav } from './components/TopNav'
import { FoundingFanPage } from './pages/FoundingFanPage'
import { HomePage } from './pages/HomePage'
import { LibraryPage } from './pages/LibraryPage'
import { SearchPage } from './pages/SearchPage'
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
          <Route path="/search" element={<SearchPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/saved" element={<Navigate to="/library" replace />} />
          <Route path="/founding-fan" element={<FoundingFanPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/watch/:id" element={<WatchPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
