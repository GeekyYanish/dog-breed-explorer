import React, { useEffect, useState } from "react";
import axios from "axios";
import CryptoCard from "./components/CryptoCard";
import CryptoTable from "./components/CryptoTable";
import CryptoDetails from "./components/CryptoDetails";
import './index.css'; // Assuming you have a global CSS file for Tailwind

export default function CryptoDashboard() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCoins = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = "https://api.coingecko.com/api/v3/coins/markets";
        const params = {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 10,
          page: 1,
          sparkline: false,
          price_change_percentage: "24h",
        };

        const response = await axios.get(url, { params, signal: controller.signal });
        setCoins(response.data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
    const interval = setInterval(fetchCoins, 60000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">CryptoX — Market Dashboard</h1>
            <p className="text-sm text-gray-500">Top 10 coins by market cap · Data from CoinGecko</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">Status:</div>
            {loading ? (
              <div className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">Loading</div>
            ) : error ? (
              <div className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm">Error</div>
            ) : (
              <div className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">Live</div>
            )}
          </div>
        </header>

        {loading ? (
          <div className="grid place-items-center h-40">
            <div className="text-center text-gray-500">Loading…</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">Error: {error}</div>
        ) : coins.length === 0 ? (
          <div className="text-gray-500">No data available.</div>
        ) : (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {coins.map((coin) => (
                <CryptoCard key={coin.id} coin={coin} onClick={setSelectedCoin} />
              ))}
            </section>

            <section className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm">
              <h2 className="font-semibold mb-4">Market Table</h2>
              <CryptoTable coins={coins} />
            </section>
          </>
        )}

        <footer className="mt-8 text-xs text-gray-500">&copy; Built with Vite · React · Tailwind · Axios</footer>
      </div>

      <CryptoDetails coin={selectedCoin} onClose={() => setSelectedCoin(null)} />
    </div>
  );
}
