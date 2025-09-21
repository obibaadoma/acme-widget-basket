import { DeliveryRule } from "../interfaces/DeliveryRule";

export class StandardDeliveryRule implements DeliveryRule {
  costForSubtotal(subtotalInCents: number): number {
    const subtotal = subtotalInCents / 100; // convert to dollars for comparison
    if (subtotal >= 90) return 0;           // free delivery
    if (subtotal >= 50) return 295;         // $2.95 → 295 cents
    return 495;                             // $4.95 → 495 cents
  }
}