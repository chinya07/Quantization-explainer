import React from 'react'
import QuantizerVisual from './components/QuantizerVisual'

function App() {
  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-12 flex flex-col items-center">
      <header className="mb-12 text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-purple-400 to-emerald-400 mb-6 tracking-tight">
          Quantization Explainer
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Interactive playground to understand how Neural Networks compress FP32 weights into INT8.
        </p>
      </header>

      <main className="w-full max-w-5xl">
        <QuantizerVisual />

        {/* Placeholder for future components */}
      </main>

      <footer className="mt-16 text-gray-600 text-sm">
        Built with React, Vite & Tailwind
      </footer>
    </div>
  )
}

export default App
