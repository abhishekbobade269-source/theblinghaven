export type OrderStatus =
  | 'PENDING_VERIFICATION'
  | 'CONFIRMED'
  | 'VAULT_ALLOCATION'
  | 'CUSTOM_SIZING_IN_PROGRESS'
  | 'QUALITY_INSPECTION_PASSED'
  | 'SECURE_DISPATCH_ARMORED'
  | 'DELIVERED_SIGNATURE_REQUIRED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'PAID' | 'REFUNDED' | 'FAILED';

export type ShippingCarrier =
  | 'BRINKS_GLOBAL'
  | 'FERRARI_GROUP_SECURE'
  | 'MALCA_AMIT'
  | 'DHL_EXPRESS_INSURED'
  | 'FEDEX_PRIORITY_DIRECT';

export interface OrderItemDto {
  id: string;
  orderId: string;
  productId: string;
  sku: string;
  title: string;
  primaryImageUrl: string;
  quantity: number;
  unitPriceUsd: number;
  totalPriceUsd: number;
  selectedRingSize?: string;
  selectedBangleSize?: string;
  customEngraving?: string;
  hallmarkCertificate?: string;
}

export interface OrderTimelineDto {
  id: string;
  orderId: string;
  status: OrderStatus;
  notes: string;
  actorEmail?: string;
  createdAt: string;
}

export interface OrderDto {
  id: string;
  orderNumber: string; // e.g. TBH-2026-8801
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerVipTier: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  currencyCode: string;
  currencySymbol: string;
  totalAmountUsd: number;
  totalAmountLocal: number;
  subtotalUsd: number;
  taxAmountUsd: number;
  shippingAmountUsd: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
    phone: string;
  };
  shippingCarrier?: ShippingCarrier;
  trackingNumber?: string;
  insuredValueUsd?: number;
  deliverySignatureName?: string;
  customerNotes?: string;
  conciergeNotes?: string;
  items: OrderItemDto[];
  timeline: OrderTimelineDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  customerId: string;
  currencyCode?: string;
  paymentMethod: string;
  customerNotes?: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
    phone: string;
  };
  items: {
    productId: string;
    quantity: number;
    selectedRingSize?: string;
    selectedBangleSize?: string;
    customEngraving?: string;
  }[];
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
  notes?: string;
  shippingCarrier?: ShippingCarrier;
  trackingNumber?: string;
  deliverySignatureName?: string;
}
