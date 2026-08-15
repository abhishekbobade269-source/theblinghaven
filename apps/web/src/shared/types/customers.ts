export type CustomerVipTier =
  | 'STANDARD'
  | 'SILVER'
  | 'GOLD_PATRON'
  | 'ROYAL_CONCIERGE';

export interface CustomerPreferencesDto {
  preferredRingSize?: string;
  preferredBangleSize?: string;
  preferredMetal?: string;
  favoriteGemstones?: string[];
  anniversaryDate?: string;
  birthDate?: string;
  giftPreferences?: string;
}

export interface CustomerDto {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  city?: string;
  vipTier: CustomerVipTier;
  totalSpendUsd: number;
  totalOrdersCount: number;
  averageOrderValueUsd: number;
  preferences: CustomerPreferencesDto;
  conciergeNotes?: string;
  assignedAdvisor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country: string;
  city?: string;
  vipTier?: CustomerVipTier;
  preferences?: CustomerPreferencesDto;
  conciergeNotes?: string;
}

export interface UpdateCustomerDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  city?: string;
  vipTier?: CustomerVipTier;
  preferences?: CustomerPreferencesDto;
  conciergeNotes?: string;
  assignedAdvisor?: string;
}
