# 🧺 ACME Widget Basket

A Node.js + TypeScript project that calculates basket totals for Acme Widget using extensible pricing and delivery rules. This project demonstrates a clean separation of concerns, the strategy pattern for offers, and precise financial calculations using integer cents.

## Badges

[](https://github.com/obibaadoma/acme-widget-basket/actions)

-----

## TL;DR

  - **Install & Run:** `npm install && npm run dev`
  - **Example Totals:** The four example baskets will print `PASS` with totals of `$37.85`, `$54.37`, `$60.85`, and `$98.27`.
  - **Core Idea:** Business rules are implemented with small, testable services and strategy objects.

-----

## Table of Contents

- [🧺 ACME Widget Basket](#-acme-widget-basket)
  - [Badges](#badges)
  - [TL;DR](#tldr)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Requirements](#requirements)
  - [Quick Start](#quick-start)
  - [Usage Example](#usage-example)
    - [Products \& Offers](#products--offers)
    - [Delivery Rules](#delivery-rules)
  - [Project Structure](#project-structure)
  - [Development](#development)
    - [Available Scripts](#available-scripts)
    - [Extending the Project](#extending-the-project)
    - [Design Notes](#design-notes)
    - [Assumptions \& Edge Cases](#assumptions--edge-cases)
  - [Complexity](#complexity)
  - [Future Enhancements](#future-enhancements)
  - [License](#license)
  - [This project is licensed under the **MIT License**.](#this-project-is-licensed-under-the-mit-license)
  - [Author](#author)

-----

## Features

  - **Precise Calculations:** All monetary math is done in integer cents to avoid floating-point errors.
  - **Pluggable Offers:** Easily add new promotions by implementing the `Offer` interface (Strategy Pattern).
  - **Configurable Delivery:** Delivery pricing is handled by a swappable `DeliveryRule` interface.
  - **Simple Catalog:** A straightforward `ProductCatalog` abstraction for easy product lookups.
  - **Minimalist:** A dependency-light TypeScript codebase focused on core logic.

-----

## Requirements

  - **Node.js:** v18+ recommended
  - **npm:** v9+ recommended

-----

## Quick Start

Install dependencies and run the sample runner located in `src/index.ts`:

```bash
npm install
npm run dev
```

You should see four scenarios printed to the console with `PASS` statuses.

-----

## Usage Example

The following example demonstrates how to wire up the components to calculate a basket's total.

```ts
import { Basket } from "./src/Basket";
import { SimpleProductCatalog } from "./src/catalogs/SimpleProductCatalog";
import { StandardDeliveryRule } from "./src/services/DeliveryService";
import { PricingService } from "./src/services/PricingService";
import { BuyOneGetHalfPrice } from "./src/strategies/BuyOneGetHalfPrice";

// 1. Set up services and rules
const catalog = new SimpleProductCatalog();
const deliveryRule = new StandardDeliveryRule();
const offers = [new BuyOneGetHalfPrice("R01")];
const pricing = new PricingService(offers);

// 2. Create and fill the basket
const basket = new Basket(catalog, deliveryRule, pricing);
basket.add("B01");
basket.add("G01");

// 3. Get the final total
console.log(`Total: $${basket.total().toFixed(2)}`);
```

-----

### Products & Offers

The `SimpleProductCatalog` provides the following products:

  - `R01` — Red Widget — `$32.95`
  - `G01` — Green Widget — `$24.95`
  - `B01` — Blue Widget — `$7.95`

The current offer strategy is **Buy One Red Widget, Get the Second Half Price**. This is implemented in `src/strategies/BuyOneGetHalfPrice.ts`. The `PricingService` applies all relevant offers to the basket to calculate the total discount.

### Delivery Rules

Delivery charges are calculated based on the **post-discount subtotal**:

  - Subtotal **\< $50** → `$4.95` delivery
  - Subtotal **≥ $50 and \< $90** → `$2.95` delivery
  - Subtotal **≥ $90** → Free delivery

-----

## Project Structure

```
src/
├─ Basket.ts                 # Orchestrates totals, discounts, and delivery.
├─ catalogs/
│  └─ SimpleProductCatalog.ts # In-memory product catalog implementation.
├─ interfaces/
│  ├─ DeliveryRule.ts        # Contract for a delivery cost rule.
│  ├─ Offer.ts               # Contract for an offer (returns discount in cents).
│  └─ ProductCatalog.ts      # Contract for a product lookup service.
├─ models/
│  └─ BasketItem.ts          # Tracks product code and quantity.
├─ services/
│  ├─ DeliveryService.ts     # Standard delivery rule implementation.
│  └─ PricingService.ts      # Applies offers and sums discounts.
└─ strategies/
   └─ BuyOneGetHalfPrice.ts  # "Buy one, get one half price" offer logic.
```

-----

## Development

The project uses ESLint for linting and Prettier for formatting. Vitest is used for testing.

### Available Scripts

  - `npm run dev`: Runs the demo script (`src/index.ts`).
  - `npm test`: Runs the test suite once.
  - `npm run test:watch`: Runs tests in watch mode for active development.
  - `npm run coverage`: Generates a test coverage report.
  - `npm run lint`: Lints the codebase for errors.
  - `npm run lint:fix`: Automatically fixes linting errors.
  - `npm run format`: Formats code using Prettier.

### Extending the Project

  - **New Products:** Implement the `ProductCatalog` interface (e.g., to fetch from a database or API calls).
  - **New Offers:** Create a new class that implements the `Offer` interface and add it to the `PricingService`.
  - **New Delivery Rules:** Implement the `DeliveryRule` interface and pass it to the `Basket` constructor.

-----

### Design Notes

  - **Integer Cents:** All monetary calculations use integer cents to ensure accuracy and avoid floating-point rounding issues. Dollar conversion only happens at the final output.
  - **Truncation:** The final total is truncated, not rounded (e.g., `37.857` becomes `37.85`), to match the provided test expectations. This is done via `Math.floor(totalInCents) / 100`.
  - **Offer Isolation:** Offer logic is fully encapsulated behind the `Offer` interface. Adding or changing promotions does not require modifying the `Basket` or other services.
  - **Efficiency:** The basket uses an internal `Map<string, BasketItem>` for efficient O(1) lookups and quantity updates.

### Assumptions & Edge Cases

  - Product codes are validated by the `ProductCatalog`. Adding an unknown code will throw an error.
  - The "Buy One Get One Half Price" offer is applied for every two items of the same product code.
  - Delivery charges are always computed on the discounted subtotal.

## Complexity

- Let N be the number of distinct product codes in the basket and M the number of active offers:
  - Subtotal computation: O(N)
  - Offer lookup per item: O(M) naive (can be O(1) with a map); in this code M is tiny and lookup is a simple `find`.
  - Overall per-total calculation: O(N + M)

-----

## Future Enhancements

  - **Composite Offers:** Support applying multiple offers to a single product with rules (e.g., "max discount wins," stackable vs. exclusive).
  - **Money Type:** Introduce a dedicated `Money` class to encapsulate currency, formatting, and conversions.
  - **Configuration-Driven Rules:** Load delivery thresholds and fees from a configuration file instead of hardcoding them.
  - **More Offer Strategies:** Implement additional offer types like bulk discounts, "spend X get Y free," or coupon codes.

-----

## License

This project is licensed under the **MIT License**.
-----

## Author

👤 **Derek Akrasi Konadu**

A full-stack developer passionate about building clean, scalable applications.

  - **GitHub:** [@obibaadoma](https://github.com/obibaadoma)
  - **LinkedIn:** [derek-akrasi-konadu](https://www.linkedin.com/in/derek-akrasi-konadu-187453151/)
  - **Email:** [akrasikonadu@yahoo.com](mailto:akrasikonadu@yahoo.com)