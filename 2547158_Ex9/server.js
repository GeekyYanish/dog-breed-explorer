const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db, run, all, get } = require('./src/db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_super_secret_change_me';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// ------ Auth Middleware -------
function authRequired(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload; // { id, email }
        next();
    } catch (e) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

// ----- DB bootstrap ------
async function init() {
    await run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

    await run(`CREATE TABLE IF NOT EXISTS coins (
    symbol TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

    await run(`CREATE TABLE IF NOT EXISTS wallets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    currency TEXT NOT NULL,
    balance REAL NOT NULL DEFAULT 0,
    UNIQUE(user_id, currency),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

    await run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    side TEXT CHECK(side IN ('BUY','SELL')) NOT NULL,
    symbol TEXT NOT NULL,
    price REAL NOT NULL,
    quantity REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'FILLED',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

    await run(`CREATE TABLE IF NOT EXISTS trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    symbol TEXT NOT NULL,
    price REAL NOT NULL,
    quantity REAL NOT NULL,
    traded_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

    // Seed coins if empty
    const count = await get('SELECT COUNT(*) as c FROM coins');
    if (count.c === 0) {
        await run(
            'INSERT INTO coins(symbol, name, price) VALUES (?,?,?), (?,?,?), (?,?,?)',
            'BTC',
            'Bitcoin',
            65000,
            'ETH',
            'Ethereum',
            3200,
            'SOL',
            'Solana',
            150
        );
    }
}

// ------ Auth Routes ------
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res
                .status(400)
                .json({ error: 'name, email, password required' });
        const hash = await bcrypt.hash(password, 10);
        await run(
            'INSERT INTO users(name, email, password_hash) VALUES (?,?,?)',
            name,
            email,
            hash
        );
        const user = await get(
            'SELECT id, email FROM users WHERE email = ?',
            email
        );

        // Give starter wallets
        await run(
            'INSERT OR IGNORE INTO wallets(user_id, currency, balance) VALUES (?,?,?), (?,?,?)',
            user.id,
            'USDT',
            10000,
            user.id,
            'INR',
            0
        );
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '7d',
        });
        res.json({ token });
    } catch (e) {
        if (String(e).includes('UNIQUE'))
            return res.status(409).json({ error: 'Email already registered' });
        console.error(e);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: 'email, password required' });
    const user = await get('SELECT * FROM users WHERE email = ?', email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '7d',
    });
    res.json({ token });
});

app.get('/api/me', authRequired, async (req, res) => {
    const user = await get(
        'SELECT id, name, email, created_at FROM users WHERE id = ?',
        req.user.id
    );
    res.json(user);
});

// ----- Coins ------
app.get('/api/coins', async (req, res) => {
    const rows = await all(
        'SELECT symbol, name, price, updated_at FROM coins ORDER BY symbol'
    );
    res.json(rows);
});

// (Dev) Update a coin price
app.post('/api/coins/:symbol/price', async (req, res) => {
    const { symbol } = req.params;
    const { price } = req.body;
    if (typeof price !== 'number' || price <= 0)
        return res.status(400).json({ error: 'valid price required' });
    const existing = await get(
        'SELECT symbol FROM coins WHERE symbol = ?',
        symbol.toUpperCase()
    );
    if (!existing) return res.status(404).json({ error: 'Coin not found' });
    await run(
        'UPDATE coins SET price = ?, updated_at = CURRENT_TIMESTAMP WHERE symbol = ?',
        price,
        symbol.toUpperCase()
    );
    const updated = await get(
        'SELECT symbol, name, price, updated_at FROM coins WHERE symbol = ?',
        symbol.toUpperCase()
    );
    res.json(updated);
});

// ----- Wallets ------
app.get('/api/wallets', authRequired, async (req, res) => {
    const rows = await all(
        'SELECT currency, balance FROM wallets WHERE user_id = ? ORDER BY currency',
        req.user.id
    );
    res.json(rows);
});

app.post('/api/wallets/deposit', authRequired, async (req, res) => {
    const { currency = 'USDT', amount } = req.body;
    if (typeof amount !== 'number' || amount <= 0)
        return res.status(400).json({ error: 'valid amount required' });
    await run(
        'INSERT OR IGNORE INTO wallets(user_id, currency, balance) VALUES (?,?,0)',
        req.user.id,
        currency
    );
    await run(
        'UPDATE wallets SET balance = balance + ? WHERE user_id = ? AND currency = ?',
        amount,
        req.user.id,
        currency
    );
    const row = await get(
        'SELECT currency, balance FROM wallets WHERE user_id = ? AND currency = ?',
        req.user.id,
        currency
    );
    res.json(row);
});

// ------ Orders & Trades (Instant Fill) -------

app.post('/api/orders', authRequired, async (req, res) => {
    // A new 'quoteCurrency' field is now expected from the frontend
    const { side, symbol, quantity, quoteCurrency } = req.body;

    if (!['BUY', 'SELL'].includes(side))
        return res.status(400).json({ error: 'Side must be BUY or SELL' });
    if (!symbol || typeof quantity !== 'number' || quantity <= 0)
        return res
            .status(400)
            .json({ error: 'Symbol and positive quantity required' });
    if (!quoteCurrency)
        return res.status(400).json({ error: 'quoteCurrency is required' });

    const coin = await get(
        'SELECT * FROM coins WHERE symbol = ?',
        symbol.toUpperCase()
    );
    if (!coin) return res.status(404).json({ error: 'Coin not found' });

    // NOTE: The price is always based on the coin's USDT value in this demo.
    // A real-world app would need a conversion rate (e.g., USDT to INR).
    const price = coin.price;
    const cost = price * quantity;

    // Ensure wallets for both currencies exist
    await run(
        'INSERT OR IGNORE INTO wallets(user_id, currency, balance) VALUES (?,?,0)',
        req.user.id,
        quoteCurrency.toUpperCase()
    );
    await run(
        'INSERT OR IGNORE INTO wallets(user_id, currency, balance) VALUES (?,?,0)',
        req.user.id,
        symbol.toUpperCase()
    );

    if (side === 'BUY') {
        const quoteWallet = await get(
            'SELECT balance FROM wallets WHERE user_id = ? AND currency = ?',
            req.user.id,
            quoteCurrency.toUpperCase()
        );
        if (!quoteWallet || quoteWallet.balance < cost) {
            return res
                .status(400)
                .json({ error: `Insufficient ${quoteCurrency} balance` });
        }
        // Debit the quote currency (e.g., USDT or INR)
        await run(
            'UPDATE wallets SET balance = balance - ? WHERE user_id = ? AND currency = ?',
            cost,
            req.user.id,
            quoteCurrency.toUpperCase()
        );
        // Credit the asset (e.g., BTC)
        await run(
            'UPDATE wallets SET balance = balance + ? WHERE user_id = ? AND currency = ?',
            quantity,
            req.user.id,
            symbol.toUpperCase()
        );
    } else {
        // SELL
        const assetWallet = await get(
            'SELECT balance FROM wallets WHERE user_id = ? AND currency = ?',
            req.user.id,
            symbol.toUpperCase()
        );
        if (!assetWallet || assetWallet.balance < quantity)
            return res
                .status(400)
                .json({ error: `Insufficient ${symbol} balance` });

        // Debit the asset (e.g., BTC)
        await run(
            'UPDATE wallets SET balance = balance - ? WHERE user_id = ? AND currency = ?',
            quantity,
            req.user.id,
            symbol.toUpperCase()
        );
        // Credit the quote currency (e.g., USDT or INR)
        await run(
            'UPDATE wallets SET balance = balance + ? WHERE user_id = ? AND currency = ?',
            cost,
            req.user.id,
            quoteCurrency.toUpperCase()
        );
    }

    const order = await run(
        "INSERT INTO orders(user_id, side, symbol, price, quantity, status) VALUES (?,?,?,?,?,'FILLED')",
        req.user.id,
        side,
        symbol.toUpperCase(),
        price,
        quantity
    );
    const orderId = order.lastID;
    await run(
        'INSERT INTO trades(order_id, user_id, symbol, price, quantity) VALUES (?,?,?,?,?)',
        orderId,
        req.user.id,
        symbol.toUpperCase(),
        price,
        quantity
    );
    const created = await get('SELECT * FROM orders WHERE id = ?', orderId);
    res.json(created);
});

app.get('/api/orders', authRequired, async (req, res) => {
    const rows = await all(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        req.user.id
    );
    res.json(rows);
});

app.get('/api/trades', authRequired, async (req, res) => {
    const rows = await all(
        'SELECT * FROM trades WHERE user_id = ? ORDER BY traded_at DESC',
        req.user.id
    );
    res.json(rows);
});

// ------- Serve Frontend --------
app.get('/', (req, res) => res.redirect('/public/index.html'));

// ------- Start ---------
init().then(() => {
    app.listen(PORT, () =>
        console.log(`✅ Server running on http://localhost:${PORT}`)
    );
});
