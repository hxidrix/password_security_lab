# Password Security & Attack Simulation Dashboard

An educational dashboard for learning and demonstrating password security concepts. Includes password strength analysis, hashing demonstrations, attack simulations and locally-deterministic security analysis.

## 🎯 Project Overview

**Tech Stack:**

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Framer Motion
- **Crypto:** WebCrypto API (SHA-256) + bcryptjs
- **Build Tool:** Vite (HMR)
- **Architecture:** Frontend-only (no backend required)

**Key Features:**

- Password strength analysis with detailed pattern detection
- Hashing demonstrations (SHA-256 vs bcrypt with salts)
- Brute-force and dictionary attack simulations
- Deterministic security analysis and crack-time estimates (local heuristics)
- Probability heatmaps and visualization of attack scenarios
- Fully local, deterministic analysis (100% client-side)

---

## 📁 Project Structure

```
ai-password-security-dashboard/
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

- Node.js 20+ (tested with Node 24)
- npm 7+ (for workspaces support)

### Installation

```bash
# From repo root
npm install
```

### Running Locally

**Development (web only):**

```bash
npm run dev
```

The web app will be available at `http://localhost:5173` by default.

**Individual apps:**

```bash
npm run dev -w web     # Web only
```

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

The project contains a number of utilities and simulation helpers. Below are the most important modules and what they do.

### Utilities - Password Analysis

See `apps/web/src/utils/password/analysis.ts` for `analyzePassword(password)` which returns a comprehensive analysis (entropy, detected patterns, score, warnings and suggestions). The analysis is deterministic and runs fully in the browser.

### Utilities - Password Generation

See `apps/web/src/utils/password/generate.ts` for `generateStrongPassword(length = 16)` — cryptographically secure, client-side password generation using `crypto.getRandomValues()`.

### Utilities - Common Passwords & Dictionary

See `apps/web/src/utils/password/common.ts` for `COMMON_PASSWORDS` and `COMMON_WORDS` used by analysis and dictionary simulations. These are bundled and deterministic (no external downloads).

### Utilities - Duration Formatting

`apps/web/src/utils/format/duration.ts` provides `formatDurationSeconds(seconds)` for user-friendly time formatting used in crack-time displays.

### Utilities - Cryptography

`apps/web/src/utils/crypto/sha256.ts` provides `sha256Hex(message)` using the WebCrypto API and returns a hex string.

### Simulations

Simulations live under `apps/web/src/utils/simulations/` and include entropy decomposition, crack time estimators, probability heatmaps and risk scoring. These functions are deterministic client-side models used for educational purposes.

### Hooks

`apps/web/src/hooks/useDebouncedValue.ts` — simple debounced value hook used in the password input components.

---

## 🧩 UI Highlights

The main dashboard at `apps/web/src/pages/Dashboard.tsx` composes the following feature cards (client-side only):

- `PasswordAnalyzerCard` — real-time analysis of entered passwords
- `HashingDemoCard` — SHA-256 vs bcrypt comparisons
- `AttackSimulationCard` — brute-force and dictionary attack demos
- `AISecurityAnalysisCard` — deterministic security analysis using local heuristics (not an external AI)
- `SecureSuggestionsCard` — generates strong password suggestions locally

Note: Although the project documentation historically referenced optional backend AI helpers, this codebase operates fully on deterministic, local heuristics and simulations. Any references to external AI APIs have been removed.

---

## 🔒 Security Notes

- All analyses run deterministically and locally (no external network calls by default).
- Passwords used for demo/testing should not be reused for real accounts.

---

## 🚀 Deployment

The frontend is a Vite app and can be deployed as static assets. Set `VITE_API_BASE_URL` only if you add a custom API later — by default the app does not require or call a backend.

**Build command:**

```bash
npm run build -w web
```

---

## 📝 License & Attribution

Built for educational and portfolio purposes. Uses React, Tailwind CSS, Framer Motion and bcryptjs.

---

Last updated: December 21, 2025

# Password Security & Attack Simulation Dashboard

A portfolio-quality, educational dashboard for learning and demonstrating password security concepts. Includes password strength analysis, hashing demonstrations, attack simulations and AI-powered security analysis.

## 🎯 Project Overview

**Tech Stack:**

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Framer Motion
- **Crypto:** WebCrypto API (SHA-256) + bcryptjs
- **Build Tool:** Vite (HMR)
- **Architecture:** Frontend-only (no backend required)

**Key Features:**

- Advanced password strength analysis with detailed pattern detection
- Hashing demonstrations (SHA-256 vs bcrypt with salts)
- Brute-force and dictionary attack simulations
- AI-powered security analysis with crack-time estimates
- Probability heatmaps for crack-time visualization
- Fully local, deterministic analysis (100% client-side)

---

## 📁 Project Structure

```
ai-password-security-dashboard/
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
│       │   ├── state/                # State management (Zustand)
│       │   └── utils/                # Utility functions
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── package.json
├── package.json                      # Root workspace config
├── README.md                         # Original README
└── COMPREHENSIVE_README.md           # This file
```

---

## 🔧 Setup & Development

### Prerequisites

- Node.js 20+ (tested with Node 24)
- npm 7+ (for workspaces support)

### Installation

```bash
# From repo root
npm install
```

### Environment Configuration (Optional)

```bash
# Frontend
cp apps/web/.env.example apps/web/.env

# Backend (for real AI responses, set OPENAI_API_KEY)
cp apps/api/.env.example apps/api/.env
```

### Running Locally

**Development (both apps):**

```bash
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:8787

**Individual apps:**

```bash
npm run dev -w web     # Web only
npm run dev -w api     # API only
```

**Building:**

```bash
npm run build          # Build both
npm run build -w web   # Web only
npm run build -w api   # API only
```

**Linting:**

```bash
npm run lint           # Lint web workspace
npm run lint -w web
```

---

## 📚 Complete Function Documentation

### **Utilities - Password Analysis**

#### `apps/web/src/utils/password/analysis.ts`

**`analyzePassword(password: string): PasswordAnalysis`**

- Comprehensive password strength analysis using entropy, patterns and heuristics
- Returns:
  - `password`: Original password string
  - `length`: Character count
  - `hasLower`, `hasUpper`, `hasDigit`, `hasSymbol`: Character class presence
  - `charsetSize`: Estimated character set size (26-95)
  - `entropyBits`: Heuristic entropy estimate (brute-force space)
  - `score`: 0-100 strength score
  - `label`: "Very weak" | "Weak" | "Fair" | "Strong" | "Very strong"
  - `patterns`: Detected patterns (common password, sequences, repeats, dictionary words)
  - `warnings`: User-facing security warnings
  - `suggestions`: Actionable improvement suggestions

**Internal helper functions:**

- `computeCharsetSize(pw)` - Detects character classes used in password
- `isCommonPassword(pwLower)` - Checks against top 20 common passwords
- `containsCommonWord(pwLower)` - Dictionary matching against ~10k word list
- `hasRepeatedChars(pw)` - Detects runs of 3+ identical characters
- `hasSequentialRun(pwLower)` - Detects numeric (0-9), alphabetic (a-z), keyboard sequences
- `strengthLabel(score)` - Maps score to human-readable label
- `log2(n)` - Base-2 logarithm helper
- `clamp(n, min, max)` - Range clamping utility

---

### **Utilities - Password Generation**

#### `apps/web/src/utils/password/generate.ts`

**`generateStrongPassword(length = 16): string`**

- Generates cryptographically random, high-entropy passwords
- **Features:**
  - Uses `crypto.getRandomValues()` for randomness
  - Enforces 4 character classes (lowercase, uppercase, digits, symbols)
  - Default 16 characters (clamps 14-24)
  - Fisher-Yates shuffle for distribution
- **Character sets:**
  - Lowercase: `abcdefghjkmnpqrstuvwxyz` (23 chars, no ambiguous)
  - Uppercase: `ABCDEFGHJKMNPQRSTUVWXYZ` (23 chars)
  - Digits: `23456789` (8 chars, no 0/1)
  - Symbols: `!@#$%^&*-_=+?` (13 chars)

**Internal helper functions:**

- `randInt(maxExclusive)` - Cryptographically random integer [0, max)
- `pick(set)` - Random character from character set

---

### **Utilities - Common Passwords & Dictionary**

#### `apps/web/src/utils/password/common.ts`

**`COMMON_PASSWORDS: readonly string[]`**

- Top 7000+ most common passwords in real-world breaches
- Used for pattern detection and early-termination in crack simulations

**`COMMON_WORDS: string[]`**

- ~10k word dictionary for dictionary attack simulations
- Built from seed words with mangling (prefixes, suffixes, leetspeak)
- Variants include: numeric suffixes, character substitutions, compound words
- Deterministically generated from seed to avoid external files

**`buildLargeDictionary(): string[]`**

- Expands seed set into ~40k-word corpus via:
  - Leetspeak transformation (`a→@`, `o→0`, etc.)
  - Prefix/suffix combinations
  - Numeric enumeration

---

### **Utilities - Duration Formatting**

#### `apps/web/src/utils/format/duration.ts`

**`formatDurationSeconds(seconds: number): string`**

- Converts raw seconds into human-readable time durations
- **Outputs:**
  - `≤ 1s`: Millisecond precision (e.g., "0.001s", "0.523s")
  - `< 1 min`: Seconds (e.g., "45.2s")
  - `< 1 hour`: Minutes (e.g., "12.5 min")
  - `< 1 day`: Hours (e.g., "3.2 hr")
  - `< 1 year`: Days (e.g., "45.3 days")
  - `≥ 1 year`: Years with scientific notation for extreme values
  - `0 or ≤ 0`: Returns "—" (infinity symbol)
- Used in crack-time visualizations

---

### **Utilities - Cryptography**

#### `apps/web/src/utils/crypto/sha256.ts`

**`sha256Hex(message: string): Promise<string>`**

- Computes SHA-256 hash of input message using WebCrypto API
- Returns lowercase hexadecimal string representation
- Demonstrates unsalted hashing (no protection against rainbow tables)

**Internal helper:**

- `toHex(bytes)` - Converts Uint8Array to hex string with zero-padding

---

### **Utilities - DOM Utilities**

#### `apps/web/src/utils/cn.ts`

**`cn(...classes): string`**

- Conditional class name concatenation utility
- Filters out falsy values, joins with spaces
- Simplifies React className handling with booleans/undefined
- Example: `cn('base', isActive && 'active', false, undefined)` → `"base active"`

---

### **Utilities - API Client**

#### `apps/web/src/utils/api/client.ts`

**`postJson<TResponse>(opts): Promise<TResponse>`**

- Generic JSON POST request wrapper
- **Parameters:**
  - `apiBaseUrl`: API origin (e.g., `http://localhost:8787`)
  - `path`: Endpoint path (e.g., `/api/password/suggest`)
  - `body`: Request payload (auto-serialized to JSON)
  - `devOpenAIKey?`: Dev-only OpenAI key passthrough (server rejects in production)
- **Dev-only feature:** Sends `x-openai-api-key` header if provided and in dev mode
- **Error handling:** Throws with server-provided error message or HTTP status

---

### **Custom Hooks**

#### `apps/web/src/hooks/useDebouncedValue.ts`

**`useDebouncedValue<T>(value: T, delay = 250): T`**

- Debounces state updates with configurable delay
- **Use case:** Real-time password analysis (waits for user to stop typing)
- **Behavior:**
  - Returns previous value immediately
  - Updates state after `delay` ms of inactivity
  - Cancels pending updates if value changes
  - Cleans up timeout on unmount

---

### **Simulations - Entropy Calculations**

#### `apps/web/src/utils/simulations/entropy.ts`

**`baselineEntropyBits(opts): number`**

- Computes brute-force entropy estimate: `length × log₂(charsetSize)`
- **Formula:** `E = L × log₂(C)` where L=length, C=charset size
- Used as baseline before applying pattern penalties

**`entropyBreakdown(opts): EntropyBreakdown`**

- Decomposes entropy into components:
  - `baselineBits`: Baseline entropy from length & charset
  - `penaltyBits`: Deduction for common patterns
  - `repetitionPenaltyBits`: Deduction for repeated characters
  - `effectiveBits`: Final effective entropy (baseline - penalties)
- Used in UI breakdown visualization

**Internal helper:**

- `log2(n)` - Base-2 logarithm

---

### **Simulations - Crack Time Calculations**

#### `apps/web/src/utils/simulations/cracking.ts`

**`avgTimeToCrackSeconds(opts): number`**

- Estimates average time to crack via brute-force (random guessing)
- **Formula:** `T_avg ≈ (2^E / 2) / G_ps` where E=entropy bits, G_ps=guesses/sec
- **Handles edge cases:** Overflow protection (>700 exponent = Infinity)

**`probCrackedBySeconds(opts): number`**

- Probability password is cracked within specific time window
- **Formula:** `P = 1 - e^(-λ)` where λ = (guesses) / (2^entropy)
- **Range:** 0 (impossible) to 1 (certain)
- **Use case:** Heatmap probability visualization

**`buildProbabilityHeatmap(opts): number[][]`**

- Generates 2D probability matrix for visualization
- **Inputs:**
  - `entropyBits`: Password entropy
  - `guessesPerSecond`: Attacker rate
  - `horizonsSeconds`: Time windows (e.g., [1h, 1d, 1w])
  - `bands`: Scaling factors for coloring
- **Output:** Matrix where each cell = probability × band factor

---

### **Simulations - Risk Assessment**

#### `apps/web/src/utils/simulations/risk.ts`

**`computeRisk(opts): RiskReport`**

- Comprehensive risk assessment including online/offline attack scenarios
- **Returns:**
  - `score`: 0-100 risk score
  - `tier`: "low" | "medium" | "high"
  - `online.p1h/p1d/p1w`: Crack probability within 1 hour/day/week (online)
  - `offline.p1h/p1d/p1w`: Crack probability within 1 hour/day/week (offline)
- **Defaults:**
  - Online: 100 guesses/sec (rate-limited authentication)
  - Offline: 1 billion guesses/sec (GPU cracking)
  - Pattern multiplier: 1.0 (adjustable for detected patterns)

**`riskTierFromScore(score): RiskTier`**

- Maps score to tier:
  - `≥ 70` → "high"
  - `35–70` → "medium"
  - `< 35` → "low"

---

### **AI & Security Analysis**

#### `apps/web/src/features/ai/securityAnalysisEngine.ts`

**`runSecurityAnalysis(password: string): SecurityAnalysis`**

- Deterministic security analysis using heuristics (no external AI required)
- **Returns:**
  - `executiveSummary`: Professional 1-liner assessment
  - `technicalFindings`: Detailed bullet points (entropy, length, charset, patterns)
  - `attackFeasibility`: Analysis of online vs offline crack likelihood
  - `riskClassification`: "LOW" | "MODERATE" | "HIGH"
  - `recommendations`: Actionable remediation steps
  - `metadata`: Entropy, length, charset, patterns for reference
- **Risk logic:**
  - LOW: `entropy > 60 bits && score ≥ 60 && no patterns`
  - MODERATE: `entropy ≥ 40 bits`
  - HIGH: Escalated by common password or dictionary word presence

**`TRANSPARENCY_LABEL: string`**

- Disclosure: "Analysis generated using deterministic security heuristics and simulated attack models."

---

### **Backend - API Server**

#### `apps/api/src/index.ts`

**`mockAnalysis(password): object`**

- Lightweight server-side analysis fallback (when OpenAI key unavailable)
- **Returns:**
  - `mode`: "mock"
  - `summary`: Explanation that local analysis is running
  - `weaknesses`: Array of identified issues (length, charset, patterns)
  - `improvements`: Actionable suggestions
- **Checks:**
  - Length < 12 characters
  - Missing uppercase, lowercase, digits, symbols
  - Presence of common password substrings

**`generateStrongPasswordLocal(): string`**

- Server-side local password generator (mirrors frontend)
- **Returns:** 16-character password with mixed character classes
- **Process:** Random selection → Fisher-Yates shuffle

**`main(): Promise<void>`**

- Express.js server initialization
- **Routes:**
  - `GET /api/health` - Health check
  - `POST /api/ai/analyze` - Password analysis endpoint
  - `POST /api/password/suggest` - Strong password generation (1-5 suggestions)
- **CORS:** Configurable origin (default: `http://localhost:5173`)
- **Listens:** Port from `PORT` env var (default: 8787)

**Internal helpers:**

- `jsonFromLooseText(text)` - Extracts JSON object from raw text response

---

### **UI Components - Basic**

#### `apps/web/src/components/ui/Card.tsx`

**`Card({ children, className, delay }): JSX.Element`**

- Motion-animated card container with stagger entrance
- **Props:**
  - `children`: Card content
  - `className?`: Additional Tailwind classes
  - `delay?`: Entrance animation delay (for dashboard stagger)
- **Animation:** Fade + slide-up (0.35s duration)
- **Hover:** Subtle lift effect (-2px)

---

#### `apps/web/src/components/ui/SectionHeader.tsx`

**`SectionHeader({ title, subtitle, right, className }): JSX.Element`**

- Flexible section heading with optional subtitle and right slot
- **Props:**
  - `title`: Main heading text
  - `subtitle?`: Smaller description text
  - `right?`: React node for right-aligned content (e.g., button)
  - `className?`: Additional styles
- **Layout:** Flexbox, 2-column with gap

---

#### `apps/web/src/components/ui/Metric.tsx`

**`Metric({ label, value, sublabel, className }): JSX.Element`**

- Display card for numeric metrics (entropy, score, length)
- **Props:**
  - `label`: Metric name (xs text, muted color)
  - `value`: Main display value (large, bold)
  - `sublabel?`: Secondary text (xs, muted)
  - `className?`: Additional styles
- **Styling:** Rounded border, dark background, accent color

---

#### `apps/web/src/components/ui/ProgressBar.tsx`

**`ProgressBar({ value, className, heightClassName }): JSX.Element`**

- Animated progress bar with gradient fill
- **Props:**
  - `value`: 0–1 range (clamped)
  - `className?`: Container styles
  - `heightClassName?`: Height (default: `h-2.5`)
- **Gradient:** Red → yellow → green based on position
- **Animation:** Smooth interpolation with Framer Motion

**Internal helper:**

- `clamp01(n)` - Clamps number to 0-1 range

---

#### `apps/web/src/components/ui/CopyButton.tsx`

**`CopyButton({ text, label, className }): JSX.Element`**

- Copy-to-clipboard button with feedback animation
- **Props:**
  - `text`: Text to copy
  - `label?`: Button label (default: "Copy")
  - `className?`: Additional styles
- **Behavior:** Tooltip feedback, temporary success state

---

#### `apps/web/src/components/ui/Tooltip.tsx`

**`Tooltip({ content, children, className, side }): JSX.Element`**

- Accessible tooltip with mouse/focus triggers
- **Props:**
  - `content`: Tooltip text/element
  - `children`: Trigger element
  - `className?`: Trigger container styles
  - `side?`: Position ("top" | "bottom", default: "top")
- **Accessibility:** ARIA `aria-describedby`, unique ID per instance
- **Animation:** Fade + scale (0.12s)

---

### **UI Components - Charts**

#### `apps/web/src/components/charts/DonutChart.tsx`

**`DonutChart({ segments, size, strokeWidth, className }): JSX.Element`**

- Animated donut chart for multi-category visualization
- **Props:**
  - `segments`: Array of `{ label, value, color }`
  - `size?`: Viewport size (default: 120)
  - `strokeWidth?`: Ring thickness (default: 14)
  - `className?`: SVG container styles
- **Features:** Arc animation, hover state, percentage labels

**Internal helpers:**

- `clamp01(n)` - Range clamping
- `polarToCartesian(cx, cy, r, angleDeg)` - Coordinate conversion
- `describeArc(cx, cy, r, startAngle, endAngle)` - SVG arc path generation

---

#### `apps/web/src/components/charts/Heatmap.tsx`

**`Heatmap({ values, rowLabels, colLabels, className }): JSX.Element`**

- 2D grid visualization with color intensity mapping
- **Props:**
  - `values`: 2D array of 0–1 probabilities
  - `rowLabels?`: Left-side labels
  - `colLabels?`: Top labels
  - `className?`: Container styles
- **Coloring:** Red (0) → yellow (0.5) → green (1)

**Internal helpers:**

- `clamp01(n)` - Range clamping
- `cellClass(v)` - Maps value to Tailwind color class

---

#### `apps/web/src/components/charts/BarMeter.tsx`

**`BarMeter({ value, label, max, color, className }): JSX.Element`**

- Horizontal bar meter for single-value metrics
- **Props:**
  - `value`: Current value (0–max)
  - `label`: Meter label
  - `max?`: Maximum value (default: 100)
  - `color?`: Bar color CSS value
  - `className?`: Container styles
- **Display:** Label + percentage + animated fill bar

---

#### `apps/web/src/components/charts/EntropyChart.tsx`

**`EntropyChart({ entropyBits, length, charsetSize }): JSX.Element`**

- Breakdown chart showing entropy components and crack times
- **Visualization:** Bar chart with entropy vs length tradeoff
- **Interactive:** Hover to inspect specific length values
- **Metrics:** Shows average crack time for select entropy levels

---

#### `apps/web/src/components/charts/EntropyCrackTimeChart.tsx`

**`EntropyCrackTimeChart({ maxLength, charsetSize, highlightLength }): JSX.Element`**

- Line chart: entropy (X) vs average crack time (Y) across attacker profiles
- **Profiles:**
  - Online (rate-limited): 100 guesses/sec
  - Laptop: 1 million guesses/sec
  - GPU: 1 billion guesses/sec
- **Highlights:** Specific length on hover
- **Formatting:** Time scales from milliseconds to years

---

#### `apps/web/src/components/charts/GuessDistributionHistogram.tsx`

**`GuessDistributionHistogram({ entropyBits, horizonsSeconds }): JSX.Element`**

- Histogram showing distribution of guesses required across time windows
- **X-axis:** Number of guesses (log scale)
- **Y-axis:** Probability density
- **Bands:** Color-coded time windows (1h, 1d, 1w)

---

#### `apps/web/src/components/charts/AverageCrackTimeBars.tsx`

**`AverageCrackTimeBars({ entropyBits }): JSX.Element`**

- Bar chart comparing average crack times across attacker profiles
- **Profiles:** Online, laptop, GPU
- **Displays:** Time (formatted) and approximate years
- **Color-coded:** By attacker capability

---

#### `apps/web/src/components/charts/ProbabilityHeatmap.tsx`

**`ProbabilityHeatmap({ entropyBits, entropyRange }): JSX.Element`**

- 2D probability matrix: entropy vs time windows
- **Rows:** Entropy levels (bit range)
- **Columns:** Time horizons (1h, 1d, 1w, 1y)
- **Cells:** Crack probability (color intensity)

---

#### `apps/web/src/components/charts/ProbabilityHeatmap2D.tsx`

**`ProbabilityHeatmap2D({ maxLength, charsetSize, durationSeconds, highlightLength, highlightGuessesPerSecond }): JSX.Element`**

- 2D heatmap: length × attacker capability
- **Shows:** Probability of crack within specified duration
- **Highlights:** Selected length and attacker profile
- **Strength tiers:** Color gradient from weak (red) to strong (green)

**Internal helpers:**

- `clamp(v, a, b)` - Range clamping
- `mixColor(a, b, t)` - RGB color interpolation
- `rgbToHex(r, g, b)` - RGB to hex conversion

---

### **Background Components**

#### `apps/web/src/components/background/CyberBackground.tsx`

**`CyberBackground({ className }): JSX.Element`**

- Animated particle effect background (cyberpunk aesthetic)
- **Features:**
  - Respects `prefers-reduced-motion` accessibility setting
  - Canvas-based for performance
  - Particles fade in/out with velocity
  - Responsive canvas resizing
- **Performance:** RequestAnimationFrame loop with cleanup

**Internal helper:**

- `prefersReducedMotion()` - Detects accessibility preference

---

#### `apps/web/src/components/background/SquaresBackground.tsx`

**`SquaresBackground({ direction, speed, borderColor, squareSize, hoverFillColor }): JSX.Element`**

- Animated grid of squares with hover effects
- **Props:**
  - `direction?`: Scroll direction ("up" | "down" | "left" | "right", default: "right")
  - `speed?`: Animation speed multiplier (default: 0.9)
  - `borderColor?`: Grid line color (default: `rgba(255,255,255,0.06)`)
  - `squareSize?`: Grid cell size (default: 48px)
  - `hoverFillColor?`: Hover highlight color (default: purple tint)
- **Interaction:** Mouse hover fills nearest squares
- **Canvas-based:** Efficient rendering for large grids

---

### **Feature Components - Password Analysis**

#### `apps/web/src/features/password/PasswordAnalyzerCard.tsx`

**`PasswordAnalyzerCard({ delay }): JSX.Element`**

- Main password input & analysis interface
- **Features:**
  - Real-time analysis with debounce (250ms)
  - Shows strength score, entropy, character classes
  - Displays warnings and suggestions
  - Copy button for tested password
  - Visual strength indicators
- **State:** Uses global password state (`usePassword()`)

---

### **Feature Components - Hashing**

#### `apps/web/src/features/hashing/HashingDemoCard.tsx`

**`HashingDemoCard({ delay }): JSX.Element`**

- Side-by-side hashing demonstration
- **Compares:**
  - SHA-256 (unsalted) - Same input → same hash
  - bcrypt (salted) - Same input → different hashes each run
- **Purpose:** Visual education on salt importance
- **Interactive:** Run buttons for each hash function

---

### **Feature Components - Attacks**

#### `apps/web/src/features/attacks/AttackSimulationCard.tsx`

**`AttackSimulationCard({ delay }): JSX.Element`**

- Container for attack simulation sub-components
- **Children:** Brute-force and dictionary attack demos

---

#### `apps/web/src/features/attacks/BruteForceSimulation.tsx`

**`BruteForceSimulation(): JSX.Element`**

- Interactive brute-force cracking simulation
- **Features:**
  - Shows guess progression vs target password
  - Real-time probability visualization
  - Displays time estimates by attacker profile
  - Interactive attacker capability selector
- **Models:** Online (rate-limited), Laptop, GPU

---

#### `apps/web/src/features/attacks/DictionaryAttackSimulation.tsx`

**`DictionaryAttackSimulation(): JSX.Element`**

- Dictionary attack simulation using ~10k word corpus
- **Features:**
  - Shows guesses required to crack common vs random passwords
  - Highlights why dictionary attacks fail on entropy-rich passwords
  - Position indicator in dictionary for common passwords

---

### **Feature Components - AI Analysis**

#### `apps/web/src/features/ai/AISecurityAnalysisCard.tsx`

**`AISecurityAnalysisCard({ delay }): JSX.Element`**

- Risk assessment and security recommendations
- **Displays:**
  - Risk classification (LOW/MODERATE/HIGH)
  - Executive summary
  - Technical findings
  - Attack feasibility analysis
  - Recommendations
- **Debounced:** Waits for analysis to complete

---

#### `apps/web/src/features/ai/AISecurityExplanation.tsx`

**`AISecurityExplanation(): JSX.Element`**

- Educational explainer for the security analysis engine
- Explains deterministic model vs real AI

---

### **Feature Components - Suggestions**

#### `apps/web/src/features/suggestions/SecureSuggestionsCard.tsx`

**`SecureSuggestionsCard({ delay }): JSX.Element`**

- Strong password generation UI
- **Features:**
  - Fetches suggestions from backend (`/api/password/suggest`)
  - Displays 3 generated passwords with rationale
  - Copy buttons for each suggestion
  - Uses cryptographic randomness

---

### **Pages**

#### `apps/web/src/pages/Dashboard.tsx`

**`Dashboard(): JSX.Element`**

- Main page layout orchestrating all feature cards
- **Layout:**
  - Header with title & description
  - Password input section
  - 4-column feature grid (analyzers, hashing, attacks, AI, suggestions)
  - Staggered entrance animations (Card `delay` prop)
- **State:** Integrates global password store

---

### **State Management**

#### `apps/web/src/state/password.tsx`

**`usePassword(): { password: string; setPassword: (p: string) => void }`**

- Global password state hook (Zustand store)
- Single source of truth for current test password
- Synced across all analysis components

---

#### `apps/web/src/state/demoSettings.tsx`

**`useDemoSettings(): DemoSettings`**

- Global demo configuration state
- Stores attacker profiles, time horizons, visualization preferences
- Persists settings to localStorage

---

## 🚀 Deployment

### Vercel

This monorepo can be split for deployment:

**Frontend (apps/web):**

- Vite app deployable as static site or serverless function
- Set `VITE_API_BASE_URL` env var to point to API origin

**Backend (apps/api):**

- Express.js deployable to Vercel Functions or standalone Node service
- Set `PORT`, `CORS_ORIGIN`, `OPENAI_API_KEY` (optional) env vars

### Build Commands

```bash
# Frontend
npm run build -w web    # Creates dist/ (static files)

# Backend
npm run build -w api    # Creates dist/index.js
npm run start -w api    # Runs compiled server
```

---

## 🔒 Security Notes

### Local Operation

- All analyses run deterministically locally (no server required)
- Passwords **never** sent externally unless explicitly configured
- No data collection or telemetry

### OpenAI Integration (Optional)

- **Dev mode only:** Can optionally pass OpenAI API key via header (demo)
- **Production:** Server rejects dev-key header when `NODE_ENV=production`
- **Recommendation:** Configure API key server-side in `.env`, never in browser code

### Password Input

- Test passwords are for **demo only**
- Never reuse test passwords in real accounts
- Use password manager for production secrets

---

## 🎓 Educational Use

This dashboard teaches:

- **Entropy & randomness** – Why length and variety matter
- **Hash functions** – Salt importance (SHA-256 vs bcrypt)
- **Attack models** – Realistic crack time estimates
- **Risk assessment** – Patterns that weaken passwords
- **Attack simulation** – Brute-force and dictionary limits

---

## 🛠️ Maintenance

### Dependency Updates

```bash
npm update              # Update all workspaces
npm update -w web       # Web only
npm update -w api       # API only
```

### Linting

```bash
npm run lint
npm run lint -w web
```

### Type Checking

```bash
npm run build           # Includes TypeScript check via `tsc -b`
```

---

## 📝 License & Attribution

Built for educational and portfolio purposes. Uses:

- React (Facebook)
- Tailwind CSS (Utility-first CSS)
- Framer Motion (Animation library)
- bcryptjs (Password hashing)
- Express.js (Web framework)

---

## 🔗 Quick Links

- **Ports:** Web (5173), API (8787)
- **Main files:** `apps/web/src/App.tsx`, `apps/api/src/index.ts`
- **Styling:** Tailwind CSS config in `apps/web/tailwind.config.ts`
- **Types:** Full TypeScript (strict mode)

---

## ❓ FAQ

**Q: Why no external AI API by default?**
A: The dashboard is fully functional offline with deterministic heuristics. Optional OpenAI integration is available but requires server-side setup.

**Q: Can I export/save analysis results?**
A: Currently, analysis is real-time. Add localStorage or JSON export for persistence.

**Q: How accurate are crack-time estimates?**
A: Heuristic models for education. Real attacks vary based on hash function strength, salting, iterations, attacker hardware.

**Q: Is this suitable for real password management?**
A: No. Use dedicated password managers (Bitwarden, 1Password). This dashboard is for learning, not production secrets.

---

Last updated: December 14, 2025
