import { Product } from "../interfaces/ProductCatalog";
import { Offer } from "../interfaces/Offer";

export class PricingService {
  constructor(private offers: Offer[]) {}

  calculateDiscount(items: { product: Product; quantity: number }[]): number {
    let totalDiscount = 0;

    for (const { product, quantity } of items) {
      const applicableOffer = this.offers.find(
        offer => offer.appliesToProductCode === product.code
      );
      if (applicableOffer) {
        totalDiscount += applicableOffer.apply([product], quantity);
      }
    }

    return totalDiscount; 
  }
}