import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/Hero'
import AuthPage from './pages/AuthPage'
import {Routes, Route} from 'react-router-dom'
import './styles/globals.css'

function App() {
  return (
    <>
      <Navbar/>
      <Routes>
      <Route path="/" element={<Hero/>}/>
      <Route path="/auth" element={<AuthPage/>}/>
      <Route path="/buy" element={<h1>Buy Page</h1>}/>
      <Route path="/sell" element={<h1>Sell Page</h1>}/>
      <Route path="/explore" element={<h1>Explore Page</h1>}/>
      <Route path="/drops" element={<h1>Drops Page</h1>}/>
      <Route path="/about" element={<h1>About Page</h1>}/>
      </Routes>
      <Footer/>
    </>
  )
}

export default App
