import { describe, it, expect } from 'vitest';
import { StandardDeliveryRule } from '../src/services/DeliveryService';

const rule = new StandardDeliveryRule();

describe('StandardDeliveryRule', () => {
  it('charges $4.95 when discounted subtotal < $50', () => {
    // 4999 cents → below $50
    expect(rule.costForSubtotal(4999)).toBe(495);
  });

  it('charges $2.95 when $50 ≤ discounted subtotal < $90', () => {
    expect(rule.costForSubtotal(5000)).toBe(295);
    expect(rule.costForSubtotal(8999)).toBe(295);
  });

  it('is free when discounted subtotal ≥ $90', () => {
    expect(rule.costForSubtotal(9000)).toBe(0);
    expect(rule.costForSubtotal(15000)).toBe(0);
  });
});
