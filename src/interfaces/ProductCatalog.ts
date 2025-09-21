export interface Product {
  code: string;
  name: string;
  priceInCents: number; // ← CHANGED: store price in cents
}

export interface ProductCatalog {
  getProductByCode(code: string): Product | undefined;
}