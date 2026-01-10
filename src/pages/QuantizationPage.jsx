import React from 'react';
import QuantizerVisual from '../components/QuantizerVisual';

const QuantizationPage = () => {
    return (
        <div className="flex flex-col items-center w-full">
            <header className="mb-12 text-center max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-purple-400 to-emerald-400 mb-6 tracking-tight">
                    Quantization Explainer
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Interactive playground to understand how Neural Networks compress FP32 weights into INT8.
                </p>
            </header>

            <main className="w-full max-w-5xl">
                <QuantizerVisual />
            </main>
        </div>
    );
};

export default QuantizationPage;
