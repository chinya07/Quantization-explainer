import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import QuantizationPage from './pages/QuantizationPage'
import PruningPage from './pages/PruningPage'
import DistillationPage from './pages/DistillationPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<QuantizationPage />} />
          <Route path="/pruning" element={<PruningPage />} />
          <Route path="/distillation" element={<DistillationPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
