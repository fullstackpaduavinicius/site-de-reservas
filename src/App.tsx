import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Reserve from './pages/Reserve'
import Nature from './pages/Nature'
import Portfolio from './pages/Portfolio'
import Contact from './pages/Contact'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsappButton from './components/WhatsappButton'
import InstagramButton from './components/InstagramButton'

export default function App(): JSX.Element {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/reserva" element={<Reserve />} />
        <Route path="/natureza" element={<Nature />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contato" element={<Contact />} />
      </Routes>
      <WhatsappButton />
      <InstagramButton />
      <Footer />
    </Router>
  )
}