import { CartItem, CalculationInput, CalculationResult } from '@/types';

const FREE_SHIPPING_THRESHOLD = parseFloat(
  process.env.FREE_SHIPPING_THRESHOLD || '50'
);
const DEFAULT_SHIPPING_COST = parseFloat(
  process.env.DEFAULT_SHIPPING_COST || '5.99'
);

export function calculateShipping(
  orderTotal: number,
  weight: number
): { cost: number; freeShipping: boolean } {
  if (orderTotal >= FREE_SHIPPING_THRESHOLD) {
    return { cost: 0, freeShipping: true };
  }
  // Weight-based shipping: base cost + $0.50 per kg
  const weightCost = weight > 0 ? weight * 0.5 : 0;
  const cost = DEFAULT_SHIPPING_COST + weightCost;
  return { cost: parseFloat(cost.toFixed(2)), freeShipping: false };
}

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    return sum + item.quantity * item.unitPrice;
  }, 0);
}

export function calculateDiscount(
  subtotal: number,
  discountType: 'percentage' | 'fixed',
  discountValue: number
): number {
  if (discountValue <= 0) return 0;
  if (discountType === 'percentage') {
    const pct = Math.min(discountValue, 100);
    return parseFloat(((subtotal * pct) / 100).toFixed(2));
  }
  return parseFloat(Math.min(discountValue, subtotal).toFixed(2));
}

export function performCalculation(input: CalculationInput): CalculationResult {
  const { items, discountType, discountValue, taxRate, weight } = input;

  const subtotal = parseFloat(calculateSubtotal(items).toFixed(2));
  const discountAmount = calculateDiscount(subtotal, discountType, discountValue);
  const taxableAmount = parseFloat((subtotal - discountAmount).toFixed(2));
  const taxAmount = parseFloat((taxableAmount * taxRate).toFixed(2));
  const { cost: shippingCost, freeShipping } = calculateShipping(
    taxableAmount,
    weight
  );
  const total = parseFloat(
    (taxableAmount + taxAmount + shippingCost).toFixed(2)
  );

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    shippingCost,
    total,
    freeShipping,
  };
}

export function validateInput(input: CalculationInput): string[] {
  const errors: string[] = [];

  if (!input.items || input.items.length === 0) {
    errors.push('At least one item is required.');
  }

  input.items?.forEach((item, index) => {
    if (!item.name || item.name.trim() === '') {
      errors.push(`Item ${index + 1}: Name is required.`);
    }
    if (item.quantity <= 0 || !Number.isFinite(item.quantity)) {
      errors.push(`Item ${index + 1}: Quantity must be a positive number.`);
    }
    if (item.unitPrice < 0 || !Number.isFinite(item.unitPrice)) {
      errors.push(`Item ${index + 1}: Unit price must be a non-negative number.`);
    }
  });

  if (input.discountValue < 0) {
    errors.push('Discount value cannot be negative.');
  }
  if (input.discountType === 'percentage' && input.discountValue > 100) {
    errors.push('Percentage discount cannot exceed 100%.');
  }
  if (input.taxRate < 0 || input.taxRate > 1) {
    errors.push('Tax rate must be between 0 and 1 (e.g., 0.08 for 8%).');
  }
  if (input.weight < 0) {
    errors.push('Weight cannot be negative.');
  }

  return errors;
}
