import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/Hero'
import AuthPage from './pages/AuthPage'
import ExplorePage from './pages/explorePage'
import SellPage from './pages/SellPage'
import {Routes, Route} from 'react-router-dom'
import './styles/globals.css'
import BuyPage from './pages/BuyPage'

function App() {
  return (
    <>
      <Navbar/>
      <Routes>
      <Route path="/" element={<Hero/>}/>
      <Route path="/auth" element={<AuthPage/>}/>
      <Route path="/buy" element={<BuyPage/>}/>
      <Route path="/sell" element={<SellPage/>}/>
      <Route path="/explore" element={<ExplorePage/>}/>
      <Route path="/drops" element={<h1>Drops Page</h1>}/>
      <Route path="/about" element={<h1>About Page</h1>}/>
      </Routes>
      <Footer/>
    </>
  )
}

export default App
