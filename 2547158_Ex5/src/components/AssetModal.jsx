import React from 'react';
import Icon from './Icon';

const AssetModal = ({ asset, onClose }) => {
  if (!asset) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-cyan-500/50" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-3xl font-bold mb-2 text-white">{asset.name} ({asset.symbol})</h3>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700">
              <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-400 mb-4">Balance: {asset.balance} {asset.symbol}</p>
          <p className="text-2xl text-white mb-6">Value: ${asset.valueUSD}</p>
          <div className="flex space-x-4">
            <button className="flex-1 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-semibold">Buy</button>
            <button className="flex-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-semibold">Sell</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetModal;
