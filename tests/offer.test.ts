import { describe, it, expect } from 'vitest';
import { BuyOneGetHalfPrice } from '../src/strategies/BuyOneGetHalfPrice';
import { Product } from '../src/interfaces/ProductCatalog';

const R01: Product = { code: 'R01', name: 'Red Widget', priceInCents: 3295 };

describe('BuyOneGetHalfPrice', () => {
  it('no discount for quantity 1', () => {
    const offer = new BuyOneGetHalfPrice('R01');
    expect(offer.apply([R01], 1)).toBe(0);
  });

  it('applies half price once for quantity 2', () => {
    const offer = new BuyOneGetHalfPrice('R01');
    // Half of 3295 rounded → 1648 cents
    expect(offer.apply([R01], 2)).toBe(Math.round(3295 / 2));
  });

  it('applies half price floor(quantity/2) times', () => {
    const offer = new BuyOneGetHalfPrice('R01');
    const half = Math.round(3295 / 2);
    expect(offer.apply([R01], 3)).toBe(half * 1);
    expect(offer.apply([R01], 4)).toBe(half * 2);
    expect(offer.apply([R01], 5)).toBe(half * 2);
  });

  it('no discount if product not applicable', () => {
    const offer = new BuyOneGetHalfPrice('G01');
    expect(offer.apply([R01], 4)).toBe(0);
  });
});
