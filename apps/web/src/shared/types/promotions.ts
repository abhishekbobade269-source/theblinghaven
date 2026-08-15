export type PromotionType =
  | 'PERCENTAGE_OFF'
  | 'FIXED_AMOUNT_OFF'
  | 'COMPLIMENTARY_BESPOKE_GIFT'
  | 'FREE_ARMORED_SHIPPING';

export interface PromotionDto {
  id: string;
  code: string; // e.g. ROYAL2026, ATELIER10
  name: string;
  description?: string;
  type: PromotionType;
  value: number; // e.g. 15 for 15% or 500 for $500 off
  minPurchaseAmountUsd?: number;
  maxDiscountAmountUsd?: number;
  vipTierRequired?: string; // e.g. ROYAL_CONCIERGE
  categoryId?: string;
  collectionId?: string;
  usageLimit?: number;
  usageCount: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreatePromotionDto {
  code: string;
  name: string;
  description?: string;
  type: PromotionType;
  value: number;
  minPurchaseAmountUsd?: number;
  maxDiscountAmountUsd?: number;
  vipTierRequired?: string;
  categoryId?: string;
  collectionId?: string;
  usageLimit?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface ValidateCouponDto {
  code: string;
  cartSubtotalUsd: number;
  customerId?: string;
  vipTier?: string;
}

export interface CouponValidationResultDto {
  isValid: boolean;
  code: string;
  discountAmountUsd: number;
  discountMessage: string;
  promotion?: PromotionDto;
}
