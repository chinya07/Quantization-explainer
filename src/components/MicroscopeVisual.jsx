import React from 'react';
import { motion } from 'framer-motion';

const MicroscopeVisual = ({ minVal, maxVal, inputVal, scale, zeroPoint }) => {
    // Safety check for initialization
    if (!scale || scale === 0) return null;

    // 1. Calculate View Window
    // We want to show a narrow window around the current input to emphasize the "Microscope" feel.
    // Let's show roughly +/- 1.5 steps (buckets) around the input.
    const viewRadius = scale * 1.5;
    const viewMin = inputVal - viewRadius;
    const viewMax = inputVal + viewRadius;

    // Map value to percentage (0-100)
    const mapToPct = (val) => ((val - viewMin) / (viewMax - viewMin)) * 100;

    // 2. Identify Visible Buckets
    // Find q values that fall within this zoomed view
    const visibleBuckets = [];
    const minQ = Math.floor(((viewMin) / scale) + zeroPoint);
    const maxQ = Math.ceil(((viewMax) / scale) + zeroPoint);

    for (let q = minQ; q <= maxQ; q++) {
        const bucketVal = scale * (q - zeroPoint);
        visibleBuckets.push({ q, val: bucketVal });
    }

    // 3. Current Snap Target
    const currentQ = Math.round(inputVal / scale + zeroPoint);
    const snapppedVal = scale * (currentQ - zeroPoint);
    const error = snapppedVal - inputVal;

    return (
        <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700 mt-8 relative overflow-hidden select-none">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-2 group relative cursor-help">
                    <h3 className="text-sm uppercase tracking-wide text-gray-400 font-semibold flex items-center gap-2">
                        <span className="text-xl">🔬</span> Quantization Microscope
                    </h3>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                    {/* Tooltip */}
                    <div className="absolute left-0 top-full mt-2 w-72 bg-gray-900/95 backdrop-blur-sm text-xs text-gray-300 p-4 rounded-lg border border-gray-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none text-left">
                        <h4 className="font-bold text-white mb-2">What is Quantization Error?</h4>
                        <p className="mb-2">It's the precision we lose when forcing a smooth real number into a fixed integer bucket.</p>
                        <p>Think of it like rounding currency: <br /> Real <span className="text-pink-400">$10.43</span> &rarr; Bucket <span className="text-emerald-400">$10.00</span>.</p>
                        <p className="mt-2 border-t border-gray-700 pt-2 text-gray-400">Error = Distance to nearest Green Line.</p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3 text-xs font-mono bg-gray-900/50 rounded-lg p-2 border border-gray-700/50">
                    <div className="flex items-center gap-2 px-2">
                        <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                        <span className="text-gray-400">Real Input:</span>
                        <span className="text-pink-400 font-bold">{inputVal.toFixed(4)}</span>
                    </div>
                    <div className="w-px h-4 bg-gray-700"></div>

                    <div className="flex items-center gap-2 px-2">
                        <span className="text-gray-400">Int8 (q):</span>
                        <span className="text-purple-400 font-bold">{currentQ}</span>
                    </div>
                    <div className="w-px h-4 bg-gray-700"></div>

                    <div className="flex items-center gap-2 px-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-gray-400">Bucket Val:</span>
                        <span className="text-emerald-400 font-bold">{snapppedVal.toFixed(4)}</span>
                    </div>
                    <div className="w-px h-4 bg-gray-700"></div>

                    <div className="flex items-center gap-2 px-2">
                        <span className="text-gray-500">Step Size:</span>
                        <span className="text-blue-400 font-bold">{scale.toFixed(4)}</span>
                    </div>
                </div>
            </div>

            {/* Microscope Viewport */}
            <div className="relative h-48 bg-gray-900 rounded-lg border-2 border-gray-600 shadow-inner overflow-hidden">

                {/* Visual Grid Lines (Buckets) */}
                {visibleBuckets.map((b) => (
                    <motion.div
                        key={b.q}
                        className="absolute top-0 bottom-0 w-1 bg-emerald-500/20 border-l border-emerald-500/50"
                        style={{ left: `${mapToPct(b.val)}%` }}
                        initial={false}
                        animate={{ left: `${mapToPct(b.val)}%` }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <span className="absolute bottom-2 left-2 text-xs font-mono text-emerald-500/50">q={b.q}</span>
                    </motion.div>
                ))}

                {/* The "Snap" Connection (Error Spring) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    <motion.line
                        x1={`${mapToPct(inputVal)}%`}
                        y1="50%"
                        x2={`${mapToPct(snapppedVal)}%`}
                        y2="50%"
                        stroke="#ef4444" // Red for error
                        strokeWidth="4"
                        strokeDasharray="4"
                        initial={false}
                        animate={{
                            x1: `${mapToPct(inputVal)}%`,
                            x2: `${mapToPct(snapppedVal)}%`
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                    {/* Error Label floating above the spring */}
                    <motion.text
                        x={`${(mapToPct(inputVal) + mapToPct(snapppedVal)) / 2}%`}
                        y="45%"
                        fill="#f87171"
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle"
                        animate={{
                            x: `${(mapToPct(inputVal) + mapToPct(snapppedVal)) / 2}%`
                        }}
                    >
                        Error: {Math.abs(error).toFixed(5)}
                    </motion.text>
                </svg>

                {/* Real Value Dot (Pink) - Center of the universe mostly, but moves relative to grid in this impl */}
                {/* Actually, since we center the VIEW on inputVal, inputVal is always 50%. 
                    But wait, that makes the grid move. That is arguably better for a "camera tracking" feel.
                    Let's re-verify: mapToPct(inputVal) -> ((inputVal - (inputVal - R)) / 2R) * 100 = 50%.
                    Yes, so the Pink Dot stays centered, and the world moves past it. Perfect.
                */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-pink-500 rounded-full shadow-[0_0_15px_rgba(236,72,153,1)] z-20 ring-4 ring-pink-900/50"></div>

                {/* Nearest Bucket Highlight (Green) */}
                <motion.div
                    className="absolute top-0 bottom-0 w-1 bg-emerald-400 z-10 shadow-[0_0_20px_rgba(52,211,153,0.5)]"
                    style={{ left: `${mapToPct(snapppedVal)}%` }}
                    animate={{ left: `${mapToPct(snapppedVal)}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />

            </div>
            <p className="mt-4 text-xs text-gray-500 text-center">
                The <span className="text-pink-400 font-bold">Pink Dot</span> is your value.
                It snaps to the nearest <span className="text-emerald-400 font-bold">Green Line</span>.
                The <span className="text-red-400 font-bold">Red Line</span> is the information lost (Error).
            </p>
        </div>
    );
};

export default MicroscopeVisual;
