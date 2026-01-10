import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const LogitTemperatureVisualizer = () => {
    const [temperature, setTemperature] = useState(1);

    // Default Logits for a "Golden Retriever" image
    const classes = [
        { label: 'Golden Retriever', score: 10, color: '#fbbf24' }, // Gold
        { label: 'Tennis Ball', score: 6, color: '#a3e635' },       // Green-ish
        { label: 'Tabby Cat', score: 2, color: '#fca5a5' },         // Pink
        { label: 'Sports Car', score: -5, color: '#60a5fa' }        // Blue
    ];

    // Softmax with Temperature Calculation
    const probabilities = useMemo(() => {
        const expValues = classes.map(c => Math.exp(c.score / temperature));
        const sumExp = expValues.reduce((a, b) => a + b, 0);
        return expValues.map(v => (v / sumExp) * 100); // Percentage
    }, [temperature]);

    return (
        <div className="w-full max-w-4xl mx-auto p-8 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl font-sans text-gray-300">
            <h2 className="text-2xl font-bold text-center mb-2 text-white">The "Temperature" Lab 🌡️</h2>
            <p className="text-center text-gray-400 mb-8 max-w-lg mx-auto">
                Discover the hidden "Dark Knowledge" by melting the probability distribution.
            </p>

            {/* --- CONTROLS --- */}
            <div className="flex flex-col items-center gap-4 mb-12">
                <div className="flex items-center gap-4 w-full max-w-md">
                    <span className="font-mono font-bold text-blue-400">T = 1</span>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                    />
                    <span className="font-mono font-bold text-red-500">T = 20</span>
                </div>
                <div className="text-xl font-bold text-white bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                    Temperature (T): <span className="text-yellow-400">{temperature.toFixed(1)}</span>
                </div>
            </div>

            {/* --- VISUALIZATION --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* LEFT: Raw Logits (Teacher's Brain) */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-sm uppercase tracking-widest text-gray-500 font-bold border-b border-gray-700 pb-2 mb-2">
                        Step 1: Raw Scores ("Logits")
                    </h3>
                    {classes.map((c, i) => (
                        <div key={i} className="flex items-center gap-4 opacity-80">
                            <span className="w-32 text-right font-mono text-sm">{c.label}</span>
                            <div className="flex-1 bg-gray-800 h-8 rounded relative overflow-hidden">
                                {/* Visualize Score Magnitude */}
                                <div
                                    className="absolute left-0 top-0 bottom-0 bg-gray-600 opacity-30"
                                    style={{ width: `${Math.max(0, (c.score + 10) / 25 * 100)}%` }} // Normalized roughly
                                ></div>
                                <span className="absolute inset-0 flex items-center justify-start pl-3 text-xs font-bold text-white">
                                    {c.score.toFixed(1)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* RIGHT: Probabilities (Softmax Output) */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-sm uppercase tracking-widest text-gray-500 font-bold border-b border-gray-700 pb-2 mb-2 flex justify-between">
                        <span>Step 2: Probabilities (Softmax)</span>
                        {temperature > 1.5 && <span className="text-yellow-400 animate-pulse">Dark Knowledge Revealed!</span>}
                    </h3>
                    {classes.map((c, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <span className="w-32 text-right font-bold text-sm text-white">{probabilities[i].toFixed(1)}%</span>
                            <div className="flex-1 bg-gray-800 h-8 rounded relative overflow-hidden ring-1 ring-white/10">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${probabilities[i]}%` }}
                                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                                    className="absolute left-0 top-0 bottom-0"
                                    style={{ backgroundColor: c.color }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- INSIGHT BOX --- */}
            <div className="mt-12 p-6 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                <h4 className="flex items-center gap-2 text-blue-300 font-bold mb-2">
                    <span className="text-xl">💡</span>
                    {temperature < 2 ? "Hard Targets (Standard)" : "Soft Targets (Distillation)"}
                </h4>
                <p className="text-blue-100/80 leading-relaxed">
                    {temperature < 2
                        ? "At low temperature, the model says: 'I am 98% sure it is a Dog'. The relationship between 'Tennis Ball' and 'Cat' is crushed to nearly zero. The Student learns nothing about the similarities."
                        : `At T=${temperature}, the "Dark Knowledge" emerges! The model admits: "Okay, it's mostly a Dog (${probabilities[0].toFixed(0)}%), but it also looks a little like a Tennis Ball (${probabilities[1].toFixed(0)}%) because they are both round/fuzzy." The Student learns this nuance!`}
                </p>
            </div>

        </div>
    );
};

export default LogitTemperatureVisualizer;
