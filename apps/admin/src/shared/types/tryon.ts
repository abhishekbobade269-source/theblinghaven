export type JewelryTryOnCategory =
  | 'RING'
  | 'EARRINGS'
  | 'NECKLACE'
  | 'BANGLE';

export type TryOnAnchorType =
  | 'HAND_RING_FINGER'
  | 'EAR_LOBE'
  | 'NECK_COLLAR'
  | 'WRIST';

export interface TryOnOverlayDto {
  id: string;
  productId?: string;
  sku: string;
  title: string;
  category: JewelryTryOnCategory;
  overlayImageUrl: string;
  defaultScale: number;
  defaultRotation: number;
  anchorType: TryOnAnchorType;
  sparkleRefractionEnabled: boolean;
  basePriceCad: number;
}

export interface TryOnConsultationDto {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  productSku: string;
  productTitle: string;
  category: JewelryTryOnCategory;
  scaleApplied: number;
  rotationApplied: number;
  skinToneSelected: string;
  capturedLookImageUrl?: string;
  preferredSalon: string;
  notes?: string;
  status: 'PENDING_ADVISOR_REVIEW' | 'CONTACTED' | 'APPOINTMENT_SCHEDULED' | 'ARCHIVED';
  createdAt: string;
}

export interface SubmitTryOnConsultationDto {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  productSku: string;
  productTitle: string;
  category: JewelryTryOnCategory;
  scaleApplied?: number;
  rotationApplied?: number;
  skinToneSelected?: string;
  capturedLookImageUrl?: string;
  preferredSalon?: string;
  notes?: string;
}
