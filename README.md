# Secure Vault Banking Application - Frontend (Presentation Layer)

This repository contains the presentation layer of the **Secure Vault** banking simulator, developed as part of the NB6005CEM Security module. It is a decoupled Single Page Application (SPA) built to securely interact with the FastAPI backend while mitigating common client-side vulnerabilities.

##  Technology Stack
*   **Framework:** React 19.2
*   **Build Tool:** Vite 8.0
*   **Styling:** Tailwind CSS 3.4
*   **Deployment:** Vercel Edge Network

##  Key Security Features
*   **Dual-Token Session Management:** Silently manages short-lived (15-minute) JWT access tokens in memory/local storage while handling 7-day opaque refresh tokens securely via `httpOnly` cookies.
*   **API Interceptor:** A centralized fetch wrapper (`api.js`) that automatically handles token rotation and attaches `credentials: "include"` to ensure secure, cross-origin cookie transmission.
*   **Cross-Site Scripting (XSS) Mitigation:** React's DOM rendering inherently sanitizes inputs, and the reliance on `httpOnly` cookies ensures sensitive session data is mathematically isolated from malicious JavaScript.
*   **Client-Side Validation:** Enforces strict regex and length requirements on user inputs before they ever reach the network layer.

##  Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/kavinda44/vault-frontend-app.git](https://github.com/kavinda44/vault-frontend-app.git)
   cd vault-frontend-app
