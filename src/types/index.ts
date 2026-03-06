export interface CartItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export type DiscountType = 'percentage' | 'fixed';

export interface CalculationInput {
  items: CartItem[];
  discountType: DiscountType;
  discountValue: number;
  taxRate: number;
  weight: number;
  description: string;
}

export interface CalculationResult {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  shippingCost: number;
  total: number;
  freeShipping: boolean;
}

export interface CalculationRecord {
  id: number;
  description: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
