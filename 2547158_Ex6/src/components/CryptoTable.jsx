import React from "react";

export default function CryptoTable({ coins }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-sm">
        <thead className="text-left text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Coin</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Market Cap</th>
            <th className="px-4 py-3">24h %</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((c, idx) => (
            <tr key={c.id} className="border-t last:border-b">
              <td className="px-4 py-3 text-sm text-gray-600">{idx + 1}</td>
              <td className="px-4 py-3 flex items-center gap-3">
                <img src={c.image} alt={c.name} className="w-6 h-6" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.symbol.toUpperCase()}</div>
                </div>
              </td>
              <td className="px-4 py-3">${c.current_price.toLocaleString()}</td>
              <td className="px-4 py-3">${c.market_cap.toLocaleString()}</td>
              <td className={`px-4 py-3 ${c.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {c.price_change_percentage_24h?.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
