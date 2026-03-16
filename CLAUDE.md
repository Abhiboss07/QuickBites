# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QuickBites is a full-stack food delivery app with three separate runnable components:
- **Backend** — Node.js/Express REST API (port 5000, MongoDB)
- **Frontend** — React/Vite web app (port 5173)
- **Expo Wrapper** — React Native mobile app that wraps the web frontend in a WebView

## Commands

### Backend (`/backend`)
```bash
cd backend
npm run dev       # Start with nodemon (hot reload)
npm start         # Start without hot reload
npm test          # Run Jest tests
```

### Frontend (root)
```bash
npm run dev       # Vite dev server on port 5173
npm run build     # Production build to /dist
npm run preview   # Preview production build
```

### Expo Mobile Wrapper (`/expo-wrapper`)
```bash
cd expo-wrapper
npx expo start            # Start Expo dev server
npx expo start --android  # Android emulator
npx expo start --ios      # iOS simulator
expo lint                 # Lint check
```

## Architecture

### Three-Tier Flow
```
Expo WebView → Web Frontend (React/Vite) → Backend API (Express) → MongoDB
```

The Expo wrapper simply loads the web frontend in a WebView. The `expo-wrapper/app/index.tsx` has a hardcoded IP (`192.168.0.169:5173`) to reach the Vite dev server on the local network.

The Vite config (`vite.config.js`) proxies `/api/*` to `http://localhost:5000`, so the frontend never hits the backend directly with a full URL — all API calls go through `/api/...`.

### State Management
The frontend uses a single Context + Reducer pattern in `src/context/AppContextBackend.jsx`. All components access state via `useApp()`. This context manages: auth, cart, restaurants, orders, and favorites.

### API Client
`src/services/api.js` is the centralized fetch wrapper. It reads the JWT token from `localStorage` and attaches it as a Bearer token on every request. On a 401 response it clears the token and redirects to `/login`.

### Authentication
- Register/login returns a JWT (expires 7 days), stored in `localStorage`
- Backend middleware in `backend/middleware/auth.js` validates the Bearer token on protected routes
- Backend env vars: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE` (set in `backend/.env`)

### Data Models
- **User**: name, email, hashed password, addresses[], favorites[] (Restaurant refs)
- **Restaurant**: menu items embedded as subdocuments, cuisine, category, featured, ecoFriendly flags
- **Order**: references User + Restaurant, status enum (`pending→confirmed→preparing→ready→out-for-delivery→delivered`), tracking info
- **Cart**: one per user, totals auto-calculated on save via Mongoose middleware

### Promo Codes (hardcoded in backend)
`YUMMY20` (20% off, min $15), `QUICK10` (10% off, min $10), `FIRST50` (50% off, max $15), `FREESHIP` (free delivery, min $20)

## Key Files

| File | Purpose |
|------|---------|
| `backend/server.js` | Express app entry point, middleware setup |
| `backend/routes/` | Route handlers: `auth.js`, `restaurants.js`, `cart.js`, `orders.js`, `users.js` |
| `backend/models/` | Mongoose schemas: `User.js`, `Restaurant.js`, `Order.js`, `Cart.js` |
| `backend/middleware/auth.js` | JWT verification middleware |
| `src/context/AppContextBackend.jsx` | Global frontend state (Context + Reducer) |
| `src/services/api.js` | Centralized API client with token management |
| `vite.config.js` | Dev proxy `/api` → `localhost:5000` |
| `expo-wrapper/app/index.tsx` | WebView component pointing to local IP |
