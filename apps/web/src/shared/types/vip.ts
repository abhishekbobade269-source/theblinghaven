export type VipTier =
  | 'MAISON_PATRON'
  | 'ROYAL_TIER'
  | 'BLACK_TIER_INNER_CIRCLE';

export interface VipMemberDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  invitationKey: string;
  tier: VipTier;
  assignedAdvisor: string;
  preferredSalon: string;
  totalSpendCad: number;
  joinedAt: string;
}

export type VaultAllocationStatus =
  | 'AVAILABLE'
  | 'RESERVED_ON_HOLD'
  | 'ALLOCATED_ACQUIRED';

export interface SecretVaultDropDto {
  id: string;
  sku: string;
  title: string;
  tagline: string;
  description: string;
  gemstoneDetails: string;
  metalDetails: string;
  priceCad: number;
  vaultLocation: string;
  allocationStatus: VaultAllocationStatus;
  accessTierRequired: VipTier;
  dropEndTimestamp: string;
  primaryImageUrl: string;
  galleryImages: string[];
}

export interface VipChatMessageDto {
  id: string;
  clientEmail: string;
  clientName: string;
  senderRole: 'CLIENT' | 'ADVISOR';
  senderName: string;
  message: string;
  salonLocation: string;
  timestamp: string;
  isRead: boolean;
}

export interface AuthenticateVipDto {
  invitationKey: string;
}

export interface SendVipMessageDto {
  clientEmail: string;
  clientName: string;
  message: string;
  salonLocation?: string;
}

export interface ReplyVipMessageDto {
  clientEmail: string;
  advisorName: string;
  message: string;
}

export interface ReserveVaultDropDto {
  clientEmail: string;
  clientName: string;
  dropId: string;
  preferredSalon: string;
  notes?: string;
}
