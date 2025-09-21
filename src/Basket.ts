import { ProductCatalog } from "./interfaces/ProductCatalog";
import { DeliveryRule } from "./interfaces/DeliveryRule";
import { Offer } from "./interfaces/Offer";
import { PricingService } from "./services/PricingService";
import { BasketItem } from "./models/BasketItem";

export class Basket {
  private items: Map<string, BasketItem> = new Map();

  constructor(
    private catalog: ProductCatalog,
    private deliveryRule: DeliveryRule,
    private pricingService: PricingService
  ) {}

  add(productCode: string): void {
    const product = this.catalog.getProductByCode(productCode);
    if (!product) {
      throw new Error(`Product with code ${productCode} not found`);
    }

    const existing = this.items.get(productCode);
    if (existing) {
      existing.increment();
    } else {
      this.items.set(productCode, new BasketItem(product));
    }
  }

  total(): number {
    const itemized = Array.from(this.items.values()).map(item => ({
      product: item.product,
      quantity: item.quantity,
    }));

    // All calculations in cents (integers)
    const subtotalInCents = itemized.reduce(
      (sum, { product, quantity }) => sum + product.priceInCents * quantity,
      0
    );

    const discountInCents = this.pricingService.calculateDiscount(itemized);
    const deliveryInCents = this.deliveryRule.costForSubtotal(subtotalInCents - discountInCents);

    const totalInCents = subtotalInCents - discountInCents + deliveryInCents;

    // Truncate to 2 decimal places (no rounding up)
    return Math.floor(totalInCents) / 100;
  }
}