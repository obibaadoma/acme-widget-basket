export interface Product {
  code: string;
  name: string;
  price: number;
}

export interface ProductCatalog {
  getProductByCode(code: string): Product | undefined;
}