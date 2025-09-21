import { Product, ProductCatalog } from "../interfaces/ProductCatalog";

export class SimpleProductCatalog implements ProductCatalog {
  private products: Product[] = [
    { code: "R01", name: "Red Widget", price: 32.95 },
    { code: "G01", name: "Green Widget", price: 24.95 },
    { code: "B01", name: "Blue Widget", price: 7.95 },
  ];

  getProductByCode(code: string): Product | undefined {
    return this.products.find(p => p.code === code);
  }
}