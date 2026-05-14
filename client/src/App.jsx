import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthPage from './pages/AuthPage'
import ExplorePage from './pages/explorePage'
import SellPage from './pages/SellPage'
import { Routes, Route, Navigate } from 'react-router-dom'
import './styles/globals.css'
import BuyPage from './pages/BuyPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import { UserProvider } from './context/UserContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <UserProvider>
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/about" element={<h1>About Page</h1>} />

          {/* Protected Routes - Require Authentication */}
          <Route
            path="/buy"
            element={
              <ProtectedRoute>
                <BuyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sell"
            element={
              <ProtectedRoute>
                <SellPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <div className="page-placeholder">Cart Page (Coming Soon)</div>
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </>
    </UserProvider>
  )
}

export default App
