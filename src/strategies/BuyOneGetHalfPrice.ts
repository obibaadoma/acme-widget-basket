import { Offer } from "../interfaces/Offer";
import { Product } from "../interfaces/ProductCatalog";

export class BuyOneGetHalfPrice implements Offer {
  constructor(public appliesToProductCode: string) {}

  apply(items: Product[], quantity: number): number {
    if (quantity < 2) return 0;

    const halfPriceItems = Math.floor(quantity / 2);
    const product = items.find(p => p.code === this.appliesToProductCode);
    if (!product) return 0;

    const discountPerItem = product.price * 0.5;
    return discountPerItem * halfPriceItems;
  }
}