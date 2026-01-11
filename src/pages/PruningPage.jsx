import React, { useState } from 'react';
import MatrixVisual from '../components/pruning/MatrixVisual';
import GraphVisual from '../components/pruning/GraphVisual';
import TradeOffGraph from '../components/pruning/TradeOffGraph';

const PruningPage = () => {
    const [sparsity, setSparsity] = useState(0);
    const [mode, setMode] = useState('unstructured'); // 'unstructured' | 'structured'

    return (
        <div className="flex flex-col items-center w-full min-h-[60vh] text-center">
            <header className="mb-8 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 mb-6 tracking-tight">
                    Pruning Visualizer
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed mb-4">
                    Pruning removes redundant connections.
                    {mode === 'unstructured' ? (
                        <span> <span className="text-pink-400 font-bold">Unstructured Pruning</span> deletes individual weights.</span>
                    ) : (
                        <span> <span className="text-blue-400 font-bold">Structured Pruning</span> deletes entire neurons/channels.</span>
                    )}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl items-start">

                {/* Left Column: Controls & Trade-off */}
                <div className="flex flex-col gap-6">
                    <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl text-left">

                        {/* Mode Toggle */}
                        <div className="flex bg-gray-800 p-1 rounded-lg mb-8">
                            <button
                                onClick={() => setMode('unstructured')}
                                className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${mode === 'unstructured' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Unstructured
                            </button>
                            <button
                                onClick={() => setMode('structured')}
                                className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${mode === 'structured' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Structured
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-wide">
                                Target Sparsity: <span className="text-orange-400 text-xl ml-2">{sparsity}%</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="99"
                                step="1"
                                value={sparsity}
                                onChange={(e) => setSparsity(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                                <span>0% (Dense)</span>
                                <span>99% (Sparse)</span>
                            </div>
                        </div>
                    </div>

                    <TradeOffGraph sparsity={sparsity} mode={mode} />
                </div>

                {/* Right Column: Visualizer */}
                <div>
                    {mode === 'unstructured' ? (
                        <MatrixVisual sparsity={sparsity} />
                    ) : (
                        <GraphVisual sparsity={sparsity} isStructured={true} />
                    )}

                    <div className="mt-8 bg-gray-900/50 border border-gray-800 p-4 rounded-lg text-sm text-gray-400 text-left">
                        <h4 className="font-bold text-gray-300 mb-2">Key Difference:</h4>
                        {mode === 'unstructured' ? (
                            <p>Unstructured pruning creates <span className="text-pink-400">Sparse Matrices</span>. This is theoretically efficient but requires specialized hardware to skip the zeroes during calculation.</p>
                        ) : (
                            <p>Structured pruning creates <span className="text-blue-400">Smaller Matrices</span>. By removing entire rows/columns (Neurons), the model shrinks physically and runs faster on standard hardware.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PruningPage;
