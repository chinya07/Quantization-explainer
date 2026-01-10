import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DistillationHero = () => {
    // Generate data packets for animation
    const [packets, setPackets] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const id = Math.random();
            setPackets(prev => [...prev.slice(-8), id]);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    // COORDINATE SYSTEM: 1000px x 500px
    // Using simple absolute positioning to guarantee SVG/Div alignment.
    // The parent has 'overflow-x-auto' or 'scale' to handle responsiveness if needed, 
    // but here we ensure the DIAGRAM ITSELF is consistent.

    return (
        <div className="w-full overflow-hidden bg-gray-950 rounded-xl border border-gray-800 shadow-2xl flex items-center justify-center p-4">
            {/* Diagram Container - Scalable */}
            <div className="relative w-[1000px] h-[500px] bg-gray-900/30 rounded-lg shrink-0 scale-90 md:scale-100 origin-center" style={{ perspective: '1000px' }}>

                {/* --- NODES (Absolute Positioning) --- */}

                {/* 1. DATA (Left) - (x: 50, y: 220) */}
                <div className="absolute left-[50px] top-[200px] z-20">
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-20 h-24 bg-gradient-to-b from-gray-500 to-gray-700 rounded-lg shadow-xl border border-gray-400/50 flex items-center justify-center"
                        style={{ transform: 'rotateY(15deg)' }}
                    >
                        <div className="absolute top-0 w-full h-4 bg-gray-300 rounded-[50%] opacity-50"></div>
                        <span className="text-xs font-bold text-white mt-4 tracking-widest">DATA</span>
                    </motion.div>
                </div>

                {/* 2. TEACHER (Top Center) - (x: 300, y: 50) */}
                <div className="absolute left-[300px] top-[50px] z-10 w-72 p-4 bg-orange-900/20 border border-orange-500/30 rounded-xl" style={{ transform: 'rotateX(10deg)' }}>
                    <h3 className="text-orange-400 font-bold text-xs mb-2 text-center uppercase tracking-wider">Teacher Logic</h3>
                    <div className="flex justify-around items-center h-20">
                        {[...Array(3)].map((_, i) => (
                            <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }} className="w-4 h-4 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50" />
                        ))}
                    </div>
                </div>

                {/* 3. STUDENT (Bottom Center) - (x: 300, y: 350) */}
                <div className="absolute left-[300px] top-[350px] z-10 w-56 p-4 bg-green-900/20 border border-green-500/30 rounded-xl" style={{ transform: 'rotateX(-10deg)' }}>
                    <h3 className="text-emerald-400 font-bold text-xs mb-2 text-center uppercase tracking-wider">Student Logic</h3>
                    <div className="flex justify-around items-center h-16">
                        {[...Array(2)].map((_, i) => (
                            <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, delay: i * 0.2 + 0.5, repeat: Infinity }} className="w-4 h-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                        ))}
                    </div>
                </div>

                {/* 4. SOFTWARE LABELS (Right Top) - (x: 650, y: 80) */}
                <div className="absolute left-[650px] top-[80px] z-10 w-40 h-20 bg-orange-100/5 border border-orange-500/50 rounded flex flex-col items-center justify-center backdrop-blur-md">
                    <span className="text-[10px] text-orange-300 uppercase mb-2 font-bold">Soft Labels</span>
                    <div className="flex gap-1 items-end h-8">
                        <motion.div animate={{ height: ["80%", "70%", "80%"] }} className="w-3 bg-orange-400 rounded-t-sm"></motion.div>
                        <motion.div animate={{ height: ["15%", "25%", "15%"] }} className="w-3 bg-orange-400 rounded-t-sm opacity-60"></motion.div>
                        <div className="w-3 bg-orange-400 h-[5%] rounded-t-sm opacity-30"></div>
                    </div>
                </div>

                {/* 5. PREDICTIONS (Right Bottom) - (x: 650, y: 380) */}
                <div className="absolute left-[650px] top-[380px] z-10 w-40 h-20 bg-green-100/5 border border-green-500/50 rounded flex flex-col items-center justify-center backdrop-blur-md">
                    <span className="text-[10px] text-green-300 uppercase mb-2 font-bold">Predictions</span>
                    <div className="flex gap-1 items-end h-8">
                        <motion.div animate={{ height: ["60%", "75%", "60%"] }} className="w-3 bg-green-400 rounded-t-sm"></motion.div>
                        <div className="w-3 bg-green-400 h-[25%] rounded-t-sm opacity-60"></div>
                        <div className="w-3 bg-green-400 h-[15%] rounded-t-sm opacity-30"></div>
                    </div>
                </div>

                {/* 6. LOSS FUNCTION (Far Right) - (x: 850, y: 230) */}
                <div className="absolute left-[850px] top-[230px] z-20 w-28 h-28 bg-red-900/40 border-2 border-red-500 rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.3)] backdrop-blur">
                    <span className="text-2xl font-black text-red-500">LOSS</span>
                    <span className="text-[8px] text-red-200 mt-1 uppercase tracking-widest">Knowledge Transfer</span>
                </div>


                {/* --- CONNECTORS (SVG) --- */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>

                    {/* Path 1: Data(130, 250) -> Teacher(300, 100) */}
                    <path d="M 130 250 C 180 250, 180 100, 300 100" fill="none" stroke="#6b7280" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />

                    {/* Path 2: Data(130, 250) -> Student(300, 400) */}
                    <path d="M 130 250 C 180 250, 180 400, 300 400" fill="none" stroke="#6b7280" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />

                    {/* Path 3: Teacher(580, 100) -> SoftLabels(650, 120) */}
                    <path d="M 588 100 L 650 120" fill="none" stroke="#fb923c" strokeWidth="2" />

                    {/* Path 4: Student(556, 400) -> Predictions(650, 420) */}
                    <path d="M 556 400 L 650 420" fill="none" stroke="#34d399" strokeWidth="2" />

                    {/* Path 5: SoftLabels(810, 120) -> Loss(850, 250) */}
                    <path d="M 810 120 C 830 120, 850 200, 890 230" fill="none" stroke="#fb923c" strokeWidth="3" filter="url(#glow)" />

                    {/* Path 6: Predictions(810, 420) -> Loss(850, 290) */}
                    <path d="M 810 420 C 830 420, 850 350, 890 310" fill="none" stroke="#34d399" strokeWidth="3" filter="url(#glow)" />

                    {/* Path 7: FEEDBACK LOOP (Loss -> Student) */}
                    <path d="M 850 270 C 800 350, 700 500, 450 450" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" opacity="0.3" markerEnd="url(#arrow)" />


                    {/* PACKETS */}
                    {packets.map(bg => (
                        <g key={bg}>
                            {/* Data -> Teacher */}
                            <motion.circle r="3" fill="white" initial={{ offsetDistance: "0%" }} animate={{ offsetDistance: "100%" }} transition={{ duration: 1.5, ease: "linear" }} style={{ offsetPath: "path('M 130 250 C 180 250, 180 100, 300 100')" }} />
                            {/* Data -> Student */}
                            <motion.circle r="3" fill="white" initial={{ offsetDistance: "0%" }} animate={{ offsetDistance: "100%" }} transition={{ duration: 1.5, ease: "linear" }} style={{ offsetPath: "path('M 130 250 C 180 250, 180 400, 300 400')" }} />

                            {/* Labels -> Loss (The Knowledge Transfer) */}
                            <motion.circle r="4" fill="#fb923c" initial={{ offsetDistance: "0%", opacity: 0 }} animate={{ offsetDistance: "100%", opacity: 1 }} transition={{ duration: 1, delay: 1.5, ease: "linear" }} style={{ offsetPath: "path('M 810 120 C 830 120, 850 200, 890 230')" }} />

                            {/* Preds -> Loss */}
                            <motion.circle r="4" fill="#34d399" initial={{ offsetDistance: "0%", opacity: 0 }} animate={{ offsetDistance: "100%", opacity: 1 }} transition={{ duration: 1, delay: 1.5, ease: "linear" }} style={{ offsetPath: "path('M 810 420 C 830 420, 850 350, 890 310')" }} />
                        </g>
                    ))}

                </svg>

            </div>
        </div>
    );
};

export default DistillationHero;
