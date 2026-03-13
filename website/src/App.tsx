import { Routes, Route } from 'react-router-dom'
import Analytics from './components/Analytics'
import Home from './pages/Home'
import Engine from './pages/Engine'
import GtmEngineers from './pages/GtmEngineers'

export default function App() {
  return (
    <>
      <Analytics />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/engine" element={<Engine />} />
        <Route path="/gtm-engineers" element={<GtmEngineers />} />
      </Routes>
    </>
  )
}
