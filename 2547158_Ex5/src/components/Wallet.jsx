import React, { useState } from 'react';
import AssetModal from './AssetModal';

const Wallet = () => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const assets = [
    { name: 'Bitcoin', symbol: 'BTC', balance: 0.125, valueUSD: '8,556.35', logo: 'https://placehold.co/40x40/F7931A/000000?text=B' },
    { name: 'Ethereum', symbol: 'ETH', balance: 1.5, valueUSD: '5,340.18', logo: 'https://placehold.co/40x40/627EEA/FFFFFF?text=E' },
    { name: 'Cardano', symbol: 'ADA', balance: 2500, valueUSD: '1,150.00', logo: 'https://placehold.co/40x40/0033AD/FFFFFF?text=A' },
  ];

  return (
    <div>
      <header className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-white mb-4">Your Wallet</h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">View your asset balances and their current value.</p>
      </header>
      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <ul className="divide-y divide-gray-700">
          {assets.map((asset) => (
            <li key={asset.symbol} onClick={() => setSelectedAsset(asset)} className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center">
                <img src={asset.logo} alt={asset.name} className="w-10 h-10 rounded-full mr-4"/>
                <div>
                  <p className="font-bold text-lg text-white">{asset.name}</p>
                  <p className="text-gray-400">{asset.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg text-white">{asset.balance} {asset.symbol}</p>
                <p className="text-gray-400">${asset.valueUSD}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <AssetModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
    </div>
  );
};

export default Wallet;
