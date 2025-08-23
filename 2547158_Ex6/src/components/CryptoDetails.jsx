import React from 'react';
import { X } from 'lucide-react'; // install lucide-react if not already: npm install lucide-react

export default function CryptoDetails({ coin, onClose }) {
    if (!coin) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 w-96 relative">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                >
                    <X size={20} />
                </button>

                {/* Header with Icon */}
                <div className="flex items-center gap-4 mb-4">
                    <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-12 h-12 rounded-full"
                    />
                    <div>
                        <h2 className="text-xl font-bold">{coin.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            {coin.symbol.toUpperCase()}
                        </p>
                    </div>
                </div>

                {/* Coin Details */}
                <p><strong>Current Price:</strong> ${coin.current_price.toLocaleString()}</p>
                <p><strong>Market Cap:</strong> ${coin.market_cap.toLocaleString()}</p>
                <p><strong>24h Change:</strong> {coin.price_change_percentage_24h?.toFixed(2)}%</p>
                <p><strong>High 24h:</strong> ${coin.high_24h?.toLocaleString()}</p>
                <p><strong>Low 24h:</strong> ${coin.low_24h?.toLocaleString()}</p>

                {/* View on CoinGecko */}
                <a
                    href={`https://www.coingecko.com/en/coins/${coin.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        View Details
                    </button>
                </a>
            </div>
        </div>
    );
}
