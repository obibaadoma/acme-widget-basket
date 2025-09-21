import { DeliveryRule } from "../interfaces/DeliveryRule";

export class StandardDeliveryRule implements DeliveryRule {
  costForSubtotal(subtotalInCents: number): number {
    const subtotal = subtotalInCents / 100; 
    if (subtotal >= 90) return 0;           
    if (subtotal >= 50) return 295;         
    return 495;                             
  }
}