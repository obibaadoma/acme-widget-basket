import { describe, it, expect } from 'vitest';
import { Basket } from '../src/Basket';
import { SimpleProductCatalog } from '../src/catalogs/SimpleProductCatalog';
import { StandardDeliveryRule } from '../src/services/DeliveryService';
import { PricingService } from '../src/services/PricingService';
import { BuyOneGetHalfPrice } from '../src/strategies/BuyOneGetHalfPrice';

function makeBasket() {
  const catalog = new SimpleProductCatalog();
  const delivery = new StandardDeliveryRule();
  const offers = [new BuyOneGetHalfPrice('R01')];
  const pricing = new PricingService(offers);
  return new Basket(catalog, delivery, pricing);
}

describe('Basket totals (integration)', () => {
  it('B01, G01 → $37.85', () => {
    const b = makeBasket();
    b.add('B01');
    b.add('G01');
    expect(b.total()).toBe(37.85);
  });

  it('R01, R01 → $54.37', () => {
    const b = makeBasket();
    b.add('R01');
    b.add('R01');
    expect(b.total()).toBe(54.37);
  });

  it('R01, G01 → $60.85', () => {
    const b = makeBasket();
    b.add('R01');
    b.add('G01');
    expect(b.total()).toBe(60.85);
  });

  it('B01, B01, R01, R01, R01 → $98.27', () => {
    const b = makeBasket();
    b.add('B01');
    b.add('B01');
    b.add('R01');
    b.add('R01');
    b.add('R01');
    expect(b.total()).toBe(98.27);
  });
  
  it('throws error when adding invalid product code', () => {
    const b = makeBasket();
    expect(() => b.add('INVALID')).toThrow('Product with code INVALID not found');
  });
});
