import React from 'react';
import CryptoCarousel from './CryptoCarousel';

const Dashboard = () => (
  <div className="space-y-12">
    <header className="text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Market Overview</h1>
      <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
        Welcome to CryptoX. Here's a snapshot of the current crypto market.
      </p>
    </header>
    <CryptoCarousel />
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-4">Your Portfolio Summary</h2>
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-lg">Total Balance</span>
        <span className="text-3xl font-bold text-white">$12,845.67</span>
      </div>
    </div>
  </div>
);

export default Dashboard;
