import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-950 flex flex-col">
            <Navbar />
            <div className="flex-grow p-4 md:p-12 w-full mx-auto max-w-7xl flex flex-col items-center">
                {children}
            </div>
            <footer className="py-8 text-center text-gray-600 text-sm border-t border-gray-900 bg-gray-950">
                Built with React, Vite & Tailwind • Part of the OptiLens Suite
            </footer>
        </div>
    );
};

export default Layout;
