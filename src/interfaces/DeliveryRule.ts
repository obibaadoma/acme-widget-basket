export interface DeliveryRule {
  costForSubtotal(subtotal: number): number;
}
