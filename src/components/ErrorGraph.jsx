import React from 'react';
import { motion } from 'framer-motion';

const ErrorGraph = ({ minVal, maxVal, inputVal, scale, zeroPoint, qMin, qMax }) => {
    // 1. Generate Data Points for the Graph
    // We want to plot x (Real Input) vs y (Dequantized Output)
    // Range: slightly larger than [minVal, maxVal] to show context
    const padding = (maxVal - minVal) * 0.1;
    const graphMin = minVal - padding;
    const graphMax = maxVal + padding;
    const width = 100; // SVG viewBox coordinates (0-100)
    const height = 100;

    // Helper to map real value to SVG coordinate
    const mapX = (r) => ((r - graphMin) / (graphMax - graphMin)) * width;
    const mapY = (r) => height - ((r - graphMin) / (graphMax - graphMin)) * height;

    // Generate Staircase Path
    // We iterate through all integer buckets in view
    const staircasePath = (() => {
        let path = "";
        // Find rough range of q values visible
        const startQ = Math.floor(Math.max(qMin, (graphMin / scale) + zeroPoint));
        const endQ = Math.ceil(Math.min(qMax, (graphMax / scale) + zeroPoint));

        for (let q = startQ; q <= endQ; q++) {
            // Reconstruct Real Value for this Q
            // Dequantized value (y-level)
            const r_dequant = scale * (q - zeroPoint);

            // The step happens at the boundaries. 
            // The bucket q corresponds to real range approx [scale*(q-0.5 - Z), scale*(q+0.5 - Z)]
            // A standard round() function transitions at .5
            const r_start = scale * (q - 0.5 - zeroPoint);
            const r_end = scale * (q + 0.5 - zeroPoint);

            // Clamp coordinates to visual bounds for safety
            const x1 = Math.max(0, mapX(r_start));
            const x2 = Math.min(100, mapX(r_end));
            const y = mapY(r_dequant);

            if (path === "") path += `M ${x1} ${y}`;

            // Draw horizontal step
            path += ` L ${x2} ${y}`;

            // Draw vertical rise to next step (if not last)
            if (q < endQ) {
                const next_y = mapY(scale * (q + 1 - zeroPoint));
                path += ` L ${x2} ${next_y}`;
            }
        }
        return path;
    })();

    // Ideal Line (y=x)
    const idealPath = `M ${mapX(graphMin)} ${mapY(graphMin)} L ${mapX(graphMax)} ${mapY(graphMax)}`;

    // Current Error Calculation for Scribble Position
    const currentQ = Math.max(qMin, Math.min(qMax, Math.round(inputVal / scale + zeroPoint)));
    const currentDequant = scale * (currentQ - zeroPoint);

    // Coordinates for the current point interaction
    const curX = mapX(inputVal);
    const curY_ideal = mapY(inputVal);
    const curY_actual = mapY(currentDequant);

    // Determine Scribble Direction (pointing at the gap)
    // We want the arrow to point somewhat perpendicular to the gap line
    const errorMag = Math.abs(currentDequant - inputVal);
    const hasSignificantError = errorMag > (scale * 0.1); // Show only if error is noticeable

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mt-8 relative select-none">
            <div className="flex justify-between items-end mb-4">
                <h3 className="text-sm uppercase tracking-wide text-gray-400 font-semibold">Quantization Error Graph</h3>
                <div className="text-xs font-mono">
                    <span className="text-gray-500">Error: </span>
                    <span className={`${hasSignificantError ? 'text-pink-400' : 'text-emerald-400'} font-bold`}>
                        {(currentDequant - inputVal).toFixed(4)}
                    </span>
                </div>
            </div>

            <div className="relative aspect-[2/1] w-full bg-gray-900 rounded border border-gray-700 overflow-hidden">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Grid / Axes */}
                    <line x1="0" y1="100" x2="100" y2="0" stroke="#374151" strokeWidth="0.5" strokeDasharray="2" />

                    {/* Ideal Line (Green) */}
                    <path d={idealPath} stroke="#10b981" strokeWidth="0.5" strokeDasharray="2" fill="none" opacity="0.6" />

                    {/* Staircase (Blue) */}
                    <path d={staircasePath} stroke="#3b82f6" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />

                    {/* Current Input Vertical Line */}
                    <line x1={curX} y1="0" x2={curX} y2="100" stroke="#ec4899" strokeWidth="0.5" strokeDasharray="2" opacity="0.4" />

                    {/* The "Gap" Line (Error Magnitude) */}
                    <motion.line
                        x1={curX} y1={curY_ideal}
                        x2={curX} y2={curY_actual}
                        stroke="#ec4899"
                        strokeWidth="1.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.2 }}
                    />
                </svg>

                {/* Scribble Arrow Overlay */}
                {hasSignificantError && (
                    <motion.svg
                        className="absolute w-24 h-24 pointer-events-none text-yellow-300 drop-shadow-lg z-20"
                        style={{
                            left: `${curX}%`,
                            top: `${(curY_ideal + curY_actual) / 2}%`,
                            transform: 'translate(10px, -50%)' // Shift right of the point
                        }}
                        viewBox="0 0 100 100"
                    >
                        {/* Hand-drawn Arrow Path */}
                        <motion.path
                            d="M 60,50 C 40,50 30,40 10,50 M 15,40 L 5,50 L 15,60"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        />
                        <motion.text
                            x="40" y="30"
                            fill="currentColor"
                            fontSize="16"
                            fontWeight="bold"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Error!
                        </motion.text>
                    </motion.svg>
                )}
            </div>
            <p className="mt-2 text-xs text-gray-500 text-center">
                The "Staircase" shows how multiple Real Values get mapped to the
                <span className="text-blue-400 font-bold mx-1">same</span>
                Integer, creating error.
            </p>
        </div>
    );
};

export default ErrorGraph;
