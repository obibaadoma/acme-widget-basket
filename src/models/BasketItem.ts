import { Product } from '../interfaces/ProductCatalog';

export class BasketItem {
  constructor(
    public product: Product,
    public quantity: number = 1
  ) {}

  increment() {
    this.quantity++;
  }
}
