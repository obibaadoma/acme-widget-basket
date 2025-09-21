import { Offer } from "../interfaces/Offer";
import { Product } from "../interfaces/ProductCatalog";

export class BuyOneGetHalfPrice implements Offer {
  constructor(public appliesToProductCode: string) {}

  apply(items: Product[], quantity: number): number {
    if (quantity < 2) return 0;

    const product = items.find(p => p.code === this.appliesToProductCode);
    if (!product) return 0;

    // Calculate how many items get the discount (every second item)
    const discountedItems = Math.floor(quantity / 2);
    
    // Calculate the discount amount (50% of the product price)
    // Use Math.round to handle odd cents correctly
    const discountPerItem = Math.round(product.priceInCents / 2);
    
    return discountPerItem * discountedItems;
  }
}