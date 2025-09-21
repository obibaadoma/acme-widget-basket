import { Product, ProductCatalog } from "../interfaces/ProductCatalog";

export class SimpleProductCatalog implements ProductCatalog {
  private products: Product[] = [
    { code: "R01", name: "Red Widget", priceInCents: 3295 },   
    { code: "G01", name: "Green Widget", priceInCents: 2495 }, 
    { code: "B01", name: "Blue Widget", priceInCents: 795 },   
  ];

  getProductByCode(code: string): Product | undefined {
    return this.products.find(p => p.code === code);
  }
}