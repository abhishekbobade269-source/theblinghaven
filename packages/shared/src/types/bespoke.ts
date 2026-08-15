export type BespokeStatus =
  | 'SUBMITTED'
  | 'CAD_DESIGN_IN_PROGRESS'
  | 'QUOTE_PENDING_CLIENT'
  | 'QUOTE_ACCEPTED'
  | 'CASTING_AND_SETTING'
  | 'HALLMARK_AND_CERTIFICATION'
  | 'COMPLETED_DISPATCHED'
  | 'DECLINED';

export interface BespokeRequestDto {
  id: string;
  referenceNumber: string; // e.g. BESPOKE-2026-001
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientCountry: string;
  vipTier?: string;
  category: string; // Ring, Choker, Kada, Earrings, Pendant
  metalPreference: string; // 18K Yellow Gold, 18K White Gold, 22K Solid Gold, Platinum Pt950
  gemstonePreference?: string; // D-Flawless Diamond, Zambian Emerald, Pigeon Blood Ruby, Basra Pearl
  estimatedCaratWeight?: number; // e.g. 5.0
  diamondShape?: string; // Cushion, Emerald, Round Brilliant, Pear, Oval
  ringOrWristSize?: string; // e.g. US 6.5
  engravingText?: string;
  budgetRangeUsd: string; // e.g. $25,000 - $50,000 USD
  inspirationPhotoUrl?: string;
  designBrief: string;
  status: BespokeStatus;
  assignedGoldsmith?: string; // e.g. Master Artisan Pierre Dubois
  quotedAmountUsd?: number;
  cadRenderUrl?: string;
  estimatedCompletionWeeks?: number;
  atelierNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitBespokeDto {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientCountry: string;
  category: string;
  metalPreference: string;
  gemstonePreference?: string;
  estimatedCaratWeight?: number;
  diamondShape?: string;
  ringOrWristSize?: string;
  engravingText?: string;
  budgetRangeUsd: string;
  inspirationPhotoUrl?: string;
  designBrief: string;
}

export interface UpdateBespokeDto {
  status?: BespokeStatus;
  assignedGoldsmith?: string;
  quotedAmountUsd?: number;
  cadRenderUrl?: string;
  estimatedCompletionWeeks?: number;
  atelierNotes?: string;
}
