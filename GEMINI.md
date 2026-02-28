# BenefitsIQ - HR Benefits Financial Intelligence Platform

## Project Overview
BenefitsIQ is a production-ready MVP for employer benefits financial analysis. It provides multi-tenant isolation, deterministic scenario modeling, AI-powered executive insights, and automated invoice parsing.

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4 (Executive dark theme)
- **UI Components:** custom shadcn/ui (Radix UI based)
- **State Management:** Zustand
- **Backend/Auth:** Supabase (PostgreSQL with RLS)
- **AI Engine:** Claude 3.5 Sonnet
- **Icons:** Lucide React

## Core Architecture
- `src/components/layout`: Dashboard and sidebar structure
- `src/components/ui`: Highly reusable shadcn/ui components (Skeleton, Spinner, Sonner, etc.)
- `src/services/calculationEngine.ts`: Deterministic logic for financial projections
- `src/services/claudeService.ts`: AI-powered narrative generator (Claude 3.5 Sonnet)
- `src/lib/supabase.ts`: Multi-tenant data layer
- `src/hooks/useAuth.ts`: Role-based access control and profile management
- `src/utils/logger.ts`: Centralized diagnostic telemetry

## Reliability & Performance
- **Error Handling:** Global `ErrorBoundary` with professional recovery UI.
- **Testing:** Vitest suite for calculation logic and utility helpers.
- **Transitions:** View Transition API enabled for theme toggling.
- **Theme:** Dynamic "Executive" theme with HSL-based Tailwind v4 variables.

## Multi-Tenancy (Supabase RLS)
Data isolation is enforced at the database level using Row Level Security:
- `organizations`: Root tenant table
- `profiles`: User mapping to organizations and roles
- `benefits_data`: Filtered by `organization_id` via RLS policies

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and add your keys
4. Run development server: `npm run dev`
5. Apply Supabase migrations found in `/supabase/migrations`

## Deployment Instructions
- Build the project: `npm run build`
- Deploy the `dist` folder to any static hosting provider (Vercel, Netlify, Cloudflare Pages)
- Configure environment variables in your hosting provider's dashboard.
