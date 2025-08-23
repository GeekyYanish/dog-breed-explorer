// server.js
// Pure Node.js REST API for CryptoX (no Express)

const http = require('http');
const url = require('url');
const PORT = 3000;

// Sample in-memory data
const coins = [
  { id: 1, symbol: 'BTC', name: 'Bitcoin', price: 50630.25, change24h: -1.2, marketCap: 950000000000, volume24h: 28000000000 },
  { id: 2, symbol: 'ETH', name: 'Ethereum', price: 3200.5, change24h: 2.8, marketCap: 380000000000, volume24h: 12000000000 },
  { id: 3, symbol: 'BNB', name: 'Binance Coin', price: 420.0, change24h: 0.5, marketCap: 64000000000, volume24h: 2000000000 },
  { id: 4, symbol: 'ADA', name: 'Cardano', price: 0.98, change24h: -0.8, marketCap: 33000000000, volume24h: 500000000 },
  { id: 5, symbol: 'SOL', name: 'Solana', price: 45.12, change24h: 4.1, marketCap: 16000000000, volume24h: 900000000 },
  { id: 6, symbol: 'DOGE', name: 'Dogecoin', price: 0.082, change24h: -3.4, marketCap: 11000000000, volume24h: 350000000 },
  { id: 7, symbol: 'XRP', name: 'Ripple', price: 0.67, change24h: 1.0, marketCap: 35000000000, volume24h: 750000000 }
];

function sendJSON(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    // CORS headers
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

function handleApiRequest(req, res) {
  const parsed = url.parse(req.url, true);
  const qs = parsed.query;

  // Start with full dataset
  let results = coins.slice();

  // Support endpoint variations: /api, /api/items
  // Query parameters supported:
  // - item: substring on name or symbol (case-insensitive)
  // - price: equality filter (number)
  // - minPrice, maxPrice
  // - limit: number
  // - sortBy: price|marketCap|change24h
  // - order: asc|desc

  if (qs.item) {
    const needle = String(qs.item).toLowerCase();
    results = results.filter(c => c.name.toLowerCase().includes(needle) || c.symbol.toLowerCase().includes(needle));
  }

  if (qs.price) {
    const p = Number(qs.price);
    if (!Number.isNaN(p)) results = results.filter(c => Math.abs(c.price - p) < 1e-9);
  }

  if (qs.minPrice) {
    const p = Number(qs.minPrice);
    if (!Number.isNaN(p)) results = results.filter(c => c.price >= p);
  }
  if (qs.maxPrice) {
    const p = Number(qs.maxPrice);
    if (!Number.isNaN(p)) results = results.filter(c => c.price <= p);
  }

  if (qs.sortBy) {
    const key = qs.sortBy;
    const order = (qs.order || 'desc').toLowerCase();
    results.sort((a, b) => {
      if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  if (qs.limit) {
    const n = parseInt(qs.limit, 10);
    if (!Number.isNaN(n) && n > 0) results = results.slice(0, n);
  }

  // Add metadata
  const response = {
    count: results.length,
    query: qs,
    data: results
  };

  sendJSON(res, 200, response);
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // Always reply to OPTIONS for CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  if (pathname === '/api' || pathname === '/api/items') {
    if (req.method === 'GET') {
      return handleApiRequest(req, res);
    } else {
      return sendJSON(res, 405, { error: 'Method not allowed' });
    }
  }

  // Basic homepage for quick walk-through
  if (pathname === '/' && req.method === 'GET') {
    const body = `\nCryptoX API running. Try: /api or /api?item=btc&minPrice=100`;
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Content-Length': Buffer.byteLength(body),
      'Access-Control-Allow-Origin': '*'
    });
    return res.end(body);
  }

  // Not found
  sendJSON(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});