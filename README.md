<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

<h1 align="center">🏦 Digital Vault — Frontend</h1>

<p align="center">
  <strong>A modern, responsive banking SPA built with React 19, Vite, and Tailwind CSS — featuring dark mode, silent token refresh, OTP-secured transfers, and encrypted transaction history.</strong>
</p>

<p align="center">
  <a href="https://vault-frontend-app.vercel.app">🌐 Live Demo</a> •
  <a href="https://vault-backend-api-szxu.onrender.com/docs">📡 API Docs</a> •
  <a href="https://github.com/kavinda44/vault-backend-api">Backend Repo</a>
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Application Pages](#application-pages)
- [API Integration](#api-integration)
- [Authentication Flow](#authentication-flow)
- [State Management](#state-management)
- [Client-Side Validation](#client-side-validation)
- [Features](#features)
- [Deployment](#deployment)

---

## Overview

Digital Vault is a **secure banking prototype** showcasing modern frontend security practices and premium UI design. This repository contains the **React SPA frontend** that communicates with the [FastAPI backend](https://github.com/kavinda44/vault-backend-api) to deliver a full-featured banking experience.

### Key Highlights

- 🎨 **Premium UI** — Glassmorphism effects, smooth transitions, and dark mode support via Tailwind CSS
- 🔄 **Silent Token Refresh** — Automatic JWT refresh using HttpOnly cookies with zero user disruption
- 💸 **OTP-Secured Transfers** — Two-phase fund transfers with email-based one-time password verification
- 📊 **Interactive Dashboard** — Real-time balance display, cash flow donut chart, and recent activity feed
- 📜 **Statement Management** — Searchable, filterable transaction history with CSV export
- 🌙 **Dark Mode** — Persistent dark/light theme toggle stored in localStorage

---

## Screenshots

> 💡 Visit the [live demo](https://vault-frontend-app.vercel.app) to explore the full application.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | ^19.2.4 | UI framework (functional components, hooks) |
| **Vite** | ^8.0.1 | Build tool & dev server (HMR, fast bundling) |
| **Tailwind CSS** | ^3.4.19 | Utility-first CSS framework |
| **Lucide React** | ^0.577.0 | Icon library (dashboard, navigation) |
| **PostCSS** | ^8.5.8 | CSS processing pipeline |
| **Autoprefixer** | ^10.4.27 | Vendor prefix automation |
| **ESLint** | ^9.39.4 | Code linting |
| **Montserrat** | CDN | Primary typeface (Google Fonts) |
| **Font Awesome** | 6.4 (CDN) | Auth page icons |

---

## Project Structure

```
vault-frontend-app/
├── index.html                  # HTML entry (Montserrat font, Font Awesome CDN)
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite + React plugin configuration
├── tailwind.config.js          # Tailwind CSS 3 configuration
├── postcss.config.js           # PostCSS (Tailwind + Autoprefixer)
├── eslint.config.js            # ESLint configuration
├── public/
│   ├── favicon.svg             # App favicon
│   └── icons.svg               # Icon sprites
└── src/
    ├── main.jsx                # React entry point (StrictMode)
    ├── App.jsx                 # Root component — auth gate & session management
    ├── Auth.jsx                # Login, Register, Forgot Password (sliding panels)
    ├── Dashboard.jsx           # Dashboard shell — sidebar, header, page routing
    ├── Transfer.jsx            # Fund transfer form with OTP verification
    ├── Statements.jsx          # Transaction history — search, filter, CSV export
    ├── Profile.jsx             # Username & password update form
    ├── Settings.jsx            # Appearance & notification preferences
    ├── api.js                  # Centralised fetch wrapper with silent token refresh
    ├── index.css               # Tailwind directives + Montserrat base font
    ├── App.css                 # Vite scaffolding styles
    └── assets/
        ├── hero.png            # Hero image asset
        ├── react.svg           # React logo
        └── vite.svg            # Vite logo
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- The [backend API](https://github.com/kavinda44/vault-backend-api) running locally or deployed

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/kavinda44/vault-frontend-app.git
cd vault-frontend-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**.

### API Configuration

The API base URL is configured in `src/api.js`:

```javascript
const API_BASE = "https://vault-backend-api-szxu.onrender.com";
```

To point to a local backend, update this to:

```javascript
const API_BASE = "http://localhost:8000";
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR (port 5173) |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |

---

## Application Pages

### 🔓 Authentication (`Auth.jsx`)

A sliding-panel auth interface with three modes:

| Mode | Description |
|---|---|
| **Login** | Username & password authentication |
| **Register** | New account creation (username, email, NIC, password + confirmation) |
| **Forgot Password** | Email-based password reset request |

### 🏠 Dashboard Home (`Dashboard.jsx`)

The main dashboard view featuring:
- **Balance Card** — Current account balance with account number
- **Cash Flow Donut Chart** — Visual breakdown of income vs. expenses
- **Recent Activity** — Latest transactions at a glance

### 💸 Transfers (`Transfer.jsx`)

Two-phase fund transfer flow:
1. Fill in recipient account, amount, and description → submit
2. Receive 6-digit OTP via email → enter OTP to confirm

### 📜 Statements (`Statements.jsx`)

Full transaction history with:
- **Search** — Filter by account number or description
- **Date Filter** — Filter by date range
- **Status Filter** — Filter by transaction status
- **CSV Export** — Download transaction records

### 👤 Profile (`Profile.jsx`)

Account management:
- Update username
- Change password (requires current password)

### ⚙️ Settings (`Settings.jsx`)

User preferences:
- 🌙 Dark / Light mode toggle (persisted to localStorage)
- 🔔 Notification preferences (UI-only)

### Navigation Architecture

```
App.jsx
  ├── loggedInUser === null → Auth.jsx
  └── loggedInUser !== null → Dashboard.jsx (Shell)
                                ├── "home"       → Dashboard Home
                                ├── "transfers"  → Transfer.jsx
                                ├── "statements" → Statements.jsx
                                ├── "profile"    → Profile.jsx
                                ├── "settings"   → Settings.jsx
                                └── Quick Transfer Modal (overlay)
```

---

## API Integration

### Centralised Fetch Wrapper (`api.js`)

All API calls go through `apiFetch()`, which handles:

1. **Automatic Auth Headers** — Attaches `Authorization: Bearer <token>` from localStorage
2. **Cookie Credentials** — Sets `credentials: "include"` on every request (sends HttpOnly cookies)
3. **Silent Token Refresh** — Intercepts 401 responses and transparently refreshes the access token
4. **Concurrent Refresh Prevention** — Uses `isRefreshing` flag + shared promise to prevent duplicate refresh calls
5. **Session Expiry** — Dispatches `session-expired` CustomEvent on refresh failure (triggers auto-logout)

```
apiFetch(endpoint, options)
    │
    ├──► Attach Authorization header from localStorage
    ├──► Set credentials: "include" (send cookies)
    ├──► Make request
    │
    ├──► If 401 response:
    │    ├── Prevent concurrent refreshes (isRefreshing flag)
    │    ├── POST /refresh (sends httpOnly cookie)
    │    ├── On success: save new access_token to localStorage
    │    ├── Retry original request with new token
    │    └── On failure: dispatch "session-expired" CustomEvent
    │
    └──► Return response
```

### API Base URL

| Environment | URL |
|---|---|
| **Production** | `https://vault-backend-api-szxu.onrender.com` |
| **Development** | `http://localhost:8000` |

---

## Authentication Flow

### Login → Dashboard

```
User enters credentials
    │
    ├──► POST /login
    │    └── Response: { access_token, username, account_number, balance }
    │
    ├──► Store in localStorage:
    │    ├── token (JWT access token)
    │    ├── username
    │    └── vault_session (full user object)
    │
    ├──► Refresh token set as HttpOnly cookie by server
    │
    └──► App.jsx detects loggedInUser → render Dashboard.jsx
```

### Auto-Logout on Session Expiry

```
apiFetch() receives 401
    │
    ├──► Attempt POST /refresh
    │
    ├──► If refresh fails:
    │    ├── Dispatch "session-expired" CustomEvent
    │    └── App.jsx listener:
    │         ├── Clear localStorage (token, username, vault_session)
    │         └── Set loggedInUser = null → render Auth.jsx
    │
    └──► User is redirected to login
```

---

## State Management

The app uses **React `useState`** with **localStorage persistence** — no external state management library required.

### localStorage Keys

| Key | Purpose |
|---|---|
| `token` | JWT access token (15-minute expiry) |
| `username` | Currently logged-in username |
| `vault_session` | Full user session object (username, accountNumber, balance) |
| `vault_profile_{accountNumber}` | Per-account cached profile data |
| `vault_dark_mode` | Dark mode preference (`true` / `false`) |

### Cookie (HttpOnly)

| Key | Purpose |
|---|---|
| `refresh_token` | Opaque refresh token — **not accessible to JavaScript** |

---

## Client-Side Validation

| Field | Validation Rule |
|---|---|
| **Email** | Regex: `^[^\s@]+@[^\s@]+\.[^\s@]+$` |
| **Password** | Minimum 8 characters |
| **Confirm Password** | Must exactly match password field |

---

## Features

| Feature | Description |
|---|---|
| 🔐 **Secure Authentication** | JWT access tokens + HttpOnly refresh token cookies |
| 🔄 **Silent Token Refresh** | Seamless re-authentication without user intervention |
| 💸 **OTP-Secured Transfers** | Two-phase transfers with email-based OTP |
| 📊 **Interactive Dashboard** | Balance display, charts, and recent activity |
| 📜 **Transaction Statements** | Search, filter, and export as CSV |
| 🌙 **Dark Mode** | Persistent theme toggle |
| 📱 **Responsive Design** | Works across desktop, tablet, and mobile |
| 👤 **Profile Management** | Update credentials securely |
| 🛡️ **XSS Protection** | Refresh tokens stored in HttpOnly cookies (inaccessible to JS) |
| ⏱️ **Session Management** | Automatic logout on session expiry |

---

## Deployment

### Vercel (Production)

The frontend is deployed on **Vercel** with automatic deployments from the `main` branch.

| Property | Value |
|---|---|
| **Platform** | Vercel |
| **Framework Preset** | Vite |
| **Build Command** | `vite build` |
| **Output Directory** | `dist` |
| **Production URL** | `https://vault-frontend-app.vercel.app` |
| **TLS** | Automatic HTTPS via Vercel |
| **CDN** | Vercel Edge Network (global) |

### Deploy Your Own

1. Fork this repository
2. Import the project in [Vercel Dashboard](https://vercel.com/new)
3. Vercel auto-detects Vite — no additional configuration needed
4. Set the API base URL in `src/api.js` to your backend URL
5. Deploy 🚀

---

## 🔗 Related

| Resource | Link |
|---|---|
| **Backend API Repository** | [vault-backend-api](https://github.com/kavinda44/vault-backend-api) |
| **Live Frontend** | [vault-frontend-app.vercel.app](https://vault-frontend-app.vercel.app) |
| **Live API Docs** | [Swagger UI](https://vault-backend-api-szxu.onrender.com/docs) |

---

## 📄 License

This project was developed as part of the **NB6005CEM Security** module at Coventry University.

---

<p align="center">

</p>
