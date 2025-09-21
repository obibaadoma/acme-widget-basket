import { Basket } from "./Basket";
import { SimpleProductCatalog } from "./catalogs/SimpleProductCatalog";
import { StandardDeliveryRule } from "./services/DeliveryService";
import { PricingService } from "./services/PricingService";
import { BuyOneGetHalfPrice } from "./strategies/BuyOneGetHalfPrice";

// Setup
const catalog = new SimpleProductCatalog();
const deliveryRule = new StandardDeliveryRule();
const offers = [new BuyOneGetHalfPrice("R01")];
const pricingService = new PricingService(offers);

const basket = new Basket(catalog, deliveryRule, pricingService);

// Test Cases
function testBasket(items: string[], expected: number) {
  const b = new Basket(catalog, deliveryRule, pricingService);
  items.forEach(code => b.add(code));
  const result = b.total();
  console.log(`${items.join(", ")} → $${result} (expected $${expected}) → ${result === expected ? "✅ PASS" : "❌ FAIL"}`);
}

console.log("=== ACME WIDGET CO - BASKET TESTS ===");
testBasket(["B01", "G01"], 37.85);
testBasket(["R01", "R01"], 54.37);
testBasket(["R01", "G01"], 60.85);
testBasket(["B01", "B01", "R01", "R01", "R01"], 98.27);