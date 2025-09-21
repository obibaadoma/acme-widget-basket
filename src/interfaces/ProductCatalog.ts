export interface Product {
  code: string;
  name: string;
  priceInCents: number; 
}

export interface ProductCatalog {
  getProductByCode(code: string): Product | undefined;
}