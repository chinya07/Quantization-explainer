import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const MatrixVisual = ({ sparsity, showHeatmap = true }) => {
    // 1. Generate deterministic random weights (Seed logic simulated by just constants or single random pass usually, 
    // but here we use memo to keep them stable across renders)
    const weights = useMemo(() => {
        const w = [];
        for (let i = 0; i < 100; i++) {
            // Random value between -1 and 1
            w.push(Math.random() * 2 - 1);
        }
        return w;
    }, []);

    // 2. Calculate Threshold
    // To achieve X% sparsity, we need to prune the X% smallest absolute values.
    const threshold = useMemo(() => {
        if (sparsity === 0) return 0;
        if (sparsity === 100) return Infinity;

        const absWeights = weights.map(Math.abs).sort((a, b) => a - b);
        const cutoffIndex = Math.floor((sparsity / 100) * absWeights.length);
        return absWeights[cutoffIndex] || 0;
    }, [weights, sparsity]);

    return (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl max-w-md mx-auto aspect-square flex flex-col items-center justify-center relative">
            <h3 className="absolute top-4 left-6 text-sm uppercase tracking-wide text-gray-400 font-semibold">Weight Matrix (10x10)</h3>
            <div className="grid grid-cols-10 gap-1 w-full h-full mt-8">
                {weights.map((val, idx) => {
                    const isPruned = Math.abs(val) < threshold;
                    return (
                        <motion.div
                            key={idx}
                            initial={false}
                            animate={{
                                opacity: isPruned ? 0.1 : 1,
                                scale: isPruned ? 0.8 : 1,
                                backgroundColor: isPruned
                                    ? '#1f2937' // gray-800
                                    : val > 0 ? '#34d399' : '#f472b6' // emerald-400 : pink-400
                            }}
                            transition={{ duration: 0.3 }}
                            className="rounded-sm w-full h-full"
                            title={`Weight: ${val.toFixed(3)}`}
                        />
                    );
                })}
            </div>

            {/* Stats Overlay */}
            <div className="absolute bottom-4 right-6 bg-gray-900/80 p-2 rounded border border-gray-600 font-mono text-xs">
                T: {threshold.toFixed(3)} | Active: {100 - sparsity}%
            </div>
        </div>
    );
};

export default MatrixVisual;
