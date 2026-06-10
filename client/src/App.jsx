import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthPage from './pages/AuthPage'
import ExplorePage from './pages/ExplorePage'
import SellPage from './pages/SellPage'
import { Routes, Route, Navigate } from 'react-router-dom'
import './styles/globals.css'
import BuyPage from './pages/BuyPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import CartPage from './pages/CartPage'
import { UserProvider } from './context/UserContext'
import ProtectedRoute from './components/ProtectedRoute'
import CartDrawer from './components/cart/CartDrawer'
import ToastContainer from './components/ui/ToastContainer'
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

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

          {/* Public Routes - No Authentication Required */}
          <Route path="/buy/:id"  element={<BuyPage />}  />

          {/* Protected Routes - Require Authentication */}
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
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>}
           />
          <Route path="/orders/confirmation" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <CartDrawer />
        <ToastContainer />
        <Footer />
      </>
    </UserProvider>
  )
}

export default App
