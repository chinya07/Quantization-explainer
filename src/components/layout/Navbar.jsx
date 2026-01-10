import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="w-full bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 font-bold text-xl tracking-tighter text-white">
                            🔭 OptiLens
                        </div>
                    </div>
                    <div className="flex items-baseline space-x-4">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                    ? 'bg-gray-800 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] border border-blue-500/30'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`
                            }
                        >
                            Quantization
                        </NavLink>
                        <NavLink
                            to="/pruning"
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                    ? 'bg-gray-800 text-white shadow-[0_0_10px_rgba(249,115,22,0.5)] border border-orange-500/30'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`
                            }
                        >
                            Pruning
                        </NavLink>
                        <NavLink
                            to="/distillation"
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                    ? 'bg-gray-800 text-white shadow-[0_0_10px_rgba(251,191,36,0.5)] border border-yellow-500/30'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`
                            }
                        >
                            Distillation
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
