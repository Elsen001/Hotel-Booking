# 🏨 Hotel Booking System

A dynamic hotel booking application where users select a destination, choose hotels per day, and configure meal plans based on **board type** rules — with a live total-price calculation across the whole trip.

Built as a frontend technical assessment.

**Live demo:** _add your Vercel/Netlify URL here_
**Repository:** _add your GitHub URL here_

---

## ✨ Features

- **Step 1 — Configuration:** citizenship, start date + number of days, destination, and board type (FB / HB / NB) with inline validation.
- **Step 2 — Daily Configuration:** one row per day to pick a hotel, lunch, and dinner. Meal selection is governed by board-type business rules.
- **Step 3 — Summary & Pricing:** configuration recap, per-day selection breakdown, and a grand total using `Σ (hotel price + selected meal prices)`.

### Business rules (board types)

| Board | Code | Meals selectable |
|-------|------|------------------|
| Full Board | `FB` | Lunch **and** dinner |
| Half Board | `HB` | Lunch **or** dinner (mutually exclusive — the other locks once one is chosen) |
| No Board | `NB` | None (dropdowns disabled) |

### Bonus features implemented

- ✅ **TypeScript** throughout (strict mode)
- ✅ **Unit tests** (Vitest) covering pricing + all board rules
- ✅ **Responsive design** (mobile-friendly, horizontally scrollable table)
- ✅ **Loading state & animations** (boot spinner, fade-in transitions)
- ✅ **Save / Load** booking configuration (localStorage)
- ✅ **Export as PDF / Print** (print-optimized stylesheet)

---

## 🚀 Setup

```bash
# install dependencies
npm install

# start the dev server (http://localhost:5173)
npm run dev

# run unit tests
npm run test

# production build
npm run build

# preview the production build
npm run preview
```

Requires Node.js 18+.

---

## 🧱 Technology choices & justification

| Concern | Choice | Why |
|---|---|---|
| Framework | **React 18** | Preferred option in the brief; component model fits a multi-step form well. |
| Language | **TypeScript** | Data models are strongly typed; catches meal/hotel id mismatches at compile time. |
| State | **Context API + `useReducer`** | App state is small and localized to the booking flow — Redux would be over-engineering. A reducer keeps board-rule side effects (clearing invalid meals on board/destination change) in one predictable place. |
| Styling | **Tailwind CSS** | Fast, consistent styling with a small custom design layer (`.card`, `.btn-*`) and a built-in print stylesheet. |
| Build/test | **Vite + Vitest** | Instant dev server; Vitest shares Vite config for zero-friction unit tests. |

---

## 🏗️ Architecture decisions

```
src/
├── data/            # Static data models (countries, hotels, board types, meals)
├── types.ts         # Shared TypeScript interfaces
├── context/         # BookingContext — useReducer store + save/load
├── utils/pricing.ts # Pure business logic (rules + cost math) — fully unit-tested
├── components/
│   ├── ConfigForm   # Step 1
│   ├── DailyConfig  # Step 2 (table) + DayRow (row)
│   ├── Summary      # Step 3
│   ├── Stepper      # Progress indicator
│   └── Select       # Reusable styled <select>
└── App.tsx          # Step orchestration + save/load UI
```

Key decisions:

1. **Business logic is pure and isolated** in `utils/pricing.ts` (`canSelectMeal`, `computeDayCost`, `computeGrandTotal`). Components stay presentational and the rules are trivially testable — no DOM needed.
2. **The reducer owns invalidation.** Changing destination resets each day's hotel/meal ids (they belong to the old country); switching to `NB` clears meals. This prevents stale, impossible selections from ever entering state.
3. **Half-board exclusivity is derived, not stored.** `canSelectMeal` disables the opposite dropdown based on the current day's selection, so the state can never hold both lunch and dinner under HB.
4. **Per-day hotel selection** matches the pricing formula (hotel price summed per day) and lets travellers change hotels mid-trip.

---

## ⚠️ Known limitations & future improvements

- Persistence is a single localStorage slot; multiple named bookings would be a natural extension.
- Dates are informational (no availability/seasonality pricing).
- No backend — data models are static per the brief.
- Could add PDF generation via a library (e.g. `jspdf`) for a branded export instead of the browser print dialog.
- Component/integration tests (React Testing Library) could complement the pure-logic unit tests.

---

## 🧪 Tests

```bash
npm run test
```

Covers hotel/meal lookups, all three board-type rules (including HB mutual exclusivity), single-day and multi-day totals, and date math.
