import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper component for math fractions
const Fraction = ({ num, den }) => (
    <div className="inline-flex flex-col items-center align-middle mx-1">
        <span className="border-b border-gray-400 px-1 pb-px">{num}</span>
        <span className="pt-px">{den}</span>
    </div>
);

const DefinitionsPanel = ({ mode }) => {
    return (
        <>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left">
                {/* Scale Definition */}
                <motion.div
                    className="bg-gray-800 p-5 rounded-lg border-t-4 border-blue-500 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h3 className="text-lg font-bold text-blue-400 mb-2">Scale (S)</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        Defines the "step size" of quantization. It tells us how much "real value" is covered by one single integer step.
                    </p>
                    <div className="bg-gray-900 p-3 rounded text-xs font-mono text-blue-200 flex items-center justify-center min-h-[4rem]">
                        {mode === 'asymmetric' ? (
                            <div className="flex items-center">
                                <span>S = </span>
                                <Fraction
                                    num={<span>r_max - r_min</span>}
                                    den={<span>q_max - q_min</span>}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <span>S = </span>
                                <Fraction
                                    num={<span>max(|r|)</span>}
                                    den={<span>127</span>}
                                />
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Zero Point Definition */}
                <motion.div
                    className="bg-gray-800 p-5 rounded-lg border-t-4 border-purple-500 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-lg font-bold text-purple-400 mb-2">Zero Point (Z)</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        The integer value that corresponds to the real value 0. It allows us to represent asymmetric ranges (e.g. ReLU activations [0, 6]).
                    </p>
                    <div className="bg-gray-900 p-3 rounded text-xs font-mono text-purple-200 flex items-center justify-center min-h-[4rem]">
                        {mode === 'asymmetric' ? (
                            <div className="flex items-center">
                                <span>Z = round(q_min - </span>
                                <Fraction
                                    num={<span>r_min</span>}
                                    den={<span>S</span>}
                                />
                                <span>)</span>
                            </div>
                        ) : (
                            <span>Z = 0 (Fixed for Symmetric)</span>
                        )}
                    </div>
                </motion.div>

                {/* Quantized Value Definition */}
                <motion.div
                    className="bg-gray-800 p-5 rounded-lg border-t-4 border-emerald-500 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="text-lg font-bold text-emerald-400 mb-2">Quantized (q)</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        The final 8-bit integer stored in memory. We get this by dividing the real value by scale, shifting by zero-point, and rounding.
                    </p>
                    <div className="bg-gray-900 p-3 rounded text-xs font-mono text-emerald-200 flex items-center justify-center min-h-[4rem]">
                        <div className="flex items-center">
                            <span>q = clamp(round(</span>
                            <Fraction
                                num={<span>r</span>}
                                den={<span>S</span>}
                            />
                            <span> + Z))</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Glossary of Terms */}
            <motion.div
                className="mt-8 bg-gray-800/50 rounded-lg p-6 border border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <h4 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-4">Legend & Key Terms</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                        <span className="text-blue-300 font-bold font-mono">r</span>
                        <span className="text-gray-500 mx-2">—</span>
                        <span className="text-gray-400">Real value (FP32 input)</span>
                    </div>
                    <div>
                        <span className="text-emerald-300 font-bold font-mono">q</span>
                        <span className="text-gray-500 mx-2">—</span>
                        <span className="text-gray-400">Quantized value (INT8)</span>
                    </div>
                    <div>
                        <span className="text-gray-300 font-bold font-mono">r_min, r_max</span>
                        <span className="text-gray-500 mx-2">—</span>
                        <span className="text-gray-400">Min/Max of input range</span>
                    </div>
                    <div>
                        <span className="text-gray-300 font-bold font-mono">q_min, q_max</span>
                        <span className="text-gray-500 mx-2">—</span>
                        <span className="text-gray-400">Min/Max of INT8 (-128, 127)</span>
                    </div>
                    <div>
                        <span className="text-yellow-200 font-bold font-mono">round()</span>
                        <span className="text-gray-500 mx-2">—</span>
                        <span className="text-gray-400">Round to nearest integer</span>
                    </div>
                    <div>
                        <span className="text-yellow-200 font-bold font-mono">clamp()</span>
                        <span className="text-gray-500 mx-2">—</span>
                        <span className="text-gray-400">Limit value to [q_min, q_max]</span>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default DefinitionsPanel;
