import React, { useState } from 'react';

// Example hardcoded prices based on your earlier UI
const COIN_PRICES = {
    BTC: 68450.78,
    ETH: 3560.12,
    SOL: 165.3,
};

const Trade = () => {
    const [formData, setFormData] = useState({
        coin: 'BTC',
        coinAmount: '',
        usdAmount: '',
        tradeType: 'buy',
        remarks: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleCoinChange = (e) => {
        // When changing coin, clear amounts to avoid confusion
        setFormData((prev) => ({
            ...prev,
            coin: e.target.value,
            coinAmount: '',
            usdAmount: '',
        }));
        setError('');
    };

    const handleAmountChange = (e) => {
        setError('');
        const { name, value } = e.target;
        if (value !== '' && (isNaN(value) || Number(value) <= 0)) {
            setFormData((prev) => ({ ...prev, [name]: '' }));
            setError('Amount must be a positive number.');
            return;
        }
        const price = COIN_PRICES[formData.coin];
        if (name === 'coinAmount') {
            setFormData((prev) => ({
                ...prev,
                coinAmount: value,
                usdAmount: value ? (Number(value) * price).toFixed(2) : '',
            }));
        } else if (name === 'usdAmount') {
            setFormData((prev) => ({
                ...prev,
                usdAmount: value,
                coinAmount: value ? (Number(value) / price).toFixed(8) : '',
            }));
        }
    };

    const handleInputChange = (e) => {
        setError('');
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const ca = parseFloat(formData.coinAmount);
        const usd = parseFloat(formData.usdAmount);
        if ((!ca && !usd) || ca <= 0 || usd <= 0) {
            setError('Please enter a valid positive amount.');
            return;
        }
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center">
                <div className="text-center bg-green-900/50 border-l-4 border-green-500 text-green-300 p-6 rounded-lg shadow-md max-w-lg mx-auto">
                    <h3 className="text-2xl font-bold mb-2 text-white">
                        Success!
                    </h3>
                    <p>
                        Your order to {formData.tradeType} {formData.coinAmount}{' '}
                        {formData.coin} (~${formData.usdAmount}) has been
                        placed.
                    </p>
                </div>
                <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg border border-cyan-500/30">
                    <h4 className="text-lg font-bold text-cyan-400 mb-4">
                        Transaction Details
                    </h4>
                    <div className="flex flex-col gap-2 text-gray-100">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Type:</span>
                            <span className="font-semibold capitalize">
                                {formData.tradeType}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Coin:</span>
                            <span className="font-semibold">
                                {formData.coin}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">
                                Amount ({formData.coin}):
                            </span>
                            <span className="font-semibold">
                                {formData.coinAmount}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Amount (USD):</span>
                            <span className="font-semibold">
                                ${formData.usdAmount}
                            </span>
                        </div>
                        {formData.remarks && (
                            <div className="flex flex-col mt-2">
                                <span className="text-gray-400">Remarks:</span>
                                <span className="whitespace-pre-wrap mt-1 text-cyan-200">
                                    {formData.remarks}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between mt-2 pt-3 border-t border-gray-700">
                            <span className="text-gray-400">Date/Time:</span>
                            <span className="font-semibold">
                                {new Date().toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                    Place Another Order
                </button>
            </div>
        );
    }

    return (
        <div>
            <header className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-white mb-4">
                    Trade Crypto
                </h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Buy or sell cryptocurrencies instantly.
                    <span className="block mt-2 text-sm text-cyan-300">
                        Current Price: BTC ${COIN_PRICES.BTC}, ETH $
                        {COIN_PRICES.ETH}, SOL ${COIN_PRICES.SOL}
                    </span>
                </p>
            </header>
            <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-xl shadow-2xl border border-cyan-500/30">
                <div className="flex border-b border-gray-700 mb-6">
                    <button
                        onClick={() =>
                            setFormData((f) => ({ ...f, tradeType: 'buy' }))
                        }
                        className={`flex-1 py-2 text-lg font-semibold transition-colors ${
                            formData.tradeType === 'buy'
                                ? 'text-cyan-400 border-b-2 border-cyan-400'
                                : 'text-gray-400'
                        }`}
                    >
                        Buy
                    </button>
                    <button
                        onClick={() =>
                            setFormData((f) => ({ ...f, tradeType: 'sell' }))
                        }
                        className={`flex-1 py-2 text-lg font-semibold transition-colors ${
                            formData.tradeType === 'sell'
                                ? 'text-cyan-400 border-b-2 border-cyan-400'
                                : 'text-gray-400'
                        }`}
                    >
                        Sell
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="coin"
                            className="text-sm font-medium text-gray-300"
                        >
                            Cryptocurrency
                        </label>
                        <select
                            name="coin"
                            id="coin"
                            value={formData.coin}
                            onChange={handleCoinChange}
                            className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
                        >
                            <option>BTC</option>
                            <option>ETH</option>
                            <option>SOL</option>
                        </select>
                    </div>
                    <div>
                        <label
                            htmlFor="coinAmount"
                            className="text-sm font-medium text-gray-300"
                        >
                            Amount ({formData.coin})
                        </label>
                        <input
                            type="number"
                            name="coinAmount"
                            id="coinAmount"
                            min="0.00000001"
                            step="0.00000001"
                            value={formData.coinAmount}
                            onChange={handleAmountChange}
                            placeholder={formData.coin}
                            className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="usdAmount"
                            className="text-sm font-medium text-gray-300"
                        >
                            Amount (USD)
                        </label>
                        <input
                            type="number"
                            name="usdAmount"
                            id="usdAmount"
                            min="0.01"
                            step="0.01"
                            value={formData.usdAmount}
                            onChange={handleAmountChange}
                            placeholder="USD"
                            className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
                        />
                        {error && (
                            <div className="text-red-400 text-sm mt-2">
                                {error}
                            </div>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="remarks"
                            className="text-sm font-medium text-gray-300"
                        >
                            Remarks (optional)
                        </label>
                        <textarea
                            name="remarks"
                            id="remarks"
                            value={formData.remarks}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Enter any remarks for the trade..."
                            className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 resize-none"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                                formData.tradeType === 'buy'
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-red-600 hover:bg-red-700'
                            }`}
                        >
                            {formData.tradeType === 'buy' ? 'Buy' : 'Sell'}{' '}
                            {formData.coin}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Trade;
