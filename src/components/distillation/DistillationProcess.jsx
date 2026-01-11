import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import goldenRetriever from '../../assets/golden_retriever.jpg';

const DistillationProcess = () => {
    const [step, setStep] = useState(0);

    // Simulation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % 4); // 4 Steps in the loop
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    // Step Descriptions
    const getStepDescription = () => {
        switch (step) {
            case 0: return "1. Forward Pass: Input Image feeds into both networks.";
            case 1: return "2. Inference: Teacher generates Soft Targets (Dark Knowledge). Student tries to guess.";
            case 2: return "3. Loss Layout: Student's answer is compared to BOTH the Teacher AND the Ground Truth.";
            case 3: return "4. Backpropagation: The Student updates its weights to match both sources. Teacher is Frozen.";
            default: return "";
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto mt-16 p-8 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl font-sans text-gray-300">
            <h2 className="text-2xl font-bold text-center mb-2 text-white">Step 2: The Training Loop 🔄</h2>
            <p className="text-center text-gray-400 mb-8">
                How the Student learns from two masters: The <span className="text-yellow-400">Teacher's Wisdom</span> and the <span className="text-green-400">Real Truth</span>.
            </p>

            {/* --- VISUALIZATION AREA (Fixed 900px Width) --- */}
            <div className="relative h-[400px] w-[900px] bg-gray-950 rounded-xl border border-gray-800 overflow-hidden select-none shadow-inner mx-auto overflow-x-auto pb-4">

                {/* 1. INPUT (Left) */}
                <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                    <motion.div
                        animate={{ scale: step === 0 ? 1.2 : 1, opacity: step === 0 ? 1 : 0.7 }}
                        className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-600 shadow-lg"
                    >
                        <img
                            src={goldenRetriever}
                            alt="Golden Retriever"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>

                {/* 2. NETWORKS (Center Column) */}

                {/* TEACHER (Top) */}
                <div className="absolute left-[300px] top-16 flex flex-col items-center z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Teacher</span>
                        <span className="text-[10px] bg-gray-800 px-1 rounded text-gray-400 border border-gray-700">FROZEN 🥶</span>
                    </div>
                    <motion.div
                        animate={{
                            boxShadow: step === 1 ? "0 0 20px rgba(234,179,8,0.4)" : "none",
                            borderColor: step === 1 ? "#eab308" : "#4b5563"
                        }}
                        className="w-32 h-24 bg-gray-900 border-2 border-gray-700 rounded-xl flex items-center justify-center relative overflow-hidden"
                    >
                        {/* Complex Network SVG */}
                        <svg className="w-full h-full p-2" viewBox="0 0 100 60">
                            {/* Connections */}
                            <g stroke="#854d0e" strokeWidth="0.5" opacity="0.5">
                                {/* Layer 1 to 2 */}
                                {[10, 30, 50, 70, 90].map(y1 => [20, 40, 60, 80].map(y2 => <line key={y1 + y2} x1="20" y1={y1 / 2 + 5} x2="50" y2={y2 / 2 + 10} />))}
                                {/* Layer 2 to 3 */}
                                {[20, 40, 60, 80].map(y1 => [10, 30, 50, 70, 90].map(y2 => <line key={y1 + y2} x1="50" y1={y1 / 2 + 10} x2="80" y2={y2 / 2 + 5} />))}
                            </g>
                            {/* Nodes */}
                            <g fill="#ca8a04">
                                {/* Input Layer */}
                                {[10, 30, 50, 70, 90].map(y => <circle key={y} cx="20" cy={y / 2 + 5} r="2" />)}
                                {/* Hidden Layer */}
                                {[20, 40, 60, 80].map(y => <circle key={y} cx="50" cy={y / 2 + 10} r="2" />)}
                                {/* Output Layer */}
                                {[10, 30, 50, 70, 90].map(y => <circle key={y} cx="80" cy={y / 2 + 5} r="2" />)}
                            </g>
                        </svg>
                    </motion.div>
                </div>

                {/* STUDENT (Bottom) */}
                <div className="absolute left-[300px] bottom-16 flex flex-col items-center z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Student</span>
                        <span className="text-[10px] bg-green-900/30 px-1 rounded text-green-400 border border-green-800">TRAINABLE 🧠</span>
                    </div>
                    <motion.div
                        animate={{
                            boxShadow: (step === 1 || step === 3) ? "0 0 20px rgba(34,197,94,0.4)" : "none",
                            borderColor: (step === 1 || step === 3) ? "#22c55e" : "#4b5563",
                            scale: step === 3 ? 1.05 : 1
                        }}
                        className="w-24 h-24 bg-gray-900 border-2 border-gray-700 rounded-xl flex items-center justify-center relative overflow-hidden"
                    >
                        {/* Simple Network SVG */}
                        <svg className="w-full h-full p-2" viewBox="0 0 100 60">
                            {/* Connections */}
                            <g stroke="#14532d" strokeWidth="0.5" opacity="0.6">
                                {[20, 50, 80].map(y1 => [35, 65].map(y2 => <line key={y1 + y2} x1="25" y1={y1 / 2 + 5} x2="75" y2={y2 / 2 + 10} />))}
                            </g>
                            {/* Nodes */}
                            <g fill="#16a34a">
                                {/* Input */}
                                {[20, 50, 80].map(y => <circle key={y} cx="25" cy={y / 2 + 5} r="3" />)}
                                {/* Output */}
                                {[35, 65].map(y => <circle key={y} cx="75" cy={y / 2 + 10} r="3" />)}
                            </g>
                        </svg>
                    </motion.div>
                </div>


                {/* 3. OUTPUTS & LOSS (Right) */}

                {/* Soft Targets */}
                <div className="absolute left-[560px] top-[110px] -translate-y-1/2 flex flex-col items-start pl-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: step >= 1 ? 1 : 0.2, x: step === 1 ? [0, 5, 0] : 0 }}
                        className="px-3 py-1 bg-yellow-900/30 border border-yellow-600 rounded text-xs text-yellow-300 mb-1 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                    >
                        Predictions
                    </motion.div>
                    <span className="text-[9px] text-yellow-500/80">Soft Labels (softmax with T)</span>
                </div>

                {/* Student Preds */}
                <div className="absolute left-[560px] top-[300px] -translate-y-1/2 flex flex-col items-start pl-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: step >= 1 ? 1 : 0.2 }}
                        className="px-3 py-1 bg-green-900/30 border border-green-600 rounded text-xs text-green-300 mb-1 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                    >
                        Predictions
                    </motion.div>
                    <span className="text-[9px] text-green-500/80">Hard Labels (argmax)</span>
                </div>

                {/* TOTAL LOSS (Far Right) */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center z-10 w-32">
                    <motion.div
                        animate={{
                            scale: step === 2 ? 1.1 : 1,
                            backgroundColor: step === 2 ? "rgba(239,68,68,0.2)" : "rgba(17,24,39,0.5)"
                        }}
                        className="w-24 h-24 rounded-full border-2 border-red-500/50 flex flex-col items-center justify-center p-2 text-center"
                    >
                        <span className="text-sm font-bold text-red-400">Total Loss</span>
                        <span className="text-[9px] text-gray-500 mt-1">Soft (KL) + Hard (CE)</span>
                    </motion.div>

                    {/* Ground Truth Label */}
                    <div className="absolute -bottom-12 bg-gray-800 px-2 py-1 rounded text-[10px] border border-gray-600">
                        Truth: "Golden Retriever"
                    </div>
                </div>


                {/* --- CONNECTIONS (SVG) --- */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
                        </marker>
                        <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                        </marker>
                    </defs>

                    {/* Input Splits */}
                    <motion.path
                        d="M 120 200 C 180 200, 180 110, 260 110"
                        fill="none"
                        stroke={step === 0 ? "#fff" : "#4b5563"}
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        markerEnd="url(#arrowhead)"
                    />
                    <motion.path
                        d="M 120 200 C 180 200, 180 300, 260 300"
                        fill="none"
                        stroke={step === 0 ? "#fff" : "#4b5563"}
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        markerEnd="url(#arrowhead)"
                    />

                    {/* Teacher -> Soft Targets */}
                    <motion.path
                        d="M 370 110 L 560 110"
                        fill="none"
                        stroke={step >= 1 ? "#eab308" : "#4b5563"}
                        strokeDasharray="4 4"
                        animate={{ strokeDashoffset: [0, -20] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        strokeWidth="2"
                    />

                    {/* Student -> Preds */}
                    <motion.path
                        d="M 370 300 L 560 300"
                        fill="none"
                        stroke={step >= 1 ? "#22c55e" : "#4b5563"}
                        strokeDasharray="4 4"
                        animate={{ strokeDashoffset: [0, -20] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        strokeWidth="2"
                    />

                    {/* Soft Targets -> Loss */}
                    <motion.path
                        d="M 640 110 C 750 110, 750 180, 780 180"
                        fill="none"
                        stroke={step >= 2 ? "#eab308" : "#4b5563"}
                        strokeWidth="2"
                    />

                    {/* Preds -> Loss */}
                    <motion.path
                        d="M 640 300 C 750 300, 750 220, 780 220"
                        fill="none"
                        stroke={step >= 2 ? "#22c55e" : "#4b5563"}
                        strokeWidth="2"
                    />

                </svg>

            </div>

            {/* --- CAPTION BAR --- */}
            <div className="h-12 flex items-center justify-center mt-4">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center font-mono text-sm text-blue-300 bg-blue-900/20 px-4 py-2 rounded-full border border-blue-500/30"
                >
                    {getStepDescription()}
                </motion.div>
            </div>
        </div>
    );
};

export default DistillationProcess;
