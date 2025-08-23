import React, { useState, useEffect, useCallback } from 'react';

// Example: add a representative logo for each coin
const slides = [
  {
    logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    title: 'Bitcoin (BTC)',
    price: '$68,450.78',
    change: '+2.5%',
  },
  {
    logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    title: 'Ethereum (ETH)',
    price: '$3,560.12',
    change: '+4.1%',
  },
  {
    logo: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    title: 'Solana (SOL)',
    price: '$165.30',
    change: '-1.2%',
  },
];

const CryptoCarousel = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1)), []);
  const prev = useCallback(() => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1)), []);
  const goToSlide = useCallback((idx) => setCurrent(idx), []);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg shadow-2xl bg-gray-800">
      <div
        className="flex transition-transform ease-out duration-500 h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div key={slide.title} className="w-full flex-shrink-0 h-full flex items-center justify-center px-8">
            {/* Coin Image */}
            <div className="hidden md:flex items-center justify-center h-full w-2/5">
              <img
                src={slide.logo}
                alt={slide.title}
                className="h-32 w-32 object-contain drop-shadow-xl bg-white rounded-full p-2"
              />
            </div>
            {/* Details */}
            <div className="flex flex-col items-center md:items-start justify-center w-full md:w-3/5 h-full text-white p-4">
              <h3 className="text-3xl md:text-4xl font-bold mb-2">{slide.title}</h3>
              <p className="text-2xl md:text-3xl text-gray-300">{slide.price}</p>
              <p
                className={`text-xl font-semibold mt-1 ${
                  slide.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {slide.change}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Controls */}
      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700/60 hover:bg-gray-900 text-white p-2 rounded-full z-10"
        onClick={prev}
        aria-label="Previous Slide"
      >
        &#8592;
      </button>
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700/60 hover:bg-gray-900 text-white p-2 rounded-full z-10"
        onClick={next}
        aria-label="Next Slide"
      >
        &#8594;
      </button>
      {/* Indicators */}
      <div className="absolute bottom-3 w-full flex justify-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`h-3 w-3 rounded-full ${idx === current ? 'bg-cyan-400' : 'bg-gray-400/40'} transition-colors`}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CryptoCarousel;