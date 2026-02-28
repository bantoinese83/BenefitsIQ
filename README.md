# BenefitsIQ

**BenefitsIQ** is a production-ready, multi-tenant financial intelligence platform designed for HR and enterprise executives. It provides real-time deterministic scenario modeling, AI-powered insights, and automated invoice validation.

---

## 🏗 System Architecture

BenefitsIQ is built with a focus on perceived performance, architectural seams, and cognitive ease for future maintainers.

### Tech Stack
*   **Frontend Framework:** React 19, TypeScript, Vite
*   **Design System:** Tailwind CSS v4, custom `shadcn/ui` components (Radix-based)
*   **State Management:** Zustand (Global State), Contextual abstractions (`useQuery`)
*   **Backend & Auth:** Supabase (PostgreSQL with Row Level Security)
*   **AI Engine:** Claude 3.5 Sonnet API

### Core Architectural Seams
To manage cognitive load, the system is strictly divided along key "seams":
1.  **Environment Boundary (`src/lib/config.ts`):** Direct access to `import.meta.env` is prohibited. All environment variables pass through a schema-validated Zod parser. If the environment is invalid, the app fails fast at initialization.
2.  **Actuarial vs. Probabilistic Logic:** The deterministic financial math (`calculationEngine.ts`) is strictly decoupled from the generative AI (`claudeService.ts`). The AI service acts solely as an interpreter of the deterministic outputs.
3.  **Data Fetching (`src/hooks/useQuery.ts`):** Supabase queries are wrapped in a generic `useQuery` hook to centralize loading, logging, and error handling, making it easy to migrate to TanStack Query later.

---

## ⚖️ Architectural Trade-Offs & Optimizations

As a high-performance executive dashboard, we intentionally deviate from standard "Clean Code" dogmatism in specific, documented areas to prioritize runtime efficiency and user experience.

### 1. The $O(N)$ Reduction Pass (Data-Oriented Design)
**Location:** `src/services/calculationEngine.ts`

**The Trade-off:** Clean code principles often dictate creating many small, single-responsibility functions (e.g., `calculateBaseline()`, `calculateProjections()`, `calculateDelta()`). However, doing so requires iterating over the array of benefit plans multiple times, increasing object allocations and degrading CPU cache locality.

**The Decision:** We collapsed the baseline calculation, scenario adjustments, and cost projections into a single `reduce` pass. 
*   *Why?* To achieve peak $O(N)$ efficiency. We traded a minor loss in functional isolation for a significant reduction in iteration overhead. This is critical when modeling scenarios with hundreds of plan variations dynamically.

### 2. Perceived Performance over Perfect Data Synchronization
**Location:** `src/pages/Dashboard.tsx` & `src/components/ui/skeleton.tsx`

**The Trade-off:** Waiting for all queries to resolve before rendering the page guarantees perfect data consistency but results in a blank screen (poor Time-To-Interactive).

**The Decision:** We render the shell immediately and use highly accurate `Skeleton` loaders that map directly to the final UI dimensions (StatCards, Charts). We trade exact immediate state for a significantly higher *perceived* performance, ensuring the application feels "alive" to the executive user instantly.

### 3. Decoupled AI Fallbacks
**Location:** `src/services/claudeService.ts`

**The Trade-off:** If an external LLM provider goes down, standard error handling would throw a fatal error to the user.

**The Decision:** The AI engine is treated as an *enhancement*, not a critical dependency. If the API key is missing or the request times out, the service catches the error, logs it via our centralized `Logger`, and returns a deterministic, template-based financial narrative. We trade absolute truthfulness (AI analysis) for guaranteed platform uptime.

---

## 🛡 Reliability & Observability

*   **Global Error Boundaries (`src/components/ErrorBoundary.tsx`):** Catches unhandled React runtime exceptions and provides a branded "System Variance" recovery UI, preventing white screens of death.
*   **Centralized Telemetry (`src/utils/logger.ts`):** Standardized logging utility with context-passing capabilities, ready to be piped into DataDog, Sentry, or LogRocket.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v20+)
*   Supabase Account & Project

### Local Setup
1.  **Clone & Install:**
    ```bash
    git clone <repo-url>
    cd hr-benefits-app
    npm install
    ```
2.  **Environment Configuration:**
    Copy the example environment file and fill in your keys. The app will fail to compile if `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are missing.
    ```bash
    cp .env.example .env
    ```
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

### Database Migrations
Apply the initial schema to your Supabase project to enforce Multi-Tenant RLS:
```bash
# Using Supabase CLI
supabase db push
# Or run the SQL located in /supabase/migrations/20241113000000_initial_schema.sql directly in the SQL editor.
```

---

## 🧪 Testing
The core actuarial math and utility helpers are covered by Vitest. We prioritize testing pure functions (logic) over UI components.

```bash
npm run test
```
