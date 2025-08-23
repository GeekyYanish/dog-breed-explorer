# CryptoX Lite — Full-Stack (Node.js + Express + REST API + HTML5 + Tailwind)


A lightweight demo of a centralized crypto trading platform with:


- **Node.js + Express** REST API
- **SQLite** (file database, zero setup) via `sqlite3`
- **JWT Auth** (register/login)
- **Wallets** with USDT and assets
- **Coins** (BTC/ETH/SOL) with quick price tweaks
- **Instant market orders** (BUY/SELL) that fill immediately
- **Vanilla HTML5 + Tailwind CSS** frontend


## Quickstart


```bash
npm install
npm run dev # or: npm start
# open http://localhost:3000
```


## REST Endpoints


- `POST /api/auth/register` `{ name, email, password }` → `{ token }`
- `POST /api/auth/login` `{ email, password }` → `{ token }`
- `GET /api/me` (auth)
- `GET /api/coins`
- `POST /api/coins/:symbol/price` `{ price }` (dev)
- `GET /api/wallets` (auth)
- `POST /api/wallets/deposit` `{ currency, amount }` (auth)
- `POST /api/orders` `{ side, symbol, quantity }` (auth)
- `GET /api/orders` (auth)
- `GET /api/trades` (auth)


## Notes
- This is an educational demo (no real money!).
- To reset, delete the `data.db` file and restart.
- Change `JWT_SECRET` in production.