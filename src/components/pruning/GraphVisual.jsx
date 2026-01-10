import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GraphVisual = ({ sparsity, isStructured }) => {
    // Network Topology: [Inputs, Hidden, Hidden, Outputs]
    const layers = [3, 4, 4, 2];

    // SVG Dimensions
    const width = 400;
    const height = 300;
    const layerSpacing = width / (layers.length - 1);

    // Generate Nodes
    const nodes = useMemo(() => {
        const n = [];
        layers.forEach((count, layerIdx) => {
            const x = layerIdx * layerSpacing;
            const nodeSpacing = height / (count + 1);
            for (let i = 0; i < count; i++) {
                n.push({
                    id: `l${layerIdx}-n${i}`,
                    layer: layerIdx,
                    index: i,
                    x: x + 40, // Padding
                    y: (i + 1) * nodeSpacing
                });
            }
        });
        return n;
    }, []);

    // Generate Edges (Fully Connected)
    const edges = useMemo(() => {
        const e = [];
        nodes.forEach(source => {
            if (source.layer >= layers.length - 1) return;
            const targets = nodes.filter(n => n.layer === source.layer + 1);
            targets.forEach(target => {
                // Assign a consistent random "weight" to each edge to simulate pruning
                // Use deterministic hash or just seed based on IDs
                const weightVal = (Math.sin(source.index * 7 + target.index * 13) + 1) / 2; // 0 to 1
                e.push({
                    id: `${source.id}-${target.id}`,
                    source,
                    target,
                    weightVal
                });
            });
        });
        return e;
    }, [nodes]);

    // Pruning Logic
    // If Structured: Pruning happens at NODE level (e.g., kill neuron 3 in layer 2)
    // If Unstructured: Pruning happens at EDGE level

    // For visual simplicity in "Structured" mode:
    // We'll say nodes with index > X are pruned properties based on sparsity.
    // E.g., Sparsity 50% -> Keep top 50% nodes? Or just random dropping?
    // Let's effectively "drop" nodes randomly based on sparsity threshold.

    const isNodeActive = (node) => {
        if (!isStructured) return true; // In unstructured, all nodes stay, only edges go
        // Input/Output layers usually stay fixed
        if (node.layer === 0 || node.layer === layers.length - 1) return true;

        // Deterministic "importance" of node
        const importance = (Math.cos(node.index * 11 + node.layer * 7) + 1) / 2;
        return importance > (sparsity / 100);
    };

    const isEdgeActive = (edge) => {
        // If either node is dead (Structured), edge is dead
        if (!isNodeActive(edge.source) || !isNodeActive(edge.target)) return false;

        // Unstructured Logic
        if (!isStructured) {
            return edge.weightVal > (sparsity / 100);
        }

        return true;
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl max-w-md mx-auto aspect-video flex flex-col items-center relative">
            <h3 className="absolute top-4 left-6 text-sm uppercase tracking-wide text-gray-400 font-semibold">
                Network Graph ({isStructured ? 'Structured' : 'Unstructured'})
            </h3>

            <svg width="100%" height="100%" viewBox={`0 0 ${width + 80} ${height}`} className="mt-8 overflow-visible">
                <AnimatePresence>
                    {/* Edges first (layer 0) */}
                    {edges.map(edge => {
                        const active = isEdgeActive(edge);
                        return (
                            <motion.line
                                key={edge.id}
                                x1={edge.source.x}
                                y1={edge.source.y}
                                x2={edge.target.x}
                                y2={edge.target.y}
                                initial={false}
                                animate={{
                                    stroke: active ? (isStructured ? '#60a5fa' : '#f472b6') : '#374151',
                                    strokeOpacity: active ? 0.6 : 0.1,
                                    strokeWidth: active ? 2 : 1
                                }}
                                transition={{ duration: 0.5 }}
                            />
                        );
                    })}

                    {/* Nodes on top */}
                    {nodes.map(node => {
                        const active = isNodeActive(node);
                        return (
                            <motion.circle
                                key={node.id}
                                cx={node.x}
                                cy={node.y}
                                r={active ? 8 : 4}
                                initial={false}
                                animate={{
                                    fill: active ? (node.layer === 0 || node.layer === 3 ? '#34d399' : '#60a5fa') : '#1f2937',
                                    scale: active ? 1 : 0.5,
                                    opacity: active ? 1 : 0.3
                                }}
                                transition={{ duration: 0.5 }}
                            />
                        );
                    })}
                </AnimatePresence>
            </svg>

            {/* Stats Overlay */}
            <div className="absolute bottom-4 right-6 bg-gray-900/80 p-2 rounded border border-gray-600 font-mono text-xs text-right">
                {isStructured ? 'Neurons Pruned' : 'Connections Pruned'}<br />
                <span className={isStructured ? 'text-blue-400' : 'text-pink-400'}>
                    Target: {sparsity}%
                </span>
            </div>
        </div>
    );
};

export default GraphVisual;
