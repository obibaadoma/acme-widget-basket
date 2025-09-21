# 🧺 ACME Widget Basket

A small, focused Node.js + TypeScript project that calculates basket totals for Acme Widget Co using extensible pricing and delivery rules.

This project demonstrates clean separation of concerns, the strategy pattern for offers, and precise financial calculations using integer cents.

---

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Usage Example](#usage-example)
- [Products & Offers](#products--offers)
- [Delivery Rules](#delivery-rules)
- [Project Structure](#project-structure)
- [Design Notes](#design-notes)
- [For Reviewers](#for-reviewers)
- [Assumptions & Edge Cases](#assumptions--edge-cases)
- [Complexity](#complexity)
- [Future Enhancements](#future-enhancements)
- [Testing](#testing)
- [Extending](#extending)
- [Scripts](#scripts)
- [License](#license)

---

## Features

- Precise pricing in integer cents (no floating-point rounding errors)
- Pluggable offer strategies via the `Offer` interface
- Configurable delivery pricing via the `DeliveryRule` interface
- Simple `ProductCatalog` abstraction for product lookup
- Minimal, dependency-light TypeScript codebase

## Requirements

- Node.js 18+ recommended
- npm 9+

## Quick Start

Install dependencies and run the sample test runner in `src/index.ts`:

```bash
npm install
npm run dev
```

You should see four scenarios printed with PASS statuses (as coded in `src/index.ts`).

## Usage Example

The following matches the example logic in `src/index.ts` and demonstrates how to wire up the components:

```ts
import { Basket } from "./src/Basket";
import { SimpleProductCatalog } from "./src/catalogs/SimpleProductCatalog";
import { StandardDeliveryRule } from "./src/services/DeliveryService";
import { PricingService } from "./src/services/PricingService";
import { BuyOneGetHalfPrice } from "./src/strategies/BuyOneGetHalfPrice";

const catalog = new SimpleProductCatalog();
const deliveryRule = new StandardDeliveryRule();
const offers = [new BuyOneGetHalfPrice("R01")];
const pricing = new PricingService(offers);

const basket = new Basket(catalog, deliveryRule, pricing);
basket.add("B01");
basket.add("G01");

console.log(`Total: $${basket.total().toFixed(2)}`);
```

## Products & Offers

Available products (from `src/catalogs/SimpleProductCatalog.ts`):

- `R01` — Red Widget — $32.95
- `G01` — Green Widget — $24.95
- `B01` — Blue Widget — $7.95

Current offer strategy (in `src/strategies/BuyOneGetHalfPrice.ts`):

- Buy One Get One Half Price on `R01` (every second `R01` is 50% off)

How offers are applied (see `src/services/PricingService.ts`): `PricingService` looks up applicable `Offer`s per product and sums the discounts (in cents) returned by each offer for the quantities in the basket.

## Delivery Rules

From `src/services/DeliveryService.ts` (`StandardDeliveryRule`):

- Subtotal < $50 → $4.95 delivery
- $50 ≤ Subtotal < $90 → $2.95 delivery
- Subtotal ≥ $90 → Free delivery

Delivery is computed on the subtotal after offers/discounts have been applied.

## Project Structure

```
src/
├─ Basket.ts                 # Orchestrates item totals, discounts, and delivery
├─ catalogs/
│  └─ SimpleProductCatalog.ts# In-memory product catalog
├─ interfaces/
│  ├─ DeliveryRule.ts        # Delivery cost contract
│  ├─ Offer.ts               # Offer contract (returns discount in cents)
│  └─ ProductCatalog.ts      # Product lookup contract
├─ models/
│  └─ BasketItem.ts          # Tracks product + quantity
├─ services/
│  ├─ DeliveryService.ts     # Standard delivery rule implementation
│  └─ PricingService.ts      # Applies offers and sums discounts
└─ strategies/
   └─ BuyOneGetHalfPrice.ts  # “Every second item is half price” for a product
```

## Testing

This project includes a Vitest suite covering the basket totals, delivery rule, and offer strategy.

Install dependencies (if you haven’t already), then run:

```bash
npm install
npm test            # run tests once (CI-friendly)
npm run test:watch  # watch mode for local development
npm run coverage    # generate coverage report
```

Test files are located in `tests/`:

- `tests/basket.test.ts` — integration scenarios matching `src/index.ts`
- `tests/delivery.test.ts` — unit tests for `StandardDeliveryRule`
- `tests/offer.test.ts` — unit tests for `BuyOneGetHalfPrice`

## Design Notes

- All monetary math is done in integer cents for accuracy. Totals are converted to dollars at the end: `Math.floor(totalInCents) / 100` to prevent rounding up.
- `BuyOneGetHalfPrice` uses `Math.round(product.priceInCents / 2)` to correctly handle odd-cent halves.
- The basket maintains an internal `Map<string, BasketItem>` keyed by product code for efficient quantity tracking.

## For Reviewers

- Purposefully minimal dependencies; all business logic is in `src/` with clear seams (`interfaces/`, `services/`, `strategies/`).
- Deterministic money math using integer cents throughout. Final dollar value uses `Math.floor(totalInCents) / 100` to avoid rounding up, matching provided expected totals in `src/index.ts`.
- Offer logic is isolated behind the `Offer` interface; adding promotions does not require touching the `Basket`.
- Delivery calculation depends on post-discount subtotal as a realistic real-world rule.
- Readability: small files, explicit names, and a simple `src/index.ts` runner that prints PASS/FAIL for four scenarios.

What to look at first:

- `src/Basket.ts` for orchestration and precise total flow (subtotal → discounts → delivery → total)
- `src/strategies/BuyOneGetHalfPrice.ts` for discount calculation and integer handling
- `src/services/PricingService.ts` for how offers are discovered and summed

Trade-offs:

- No persistence or UI to keep the scope focused on pricing rules.
- Uses a single active offer per product in the example; composing multiple offers per product would be straightforward but out of scope for the assignment.

## Assumptions & Edge Cases

- Product codes are validated via `ProductCatalog`; adding an unknown code throws a clear error from `Basket.add`.
- Offer is applied per product family (code-based) and only when quantity threshold is met (e.g., at least two items for half-price logic).
- Totals are truncated (not rounded up) to match the test expectations in `src/index.ts`.
- Delivery is computed on the discounted subtotal.

## Complexity

- Let N be the number of distinct product codes in the basket and M the number of active offers:
  - Subtotal computation: O(N)
  - Offer lookup per item: O(M) naive (can be O(1) with a map); in this code M is tiny and lookup is a simple `find`.
  - Overall per-total calculation: O(N + M)

## Future Enhancements

- Multiple offers per product with composition rules (e.g., max discount wins, stackable vs exclusive).
- Currency/locale abstraction and money type wrapper to centralize formatting and conversions.
- Config-driven `DeliveryRule` thresholds and fees.
- Unit tests with a proper test runner (e.g., Vitest/Jest) in addition to the sample runner in `src/index.ts`.
- Additional strategies (e.g., bulk discounts, spend thresholds, coupon codes).

## Extending

- New products: implement or extend `ProductCatalog` (e.g., fetch from a DB or API)
- New offers: add a class implementing `Offer` and include it in `PricingService`
- New delivery rules: implement `DeliveryRule` and pass it to the `Basket` constructor

## Scripts

Defined in `package.json`:

- `npm run dev` → runs `ts-node src/index.ts`
- `npm run demo` → alias of the same sample runner
- `npm test` → alias of the same command for convenience
  - With Vitest: runs the Vitest suite (see Testing section)

## License

ISC License. See [LICENSE](./LICENSE).