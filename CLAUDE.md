# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Drink is a personalized beverage ordering system built with Next.js. Customers take a 5-question quiz to receive 3 tailored drink recommendations based on their mood and preferences. Staff manage inventory and fulfill orders via a POS system.

## Commands

```bash
# Development
npm run dev           # Start dev server
npm run build         # Production build
npm run lint          # ESLint

# Database (SQLite, local only)
npm run db:generate   # Generate Prisma client
npm run db:push       # Sync schema to DB
npm run db:seed       # Seed database
npm run db:reset      # Reset and reseed
npm run setup         # Full DB setup (generate + push + seed)

# Testing
npm run test          # Run all tests (Vitest)
npm run test:watch    # Watch mode
```

To run a single test file:
```bash
npx vitest run src/__tests__/recommendation.test.ts
```

## Architecture

### Data Flow
Quiz (5 questions) → `POST /api/quiz/recommend` → Recommendation Engine → 3 drink cards → Customer selects → Order created via `POST /api/orders`

### Recommendation Engine ([src/lib/recommendation/engine.ts](src/lib/recommendation/engine.ts))
Core business logic. Maps quiz answers (A/B/C per step) to ingredient module IDs across 4 categories (BASE, FLAVOR, FUNCTION, TEXTURE). Returns 3 cards:
- **Perfect Match**: 100% logic-driven from answers
- **Plot Twist**: Same base/function/texture, alternate flavor
- **Safe Trend**: Best-seller defaults with customer's base choice

Handles exclusion rule conflicts (incompatible ingredient combos) by swapping ingredients, and auto-fallbacks when stock is depleted.

### Static Data vs. Database
Production (Netlify serverless) uses embedded static data from [src/lib/data/static-data.ts](src/lib/data/static-data.ts) — contains MODULES, EXCLUSION_RULES, and QUESTIONS arrays. This is the source of truth for ingredient/question config in production.

Local development can use SQLite via Prisma. API routes detect `process.env.NETLIFY` and fall back to static data automatically.

**When adding/modifying ingredients or questions**, edit `static-data.ts` (not just the Prisma seed).

### Key Directories
- [src/app/api/](src/app/api/) — Next.js API routes (quiz, orders, customers, modules, analytics)
- [src/app/quiz/](src/app/quiz/), [src/app/results/](src/app/results/) — Customer-facing quiz and results pages
- [src/app/admin/](src/app/admin/), [src/app/pos/](src/app/pos/) — Admin dashboard and barista POS
- [src/lib/recommendation/](src/lib/recommendation/) — Core recommendation algorithm
- [src/lib/data/](src/lib/data/) — Static production data
- [src/store/quizStore.ts](src/store/quizStore.ts) — Zustand store for quiz state
- [src/types/index.ts](src/types/index.ts) — All shared TypeScript types
- [src/__tests__/](src/__tests__/) — Vitest test suite (106 tests)

### Quiz Step → Ingredient Mapping
Each of 5 steps maps answers to a specific ingredient category:
1. Energy level → BASE (e.g., Black Tea, Oolong, Coconut Water)
2. Flavor preference → FLAVOR (e.g., Vanilla, Yuzu, Lychee)
3. Health function → FUNCTION (e.g., Collagen, L-Theanine, Electrolyte)
4. Texture/topping → TEXTURE (e.g., Mochi, Milk Foam, Sparkling)
5. Risk tolerance → Algorithm variant (influences card 2/3 selection)

Each step has 5 question theme variants (e.g., music, weather, os) so repeat customers see different framing.

### State Management
Zustand ([src/store/quizStore.ts](src/store/quizStore.ts)) holds quiz progress, answers, recommendations, and selected drink. Reset on quiz start.

## Testing

Tests use Vitest + React Testing Library with jsdom. Path alias `@/` maps to `./src/`. Test setup file: [src/__tests__/setup.ts](src/__tests__/setup.ts).

## Deployment

Netlify deployment via `netlify.toml`. The `@netlify/plugin-nextjs` plugin handles Next.js compatibility. Static data fallback is what makes serverless work — the app does not require a writable DB in production.
