import LogitTemperatureVisualizer from '../components/distillation/LogitTemperatureVisualizer';

const DistillationPage = () => {
    return (
        <div className="flex flex-col items-center w-full min-h-[60vh] text-center text-white">
            <header className="mb-8 max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 mb-6 tracking-tight">
                    Knowledge Distillation
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed mb-4">
                    How do we make small models smart? By teaching them!
                    <br />
                    <span className="text-yellow-300 font-bold">Step 1: The Concept</span>
                </p>
            </header>

            <div className="w-full max-w-6xl mb-12">
                <LogitTemperatureVisualizer />
            </div>
        </div>
    );
};

export default DistillationPage;
