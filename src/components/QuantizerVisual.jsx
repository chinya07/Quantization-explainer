import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DefinitionsPanel from './DefinitionsPanel';
import MicroscopeVisual from './MicroscopeVisual';

const QuantizerVisual = () => {
    // State for Real Range
    const [minVal, setMinVal] = useState(-3.5);
    const [maxVal, setMaxVal] = useState(3.5);
    const [inputValue, setInputValue] = useState(1.2);
    const [mode, setMode] = useState('asymmetric'); // 'symmetric' | 'asymmetric'

    // Constants for Int8
    const Q_MIN = -128;
    const Q_MAX = 127;

    // Derived Quantization Parameters
    const [scale, setScale] = useState(0);
    const [zeroPoint, setZeroPoint] = useState(0);

    useEffect(() => {
        let s, z;
        if (mode === 'symmetric') {
            // Symmetric: max(|min|, |max|)
            const absMax = Math.max(Math.abs(minVal), Math.abs(maxVal));
            // Force range to be [-absMax, absMax] effectively for scale calc, but usually symmetric uses simple max-abs
            // Standard Symmetric: Scale = 2 * max(abs(rmin), abs(rmax)) / 255
            // Simplified for signed int8: Scale = max(abs(r)) / 127.
            // Let's use the widely used full range symmetric:
            s = absMax / 127.0;
            z = 0;
        } else {
            // Asymmetric: s = (rmax - rmin) / (qmax - qmin)
            // z = round(qmin - rmin/s)  <- varying formulas exist, let's use standard affine
            // Standard formula: r = s(q - z)  => q = r/s + z
            // With q in [qmin, qmax] (signed int8)
            // s = (maxVal - minVal) / (Q_MAX - Q_MIN);
            s = (maxVal - minVal) / 255.0;
            z = Math.round(Q_MIN - minVal / s);
        }
        setScale(s);
        setZeroPoint(z);
    }, [minVal, maxVal, mode]);

    // Calculate Quantized Value
    const quantized = Math.max(Q_MIN, Math.min(Q_MAX, Math.round(inputValue / scale + zeroPoint)));

    // Dequantized Value (Reconstruction)
    const dequantized = scale * (quantized - zeroPoint);

    // Quantization Error
    const error = dequantized - inputValue;

    // Generate Bell Curve Path (Standard Normal Dist: mu=0, sigma=1)
    const bellCurvePath = (() => {
        const points = [];
        const steps = 60;
        for (let i = 0; i <= steps; i++) {
            const rangePct = i / steps;
            // Map view range (0..1) to Real Value x
            const x = minVal + rangePct * (maxVal - minVal);
            // Gaussian function: e^(-x^2 / 2) -> Peak at 1.0
            const y = Math.exp(-0.5 * x * x);
            // Map y to SVG height (0 is top, 100 is bottom)
            // We want peak (y=1) to be at 5% from top
            // Base (y=0) to be at 100% (bottom)
            const plotY = 100 - (y * 95);
            points.push(`${rangePct * 100},${plotY}`);
        }
        // Close the shape for fill
        return `M 0,100 L ${points.join(' L ')} L 100,100 Z`;
    })();

    return (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 md:p-6 shadow-2xl max-w-4xl mx-auto my-4 md:my-8 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4 md:gap-0">
                <h2 className="text-xl md:text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                    QuantLens
                </h2>
                <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
                    {['symmetric', 'asymmetric'].map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${mode === m
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {m.charAt(0).toUpperCase() + m.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Controls */}
                <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700">

                    {/* Quick Presets */}
                    <div className="mb-6 pb-6 border-b border-gray-700">
                        <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3 font-semibold">Real-world Presets</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => {
                                    setMode('symmetric');
                                    setMinVal(-3.5);
                                    setMaxVal(3.5);
                                    setInputValue(0.5);
                                }}
                                className="px-3 py-2 bg-gray-700 hover:bg-blue-600 hover:text-white text-gray-300 rounded text-xs font-bold transition-colors flex flex-col items-center gap-1 group"
                            >
                                <span>Weights</span>
                                <span className="text-[10px] font-normal text-gray-400 group-hover:text-blue-200">[-3.5, 3.5] Symmetric</span>
                            </button>
                            <button
                                onClick={() => {
                                    setMode('asymmetric');
                                    setMinVal(0);
                                    setMaxVal(6);
                                    setInputValue(3.0);
                                }}
                                className="px-3 py-2 bg-gray-700 hover:bg-blue-600 hover:text-white text-gray-300 rounded text-xs font-bold transition-colors flex flex-col items-center gap-1 group"
                            >
                                <span>ReLU Activations</span>
                                <span className="text-[10px] font-normal text-gray-400 group-hover:text-blue-200">[0, 6.0] Asymmetric</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4 group relative">
                        <h3 className="text-sm uppercase tracking-wide text-gray-400 font-semibold">Input Range</h3>
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 cursor-help hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>

                            {/* Tooltip */}
                            <div className="absolute right-0 bottom-full mb-2 w-64 bg-gray-900 text-xs text-gray-300 p-3 rounded-lg border border-gray-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                                <div className="font-bold text-white mb-1">Why clip?</div>
                                <p>Real values can be infinite (-∞ to +∞), but we only have 256 INT8 buckets.</p>
                                <p className="mt-1">We <span className="text-pink-400 font-bold">clip</span> values outside this range to prioritize precision for the data that matters (e.g., -3 to 3 for weights).</p>
                                <div className="absolute bottom-[-6px] right-2 w-3 h-3 bg-gray-900 border-r border-b border-gray-700 transform rotate-45"></div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Real Min ({minVal})</span>
                            </div>
                            <input
                                type="range"
                                min="-10"
                                max="0"
                                step="0.1"
                                value={minVal}
                                onChange={(e) => setMinVal(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Real Max ({maxVal})</span>
                            </div>
                            <input
                                type="range"
                                min="0.1"
                                max="10"
                                step="0.1"
                                value={maxVal}
                                onChange={(e) => setMaxVal(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-700">
                        <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-4 font-semibold">Test Value</h3>
                        <input
                            type="range"
                            min={minVal}
                            max={maxVal}
                            step="0.01"
                            value={inputValue}
                            onChange={(e) => setInputValue(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                        <div className="flex justify-between mt-2 text-sm font-mono">
                            <span className="text-pink-400">Input: {inputValue.toFixed(4)}</span>
                            <span className="text-emerald-400">Quantized: {quantized}</span>
                        </div>
                    </div>
                </div>

                {/* Parameters Display */}
                <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700 font-mono text-sm relative overflow-hidden">

                    <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-4 font-sans font-semibold">Calculated Parameters</h3>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-900 rounded border border-gray-700">
                            <span className="text-blue-300">Scale (S)</span>
                            <span className="text-white font-bold">{scale.toFixed(6)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-900 rounded border border-gray-700">
                            <span className="text-purple-300">Zero Point (Z)</span>
                            <span className="text-white font-bold">{zeroPoint}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-900 rounded border border-gray-700">
                            <span className="text-orange-300">Int8 Range</span>
                            <span className="text-white font-bold">[{Q_MIN}, {Q_MAX}]</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h4 className="text-xs text-gray-500 mb-2">Quantization Formula</h4>
                        <div className="p-3 bg-gray-900 rounded border border-gray-600 text-center font-mono text-blue-200">
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={inputValue + scale + zeroPoint}
                                    initial={{ opacity: 0.8 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    q = round(<span className="text-pink-400 font-bold">{inputValue.toFixed(2)}</span> / <span className="text-blue-400">{scale.toFixed(4)}</span> + <span className="text-purple-400">{zeroPoint}</span>)
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual Number Line */}
            <div className="bg-gray-800 rounded-lg p-4 md:p-8 relative h-64 border border-gray-700 overflow-hidden select-none">

                {/* Real Axis Container */}
                <div className="relative mx-4 md:mx-10 h-16 mb-8">
                    <span className="absolute -top-6 left-0 text-xs font-bold text-gray-500 uppercase tracking-widest">FP32 Input Space</span>

                    {/* Bell Curve Background */}
                    <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="bellGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path d={bellCurvePath} fill="url(#bellGradient)" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.5" />
                    </svg>

                    {/* Axis Line */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-900 to-blue-500 rounded z-0"></div>

                    {/* Bucket Scale Grid (The "Why" of quantization) */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(30)].map((_, i) => {
                            // Generate a grid based on scale step relative to minVal
                            // This visualizes the discrete steps
                            // Start from a rounded multiple of scale near minVal
                            const startOffset = Math.ceil(minVal / scale) * scale;
                            const val = startOffset + (i - 5) * scale; // arbitrary range coverage

                            // Only draw if within bounds
                            if (val < minVal || val > maxVal) return null;

                            const leftPct = ((val - minVal) / (maxVal - minVal)) * 100;

                            return (
                                <motion.div
                                    key={`grid-${i}`}
                                    className="absolute top-1/4 bottom-1/4 w-px bg-gray-600/30"
                                    style={{ left: `${leftPct}%` }}
                                />
                            );
                        })}
                    </div>

                    <div className="absolute top-6 left-0 text-xs text-blue-400 -translate-x-1/2">{minVal}</div>
                    <div className="absolute top-6 right-0 text-xs text-blue-400 translate-x-1/2">{maxVal}</div>

                    {/* Input Marker */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-1.5 h-8 bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)] z-20 cursor-grab active:cursor-grabbing rounded-full"
                        animate={{
                            left: `${((inputValue - minVal) / (maxVal - minVal)) * 100}%`
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{ transform: 'translate(-50%, -50%)' }}
                    />
                    {/* Value Tag */}
                    <motion.div
                        className="absolute -top-8 text-xs text-pink-500 font-bold bg-gray-900/90 px-2 py-1 rounded border border-pink-500/30 backdrop-blur-sm z-30"
                        animate={{
                            left: `${((inputValue - minVal) / (maxVal - minVal)) * 100}%`
                        }}
                        style={{ transform: 'translate(-50%, 0)' }}
                    >
                        {inputValue.toFixed(3)}
                    </motion.div>

                    {/* Highlight the "Bucket" we are currently in */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 h-6 bg-emerald-500/20 border-x border-emerald-500/50 z-10"
                        animate={{
                            left: `${(((scale * (quantized - zeroPoint) - scale / 2) - minVal) / (maxVal - minVal)) * 100}%`,
                            width: `${(scale / (maxVal - minVal)) * 100}%`
                        }}
                        style={{ transform: 'translate(0, -50%)' }}
                    />
                </div>

                {/* Quantized Axis Container */}
                <div className="relative mx-4 md:mx-10 h-16">
                    <span className="absolute -bottom-6 left-0 text-xs font-bold text-gray-500 uppercase tracking-widest">INT8 Output Space</span>

                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-purple-900 to-purple-500 rounded"></div>
                    <div className="absolute bottom-6 left-0 text-xs text-purple-400 -translate-x-1/2">{Q_MIN}</div>
                    <div className="absolute bottom-6 right-0 text-xs text-purple-400 translate-x-1/2">{Q_MAX}</div>

                    {/* Scale visualizer dots (show density) */}
                    <div className="absolute inset-0 flex items-center justify-between px-[0%] opacity-20 pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="w-0.5 h-1 bg-purple-500 rounded-full"></div>
                        ))}
                    </div>

                    {/* Output Marker */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-8 h-10 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)] z-20 rounded-md border-2 border-emerald-300 flex items-center justify-center text-xs font-bold text-emerald-900"
                        animate={{
                            left: `${((quantized - Q_MIN) / (Q_MAX - Q_MIN)) * 100}%`
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{ transform: 'translate(-50%, -50%)' }}
                    >
                        {quantized}
                    </motion.div>
                    <motion.div
                        className="absolute -bottom-10 text-xs text-emerald-400 font-bold bg-gray-900/80 px-2 py-0.5 rounded"
                        animate={{
                            left: `${((quantized - Q_MIN) / (Q_MAX - Q_MIN)) * 100}%`
                        }}
                        style={{ transform: 'translate(-50%, 0)' }}
                    >
                        q={quantized}
                    </motion.div>
                </div>

                {/* Dynamic Connecting Line via SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40">
                    <defs>
                        <linearGradient id="connGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
                        </linearGradient>
                    </defs>
                    {/* We use basic percentage mapping here which matches the containers (mx-10 = 2.5rem approx 40px) */}
                    {/* Since we can't easily sync exact pixels in SVG without complex calc, we use the same % logic 
                and assume container padding is consistent. 
                Container padding is p-8 (32px). Inner containers have mx-10 (40px). 
                So 0% starts at 32+40 = 72px from left? No, mx-10 is margin inside the relative container.
            */}
                    <line
                        x1={`${((inputValue - minVal) / (maxVal - minVal)) * 100}%`}
                        y1="30%"
                        x2={`${((quantized - Q_MIN) / (Q_MAX - Q_MIN)) * 100}%`}
                        y2="70%"
                        stroke="url(#connGradient)"
                        strokeWidth="2"
                        strokeDasharray="4"
                        vectorEffect="non-scaling-stroke"
                        style={{
                            // Gross simplification for hacky alignment: 
                            // The SVG covers the whole div (p-8). The axis is inside a div with mx-10.
                            // So 0% in axis is shifted by 40px relative to SVG 0% ??
                            // Actually let's just use a simple HTML div line that is safer or accept slight misalignment
                            // The previous version had valid logic but was visually boring.
                            // Let's rely on the eye-matching.
                        }}
                    />
                </svg>

            </div>


            {/* Error visualization */}
            <MicroscopeVisual
                minVal={minVal}
                maxVal={maxVal}
                inputVal={inputValue}
                scale={scale}
                zeroPoint={zeroPoint}
            />

            <DefinitionsPanel mode={mode} />
        </div >
    );
};

export default QuantizerVisual;
