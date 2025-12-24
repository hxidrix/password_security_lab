# Password Security & Attack Simulation Dashboard

An educational dashboard for learning and demonstrating password security concepts. Includes password strength analysis, hashing demonstrations, attack simulations and deterministic security analysis—all fully client-side.

## 🎯 Project Overview

**Tech Stack:**

* **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Framer Motion
* **Crypto:** WebCrypto API (SHA-256) + bcryptjs
* **Build Tool:** Vite (HMR)
* **Architecture:** Frontend-only (no backend required)

**Key Features:**

* Password strength analysis with detailed pattern detection
* Hashing demonstrations (SHA-256 vs bcrypt with salts)
* Brute-force and dictionary attack simulations
* Deterministic security analysis and crack-time estimates (local heuristics)
* Probability heatmaps and visualization of attack scenarios
* Fully local, deterministic analysis (100% client-side)

---

## 📁 Project Structure

```
password-security-dashboard/
├── apps/
│   └── web/                          # React frontend
│       ├── src/
│       │   ├── App.tsx               # Root component
│       │   ├── main.tsx              # React entry point
│       │   ├── index.css             # Global styles
│       │   ├── App.css               # App styles
│       │   ├── components/           # Reusable UI components
│       │   ├── features/             # Feature modules
│       │   ├── hooks/                # Custom React hooks
│       │   ├── pages/                # Page components
│       │   ├── state/                # State management
│       │   └── utils/                # Utility functions
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── package.json
├── package.json                      # Root workspace config
└── README.md                         # This file
```

---

## 🔧 Setup & Development

### Prerequisites

* Node.js 20+
* npm 7+ (for workspace support)

### Installation

```bash
# From repo root
npm install
```

### Running Locally

**Development (web only):**

```bash
npm run dev -w web
```

The web app will be available at `http://localhost:5173`.

**Building:**

```bash
npm run build -w web   # Build web only
```

**Linting:**

```bash
npm run lint -w web
```

---

## 📚 Function Documentation (Highlights)

### Utilities - Password Analysis

* `apps/web/src/utils/password/analysis.ts` → `analyzePassword(password)`
* Computes entropy, detects patterns, scores strength, gives suggestions.

### Utilities - Password Generation

* `apps/web/src/utils/password/generate.ts` → `generateStrongPassword(length = 16)`
* Generates high-entropy passwords locally using `crypto.getRandomValues()`.

### Utilities - Common Passwords & Dictionary

* `COMMON_PASSWORDS` & `COMMON_WORDS` used for analysis and dictionary simulations.
* Deterministic, fully client-side, no external downloads.

### Utilities - Cryptography

* `apps/web/src/utils/crypto/sha256.ts` → `sha256Hex(message)`
* Unsalted SHA-256 hashing using WebCrypto API.

### Simulations

* Brute-force and dictionary attack simulations.
* Entropy decomposition, crack-time estimators, probability heatmaps.
* Fully deterministic client-side models.

### Hooks

* `useDebouncedValue.ts` — Debounced state updates for password inputs.

---

## 🦞 UI Highlights

* `PasswordAnalyzerCard` — Real-time password analysis.
* `HashingDemoCard` — SHA-256 vs bcrypt comparisons.
* `AttackSimulationCard` — Brute-force & dictionary attack demos.
* `AISecurityAnalysisCard` — Deterministic security heuristics (local only).
* `SecureSuggestionsCard` — Generates strong password suggestions locally.

> Note: All AI and backend references have been removed. Everything runs client-side.

---

## 🔒 Security Notes

* All analyses run locally, deterministic, no external calls.
* Passwords used for demo/testing should **never** be reused in real accounts.

---

## 🚀 Deployment

* Frontend is a Vite app, deployable as static assets.
* Build with:

```bash
npm run build -w web
```

---

## 🎓 Educational Use

This dashboard teaches:

* Password entropy & randomness
* Hash functions (SHA-256 vs bcrypt)
* Realistic brute-force and dictionary attack simulations
* Risk assessment based on patterns
* Deterministic, local security analysis

---

## 🛠️ License & Attribution

Built for educational and portfolio purposes. Uses:

* React
* Tailwind CSS
* Framer Motion
* bcryptjs

---

© 2025 Haider Ali. All rights reserved.
