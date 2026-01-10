import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TradeOffGraph = ({ sparsity, mode }) => {
    // Hardware State: 'cpu' | 'npu'
    const [hardware, setHardware] = useState('cpu');

    // Canvas dimensions
    const width = 500;
    const height = 280;
    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    // --- CURVE GENERATION LOGIC ---

    // ACCURACY (Independent of Hardware, roughly)
    const getAccuracy = (x) => {
        if (mode === 'unstructured') {
            // Unstructured: Accuracy stays high longer (up to 60%)
            if (x < 0.6) return 100;
            return 100 * (1 - Math.pow((x - 0.6) / 0.4, 2));
        } else {
            // Structured: Accuracy drops faster (starting at 10%)
            if (x < 0.1) return 100;
            return Math.max(0, 100 - (x - 0.1) * 120);
        }
    };

    // SPEEDUP (Dependent on Hardware & Mode)
    const getSpeedup = (x) => {
        if (mode === 'unstructured') {
            // User Correction: Unstructured rarely reduces computation actually.
            // Even on NPU, the overhead often negates gains unless sparsity is extreme.
            // Let's keep it flat to emphasize the "Hardware Unfriendliness".
            return 1;
        } else {
            // Structured: Always speeds up (matrix shrinks)
            // NPU might get better utilization from the smaller dense blocks?
            // Or just generally linear.
            const baseSpeedup = 1 / (1 - x + 0.05);
            let finalSpeedup = baseSpeedup;
            if (hardware === 'npu') {
                finalSpeedup = baseSpeedup * 1.5; // NPUs accelerate the shrunk model even better
            }
            // Cap at 10x to prevent graph overflow
            return Math.min(10, finalSpeedup);
        }
    };

    // Generate Path Data
    const generatePath = (func, scaleY) => {
        let path = `M ${padding} ${height - padding - (func(0) * scaleY)}`;
        for (let i = 1; i <= 100; i++) {
            const xVal = i / 100;
            const yVal = func(xVal);
            const x = padding + (i / 100) * graphWidth;
            const y = height - padding - (yVal * scaleY);
            path += ` L ${x} ${y}`;
        }
        return path;
    };

    const s = sparsity / 100;
    const currentAcc = getAccuracy(s);
    const currentSpeed = getSpeedup(s);

    const accScale = graphHeight / 100; // 0-100
    const speedScale = graphHeight / 10; // 0-10x

    return (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-xl max-w-xl mx-auto mt-8 font-sans">
            <h3 className="text-gray-300 font-bold mb-2 text-center">Trade-off Simulator</h3>

            {/* Disclaimer */}
            <div className="bg-yellow-900/20 border border-yellow-700/50 p-2 rounded mb-4 text-[10px] text-yellow-200/70 text-center mx-4">
                ⚠️ <span className="font-bold">Generalization:</span> This graph illustrates theoretical trends. Real-world speedups depend heavily on memory bandwidth, cache efficiency, and specific vendor implementations (Intel/NVIDIA/Apple).
            </div>

            {/* Hardware Toggle - Only for Structured */}
            <div className={`flex justify-center gap-2 mb-6 transition-opacity duration-300 ${mode === 'unstructured' ? 'opacity-0 pointer-events-none h-0 overflow-hidden' : 'opacity-100'}`}>
                <button
                    onClick={() => setHardware('cpu')}
                    className={`px-4 py-1 text-xs font-bold rounded-full border transition-colors ${hardware === 'cpu'
                        ? 'bg-gray-700 text-white border-gray-500'
                        : 'bg-gray-900 text-gray-500 border-gray-800 hover:border-gray-600'
                        }`}
                >
                    Standard CPU/GPU
                </button>
                <button
                    onClick={() => setHardware('npu')}
                    className={`px-4 py-1 text-xs font-bold rounded-full border transition-colors ${hardware === 'npu'
                        ? 'bg-purple-900/50 text-purple-300 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                        : 'bg-gray-900 text-gray-500 border-gray-800 hover:border-gray-600'
                        }`}
                >
                    AI Accelerator (NPU)
                </button>
            </div>

            <div className="relative">
                <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                    {/* Axes */}
                    <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#4b5563" strokeWidth="2" />
                    <line x1={padding} y1={height - padding} x2={padding} y2={padding} stroke="#4b5563" strokeWidth="2" />

                    {/* Labels */}
                    <text x={width / 2} y={height - 5} fill="#9ca3af" textAnchor="middle" fontSize="12">Sparsity %</text>
                    <text x={10} y={height / 2} fill="#60a5fa" textAnchor="middle" transform={`rotate(-90, 10, ${height / 2})`} fontSize="12">Accuracy</text>
                    <text x={width - 10} y={height / 2} fill="#34d399" textAnchor="middle" transform={`rotate(90, ${width - 10}, ${height / 2})`} fontSize="12">Speedup</text>

                    {/* Accuracy Curve (Blue) */}
                    <path
                        d={generatePath(getAccuracy, accScale)}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        opacity="0.8"
                    />

                    {/* Speedup Curve (Green) */}
                    <path
                        d={generatePath(getSpeedup, speedScale)}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        opacity="0.8"
                        strokeDasharray="4 4"
                    />

                    {/* Current Position Marker */}
                    <line
                        x1={padding + s * graphWidth}
                        y1={padding}
                        x2={padding + s * graphWidth}
                        y2={height - padding}
                        stroke="white"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                        opacity="0.5"
                    />

                    {/* Dots */}
                    <circle cx={padding + s * graphWidth} cy={height - padding - currentAcc * accScale} r="6" fill="#60a5fa" stroke="white" strokeWidth="2" />
                    <circle cx={padding + s * graphWidth} cy={height - padding - currentSpeed * speedScale} r="6" fill="#10b981" stroke="white" strokeWidth="2" />

                </svg>

                {/* Floating Legend */}
                <div className="absolute top-10 right-0 bg-gray-800/90 border border-gray-600 p-3 rounded text-xs pointer-events-none">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-gray-300">Accuracy: <span className="font-bold text-white">{currentAcc.toFixed(1)}%</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 border border-dashed border-white"></div>
                        <span className="text-gray-300">Speedup: <span className="font-bold text-white">{currentSpeed.toFixed(1)}x</span></span>
                    </div>
                </div>
            </div>

            <p className="text-center text-gray-500 text-xs mt-6 italic h-8 px-8 leading-relaxed">
                {mode === 'unstructured'
                    ? "Unstructured: 0x Speedup on most hardware. Sparse matrices require Metadata (Indices) which adds overhead, often canceling out any gains."
                    : (hardware === 'cpu'
                        ? "Structured: Smaller matrices run faster on CPUs/GPUs due to reduced L1/L2 cache pressure."
                        : "Structured (NPU): High speedup. Dedicated AI hardware maximizes throughput on the compressed dense blocks.")}
            </p>
        </div>
    );
};

export default TradeOffGraph;
