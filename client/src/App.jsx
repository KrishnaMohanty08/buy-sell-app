import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthPage from './pages/AuthPage'
import ExplorePage from './pages/explorePage'
import SellPage from './pages/SellPage'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import './styles/globals.css'
import BuyPage from './pages/BuyPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import { UserProvider } from './context/UserContext'

const ProtectedRoute = () => {
  const token = localStorage.getItem("authToken");
  return token ? <Outlet /> : <Navigate to="/auth" />;
};

function App() {
  return (
    <UserProvider>
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/explore" element={<ExplorePage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/buy" element={<BuyPage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="/about" element={<h1>About Page</h1>} />
        </Routes>
        <Footer />
      </>
    </UserProvider>
  )
}

export default App
