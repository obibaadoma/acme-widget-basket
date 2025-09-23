import { Product } from './ProductCatalog';

export interface Offer {
  appliesToProductCode: string;
  apply(items: Product[], quantity: number): number;
}
