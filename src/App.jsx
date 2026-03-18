import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import Gallery from './pages/Gallery'
import Login from './pages/Login'
import ResidentDashboard from './pages/resident/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'
import AdminImageManager from './pages/admin/ImageManager'
import useStore from './store/useStore'

import Footer from './components/Footer'

function App() {
  const syncNotices = useStore(state => state.syncNotices);

  React.useEffect(() => {
    const handleSync = () => syncNotices();
    
    const handleStorageChange = (e) => {
      if (e.key === '11towers_notices') {
        handleSync();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('noticesUpdated', handleSync);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('noticesUpdated', handleSync);
    };
  }, [syncNotices]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Toaster position="bottom-right" toastOptions={{ className: 'glass-card border-white/10 text-white font-bold bg-dark-bg', style: { borderRadius: '1rem', background: '#0a0a0a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/login" element={<Login />} />
            <Route path="/resident-dashboard/*" element={<ResidentDashboard />} />
            <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
            <Route path="/admin-dashboard/gallery" element={<AdminImageManager />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
