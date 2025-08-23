import React from 'react';

export default function CryptoCard({ coin, onClick }) {
    const { name, symbol, current_price, price_change_percentage_24h, image } =
        coin;
    const priceChangePositive = price_change_percentage_24h >= 0;

    return (
        <div
            onClick={() => onClick(coin)}
            className="bg-white dark:bg-zinc-900 shadow-md rounded-2xl p-4 flex items-center gap-4 
                 transition-transform transform hover:-translate-y-1 cursor-pointer"
        >
            <img src={image} alt={name} className="w-12 h-12 rounded-full" />
            <div className="flex-1">
                <div className="flex items-baseline gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {name}
                    </h3>
                    <span className="text-xs text-gray-500">
                        {symbol.toUpperCase()}
                    </span>
                </div>
                <div className="mt-1 flex items-center gap-3">
                    <div className="text-lg font-medium">
                        ${current_price.toLocaleString()}
                    </div>
                    <div
                        className={`text-sm font-medium ${
                            priceChangePositive
                                ? 'text-green-500'
                                : 'text-red-500'
                        }`}
                    >
                        {price_change_percentage_24h?.toFixed(2)}%
                    </div>
                </div>
            </div>
            <div className="text-xs text-gray-400">24h</div>
        </div>
    );
}
