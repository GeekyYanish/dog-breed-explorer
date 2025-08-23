import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Trade from './components/Trade';
import Wallet from './components/Wallet';

export default function App() {
    const [view, setView] = useState('dashboard');

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <Dashboard />;
            case 'trade':
                return <Trade />;
            case 'wallet':
                return <Wallet />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen font-sans text-gray-200 flex flex-col">
            <Navbar setView={setView} />
            <main className="flex-grow pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {renderView()}
                </div>
            </main>
            <footer className="bg-gray-800 text-white">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
                    <p>
                        &copy; {new Date().getFullYear()} CoinShift. All rights
                        reserved.
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        Cryptocurrency investments are subject to market risk.
                    </p>
                </div>
            </footer>
        </div>
    );
}
