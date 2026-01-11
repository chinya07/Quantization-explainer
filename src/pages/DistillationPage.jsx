import LogitTemperatureVisualizer from '../components/distillation/LogitTemperatureVisualizer';
import DistillationProcess from '../components/distillation/DistillationProcess';

const DistillationPage = () => {
    return (
        <div className="flex flex-col items-center w-full min-h-[60vh] text-center text-white pb-20">
            <header className="mb-8 max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 mb-6 tracking-tight">
                    Knowledge Distillation
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed mb-4">
                    How do we make small models smart? By teaching them!
                    <br />
                    <span className="text-yellow-300 font-bold">Step 1: The Concept</span> (Temperature) & <span className="text-green-400 font-bold">Step 2: The Process</span> (Training)
                </p>
            </header>

            <div className="w-full max-w-6xl mb-12 flex flex-col gap-12">
                <LogitTemperatureVisualizer />

                <div className="w-full h-px bg-gray-800 my-4" /> {/* Divider */}

                <DistillationProcess />
            </div>
        </div>
    );
};

export default DistillationPage;
